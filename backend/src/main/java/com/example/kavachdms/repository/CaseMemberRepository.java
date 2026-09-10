package com.example.kavachdms.repository;

import com.example.kavachdms.entity.CaseMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CaseMemberRepository extends JpaRepository<CaseMember, Long> {

    Optional<CaseMember> findByCaseEntity_CaseIdAndUser_Email(
            Long caseId,
            String email
    );
}