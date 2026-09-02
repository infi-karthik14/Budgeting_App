package com.budgetingapp.service;

import com.budgetingapp.dto.LoginRequest;
import com.budgetingapp.dto.RegisterRequest;
import com.budgetingapp.dto.UpdateProfileRequest;
import com.budgetingapp.dto.UserResponse;
import com.budgetingapp.entity.User;
import com.budgetingapp.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthService {

    private final UserRepository userRepository;

    // BCrypt password encoder
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ==================================================
    // CONSTRUCTOR
    // ==================================================

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

        // Name
        user.setName(request.getFullName());

        user.setFullName(request.getFullName());

        // Email
        user.setEmail(request.getEmail());

        // ==================================================
        // HASH PASSWORD
        // ==================================================

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));

        // Phone
        user.setPhoneNumber(
                request.getPhoneNumber());

        // Account creation date
        user.setJoinedDate(
                LocalDate.now());

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

        // ==================================================
        // CHECK HASHED PASSWORD
        // ==================================================

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

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
                        () -> new RuntimeException(
                                "User not found!"));

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getDateOfBirth(),
                user.getAddress(),
                user.getBio(),
                user.getJoinedDate());
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
                        () -> new RuntimeException(
                                "User not found!"));

        // ==================================================
        // NAME
        // ==================================================

        if (request.getName() != null &&
                !request.getName().trim().isEmpty()) {

            user.setName(
                    request.getName());
        }

        // ==================================================
        // FULL NAME
        // ==================================================

        if (request.getFullName() != null &&
                !request.getFullName().trim().isEmpty()) {

            user.setFullName(
                    request.getFullName());

            // Keep both synchronized
            user.setName(
                    request.getFullName());
        }

        // ==================================================
        // EMAIL
        // ==================================================

        if (request.getEmail() != null &&
                !request.getEmail().trim().isEmpty()) {

            user.setEmail(
                    request.getEmail());
        }

        // ==================================================
        // PHONE
        // ==================================================

        if (request.getPhoneNumber() != null) {

            user.setPhoneNumber(
                    request.getPhoneNumber());
        }

        // ==================================================
        // DATE OF BIRTH
        // ==================================================

        user.setDateOfBirth(
                request.getDateOfBirth());

        // ==================================================
        // ADDRESS
        // ==================================================

        user.setAddress(
                request.getAddress());

        // ==================================================
        // BIO
        // ==================================================

        user.setBio(
                request.getBio());

        // ==================================================
        // SAVE
        // ==================================================

        User updatedUser = userRepository.save(user);

        // ==================================================
        // RESPONSE
        // ==================================================

        return new UserResponse(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getFullName(),
                updatedUser.getEmail(),
                updatedUser.getPhoneNumber(),
                updatedUser.getDateOfBirth(),
                updatedUser.getAddress(),
                updatedUser.getBio(),
                updatedUser.getJoinedDate());
    }
}