package com.example.kavachdms.controller;

import com.example.kavachdms.entity.Case;
import com.example.kavachdms.service.CaseService;
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
    public Case createCase(@RequestBody Case newCase) {
        return caseService.createCase(newCase);
    }

    @GetMapping
    public List<Case> getAllCases() {
        return caseService.getAllCases();
    }
}

