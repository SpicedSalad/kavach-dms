package com.example.kavachdms.controller;

import com.example.kavachdms.entity.CaseMember;
import com.example.kavachdms.service.CaseMemberService;
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
    public CaseMember addMember(@RequestBody CaseMember caseMember) {
        return caseMemberService.addMember(caseMember);
    }

    @GetMapping
    public List<CaseMember> getAllMembers() {
        return caseMemberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public CaseMember getMember(@PathVariable Long id) {
        return caseMemberService.getMember(id);
    }

    @DeleteMapping("/{id}")
    public void removeMember(@PathVariable Long id) {
        caseMemberService.removeMember(id);
    }
}