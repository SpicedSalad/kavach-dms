package com.example.kavachdms.controller;

import com.example.kavachdms.dto.custodyEvent.CreateCustodyEventRequest;
import com.example.kavachdms.dto.custodyEvent.CustodyEventResponse;
import com.example.kavachdms.service.CustodyEventService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/custody-events")
public class CustodyEventController {

    private final CustodyEventService custodyEventService;

    public CustodyEventController(
            CustodyEventService custodyEventService) {
        this.custodyEventService = custodyEventService;
    }

    @PostMapping
    public CustodyEventResponse createCustodyEvent(
            @Valid @RequestBody CreateCustodyEventRequest request,
            Authentication authentication) {

        return custodyEventService.createCustodyEvent(
                request,
                authentication
        );
    }

    @GetMapping
    public List<CustodyEventResponse> getAllCustodyEvents(
            Authentication authentication) {
        return custodyEventService.getAllCustodyEvents(authentication);
    }

    @GetMapping("/{id}")
    public CustodyEventResponse getCustodyEventById(
            @PathVariable Long id,
            Authentication authentication) {
        return custodyEventService.getCustodyEventById(id, authentication);
    }
}