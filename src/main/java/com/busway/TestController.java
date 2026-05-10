package com.busway;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/busway/test")
    public String test() {
        return "CONTROLLER WORKING!";
    }
}