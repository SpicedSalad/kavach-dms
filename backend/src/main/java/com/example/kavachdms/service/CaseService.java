package com.example.kavachdms.service;

import com.example.kavachdms.dto.cases.CaseResponse;
import com.example.kavachdms.dto.cases.CreateCaseRequest;
import com.example.kavachdms.entity.Case;
import com.example.kavachdms.repository.CaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseService {

    private final CaseRepository caseRepository;

    public CaseService(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    public CaseResponse createCase(CreateCaseRequest request) {

        Case newCase = new Case();

        newCase.setCaseNumber(request.getCaseNumber());
        newCase.setTitle(request.getTitle());
        newCase.setDescription(request.getDescription());
        newCase.setClassification(request.getClassification());

        // Backend-controlled field
        newCase.setStatus("ACTIVE");

        Case savedCase = caseRepository.save(newCase);

        return CaseResponse.fromEntity(savedCase);
    }

    public List<CaseResponse> getAllCases() {
        return caseRepository.findAll()
                .stream()
                .map(CaseResponse::fromEntity)
                .toList();
    }
}