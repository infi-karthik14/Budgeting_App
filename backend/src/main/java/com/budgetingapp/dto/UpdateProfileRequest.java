package com.budgetingapp.dto;

import java.time.LocalDate;

public class UpdateProfileRequest {

    private String name;
    private String fullName;
    private String email;
    private String phoneNumber;

    private LocalDate dateOfBirth;
    private String address;
    private String bio;

    // Default constructor
    public UpdateProfileRequest() {
    }

    // Getters

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