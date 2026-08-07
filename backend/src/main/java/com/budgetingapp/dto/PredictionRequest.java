package com.budgetingapp.dto;

public class PredictionRequest {

    private Double monthlyIncome;
    private Double totalExpenses;
    private String category;
    private String month;

    // Default Constructor
    public PredictionRequest() {
    }

    // Parameterized Constructor
    public PredictionRequest(Double monthlyIncome, Double totalExpenses,
                             String category, String month) {
        this.monthlyIncome = monthlyIncome;
        this.totalExpenses = totalExpenses;
        this.category = category;
        this.month = month;
    }

    // Getters
    public Double getMonthlyIncome() {
        return monthlyIncome;
    }

    public Double getTotalExpenses() {
        return totalExpenses;
    }

    public String getCategory() {
        return category;
    }

    public String getMonth() {
        return month;
    }

    // Setters
    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public void setTotalExpenses(Double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    @Override
    public String toString() {
        return "PredictionRequest{" +
                "monthlyIncome=" + monthlyIncome +
                ", totalExpenses=" + totalExpenses +
                ", category='" + category + '\'' +
                ", month='" + month + '\'' +
                '}';
    }
}