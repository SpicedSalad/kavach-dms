package com.example.kavachdms.service;

import com.example.kavachdms.dto.auditEvent.AuditEventResponse;
import com.example.kavachdms.repository.AuditEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditEventService {

    private final AuditEventRepository auditEventRepository;

    public AuditEventService(
            AuditEventRepository auditEventRepository) {

        this.auditEventRepository = auditEventRepository;
    }

    public List<AuditEventResponse> getAllAuditEvents() {

        return auditEventRepository.findAll()
                .stream()
                .map(AuditEventResponse::fromEntity)
                .toList();
    }

    public AuditEventResponse getAuditEventById(Long id) {

        var event = auditEventRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Audit event not found"));

        return AuditEventResponse.fromEntity(event);
    }
}