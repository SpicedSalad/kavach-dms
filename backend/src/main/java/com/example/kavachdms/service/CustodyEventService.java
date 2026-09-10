package com.example.kavachdms.service;

import com.example.kavachdms.entity.CustodyEvent;
import com.example.kavachdms.repository.CustodyEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustodyEventService {

    private final CustodyEventRepository custodyEventRepository;

    public CustodyEventService(CustodyEventRepository custodyEventRepository) {
        this.custodyEventRepository = custodyEventRepository;
    }

    public CustodyEvent createEvent(CustodyEvent event) {
        return custodyEventRepository.save(event);
    }

    public List<CustodyEvent> getAllEvents() {
        return custodyEventRepository.findAll();
    }

    public CustodyEvent getEvent(Long id) {
        return custodyEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Custody event not found"));
    }
}