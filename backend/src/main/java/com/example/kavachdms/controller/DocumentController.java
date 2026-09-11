package com.example.kavachdms.controller;

import com.example.kavachdms.dto.documents.CreateDocumentRequest;
import com.example.kavachdms.dto.documents.DocumentResponse;
import com.example.kavachdms.service.DocumentService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    public DocumentResponse createDocument(
            @Valid @RequestBody CreateDocumentRequest request,
            Authentication authentication) {

        return documentService.createDocument(request, authentication);
    }

    @GetMapping
    public List<DocumentResponse> getAllDocuments(
            Authentication authentication) {

        return documentService.getAllDocuments(authentication);
    }

    @GetMapping("/{id}")
    public DocumentResponse getDocument(
            @PathVariable Long id,
            Authentication authentication) {

        return documentService.getDocument(id, authentication);
    }

    @DeleteMapping("/{id}")
    public void deleteDocument(
            @PathVariable Long id,
            Authentication authentication) {

        documentService.deleteDocument(id, authentication);
    }
}