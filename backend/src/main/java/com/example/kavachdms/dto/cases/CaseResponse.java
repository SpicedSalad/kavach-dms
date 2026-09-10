package com.example.kavachdms.dto.cases;

import java.time.LocalDateTime;

import com.example.kavachdms.entity.Case;

public class CaseResponse {

    private Long caseId;
    private String caseNumber;
    private String title;
    private String description;
    private String status;
    private String classification;
    private LocalDateTime createdAt;

    public CaseResponse() {
    }

    public static CaseResponse fromEntity(Case caseEntity) {
        CaseResponse response = new CaseResponse();

        response.caseId = caseEntity.getCaseId();
        response.caseNumber = caseEntity.getCaseNumber();
        response.title = caseEntity.getTitle();
        response.description = caseEntity.getDescription();
        response.status = caseEntity.getStatus();
        response.classification = caseEntity.getClassification();
        response.createdAt = caseEntity.getCreatedAt();

        return response;
    }

    public Long getCaseId() {
        return caseId;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public String getClassification() {
        return classification;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}