package com.example.kavachdms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentId;

    @ManyToOne
    @JoinColumn(
        name = "case_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_document_case")
    )
    private Case caseEntity;

    @ManyToOne
    @JoinColumn(
        name = "evidence_id",
        foreignKey = @ForeignKey(name = "fk_document_evidence")
    )
    private PhysicalEvidence evidence;

    @ManyToOne
    @JoinColumn(
        name = "created_by",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_document_created_by")
    )
    private User createdBy;

    @Column(nullable = false)
    private String documentName;

    private String documentType;

    private String classification;

    private String status;

    @Column(nullable = false)
    private Integer currentVersion = 1;

    public Document() {
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public Case getCaseEntity() {
        return caseEntity;
    }

    public void setCaseEntity(Case caseEntity) {
        this.caseEntity = caseEntity;
    }

    public PhysicalEvidence getEvidence() {
        return evidence;
    }

    public void setEvidence(PhysicalEvidence evidence) {
        this.evidence = evidence;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getClassification() {
        return classification;
    }

    public void setClassification(String classification) {
        this.classification = classification;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getCurrentVersion() {
        return currentVersion;
    }

    public void setCurrentVersion(Integer currentVersion) {
        this.currentVersion = currentVersion;
    }
}