package com.example.kavachdms.controller;

import com.example.kavachdms.entity.CustodyEvent;
import com.example.kavachdms.service.CustodyEventService;
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
    public CustodyEvent createEvent(@RequestBody CustodyEvent event) {
        return custodyEventService.createEvent(event);
    }

    @GetMapping
    public List<CustodyEvent> getAllEvents() {
        return custodyEventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public CustodyEvent getEvent(@PathVariable Long id) {
        return custodyEventService.getEvent(id);
    }
}