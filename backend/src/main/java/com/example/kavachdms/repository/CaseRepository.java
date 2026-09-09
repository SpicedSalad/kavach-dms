package com.example.kavachdms.repository;

import com.example.kavachdms.entity.Case;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<Case, Long> {
}