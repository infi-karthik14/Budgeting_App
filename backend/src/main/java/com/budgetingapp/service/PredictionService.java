package com.budgetingapp.service;

import com.budgetingapp.dto.PredictionRequest;
import org.springframework.stereotype.Service;

@Service
public class PredictionService {

    // Predict next month's expense
public Double predictExpense(PredictionRequest request) {

    double predictedExpense = request.getTotalExpenses() * 1.05;

    return predictedExpense;
}

    // Financial Health Score
    public int calculateHealthScore(double income, double expense) {

        if (income <= 0) {
            return 0;
        }

        double savingsPercentage = ((income - expense) / income) * 100;

        if (savingsPercentage >= 40)
            return 95;

        if (savingsPercentage >= 30)
            return 85;

        if (savingsPercentage >= 20)
            return 75;

        if (savingsPercentage >= 10)
            return 60;

        return 40;
    }

    // Budget Status
    public String getBudgetStatus(double budget, double expense) {

        if (expense < budget) {
            return "Within Budget";
        }

        if (expense == budget) {
            return "Budget Fully Utilized";
        }

        return "Budget Exceeded";
    }
}