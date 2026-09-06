package com.budgetingapp.controller;

import com.budgetingapp.dto.LoginRequest;
import com.budgetingapp.dto.RegisterRequest;
import com.budgetingapp.dto.UpdateProfileRequest;
import com.budgetingapp.dto.UserResponse;
import com.budgetingapp.service.AuthService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://gregarious-communication-production-6879.up.railway.app"
})
public class AuthController {

    private final AuthService authService;

    // ==================================================
    // CONSTRUCTOR
    // ==================================================

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ==================================================
    // REGISTER
    // POST: /api/auth/register
    // ==================================================

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    // ==================================================
    // LOGIN
    // POST: /api/auth/login
    // ==================================================

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody LoginRequest request) {

        String result = authService.login(request);

        return Map.of(
                "message", result);
    }

    // ==================================================
    // GET USER PROFILE
    // GET: /api/auth/user?email=example@gmail.com
    // ==================================================

    @GetMapping("/user")
    public UserResponse getUser(
            @RequestParam String email) {

        return authService.getUserByEmail(email);
    }

    // ==================================================
    // UPDATE USER PROFILE
    // PUT: /api/auth/user?email=example@gmail.com
    // ==================================================

    @PutMapping("/user")
    public UserResponse updateUser(
            @RequestParam String email,
            @RequestBody UpdateProfileRequest request) {

        return authService.updateUser(email, request);
    }
}