package com.example.kavachdms.dto.auditEvent;

import com.example.kavachdms.entity.AuditEvent;

import java.time.LocalDateTime;

public class AuditEventResponse {

    private Long auditEventId;
    private Long userId;
    private Long caseId;
    private Long documentId;
    private String eventType;
    private LocalDateTime timestamp;
    private String ipAddress;
    private String details;

    public static AuditEventResponse fromEntity(AuditEvent event) {

        AuditEventResponse response = new AuditEventResponse();

        response.auditEventId = event.getAuditEventId();
        response.userId = event.getUser().getUserId();
        response.caseId = event.getCaseEntity().getCaseId();

        response.documentId = event.getDocument() != null
                ? event.getDocument().getDocumentId()
                : null;

        response.eventType = event.getEventType();
        response.timestamp = event.getTimestamp();
        response.ipAddress = event.getIpAddress();
        response.details = event.getDetails();

        return response;
    }

    public Long getAuditEventId() {
        return auditEventId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getCaseId() {
        return caseId;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public String getEventType() {
        return eventType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getDetails() {
        return details;
    }
}