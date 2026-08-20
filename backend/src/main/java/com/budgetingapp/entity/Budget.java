package com.budgetingapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {

    // ==========================================================
    // PRIMARY KEY
    // ==========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================================================
    // BUDGET INFORMATION
    // ==========================================================

    private Double monthlyIncome;

    private Double monthlyBudget;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Long userId;

    private String startDate;

    private String endDate;

    private String budgetAmount;

    private String budgetName;

    // ==========================================================
    // DEFAULT CONSTRUCTOR
    // ==========================================================

    public Budget() {
    }

    // ==========================================================
    // GETTERS
    // ==========================================================

    public Long getId() {
        return id;
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

    public Long getUserId() {
        return userId;
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

    public void setId(Long id) {
        this.id = id;
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

    public void setUserId(Long userId) {
        this.userId = userId;
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

        return "Budget{" +
                "id=" + id +
                ", monthlyIncome=" + monthlyIncome +
                ", monthlyBudget=" + monthlyBudget +
                ", category='" + category + '\'' +
                ", userId=" + userId +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", budgetAmount='" + budgetAmount + '\'' +
                ", budgetName='" + budgetName + '\'' +
                '}';
    }
}