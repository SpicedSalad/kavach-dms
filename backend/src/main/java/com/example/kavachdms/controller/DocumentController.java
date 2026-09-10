package com.example.kavachdms.controller;

import com.example.kavachdms.dto.documents.CreateDocumentRequest;
import com.example.kavachdms.dto.documents.DocumentResponse;
import com.example.kavachdms.service.DocumentService;
import jakarta.validation.Valid;
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
            @Valid @RequestBody CreateDocumentRequest request) {

        return documentService.createDocument(request);
    }

    @GetMapping
    public List<DocumentResponse> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @GetMapping("/{id}")
    public DocumentResponse getDocument(@PathVariable Long id) {
        return documentService.getDocument(id);
    }

    @DeleteMapping("/{id}")
    public void deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
    }
}