package com.budgetingapp.dto;

public class TransactionRequest {

    private Long userId;

    private String type;

    private String category;

    private double amount;

    private String transactionDate;

    private String paymentMethod;

    private String description;

    // Default Constructor
    public TransactionRequest() {
    }

    // Getters

    public Long getUserId() {
        return userId;
    }

    public String getType() {
        return type;
    }

    public String getCategory() {
        return category;
    }

    public double getAmount() {
        return amount;
    }

    public String getTransactionDate() {
        return transactionDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getDescription() {
        return description;
    }

    // Setters

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}