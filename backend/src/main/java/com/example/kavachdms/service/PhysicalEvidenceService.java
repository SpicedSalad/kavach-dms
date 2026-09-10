package com.example.kavachdms.service;

import com.example.kavachdms.dto.physicalEvidence.PhysicalEvidenceResponse;
import com.example.kavachdms.dto.physicalEvidence.RegisterEvidenceRequest;
import com.example.kavachdms.entity.Case;
import com.example.kavachdms.entity.PhysicalEvidence;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.CaseRepository;
import com.example.kavachdms.repository.PhysicalEvidenceRepository;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhysicalEvidenceService {

    private final PhysicalEvidenceRepository physicalEvidenceRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    public PhysicalEvidenceService(
            PhysicalEvidenceRepository physicalEvidenceRepository,
            CaseRepository caseRepository,
            UserRepository userRepository) {

        this.physicalEvidenceRepository = physicalEvidenceRepository;
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
    }

    public PhysicalEvidenceResponse registerEvidence(
            RegisterEvidenceRequest request) {

        Case caseEntity = caseRepository.findById(request.getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found"));

        PhysicalEvidence evidence = new PhysicalEvidence();

        evidence.setCaseEntity(caseEntity);
        evidence.setEvidenceCode(request.getEvidenceCode());
        evidence.setBarcodeOrQr(request.getBarcodeOrQr());
        evidence.setDescription(request.getDescription());
        evidence.setEvidenceType(request.getEvidenceType());
        evidence.setStatus(request.getStatus());
        evidence.setCurrentLocation(request.getCurrentLocation());

        if (request.getCurrentHolder() != null) {
            User holder = userRepository.findById(request.getCurrentHolder())
                    .orElseThrow(() ->
                            new RuntimeException("Current holder not found"));

            evidence.setCurrentHolder(holder);
        }

        PhysicalEvidence savedEvidence =
                physicalEvidenceRepository.save(evidence);

        return PhysicalEvidenceResponse.fromEntity(savedEvidence);
    }

    public List<PhysicalEvidenceResponse> getAllEvidence() {

        return physicalEvidenceRepository.findAll()
                .stream()
                .map(PhysicalEvidenceResponse::fromEntity)
                .toList();
    }

    public PhysicalEvidenceResponse getEvidence(Long id) {

        PhysicalEvidence evidence =
                physicalEvidenceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Evidence not found"));

        return PhysicalEvidenceResponse.fromEntity(evidence);
    }
}