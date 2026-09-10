package com.example.kavachdms.service;

import com.example.kavachdms.entity.Document;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("documentSecurityService")
public class DocumentSecurityService {

    private final UserRepository userRepository;
    private final CaseSecurityService caseSecurityService;
    private final AuditService auditService;

    public DocumentSecurityService(
            UserRepository userRepository,
            CaseSecurityService caseSecurityService,
            AuditService auditService) {

        this.userRepository = userRepository;
        this.caseSecurityService = caseSecurityService;
        this.auditService = auditService;
    }

    public boolean canReadDocument(
            Authentication authentication,
            Document document) {

        return checkDocumentAccess(authentication, document, "READ");
    }

    public boolean canWriteDocument(
            Authentication authentication,
            Document document) {

        return checkDocumentAccess(authentication, document, "WRITE");
    }

    public boolean canManageDocument(
            Authentication authentication,
            Document document) {

        return checkDocumentAccess(authentication, document, "FULL");
    }

    private boolean checkDocumentAccess(
            Authentication authentication,
            Document document,
            String requiredLevel) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || document == null
                || document.getCaseEntity() == null) {

            return false;
        }

        Long caseId = document.getCaseEntity().getCaseId();

        boolean allowed;

        switch (requiredLevel) {
            case "READ":
                allowed = caseSecurityService.canReadCase(authentication, caseId);
                break;

            case "WRITE":
                allowed = caseSecurityService.canWriteCase(authentication, caseId);
                break;

            case "FULL":
                allowed = caseSecurityService.canManageCase(authentication, caseId);
                break;

            default:
                allowed = false;
        }

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElse(null);

        if (user != null) {
            auditService.logEvent(
                    user,
                    document.getCaseEntity(),
                    document,
                    allowed
                            ? "DOCUMENT_ACCESS_GRANTED"
                            : "DOCUMENT_ACCESS_DENIED",
                    null,
                    allowed
                            ? "Required access: " + requiredLevel
                            : "Insufficient access for: " + requiredLevel
            );
        }

        return allowed;
    }
}