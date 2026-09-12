package com.example.kavachdms.controller;

import com.example.kavachdms.dto.physicalEvidence.PhysicalEvidenceResponse;
import com.example.kavachdms.dto.physicalEvidence.RegisterEvidenceRequest;
import com.example.kavachdms.service.PhysicalEvidenceService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evidence")
public class PhysicalEvidenceController {

    private final PhysicalEvidenceService physicalEvidenceService;

    public PhysicalEvidenceController(
            PhysicalEvidenceService physicalEvidenceService) {

        this.physicalEvidenceService = physicalEvidenceService;
    }

    @PostMapping
    public PhysicalEvidenceResponse registerEvidence(
            @Valid @RequestBody RegisterEvidenceRequest request,
            Authentication authentication) {

        return physicalEvidenceService.registerEvidence(
                request,
                authentication
        );
    }

    @GetMapping
    public List<PhysicalEvidenceResponse> getAllEvidence(
            Authentication authentication) {
        return physicalEvidenceService.getAllEvidence(authentication);
    }

    @GetMapping("/{id}")
    public PhysicalEvidenceResponse getEvidence(
            @PathVariable Long id,
            Authentication authentication) {

        return physicalEvidenceService.getEvidence(
                id,
                authentication
        );
    }
}