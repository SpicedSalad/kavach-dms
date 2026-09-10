package com.example.kavachdms.dto.physicalEvidence;

import com.example.kavachdms.entity.PhysicalEvidence;

public class PhysicalEvidenceResponse {

    private Long evidenceId;
    private Long caseId;
    private Long currentHolder;
    private String evidenceCode;
    private String barcodeOrQr;
    private String description;
    private String evidenceType;
    private String status;
    private String currentLocation;

    public PhysicalEvidenceResponse() {
    }

    public static PhysicalEvidenceResponse fromEntity(
            PhysicalEvidence evidence) {

        PhysicalEvidenceResponse response =
                new PhysicalEvidenceResponse();

        response.evidenceId = evidence.getEvidenceId();

        if (evidence.getCaseEntity() != null) {
            response.caseId =
                    evidence.getCaseEntity().getCaseId();
        }

        if (evidence.getCurrentHolder() != null) {
            response.currentHolder =
                    evidence.getCurrentHolder().getUserId();
        }

        response.evidenceCode = evidence.getEvidenceCode();
        response.barcodeOrQr = evidence.getBarcodeOrQr();
        response.description = evidence.getDescription();
        response.evidenceType = evidence.getEvidenceType();
        response.status = evidence.getStatus();
        response.currentLocation = evidence.getCurrentLocation();

        return response;
    }

    public Long getEvidenceId() {
        return evidenceId;
    }

    public Long getCaseId() {
        return caseId;
    }

    public Long getCurrentHolder() {
        return currentHolder;
    }

    public String getEvidenceCode() {
        return evidenceCode;
    }

    public String getBarcodeOrQr() {
        return barcodeOrQr;
    }

    public String getDescription() {
        return description;
    }

    public String getEvidenceType() {
        return evidenceType;
    }

    public String getStatus() {
        return status;
    }

    public String getCurrentLocation() {
        return currentLocation;
    }
}