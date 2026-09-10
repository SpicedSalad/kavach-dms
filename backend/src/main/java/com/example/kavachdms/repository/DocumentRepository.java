package com.example.kavachdms.repository;

import com.example.kavachdms.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
}