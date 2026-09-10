package com.example.kavachdms.service;

import com.example.kavachdms.entity.PhysicalEvidence;
import com.example.kavachdms.repository.PhysicalEvidenceRepository;
import org.springframework.stereotype.Service;

@Service
public class PhysicalEvidenceService {

    private final PhysicalEvidenceRepository physicalEvidenceRepository;

    public PhysicalEvidenceService(PhysicalEvidenceRepository physicalEvidenceRepository) {
        this.physicalEvidenceRepository = physicalEvidenceRepository;
    }
}
