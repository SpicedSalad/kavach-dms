package com.example.kavachdms.service;

import com.example.kavachdms.entity.AuditEvent;
import com.example.kavachdms.repository.AuditEventRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditEventService {

    private final AuditEventRepository auditEventRepository;

    public AuditEventService(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }
}
