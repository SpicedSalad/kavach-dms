package com.example.kavachdms.controller;

import com.example.kavachdms.dto.auditEvent.AuditEventResponse;
import com.example.kavachdms.service.AuditEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-events")
public class AuditEventController {

    private final AuditEventService auditEventService;

    public AuditEventController(AuditEventService auditEventService) {
        this.auditEventService = auditEventService;
    }

    @GetMapping
    public ResponseEntity<List<AuditEventResponse>> getAllAuditEvents() {

        return ResponseEntity.ok(
                auditEventService.getAllAuditEvents()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditEventResponse> getAuditEventById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                auditEventService.getAuditEventById(id)
        );
    }
}