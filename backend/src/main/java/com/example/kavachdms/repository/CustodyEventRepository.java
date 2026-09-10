package com.example.kavachdms.repository;

import com.example.kavachdms.entity.CustodyEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustodyEventRepository
        extends JpaRepository<CustodyEvent, Long> {
}
