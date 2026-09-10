package com.example.kavachdms.dto.physicalEvidence;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegisterEvidenceRequest {

    @NotNull
    private Long caseId;

    @NotBlank
    private String evidenceCode;

    @NotBlank
    private String barcodeOrQr;

    @NotBlank
    private String description;

    @NotBlank
    private String evidenceType;

    @NotBlank
    private String status;

    @NotBlank
    private String currentLocation;

    private Long currentHolder;

    public RegisterEvidenceRequest() {
    }

    public Long getCaseId() {
        return caseId;
    }

    public void setCaseId(Long caseId) {
        this.caseId = caseId;
    }

    public String getEvidenceCode() {
        return evidenceCode;
    }

    public void setEvidenceCode(String evidenceCode) {
        this.evidenceCode = evidenceCode;
    }

    public String getBarcodeOrQr() {
        return barcodeOrQr;
    }

    public void setBarcodeOrQr(String barcodeOrQr) {
        this.barcodeOrQr = barcodeOrQr;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEvidenceType() {
        return evidenceType;
    }

    public void setEvidenceType(String evidenceType) {
        this.evidenceType = evidenceType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(String currentLocation) {
        this.currentLocation = currentLocation;
    }

    public Long getCurrentHolder() {
        return currentHolder;
    }

    public void setCurrentHolder(Long currentHolder) {
        this.currentHolder = currentHolder;
    }
}