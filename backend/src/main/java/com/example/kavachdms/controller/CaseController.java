package com.example.kavachdms.controller;

import com.example.kavachdms.dto.cases.CaseResponse;
import com.example.kavachdms.dto.cases.CreateCaseRequest;
import com.example.kavachdms.service.CaseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/cases")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @PostMapping
    public CaseResponse createCase(
            @Valid @RequestBody CreateCaseRequest request) {

        return caseService.createCase(request);
    }

    @GetMapping
    public List<CaseResponse> getAllCases() {
        return caseService.getAllCases();
    }
}