package com.budgetingapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double monthlyIncome;
    private Double monthlyBudget;
    private String category;
    private Long userId;
    private String StartDate; // Changed from LocalDate to String
    private String EndDate; // Changed from LocalDate to String
    private String BudgetAmount; // Changed from Double to String
    private String BudgetName; // Changed from Double to String

    // Default Constructor
    public Budget() {
    }

    // Getters
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
        return StartDate;
    }

    public String getEndDate() {
        return EndDate;
    }

    public String getBudgetAmount() {
        return BudgetAmount;
    }

    public String getBudgetName() {
        return BudgetName;
    }


    // Setters
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
        this.StartDate = startDate;
    }   

    public void setEndDate(String endDate) {
        this.EndDate = endDate;
    }

    public void setBudgetAmount(String budgetAmount) {
        this.BudgetAmount = budgetAmount;
    }

    public void setBudgetName(String budgetName) {
        this.BudgetName = budgetName;
    }


    @Override
    public String toString() {
        return "Budget{" +
                "id=" + id +
                ", monthlyIncome=" + monthlyIncome +
                ", monthlyBudget=" + monthlyBudget +
                ", category='" + category + '\'' +
                ", userId=" + userId +
                ", startDate='" + StartDate + '\'' +
                ", endDate='" + EndDate + '\'' +
                ", budgetamount=" + BudgetAmount +
                ", budgetName='" + BudgetName + '\'' +
                '}';
    }
}