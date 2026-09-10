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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final PhysicalEvidenceRepository physicalEvidenceRepository;

    public DocumentService(
            DocumentRepository documentRepository,
            CaseRepository caseRepository,
            UserRepository userRepository,
            PhysicalEvidenceRepository physicalEvidenceRepository) {

        this.documentRepository = documentRepository;
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
        this.physicalEvidenceRepository = physicalEvidenceRepository;
    }

    public DocumentResponse createDocument(CreateDocumentRequest request) {

        Case caseEntity = caseRepository.findById(request.getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found"));

        User creator = userRepository.findById(request.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("User not found"));

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
                                    new RuntimeException("Physical evidence not found"));

            document.setEvidence(evidence);
        }

        Document savedDocument = documentRepository.save(document);

        return DocumentResponse.fromEntity(savedDocument);
    }

    public List<DocumentResponse> getAllDocuments() {

        return documentRepository.findAll()
                .stream()
                .map(DocumentResponse::fromEntity)
                .toList();
    }

    public DocumentResponse getDocument(Long id) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Document not found"));

        return DocumentResponse.fromEntity(document);
    }

    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }
}