package com.example.kavachdms.service;

import com.example.kavachdms.entity.Document;
import com.example.kavachdms.entity.DocumentVersion;
import com.example.kavachdms.entity.DocumentVersionId;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.DocumentRepository;
import com.example.kavachdms.repository.DocumentVersionRepository;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentVersionService {

    private final DocumentVersionRepository documentVersionRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final CaseSecurityService caseSecurityService;

    public DocumentVersionService(
            DocumentVersionRepository documentVersionRepository,
            DocumentRepository documentRepository,
            UserRepository userRepository,
            CaseSecurityService caseSecurityService) {

        this.documentVersionRepository = documentVersionRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.caseSecurityService = caseSecurityService;
    }

    @Transactional
    public DocumentVersion createVersion(
            DocumentVersion version,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Authentication required");
        }

        if (version.getDocument() == null ||
                version.getDocument().getDocumentId() == null) {

            throw new RuntimeException("Document is required");
        }

        Long documentId = version.getDocument().getDocumentId();

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new RuntimeException("Document not found"));

        if (!caseSecurityService.canWriteCase(
                authentication,
                document.getCaseEntity().getCaseId())) {

            throw new RuntimeException(
                    "Insufficient permission to create document version");
        }

        User uploadedBy = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));

        int nextVersion = document.getCurrentVersion() + 1;

        DocumentVersionId versionId =
                new DocumentVersionId(documentId, nextVersion);

        version.setId(versionId);
        version.setDocument(document);
        version.setUploadedBy(uploadedBy);

        DocumentVersion savedVersion =
                documentVersionRepository.save(version);

        document.setCurrentVersion(nextVersion);
        documentRepository.save(document);

        return savedVersion;
    }

    public List<DocumentVersion> getAllVersions(
            Authentication authentication) {

        return documentVersionRepository.findAll()
                .stream()
                .filter(version ->
                        version.getDocument() != null &&
                                version.getDocument().getCaseEntity() != null &&
                                caseSecurityService.canReadCase(
                                        authentication,
                                        version.getDocument()
                                                .getCaseEntity()
                                                .getCaseId()))
                .toList();
    }

    public DocumentVersion getVersion(
            DocumentVersionId id,
            Authentication authentication) {

        DocumentVersion version =
                documentVersionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Document version not found"));

        if (version.getDocument() == null ||
                version.getDocument().getCaseEntity() == null) {

            throw new RuntimeException("Document case not found");
        }

        if (!caseSecurityService.canReadCase(
                authentication,
                version.getDocument()
                        .getCaseEntity()
                        .getCaseId())) {

            throw new RuntimeException(
                    "Insufficient permission to view document version");
        }

        return version;
    }
}