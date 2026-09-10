package com.example.kavachdms.controller;

import com.example.kavachdms.dto.auditEvent.AuditEventResponse;
import com.example.kavachdms.dto.auditEvent.CreateAuditEventRequest;
import com.example.kavachdms.service.AuditEventService;
import jakarta.validation.Valid;
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

    @PostMapping
    public ResponseEntity<AuditEventResponse> createAuditEvent(
            @Valid @RequestBody CreateAuditEventRequest request) {

        return ResponseEntity.ok(
                auditEventService.createAuditEvent(request)
        );
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