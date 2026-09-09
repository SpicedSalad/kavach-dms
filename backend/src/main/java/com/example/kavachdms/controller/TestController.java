package com.example.kavachdms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "KavachDMS Security is working!";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/test")
    public String adminTest() {
        return "ADMIN access granted!";
    }

    @PreAuthorize("hasAnyRole('FORENSIC', 'ADMIN')")
    @GetMapping("/forensics/test")
    public String forensicsTest() {
        return "FORENSIC access granted!";
    }
}