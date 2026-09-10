package com.example.kavachdms.controller;

import com.example.kavachdms.entity.PhysicalEvidence;
import com.example.kavachdms.service.PhysicalEvidenceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evidence")
public class PhysicalEvidenceController {

    private final PhysicalEvidenceService physicalEvidenceService;

    public PhysicalEvidenceController(PhysicalEvidenceService physicalEvidenceService) {
        this.physicalEvidenceService = physicalEvidenceService;
    }

    @PostMapping
    public PhysicalEvidence createEvidence(
            @RequestBody PhysicalEvidence evidence) {
        return physicalEvidenceService.createEvidence(evidence);
    }

    @GetMapping
    public List<PhysicalEvidence> getAllEvidence() {
        return physicalEvidenceService.getAllEvidence();
    }

    @GetMapping("/{id}")
    public PhysicalEvidence getEvidence(@PathVariable Long id) {
        return physicalEvidenceService.getEvidence(id);
    }
}