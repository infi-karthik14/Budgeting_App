package com.budgetingapp.dto;

public class UserResponse {

    private Long id;
    private String name;
    private String fullName;
    private String email;
    private long phoneNumber;

    public UserResponse() {
    }

    public UserResponse(
            Long id,
            String name,
            String fullName,
            String email,
            long phoneNumber) {

        this.id = id;
        this.name = name;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

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

    public long getPhoneNumber() {
        return phoneNumber;
    }

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

    public void setPhoneNumber(long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}