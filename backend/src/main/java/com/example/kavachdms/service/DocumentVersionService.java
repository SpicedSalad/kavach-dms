package com.example.kavachdms.service;

import com.example.kavachdms.entity.DocumentVersion;
import com.example.kavachdms.repository.DocumentVersionRepository;
import org.springframework.stereotype.Service;

@Service
public class DocumentVersionService {

    private final DocumentVersionRepository documentVersionRepository;

    public DocumentVersionService(DocumentVersionRepository documentVersionRepository) {
        this.documentVersionRepository = documentVersionRepository;
    }
}
