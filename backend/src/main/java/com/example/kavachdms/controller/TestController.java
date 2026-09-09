package com.example.kavachdms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "KavachDMS Security is working!";
    }

    @GetMapping("/admin/test")
    public String adminTest() {
        return "ADMIN access granted!";
    }

    @GetMapping("/forensics/test")
    public String forensicsTest() {
        return "FORENSIC access granted!";
    }
}