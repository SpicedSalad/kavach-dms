package com.example.kavachdms.controller;

import com.example.kavachdms.dto.documents.CreateDocumentRequest;
import com.example.kavachdms.dto.documents.DocumentResponse;
import com.example.kavachdms.entity.Document;
import com.example.kavachdms.entity.DocumentVersion;
import com.example.kavachdms.entity.DocumentVersionId;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.DocumentRepository;
import com.example.kavachdms.repository.DocumentVersionRepository;
import com.example.kavachdms.repository.UserRepository;
import com.example.kavachdms.service.DocumentService;
import com.example.kavachdms.service.MinIOStorageService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final DocumentRepository documentRepository;
    private final DocumentVersionRepository documentVersionRepository;
    private final UserRepository userRepository;
    private final MinIOStorageService minIOStorageService;

    public DocumentController(
            DocumentService documentService,
            DocumentRepository documentRepository,
            DocumentVersionRepository documentVersionRepository,
            UserRepository userRepository,
            MinIOStorageService minIOStorageService) {

        this.documentService = documentService;
        this.documentRepository = documentRepository;
        this.documentVersionRepository = documentVersionRepository;
        this.userRepository = userRepository;
        this.minIOStorageService = minIOStorageService;
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

    @PostMapping("/{id}/upload")
    public String uploadDocument(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Document not found"));

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        int nextVersion = documentVersionRepository.findAll()
                .stream()
                .filter(v ->
                        v.getId().getDocumentId().equals(id))
                .mapToInt(v ->
                        v.getId().getVersionNumber())
                .max()
                .orElse(0) + 1;

        String objectKey =
                document.getCaseEntity().getCaseId()
                        + "/" + id
                        + "/v" + nextVersion
                        + "/" + file.getOriginalFilename();

        String storageKey =
                minIOStorageService.uploadFile(
                        file,
                        objectKey
                );

        DocumentVersion version = new DocumentVersion();

        version.setId(
                new DocumentVersionId(id, nextVersion)
        );

        version.setDocument(document);
        version.setUploadedBy(user);
        version.setStorageKey(storageKey);

        documentVersionRepository.save(version);

        return "Uploaded successfully: " + storageKey;
    }
}