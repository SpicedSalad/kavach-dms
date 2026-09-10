package com.example.kavachdms.service;

import com.example.kavachdms.dto.auditEvent.AuditEventResponse;
import com.example.kavachdms.dto.auditEvent.CreateAuditEventRequest;
import com.example.kavachdms.entity.AuditEvent;
import com.example.kavachdms.entity.Case;
import com.example.kavachdms.entity.Document;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.AuditEventRepository;
import com.example.kavachdms.repository.CaseRepository;
import com.example.kavachdms.repository.DocumentRepository;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditEventService {

    private final AuditEventRepository auditEventRepository;
    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final DocumentRepository documentRepository;

    public AuditEventService(
            AuditEventRepository auditEventRepository,
            UserRepository userRepository,
            CaseRepository caseRepository,
            DocumentRepository documentRepository) {

        this.auditEventRepository = auditEventRepository;
        this.userRepository = userRepository;
        this.caseRepository = caseRepository;
        this.documentRepository = documentRepository;
    }

    public AuditEventResponse createAuditEvent(CreateAuditEventRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Case caseEntity = caseRepository.findById(request.getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found"));

        Document document = null;

        if (request.getDocumentId() != null) {
            document = documentRepository.findById(request.getDocumentId())
                    .orElseThrow(() -> new RuntimeException("Document not found"));
        }

        AuditEvent event = new AuditEvent();

        event.setUser(user);
        event.setCaseEntity(caseEntity);
        event.setDocument(document);
        event.setEventType(request.getEventType());
        event.setIpAddress(request.getIpAddress());
        event.setDetails(request.getDetails());

        AuditEvent savedEvent = auditEventRepository.save(event);

        return AuditEventResponse.fromEntity(savedEvent);
    }

    public List<AuditEventResponse> getAllAuditEvents() {

        return auditEventRepository.findAll()
                .stream()
                .map(AuditEventResponse::fromEntity)
                .toList();
    }

    public AuditEventResponse getAuditEventById(Long id) {

        AuditEvent event = auditEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit event not found"));

        return AuditEventResponse.fromEntity(event);
    }
}