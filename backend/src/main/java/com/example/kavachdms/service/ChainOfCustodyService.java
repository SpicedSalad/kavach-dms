package com.example.kavachdms.service;

import com.example.kavachdms.entity.CustodyEvent;
import com.example.kavachdms.entity.PhysicalEvidence;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.CustodyEventRepository;
import com.example.kavachdms.repository.PhysicalEvidenceRepository;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class ChainOfCustodyService {

    private final CustodyEventRepository custodyEventRepository;
    private final PhysicalEvidenceRepository physicalEvidenceRepository;
    private final UserRepository userRepository;
    private final CaseSecurityService caseSecurityService;
    private final AuditService auditService;

    public ChainOfCustodyService(
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

    public CustodyEvent transferEvidence(
            Authentication authentication,
            Long evidenceId,
            Long toHolderId,
            String toLocation) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Authentication required");
        }

        PhysicalEvidence evidence = physicalEvidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new RuntimeException("Evidence not found"));

        Long caseId = evidence.getCaseEntity().getCaseId();

        if (!caseSecurityService.canWriteCase(authentication, caseId)) {
            throw new RuntimeException("Insufficient permission to transfer evidence");
        }

        User transferredBy = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        User toHolder = userRepository.findById(toHolderId)
                .orElseThrow(() -> new RuntimeException("Destination holder not found"));

        User fromHolder = evidence.getCurrentHolder();

        String fromLocation = evidence.getCurrentLocation();

        CustodyEvent event = new CustodyEvent();

        event.setEvidence(evidence);
        event.setFromHolder(fromHolder);
        event.setToHolder(toHolder);
        event.setTransferredBy(transferredBy);
        event.setFromLocation(fromLocation);
        event.setToLocation(toLocation);
        event.setEventType("TRANSFER");

        CustodyEvent savedEvent = custodyEventRepository.save(event);

        evidence.setCurrentHolder(toHolder);
        evidence.setCurrentLocation(toLocation);

        physicalEvidenceRepository.save(evidence);

        auditService.logEvent(
                transferredBy,
                evidence.getCaseEntity(),
                null,
                "EVIDENCE_TRANSFERRED",
                null,
                "Evidence " + evidenceId +
                        " transferred to user " + toHolderId +
                        " at " + toLocation
        );

        return savedEvent;
    }
}