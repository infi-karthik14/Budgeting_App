package com.budgetingapp.service;

import com.budgetingapp.dto.LoginRequest;
import com.budgetingapp.dto.RegisterRequest;
import com.budgetingapp.dto.UserResponse;
import com.budgetingapp.entity.User;
import com.budgetingapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.budgetingapp.dto.UserResponse;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =====================================================
    // REGISTER USER
    // =====================================================

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            return "Email already exists!";
        }

        User user = new User();

        user.setName(request.getFullName());

        user.setFullName(request.getFullName());

        user.setEmail(request.getEmail());

        user.setPassword(request.getPassword());

        user.setPhoneNumber(request.getPhoneNumber());

        userRepository.save(user);

        return "Registration Successful!";
    }

    // =====================================================
    // LOGIN USER
    // =====================================================

    public Map<String, Object> login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        // User doesn't exist

        if (user == null) {

            Map<String, Object> response = new HashMap<>();

            response.put("success", false);

            response.put("message", "User not found!");

            return response;
        }

        // Wrong password

        if (!user.getPassword().equals(request.getPassword())) {

            Map<String, Object> response = new HashMap<>();

            response.put("success", false);

            response.put("message", "Invalid Password!");

            return response;
        }

        // =================================================
        // LOGIN SUCCESS
        // =================================================

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);

        response.put("message", "Login Successful!");

        response.put("id", user.getId());

        response.put("name", user.getName());

        response.put("fullName", user.getFullName());

        response.put("email", user.getEmail());

        response.put("phoneNumber", user.getPhoneNumber());

        return response;
    }

    /*
     * ==================================================
     * GET USER BY EMAIL
     * ==================================================
     */

    public UserResponse getUserByEmail(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber());
    }
}