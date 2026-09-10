package com.example.kavachdms.controller;

import com.example.kavachdms.entity.DocumentVersion;
import com.example.kavachdms.entity.DocumentVersionId;
import com.example.kavachdms.service.DocumentVersionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/document-versions")
public class DocumentVersionController {

    private final DocumentVersionService documentVersionService;

    public DocumentVersionController(DocumentVersionService documentVersionService) {
        this.documentVersionService = documentVersionService;
    }

    @PostMapping
    public DocumentVersion createVersion(@RequestBody DocumentVersion version) {
        return documentVersionService.createVersion(version);
    }

    @GetMapping
    public List<DocumentVersion> getAllVersions() {
        return documentVersionService.getAllVersions();
    }

    @GetMapping("/{documentId}/{versionNumber}")
    public DocumentVersion getVersion(
            @PathVariable Long documentId,
            @PathVariable Integer versionNumber) {

        DocumentVersionId id =
                new DocumentVersionId(documentId, versionNumber);

        return documentVersionService.getVersion(id);
    }
}