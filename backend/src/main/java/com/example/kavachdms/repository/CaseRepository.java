package com.example.kavachdms.repository;

import com.example.kavachdms.entity.Case;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CaseRepository extends JpaRepository<Case, Long> {

    Optional<Case> findByCaseNumber(String caseNumber);
}