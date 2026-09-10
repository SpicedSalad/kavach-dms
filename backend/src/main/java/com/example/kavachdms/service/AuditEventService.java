package com.example.kavachdms.service;

import com.example.kavachdms.entity.AuditEvent;
import com.example.kavachdms.repository.AuditEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditEventService {

    private final AuditEventRepository auditEventRepository;

    public AuditEventService(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    public AuditEvent createEvent(AuditEvent event) {
        return auditEventRepository.save(event);
    }

    public List<AuditEvent> getAllEvents() {
        return auditEventRepository.findAll();
    }

    public AuditEvent getEvent(Long id) {
        return auditEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit event not found"));
    }
}