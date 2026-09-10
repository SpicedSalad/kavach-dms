package com.example.kavachdms.dto.documents;

import com.example.kavachdms.entity.Document;

import java.time.LocalDateTime;

public class DocumentResponse {

    private Long documentId;
    private Long caseId;
    private Long evidenceId;
    private Long createdBy;
    private String documentName;
    private String documentType;
    private String classification;
    private Integer currentVersion;
    private LocalDateTime createdAt;

    public DocumentResponse() {
    }

    public static DocumentResponse fromEntity(Document document) {

        DocumentResponse response = new DocumentResponse();

        response.documentId = document.getDocumentId();

        if (document.getCaseEntity() != null) {
            response.caseId = document.getCaseEntity().getCaseId();
        }

        if (document.getEvidence() != null) {
            response.evidenceId = document.getEvidence().getEvidenceId();
        }

        if (document.getCreatedBy() != null) {
            response.createdBy = document.getCreatedBy().getUserId();
        }

        response.documentName = document.getDocumentName();
        response.documentType = document.getDocumentType();
        response.classification = document.getClassification();
        response.currentVersion = document.getCurrentVersion();
        response.createdAt = document.getCreatedAt();

        return response;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public Long getCaseId() {
        return caseId;
    }

    public Long getEvidenceId() {
        return evidenceId;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public String getDocumentName() {
        return documentName;
    }

    public String getDocumentType() {
        return documentType;
    }

    public String getClassification() {
        return classification;
    }

    public Integer getCurrentVersion() {
        return currentVersion;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}