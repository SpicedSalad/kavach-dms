package com.example.kavachdms.service;

import com.example.kavachdms.entity.Case;
import com.example.kavachdms.entity.CaseMember;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.CaseMemberRepository;
import com.example.kavachdms.repository.CaseRepository;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("caseSecurityService")
public class CaseSecurityService {

    private final CaseMemberRepository caseMemberRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public CaseSecurityService(
            CaseMemberRepository caseMemberRepository,
            CaseRepository caseRepository,
            UserRepository userRepository,
            AuditService auditService) {

        this.caseMemberRepository = caseMemberRepository;
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public boolean canReadCase(Authentication authentication, Long caseId) {
        return checkCaseAccess(authentication, caseId, "READ");
    }

    public boolean canWriteCase(Authentication authentication, Long caseId) {
        return checkCaseAccess(authentication, caseId, "WRITE");
    }

    public boolean canManageCase(Authentication authentication, Long caseId) {
        return checkCaseAccess(authentication, caseId, "FULL");
    }

    /*
     * Kept for existing code/tests that only need to check
     * whether the user has any valid access to the case.
     */
    public boolean canAccessCase(Authentication authentication, Long caseId) {
        return canReadCase(authentication, caseId);
    }

    private boolean checkCaseAccess(
            Authentication authentication,
            Long caseId,
            String requiredLevel) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Case caseEntity = caseRepository.findById(caseId).orElse(null);

        if (caseEntity == null) {
            return false;
        }

        User user = userRepository.findByEmail(authentication.getName()).orElse(null);

        if (user == null) {
            return false;
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            auditService.logEvent(
                    user,
                    caseEntity,
                    null,
                    "ACCESS_GRANTED",
                    null,
                    "Administrator access"
            );
            return true;
        }

        CaseMember membership = caseMemberRepository
                .findByCaseEntity_CaseIdAndUser_Email(
                        caseId,
                        authentication.getName()
                )
                .orElse(null);

        if (membership == null) {
            auditService.logEvent(
                    user,
                    caseEntity,
                    null,
                    "ACCESS_DENIED",
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
                caseEntity,
                null,
                allowed ? "ACCESS_GRANTED" : "ACCESS_DENIED",
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