package com.budgetingapp.service;

import com.budgetingapp.dto.BudgetRequest;
import com.budgetingapp.entity.Budget;
import com.budgetingapp.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    // Create Budget
    public Budget createBudget(BudgetRequest request) {

        Budget budget = new Budget();

        budget.setMonthlyIncome(request.getMonthlyIncome());
        budget.setMonthlyBudget(request.getMonthlyBudget());
        budget.setCategory(request.getCategory());
        budget.setUserId(request.getUserId());

        return budgetRepository.save(budget);
    }

    // Get All Budgets
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    // Get Budget By User
    public List<Budget> getBudgetsByUser(Long userId) {
        return budgetRepository.findAllByUserId(userId);
    }

    // Update Budget
    public Budget updateBudget(Long id, BudgetRequest request) {

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        budget.setMonthlyIncome(request.getMonthlyIncome());
        budget.setMonthlyBudget(request.getMonthlyBudget());
        budget.setCategory(request.getCategory());
        budget.setUserId(request.getUserId());

        return budgetRepository.save(budget);
    }

    // Delete Budget
    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}