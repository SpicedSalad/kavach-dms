package com.example.kavachdms.service;

import com.example.kavachdms.entity.CaseMember;
import com.example.kavachdms.entity.Document;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.CaseMemberRepository;
import com.example.kavachdms.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("documentSecurityService")
public class DocumentSecurityService {

    private final CaseMemberRepository caseMemberRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public DocumentSecurityService(
            CaseMemberRepository caseMemberRepository,
            UserRepository userRepository,
            AuditService auditService) {

        this.caseMemberRepository = caseMemberRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public boolean canReadDocument(
            Authentication authentication,
            Document document) {

        return checkAccess(authentication, document, "READ");
    }

    public boolean canWriteDocument(
            Authentication authentication,
            Document document) {

        return checkAccess(authentication, document, "WRITE");
    }

    public boolean canManageDocument(
            Authentication authentication,
            Document document) {

        return checkAccess(authentication, document, "FULL");
    }

    private boolean checkAccess(
            Authentication authentication,
            Document document,
            String requiredLevel) {

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                document == null ||
                document.getCaseEntity() == null) {
            return false;
        }

        User user = userRepository.findByEmail(
                authentication.getName()
        ).orElse(null);

        if (user == null) {
            return false;
        }

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            auditService.logEvent(
                    user,
                    document.getCaseEntity(),
                    document,
                    "DOCUMENT_ACCESS_GRANTED",
                    null,
                    "Administrator access"
            );
            return true;
        }

        CaseMember membership =
                caseMemberRepository
                        .findByCaseEntity_CaseIdAndUser_Email(
                                document.getCaseEntity().getCaseId(),
                                authentication.getName()
                        )
                        .orElse(null);

        if (membership == null) {
            auditService.logEvent(
                    user,
                    document.getCaseEntity(),
                    document,
                    "DOCUMENT_ACCESS_DENIED",
                    null,
                    "User is not a member of this case"
            );
            return false;
        }

        String accessLevel = membership.getAccessLevel();

        boolean allowed =
                "ACTIVE".equalsIgnoreCase(membership.getStatus())
                        && hasRequiredAccess(accessLevel, requiredLevel);

        auditService.logEvent(
                user,
                document.getCaseEntity(),
                document,
                allowed
                        ? "DOCUMENT_ACCESS_GRANTED"
                        : "DOCUMENT_ACCESS_DENIED",
                null,
                allowed
                        ? "Access level: " + accessLevel
                        : "Insufficient access level: " + accessLevel
        );

        return allowed;
    }

    private boolean hasRequiredAccess(
            String actualLevel,
            String requiredLevel) {

        if (actualLevel == null) {
            return false;
        }

        if ("FULL".equalsIgnoreCase(actualLevel)) {
            return true;
        }

        if ("WRITE".equalsIgnoreCase(actualLevel)) {
            return "READ".equalsIgnoreCase(requiredLevel)
                    || "WRITE".equalsIgnoreCase(requiredLevel);
        }

        return "READ".equalsIgnoreCase(actualLevel)
                && "READ".equalsIgnoreCase(requiredLevel);
    }
}