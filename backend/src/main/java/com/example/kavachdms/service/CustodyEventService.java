package com.example.kavachdms.service;

import com.example.kavachdms.dto.custodyEvent.CreateCustodyEventRequest;
import com.example.kavachdms.dto.custodyEvent.CustodyEventResponse;
import com.example.kavachdms.entity.CustodyEvent;
import com.example.kavachdms.entity.PhysicalEvidence;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.CustodyEventRepository;
import com.example.kavachdms.repository.PhysicalEvidenceRepository;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustodyEventService {

    private final CustodyEventRepository custodyEventRepository;
    private final PhysicalEvidenceRepository physicalEvidenceRepository;
    private final UserRepository userRepository;
    private final CaseSecurityService caseSecurityService;
    private final AuditService auditService;

    public CustodyEventService(
            CustodyEventRepository custodyEventRepository,
            PhysicalEvidenceRepository physicalEvidenceRepository,
            UserRepository userRepository,
            CaseSecurityService caseSecurityService,
            AuditService auditService) {

        this.custodyEventRepository = custodyEventRepository;
        this.physicalEvidenceRepository = physicalEvidenceRepository;
        this.userRepository = userRepository;
        this.caseSecurityService = caseSecurityService;
        this.auditService = auditService;
    }

    @Transactional
    public CustodyEventResponse createCustodyEvent(
            CreateCustodyEventRequest request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Authentication required");
        }

        PhysicalEvidence evidence = physicalEvidenceRepository
                .findById(request.getEvidenceId())
                .orElseThrow(() ->
                        new RuntimeException("Evidence not found"));

        Long caseId = evidence.getCaseEntity().getCaseId();

        if (!caseSecurityService.canWriteCase(authentication, caseId)) {
            throw new RuntimeException(
                    "Insufficient permission to transfer evidence");
        }

        User transferredBy = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));

        User fromHolder = evidence.getCurrentHolder();

        User toHolder = null;

        if (request.getToHolder() != null) {
            toHolder = userRepository
                    .findById(request.getToHolder())
                    .orElseThrow(() ->
                            new RuntimeException("To-holder user not found"));
        }

        String fromLocation = evidence.getCurrentLocation();

        CustodyEvent event = new CustodyEvent();

        event.setEvidence(evidence);
        event.setFromHolder(fromHolder);
        event.setToHolder(toHolder);
        event.setTransferredBy(transferredBy);
        event.setFromLocation(fromLocation);
        event.setToLocation(request.getToLocation());
        event.setEventType(request.getEventType());

        CustodyEvent savedEvent =
                custodyEventRepository.save(event);

        evidence.setCurrentHolder(toHolder);
        evidence.setCurrentLocation(request.getToLocation());

        physicalEvidenceRepository.save(evidence);

        auditService.logEvent(
                transferredBy,
                evidence.getCaseEntity(),
                null,
                "EVIDENCE_TRANSFERRED",
                null,
                "Evidence " + evidence.getEvidenceId()
                        + " transferred to user "
                        + request.getToHolder()
                        + " at "
                        + request.getToLocation()
        );

        return CustodyEventResponse.fromEntity(savedEvent);
    }

    public List<CustodyEventResponse> getAllCustodyEvents(
            Authentication authentication) {

        return custodyEventRepository.findAll()
                .stream()
                .filter(event ->
                        caseSecurityService.canReadCase(
                                authentication,
                                event.getEvidence()
                                        .getCaseEntity()
                                        .getCaseId()))
                .map(CustodyEventResponse::fromEntity)
                .toList();
    }

    public CustodyEventResponse getCustodyEventById(
            Long id,
            Authentication authentication) {

        CustodyEvent event = custodyEventRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Custody event not found"));

        Long caseId = event.getEvidence()
                .getCaseEntity()
                .getCaseId();

        if (!caseSecurityService.canReadCase(
                authentication,
                caseId)) {

            throw new RuntimeException(
                    "Insufficient permission to view custody event");
        }

        return CustodyEventResponse.fromEntity(event);
    }
}