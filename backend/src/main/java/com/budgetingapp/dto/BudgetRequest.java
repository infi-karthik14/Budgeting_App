package com.budgetingapp.dto;

public class BudgetRequest {

    private Long userId;

    private Double monthlyIncome;

    private String category;

    private String startDate;

    private String endDate;

    private Double budgetAmount;

    private String budgetName;

    // ==========================================================
    // CONSTRUCTOR
    // ==========================================================

    public BudgetRequest() {
    }

    // ==========================================================
    // GETTERS
    // ==========================================================

    public Long getUserId() {
        return userId;
    }

    public Double getMonthlyIncome() {
        return monthlyIncome;
    }

    public String getCategory() {
        return category;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public Double getBudgetAmount() {
        return budgetAmount;
    }

    public String getBudgetName() {
        return budgetName;
    }

    // ==========================================================
    // SETTERS
    // ==========================================================

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public void setBudgetAmount(Double budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public void setBudgetName(String budgetName) {
        this.budgetName = budgetName;
    }

    // ==========================================================
    // TO STRING
    // ==========================================================

    @Override
    public String toString() {

        return "BudgetRequest{" +
                "userId=" + userId +
                ", monthlyIncome=" + monthlyIncome +
                ", category='" + category + '\'' +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", budgetAmount=" + budgetAmount +
                ", budgetName='" + budgetName + '\'' +
                '}';
    }
}