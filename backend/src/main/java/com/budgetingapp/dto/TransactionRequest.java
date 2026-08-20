package com.budgetingapp.dto;

public class TransactionRequest {

    private Long userId;
    private String type;
    private String category;
    private Double amount;
    private String transactionDate;
    private String description;
    private String paymentMethod;
    private String status;
    private String merchant;

    // =========================
    // GETTERS
    // =========================

    public Long getUserId() {
        return userId;
    }

    public String getType() {
        return type;
    }

    public String getCategory() {
        return category;
    }

    public Double getAmount() {
        return amount;
    }

    public String getTransactionDate() {
        return transactionDate;
    }

    public String getDescription() {
        return description;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public String getMerchant() {
        return merchant;
    }

    // =========================
    // SETTERS
    // =========================

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setMerchant(String merchant) {
        this.merchant = merchant;
    }
}