package com.budgetingapp.dto;

public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private String confirmPassword;
<<<<<<< HEAD
    private String fullName;
    private long phoneNumber;
=======
>>>>>>> 1c084a1ad13f47dea69fed45d07930d2896aa02d

    // Default Constructor
    public RegisterRequest() {
    }

    // Parameterized Constructor
<<<<<<< HEAD
    public RegisterRequest(String name, String email, String password, String confirmPassword, String fullName, long phoneNumber) {
=======
    public RegisterRequest(String name, String email, String password, String confirmPassword) {
>>>>>>> 1c084a1ad13f47dea69fed45d07930d2896aa02d
        this.name = name;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
<<<<<<< HEAD
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
=======
>>>>>>> 1c084a1ad13f47dea69fed45d07930d2896aa02d
    }

    // Getters
    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

<<<<<<< HEAD
    public String getFullName() {
        return fullName;
    }

    public long getPhoneNumber() {
        return phoneNumber;
    }

=======
>>>>>>> 1c084a1ad13f47dea69fed45d07930d2896aa02d
    // Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

<<<<<<< HEAD
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setPhoneNumber(long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }   

=======
>>>>>>> 1c084a1ad13f47dea69fed45d07930d2896aa02d
    @Override
    public String toString() {
        return "RegisterRequest{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
<<<<<<< HEAD
                ", fullName='" + fullName + '\'' +
                ", phoneNumber=" + phoneNumber +
                '}';
    }
}
=======
                '}';
    }
}
>>>>>>> 1c084a1ad13f47dea69fed45d07930d2896aa02d
