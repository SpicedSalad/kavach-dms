package com.example.kavachdms.service;

import com.example.kavachdms.dto.documents.CreateDocumentRequest;
import com.example.kavachdms.dto.documents.DocumentResponse;
import com.example.kavachdms.entity.Case;
import com.example.kavachdms.entity.Document;
import com.example.kavachdms.entity.PhysicalEvidence;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.CaseRepository;
import com.example.kavachdms.repository.DocumentRepository;
import com.example.kavachdms.repository.PhysicalEvidenceRepository;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final PhysicalEvidenceRepository physicalEvidenceRepository;
    private final CaseSecurityService caseSecurityService;
    private final DocumentSecurityService documentSecurityService;

    public DocumentService(
            DocumentRepository documentRepository,
            CaseRepository caseRepository,
            UserRepository userRepository,
            PhysicalEvidenceRepository physicalEvidenceRepository,
            CaseSecurityService caseSecurityService,
            DocumentSecurityService documentSecurityService) {

        this.documentRepository = documentRepository;
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
        this.physicalEvidenceRepository = physicalEvidenceRepository;
        this.caseSecurityService = caseSecurityService;
        this.documentSecurityService = documentSecurityService;
    }

    public DocumentResponse createDocument(
            CreateDocumentRequest request,
            Authentication authentication) {

        Case caseEntity = caseRepository.findById(request.getCaseId())
                .orElseThrow(() ->
                        new RuntimeException("Case not found"));

        if (!caseSecurityService.canWriteCase(
                authentication,
                caseEntity.getCaseId())) {

            throw new RuntimeException(
                    "Insufficient permission to create document");
        }

        User creator = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("Authenticated user not found"));

        Document document = new Document();

        document.setCaseEntity(caseEntity);
        document.setCreatedBy(creator);
        document.setDocumentName(request.getDocumentName());
        document.setDocumentType(request.getDocumentType());
        document.setClassification(request.getClassification());

        /*
         * Physical evidence is optional.
         */
        if (request.getEvidenceId() != null) {

            PhysicalEvidence evidence =
                    physicalEvidenceRepository.findById(request.getEvidenceId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Physical evidence not found"));

            /*
             * Evidence must belong to the same case
             * as the document.
             */
            if (!evidence.getCaseEntity()
                    .getCaseId()
                    .equals(caseEntity.getCaseId())) {

                throw new RuntimeException(
                        "Physical evidence does not belong to this case");
            }

            document.setEvidence(evidence);
        }

        Document savedDocument =
                documentRepository.save(document);

        return DocumentResponse.fromEntity(savedDocument);
    }

    public List<DocumentResponse> getAllDocuments(
            Authentication authentication) {

        return documentRepository.findAll()
                .stream()
                .filter(document ->
                        documentSecurityService.canReadDocument(
                                authentication,
                                document))
                .map(DocumentResponse::fromEntity)
                .toList();
    }

    public DocumentResponse getDocument(
            Long id,
            Authentication authentication) {

        Document document =
                documentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Document not found"));

        if (!documentSecurityService.canReadDocument(
                authentication,
                document)) {

            throw new RuntimeException(
                    "Insufficient permission to view document");
        }

        return DocumentResponse.fromEntity(document);
    }

    public void deleteDocument(
            Long id,
            Authentication authentication) {

        Document document =
                documentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Document not found"));

        if (!documentSecurityService.canManageDocument(
                authentication,
                document)) {

            throw new RuntimeException(
                    "Insufficient permission to delete document");
        }

        documentRepository.delete(document);
    }
}