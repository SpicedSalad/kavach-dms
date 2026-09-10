package com.example.kavachdms.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DocumentVersionId implements Serializable {

    private Long documentId;
    private Integer versionNumber;

    public DocumentVersionId() {
    }

    public DocumentVersionId(Long documentId, Integer versionNumber) {
        this.documentId = documentId;
        this.versionNumber = versionNumber;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public Integer getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(Integer versionNumber) {
        this.versionNumber = versionNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DocumentVersionId)) return false;

        DocumentVersionId that = (DocumentVersionId) o;

        return Objects.equals(documentId, that.documentId)
                && Objects.equals(versionNumber, that.versionNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(documentId, versionNumber);
    }
}