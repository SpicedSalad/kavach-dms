package com.example.kavachdms.controller;

import com.example.kavachdms.entity.DocumentVersion;
import com.example.kavachdms.entity.DocumentVersionId;
import com.example.kavachdms.service.DocumentVersionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/document-versions")
public class DocumentVersionController {

    private final DocumentVersionService documentVersionService;

    public DocumentVersionController(DocumentVersionService documentVersionService) {
        this.documentVersionService = documentVersionService;
    }

    @PostMapping
    public DocumentVersion createVersion(
            @RequestBody DocumentVersion version,
            Authentication authentication) {

        return documentVersionService.createVersion(
                version,
                authentication);
    }

    @GetMapping
    public List<DocumentVersion> getAllVersions(
            Authentication authentication) {

        return documentVersionService.getAllVersions(authentication);
    }

    @GetMapping("/{documentId}/{versionNumber}")
    public DocumentVersion getVersion(
            @PathVariable Long documentId,
            @PathVariable Integer versionNumber,
            Authentication authentication) {

        DocumentVersionId id =
                new DocumentVersionId(documentId, versionNumber);

        return documentVersionService.getVersion(
                id,
                authentication);
    }
}