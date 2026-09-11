package com.example.kavachdms.service;

import com.example.kavachdms.dto.cases.CaseResponse;
import com.example.kavachdms.dto.cases.CreateCaseRequest;
import com.example.kavachdms.entity.Case;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.CaseRepository;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseService {

    private final CaseRepository caseRepository;
    private final CaseSecurityService caseSecurityService;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public CaseService(
            CaseRepository caseRepository,
            CaseSecurityService caseSecurityService,
            UserRepository userRepository,
            AuditService auditService) {
        this.caseRepository = caseRepository;
        this.caseSecurityService = caseSecurityService;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public CaseResponse createCase(
            CreateCaseRequest request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Authentication required");
        }

        User createdBy = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));

        Case newCase = new Case();

        newCase.setCaseNumber(request.getCaseNumber());
        newCase.setTitle(request.getTitle());
        newCase.setDescription(request.getDescription());
        newCase.setClassification(request.getClassification());

        // Backend-controlled fields
        newCase.setStatus("ACTIVE");
        newCase.setCreatedBy(createdBy);

        Case savedCase = caseRepository.save(newCase);

        auditService.logEvent(
                createdBy,
                savedCase,
                null,
                "CASE_CREATED",
                null,
                "Case " + savedCase.getCaseNumber() + " created"
        );

        return CaseResponse.fromEntity(savedCase);
    }

    public List<CaseResponse> getAllCases(
            Authentication authentication) {

        return caseRepository.findAll()
                .stream()
                .filter(caseEntity ->
                        caseSecurityService.canReadCase(
                                authentication,
                                caseEntity.getCaseId()))
                .map(CaseResponse::fromEntity)
                .toList();
    }
}