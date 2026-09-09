package com.example.kavachdms.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_events")
public class AuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditEventId;

    @ManyToOne
    @JoinColumn(
        name = "user_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_audit_user")
    )
    private User user;

    @ManyToOne
    @JoinColumn(
        name = "case_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_audit_case")
    )
    private Case caseEntity;

    @ManyToOne
    @JoinColumn(
        name = "document_id",
        foreignKey = @ForeignKey(name = "fk_audit_document")
    )
    private Document document;

    @Column(nullable = false)
    private String eventType;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String details;

    public AuditEvent() {
    }

    public Long getAuditEventId() {
        return auditEventId;
    }

    public void setAuditEventId(Long auditEventId) {
        this.auditEventId = auditEventId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Case getCaseEntity() {
        return caseEntity;
    }

    public void setCaseEntity(Case caseEntity) {
        this.caseEntity = caseEntity;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}