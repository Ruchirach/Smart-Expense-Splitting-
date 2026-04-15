package com.example.smartexpensesplitter.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TempController {
    @GetMapping("/greet")
    public String greet() {
        return "Hello, World!";
    }
}