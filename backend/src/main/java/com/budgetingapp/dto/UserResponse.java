package com.budgetingapp.dto;

import java.time.LocalDate;

public class UserResponse {

    private Long id;

    private String name;

    private String fullName;

    private String email;

    private String phoneNumber;

    private LocalDate dateOfBirth;

    private String address;

    private String bio;

    private LocalDate joinedDate;

    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public UserResponse(
            Long id,
            String name,
            String fullName,
            String email,
            String phoneNumber,
            LocalDate dateOfBirth,
            String address,
            String bio,
            LocalDate joinedDate) {

        this.id = id;
        this.name = name;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.bio = bio;
        this.joinedDate = joinedDate;
    }

    // ==========================================
    // GETTERS
    // ==========================================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public String getBio() {
        return bio;
    }

    public LocalDate getJoinedDate() {
        return joinedDate;
    }
}