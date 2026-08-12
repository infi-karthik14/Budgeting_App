package com.budgetingapp.controller;

import com.budgetingapp.dto.LoginRequest;
import com.budgetingapp.dto.RegisterRequest;
import com.budgetingapp.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.budgetingapp.dto.UserResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }

    @GetMapping("/user")
    public UserResponse getUser(@RequestParam String email) {

        return authService.getUserByEmail(email);
    }
}