package com.example.kavachdms.service;

import com.example.kavachdms.dto.caseMember.AddCaseMemberRequest;
import com.example.kavachdms.dto.caseMember.CaseMemberResponse;
import com.example.kavachdms.entity.Case;
import com.example.kavachdms.entity.CaseMember;
import com.example.kavachdms.entity.Role;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.CaseMemberRepository;
import com.example.kavachdms.repository.CaseRepository;
import com.example.kavachdms.repository.RoleRepository;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseMemberService {

    private final CaseMemberRepository caseMemberRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CaseSecurityService caseSecurityService;

    public CaseMemberService(
            CaseMemberRepository caseMemberRepository,
            CaseRepository caseRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            CaseSecurityService caseSecurityService) {

        this.caseMemberRepository = caseMemberRepository;
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.caseSecurityService = caseSecurityService;
    }

    public CaseMemberResponse addMember(
            AddCaseMemberRequest request,
            Authentication authentication) {

        Case caseEntity = caseRepository.findById(request.getCaseId())
                .orElseThrow(() ->
                        new RuntimeException("Case not found"));

        if (!caseSecurityService.canManageCase(
                authentication,
                caseEntity.getCaseId())) {

            throw new RuntimeException(
                    "Insufficient permission to manage case members");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() ->
                        new RuntimeException("Role not found"));

        CaseMember caseMember = new CaseMember();

        caseMember.setCaseEntity(caseEntity);
        caseMember.setUser(user);
        caseMember.setRole(role);
        caseMember.setAccessLevel(request.getAccessLevel());
        caseMember.setStatus(request.getStatus());

        CaseMember savedMember =
                caseMemberRepository.save(caseMember);

        return CaseMemberResponse.fromEntity(savedMember);
    }

    public List<CaseMemberResponse> getAllMembers(
            Authentication authentication) {

        return caseMemberRepository.findAll()
                .stream()
                .filter(member ->
                        member.getCaseEntity() != null &&
                                caseSecurityService.canReadCase(
                                        authentication,
                                        member.getCaseEntity().getCaseId()))
                .map(CaseMemberResponse::fromEntity)
                .toList();
    }

    public CaseMemberResponse getMember(
            Long id,
            Authentication authentication) {

        CaseMember caseMember =
                caseMemberRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Case member not found"));

        if (caseMember.getCaseEntity() == null) {
            throw new RuntimeException("Case not found");
        }

        if (!caseSecurityService.canReadCase(
                authentication,
                caseMember.getCaseEntity().getCaseId())) {

            throw new RuntimeException(
                    "Insufficient permission to view case member");
        }

        return CaseMemberResponse.fromEntity(caseMember);
    }

    public void removeMember(
            Long id,
            Authentication authentication) {

        CaseMember caseMember =
                caseMemberRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Case member not found"));

        if (caseMember.getCaseEntity() == null) {
            throw new RuntimeException("Case not found");
        }

        if (!caseSecurityService.canManageCase(
                authentication,
                caseMember.getCaseEntity().getCaseId())) {

            throw new RuntimeException(
                    "Insufficient permission to remove case member");
        }

        caseMemberRepository.delete(caseMember);
    }
}