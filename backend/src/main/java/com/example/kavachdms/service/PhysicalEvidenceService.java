package com.example.kavachdms.service;

import com.example.kavachdms.dto.physicalEvidence.PhysicalEvidenceResponse;
import com.example.kavachdms.dto.physicalEvidence.RegisterEvidenceRequest;
import com.example.kavachdms.entity.Case;
import com.example.kavachdms.entity.PhysicalEvidence;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.CaseRepository;
import com.example.kavachdms.repository.PhysicalEvidenceRepository;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhysicalEvidenceService {

    private final PhysicalEvidenceRepository physicalEvidenceRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final CaseSecurityService caseSecurityService;

    public PhysicalEvidenceService(
            PhysicalEvidenceRepository physicalEvidenceRepository,
            CaseRepository caseRepository,
            UserRepository userRepository,
            CaseSecurityService caseSecurityService) {

        this.physicalEvidenceRepository = physicalEvidenceRepository;
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
        this.caseSecurityService = caseSecurityService;
    }

    public PhysicalEvidenceResponse registerEvidence(
            RegisterEvidenceRequest request,
            Authentication authentication) {

        Case caseEntity = caseRepository.findById(request.getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found"));

        if (!caseSecurityService.canWriteCase(
                authentication,
                caseEntity.getCaseId())) {

            throw new RuntimeException(
                    "Insufficient permission to register evidence");
        }

        PhysicalEvidence evidence = new PhysicalEvidence();

        evidence.setCaseEntity(caseEntity);
        evidence.setEvidenceCode(request.getEvidenceCode());
        evidence.setBarcodeOrQr(request.getBarcodeOrQr());
        evidence.setDescription(request.getDescription());
        evidence.setEvidenceType(request.getEvidenceType());
        evidence.setStatus(request.getStatus());
        evidence.setCurrentLocation(request.getCurrentLocation());

        if (request.getCurrentHolder() != null) {
            User holder = userRepository.findById(request.getCurrentHolder())
                    .orElseThrow(() ->
                            new RuntimeException("Current holder not found"));

            evidence.setCurrentHolder(holder);
        }

        PhysicalEvidence savedEvidence =
                physicalEvidenceRepository.save(evidence);

        return PhysicalEvidenceResponse.fromEntity(savedEvidence);
    }

    public List<PhysicalEvidenceResponse> getAllEvidence(
            Authentication authentication) {

        return physicalEvidenceRepository.findAll()
                .stream()
                .filter(evidence ->
                        caseSecurityService.canReadCase(
                                authentication,
                                evidence.getCaseEntity().getCaseId()))
                .map(PhysicalEvidenceResponse::fromEntity)
                .toList();
    }

    public PhysicalEvidenceResponse getEvidence(
            Long id,
            Authentication authentication) {

        PhysicalEvidence evidence =
                physicalEvidenceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Evidence not found"));

        if (!caseSecurityService.canReadCase(
                authentication,
                evidence.getCaseEntity().getCaseId())) {

            throw new RuntimeException(
                    "Insufficient permission to view evidence");
        }

        return PhysicalEvidenceResponse.fromEntity(evidence);
    }
}