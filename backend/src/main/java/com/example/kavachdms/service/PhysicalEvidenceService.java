package com.example.kavachdms.service;

import com.example.kavachdms.entity.PhysicalEvidence;
import com.example.kavachdms.repository.PhysicalEvidenceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhysicalEvidenceService {

    private final PhysicalEvidenceRepository physicalEvidenceRepository;

    public PhysicalEvidenceService(PhysicalEvidenceRepository physicalEvidenceRepository) {
        this.physicalEvidenceRepository = physicalEvidenceRepository;
    }

    public PhysicalEvidence createEvidence(PhysicalEvidence evidence) {
        return physicalEvidenceRepository.save(evidence);
    }

    public List<PhysicalEvidence> getAllEvidence() {
        return physicalEvidenceRepository.findAll();
    }

    public PhysicalEvidence getEvidence(Long id) {
        return physicalEvidenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evidence not found"));
    }
}