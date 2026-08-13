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


    // Default Constructor
    public UserResponse() {
    }


    // Parameterized Constructor
    public UserResponse(
            Long id,
            String name,
            String fullName,
            String email,
            String phoneNumber,
            LocalDate dateOfBirth,
            String address,
            String bio) {

        this.id = id;
        this.name = name;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.bio = bio;
    }


    // Getters

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


    // Setters

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}