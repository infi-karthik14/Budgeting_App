package com.budgetingapp.service;

import com.budgetingapp.dto.LoginRequest;
import com.budgetingapp.dto.RegisterRequest;
import com.budgetingapp.entity.User;
import com.budgetingapp.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register User
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists!";
        }

        User user = new User();
        user.setName(request.getName());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setPhoneNumber(request.getPhoneNumber());

        userRepository.save(user);

        return "Registration Successful!";
    }

    // Login User
    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return "User not found!";
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return "Invalid Password!";
        }

        return "Login Successful!";
    }

}