package com.example.kavachdms.service;

import com.example.kavachdms.entity.DocumentVersion;
import com.example.kavachdms.entity.DocumentVersionId;
import com.example.kavachdms.repository.DocumentVersionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentVersionService {

    private final DocumentVersionRepository documentVersionRepository;

    public DocumentVersionService(DocumentVersionRepository documentVersionRepository) {
        this.documentVersionRepository = documentVersionRepository;
    }

    public DocumentVersion createVersion(DocumentVersion version) {
        return documentVersionRepository.save(version);
    }

    public List<DocumentVersion> getAllVersions() {
        return documentVersionRepository.findAll();
    }

    public DocumentVersion getVersion(DocumentVersionId id) {
        return documentVersionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document version not found"));
    }
}