package com.budgetingapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who owns the budget
    @Column(nullable = false)
    private Long userId;

    // Budget category
    @Column(nullable = false)
    private String category;

    // Budget name
    @Column(nullable = false)
    private String budgetName;

    // Amount allocated to this category
    @Column(nullable = false)
    private Double budgetAmount;

    // Optional monthly income
    private Double monthlyIncome;

    // Budget start date
    @Column(nullable = false)
    private String startDate;

    // Budget end date
    @Column(nullable = false)
    private String endDate;


    // ==========================================================
    // CONSTRUCTOR
    // ==========================================================

    public Budget() {
    }


    // ==========================================================
    // GETTERS
    // ==========================================================

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getCategory() {
        return category;
    }

    public String getBudgetName() {
        return budgetName;
    }

    public Double getBudgetAmount() {
        return budgetAmount;
    }

    public Double getMonthlyIncome() {
        return monthlyIncome;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }


    // ==========================================================
    // SETTERS
    // ==========================================================

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setBudgetName(String budgetName) {
        this.budgetName = budgetName;
    }

    public void setBudgetAmount(Double budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }


    // ==========================================================
    // TO STRING
    // ==========================================================

    @Override
    public String toString() {

        return "Budget{" +
                "id=" + id +
                ", userId=" + userId +
                ", category='" + category + '\'' +
                ", budgetName='" + budgetName + '\'' +
                ", budgetAmount=" + budgetAmount +
                ", monthlyIncome=" + monthlyIncome +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                '}';
    }
}