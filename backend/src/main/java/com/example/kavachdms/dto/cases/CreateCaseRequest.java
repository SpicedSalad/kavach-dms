package com.example.kavachdms.dto.cases;

import jakarta.validation.constraints.NotBlank;

public class CreateCaseRequest {

    @NotBlank
    private String caseNumber;

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String classification;

    public CreateCaseRequest() {
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getClassification() {
        return classification;
    }

    public void setClassification(String classification) {
        this.classification = classification;
    }
}