package com.example.kavachdms.controller;

import com.example.kavachdms.dto.caseMember.AddCaseMemberRequest;
import com.example.kavachdms.dto.caseMember.CaseMemberResponse;
import com.example.kavachdms.service.CaseMemberService;
import jakarta.validation.Valid;
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
            @Valid @RequestBody AddCaseMemberRequest request) {

        return caseMemberService.addMember(request);
    }

    @GetMapping
    public List<CaseMemberResponse> getAllMembers() {
        return caseMemberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public CaseMemberResponse getMember(@PathVariable Long id) {
        return caseMemberService.getMember(id);
    }

    @DeleteMapping("/{id}")
    public void removeMember(@PathVariable Long id) {
        caseMemberService.removeMember(id);
    }
}