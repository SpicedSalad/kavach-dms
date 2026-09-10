package com.example.kavachdms.controller;

import com.example.kavachdms.dto.physicalEvidence.PhysicalEvidenceResponse;
import com.example.kavachdms.dto.physicalEvidence.RegisterEvidenceRequest;
import com.example.kavachdms.service.PhysicalEvidenceService;
import jakarta.validation.Valid;
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
            @Valid @RequestBody RegisterEvidenceRequest request) {

        return physicalEvidenceService.registerEvidence(request);
    }

    @GetMapping
    public List<PhysicalEvidenceResponse> getAllEvidence() {
        return physicalEvidenceService.getAllEvidence();
    }

    @GetMapping("/{id}")
    public PhysicalEvidenceResponse getEvidence(
            @PathVariable Long id) {

        return physicalEvidenceService.getEvidence(id);
    }
}