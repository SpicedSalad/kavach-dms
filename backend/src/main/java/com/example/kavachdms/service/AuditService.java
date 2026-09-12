package com.example.kavachdms.service;

import com.example.kavachdms.entity.AuditEvent;
import com.example.kavachdms.entity.Case;
import com.example.kavachdms.entity.Document;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.AuditEventRepository;

import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditEventRepository auditEventRepository;

    public AuditService(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    public void logEvent(
            User user,
            Case caseEntity,
            Document document,
            String eventType,
            String ipAddress,
            String details) {

        AuditEvent event = new AuditEvent();

        event.setUser(user);
        event.setCaseEntity(caseEntity);
        event.setDocument(document);
        event.setEventType(eventType);
        event.setIpAddress(ipAddress);
        event.setDetails(details);

        auditEventRepository.save(event);
    }
}