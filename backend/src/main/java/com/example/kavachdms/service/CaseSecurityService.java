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

    public boolean canAccessCase(
            Authentication authentication,
            Long caseId) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return false;
        }

        Case caseEntity = caseRepository.findById(caseId)
                .orElse(null);

        if (caseEntity == null) {
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
                        && accessLevel != null
                        && (
                        "READ".equalsIgnoreCase(accessLevel)
                                || "WRITE".equalsIgnoreCase(accessLevel)
                                || "FULL".equalsIgnoreCase(accessLevel)
                );

        auditService.logEvent(
                user,
                caseEntity,
                null,
                allowed ? "ACCESS_GRANTED" : "ACCESS_DENIED",
                null,
                allowed
                        ? "Active case membership"
                        : "Inactive membership or missing access level"
        );

        return allowed;
    }
}