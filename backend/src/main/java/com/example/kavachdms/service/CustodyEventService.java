package com.example.kavachdms.service;

import com.example.kavachdms.entity.CustodyEvent;
import com.example.kavachdms.repository.CustodyEventRepository;
import org.springframework.stereotype.Service;

@Service
public class CustodyEventService {

    private final CustodyEventRepository custodyEventRepository;

    public CustodyEventService(CustodyEventRepository custodyEventRepository) {
        this.custodyEventRepository = custodyEventRepository;
    }
}
