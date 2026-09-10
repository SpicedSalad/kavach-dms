package com.example.kavachdms.service;

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

    public Case createCase(Case newCase) {
        return caseRepository.save(newCase);
    }

    public List<Case> getAllCases() {
        return caseRepository.findAll();
    }
}
