package com.budgetingapp.dto;

public class BudgetRequest {

    // ==========================================================
    // FIELDS
    // ==========================================================

    private Long userId;

    private Double monthlyIncome;

    private Double monthlyBudget;

    private String category;

    private String startDate;

    private String endDate;

    private String budgetAmount;

    private String budgetName;

    // ==========================================================
    // DEFAULT CONSTRUCTOR
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

    public Double getMonthlyBudget() {
        return monthlyBudget;
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

    public String getBudgetAmount() {
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

    public void setMonthlyBudget(Double monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
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

    public void setBudgetAmount(String budgetAmount) {
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
                ", monthlyBudget=" + monthlyBudget +
                ", category='" + category + '\'' +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", budgetAmount='" + budgetAmount + '\'' +
                ", budgetName='" + budgetName + '\'' +
                '}';
    }
}