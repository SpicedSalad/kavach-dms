package com.example.kavachdms.controller;

import com.example.kavachdms.entity.AuditEvent;
import com.example.kavachdms.service.AuditEventService;
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
    public AuditEvent createEvent(@RequestBody AuditEvent event) {
        return auditEventService.createEvent(event);
    }

    @GetMapping
    public List<AuditEvent> getAllEvents() {
        return auditEventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public AuditEvent getEvent(@PathVariable Long id) {
        return auditEventService.getEvent(id);
    }
}