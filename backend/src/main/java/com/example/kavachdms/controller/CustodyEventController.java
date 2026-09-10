package com.example.kavachdms.controller;

import com.example.kavachdms.dto.custodyEvent.CreateCustodyEventRequest;
import com.example.kavachdms.dto.custodyEvent.CustodyEventResponse;
import com.example.kavachdms.service.CustodyEventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/custody-events")
public class CustodyEventController {

    private final CustodyEventService custodyEventService;

    public CustodyEventController(CustodyEventService custodyEventService) {
        this.custodyEventService = custodyEventService;
    }

    @PostMapping
    public ResponseEntity<CustodyEventResponse> createCustodyEvent(
            @Valid @RequestBody CreateCustodyEventRequest request) {

        return ResponseEntity.ok(
                custodyEventService.createCustodyEvent(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<CustodyEventResponse>> getAllCustodyEvents() {
        return ResponseEntity.ok(
                custodyEventService.getAllCustodyEvents()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustodyEventResponse> getCustodyEventById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                custodyEventService.getCustodyEventById(id)
        );
    }
}