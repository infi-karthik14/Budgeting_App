package com.budgetingapp.dto;

public class BudgetRequest {

    private Long userId;
    private double monthlyIncome;
    private double monthlyBudget;
    private int month;
    private int year;

    public BudgetRequest() {
    }

    public BudgetRequest(Long userId, double monthlyIncome, double monthlyBudget, int month, int year) {
        this.userId = userId;
        this.monthlyIncome = monthlyIncome;
        this.monthlyBudget = monthlyBudget;
        this.month = month;
        this.year = year;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public double getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(double monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}