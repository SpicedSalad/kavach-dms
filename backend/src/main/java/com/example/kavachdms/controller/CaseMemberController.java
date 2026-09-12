package com.example.kavachdms.controller;

import com.example.kavachdms.dto.caseMember.AddCaseMemberRequest;
import com.example.kavachdms.dto.caseMember.CaseMemberResponse;
import com.example.kavachdms.service.CaseMemberService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/case-members")
public class CaseMemberController {

    private final CaseMemberService caseMemberService;

    public CaseMemberController(CaseMemberService caseMemberService) {
        this.caseMemberService = caseMemberService;
    }

    @PostMapping
    public CaseMemberResponse addMember(
            @Valid @RequestBody AddCaseMemberRequest request,
            Authentication authentication) {

        return caseMemberService.addMember(
                request,
                authentication);
    }

    @GetMapping
    public List<CaseMemberResponse> getAllMembers(
            Authentication authentication) {

        return caseMemberService.getAllMembers(
                authentication);
    }

    @GetMapping("/{id}")
    public CaseMemberResponse getMember(
            @PathVariable Long id,
            Authentication authentication) {

        return caseMemberService.getMember(
                id,
                authentication);
    }

    @DeleteMapping("/{id}")
    public void removeMember(
            @PathVariable Long id,
            Authentication authentication) {

        caseMemberService.removeMember(
                id,
                authentication);
    }
}