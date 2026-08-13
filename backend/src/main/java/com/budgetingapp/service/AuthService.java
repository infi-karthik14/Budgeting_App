package com.budgetingapp.service;

import com.budgetingapp.dto.LoginRequest;
import com.budgetingapp.dto.RegisterRequest;
import com.budgetingapp.dto.UpdateProfileRequest;
import com.budgetingapp.dto.UserResponse;
import com.budgetingapp.entity.User;
import com.budgetingapp.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ==================================================
    // REGISTER USER
    // ==================================================

    public String register(RegisterRequest request) {

        // Check whether email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists!";
        }

        // Create new user
        User user = new User();

        user.setName(request.getFullName());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setPhoneNumber(request.getPhoneNumber());

        // Save user
        userRepository.save(user);

        return "Registration Successful!";
    }

    // ==================================================
    // LOGIN USER
    // ==================================================

    public String login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        // User not found
        if (user == null) {
            return "User not found!";
        }

        // Password check
        if (!user.getPassword().equals(request.getPassword())) {
            return "Invalid Password!";
        }

        return "Login Successful!";
    }

    // ==================================================
    // GET USER PROFILE
    // ==================================================

    public UserResponse getUserByEmail(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found!"));

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getDateOfBirth(),
                user.getAddress(),
                user.getBio());
    }

    // ==================================================
    // UPDATE USER PROFILE
    // ==================================================

    public UserResponse updateUser(
            String email,
            UpdateProfileRequest request) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found!"));

        // ==================================================
        // UPDATE NAME
        // ==================================================

        if (request.getName() != null &&
                !request.getName().trim().isEmpty()) {

            user.setName(request.getName());
        }

        // ==================================================
        // UPDATE FULL NAME
        // ==================================================

        if (request.getFullName() != null &&
                !request.getFullName().trim().isEmpty()) {

            user.setFullName(request.getFullName());
        }

        // ==================================================
        // UPDATE EMAIL
        // ==================================================

        if (request.getEmail() != null &&
                !request.getEmail().trim().isEmpty()) {

            user.setEmail(request.getEmail());
        }

        // ==================================================
        // UPDATE PHONE
        // ==================================================

        user.setPhoneNumber(request.getPhoneNumber());

        // ==================================================
        // UPDATE DATE OF BIRTH
        // ==================================================

        user.setDateOfBirth(request.getDateOfBirth());

        // ==================================================
        // UPDATE ADDRESS
        // ==================================================

        user.setAddress(request.getAddress());

        // ==================================================
        // UPDATE BIO
        // ==================================================

        user.setBio(request.getBio());

        // ==================================================
        // SAVE TO MYSQL
        // ==================================================

        User updatedUser = userRepository.save(user);

        // ==================================================
        // RETURN UPDATED USER
        // ==================================================

        return new UserResponse(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getFullName(),
                updatedUser.getEmail(),
                updatedUser.getPhoneNumber(),
                updatedUser.getDateOfBirth(),
                updatedUser.getAddress(),
                updatedUser.getBio());
    }
}