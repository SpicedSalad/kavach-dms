package com.example.kavachdms.repository;

import com.example.kavachdms.entity.DocumentVersion;
import com.example.kavachdms.entity.DocumentVersionId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentVersionRepository
        extends JpaRepository<DocumentVersion, DocumentVersionId> {
}