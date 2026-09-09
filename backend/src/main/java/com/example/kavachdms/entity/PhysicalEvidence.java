package com.example.kavachdms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "physical_evidence")
public class PhysicalEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long evidenceId;

    @ManyToOne
    @JoinColumn(
        name = "case_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_evidence_case")
    )
    private Case caseEntity;

    @ManyToOne
    @JoinColumn(
        name = "current_holder",
        foreignKey = @ForeignKey(name = "fk_evidence_current_holder")
    )
    private User currentHolder;

    @Column(nullable = false, unique = true)
    private String evidenceCode;

    @Column(nullable = false, unique = true)
    private String barcodeOrQr;

    @Column(nullable = false)
    private String description;

    private String evidenceType;

    private String status;

    private String currentLocation;

    private java.time.LocalDateTime collectedAt;

    private java.time.LocalDateTime createdAt;

    public PhysicalEvidence() {
    }

    public Long getEvidenceId() {
        return evidenceId;
    }

    public void setEvidenceId(Long evidenceId) {
        this.evidenceId = evidenceId;
    }

    public Case getCaseEntity() {
        return caseEntity;
    }

    public void setCaseEntity(Case caseEntity) {
        this.caseEntity = caseEntity;
    }

    public User getCurrentHolder() {
        return currentHolder;
    }

    public void setCurrentHolder(User currentHolder) {
        this.currentHolder = currentHolder;
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

    public java.time.LocalDateTime getCollectedAt() {
        return collectedAt;
    }

    public void setCollectedAt(java.time.LocalDateTime collectedAt) {
        this.collectedAt = collectedAt;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}