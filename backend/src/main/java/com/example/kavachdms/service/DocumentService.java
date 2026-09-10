package com.example.kavachdms.service;

import com.example.kavachdms.entity.Document;
import com.example.kavachdms.repository.DocumentRepository;
import org.springframework.stereotype.Service;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }
}