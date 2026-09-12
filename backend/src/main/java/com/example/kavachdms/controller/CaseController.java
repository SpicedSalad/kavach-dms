package com.example.kavachdms.controller;

import com.example.kavachdms.dto.cases.CaseResponse;
import com.example.kavachdms.dto.cases.CreateCaseRequest;
import com.example.kavachdms.service.CaseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/api/cases")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @PostMapping
    public CaseResponse createCase(
            @Valid @RequestBody CreateCaseRequest request,
            Authentication authentication) {

        return caseService.createCase(request, authentication);
    }

    @GetMapping
    public List<CaseResponse> getAllCases(
            Authentication authentication) {
        return caseService.getAllCases(authentication);
    }
}