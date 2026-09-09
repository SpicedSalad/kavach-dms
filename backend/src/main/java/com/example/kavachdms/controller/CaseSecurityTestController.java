package com.example.kavachdms.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cases")
public class CaseSecurityTestController {

    @GetMapping("/{caseId}/access")
    @PreAuthorize("@caseSecurityService.canAccessCase(authentication, #caseId)")
    public String checkCaseAccess(@PathVariable Long caseId) {
        return "Case access granted for case ID: " + caseId;
    }
}