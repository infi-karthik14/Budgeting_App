package com.budgetingapp.service;

import com.budgetingapp.dto.BudgetRequest;
import com.budgetingapp.entity.Budget;
import com.budgetingapp.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    // ==========================================================
    // CONSTRUCTOR
    // ==========================================================

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    // ==========================================================
    // CREATE / ADD BUDGET
    // ==========================================================

    public Budget createBudget(BudgetRequest request) {

        validateRequest(request);

        // ======================================================
        // CHECK EXISTING CATEGORY FOR SAME USER + SAME MONTH
        // ======================================================

        Optional<Budget> existingBudget = budgetRepository
                .findByUserIdAndCategoryAndStartDateAndEndDate(
                        request.getUserId(),
                        request.getCategory(),
                        request.getStartDate(),
                        request.getEndDate());

        // ======================================================
        // EXISTING BUDGET FOUND
        // ======================================================

        if (existingBudget.isPresent()) {

            Budget budget = existingBudget.get();

            double oldAmount = parseBudgetAmount(budget.getBudgetAmount());

            double newAmount = parseBudgetAmount(request.getBudgetAmount());

            double totalAmount = oldAmount + newAmount;

            // --------------------------------------------------
            // UPDATE EXISTING BUDGET
            // --------------------------------------------------

            budget.setBudgetAmount(
                    String.valueOf(totalAmount));

            budget.setMonthlyBudget(totalAmount);

            if (request.getMonthlyIncome() != null) {
                budget.setMonthlyIncome(
                        request.getMonthlyIncome());
            }

            if (request.getBudgetName() != null
                    && !request.getBudgetName().trim().isEmpty()) {

                budget.setBudgetName(
                        request.getBudgetName().trim());
            }

            return budgetRepository.save(budget);
        }

        // ======================================================
        // CREATE NEW BUDGET
        // ======================================================

        Budget budget = new Budget();

        budget.setUserId(request.getUserId());

        budget.setMonthlyIncome(
                request.getMonthlyIncome());

        budget.setMonthlyBudget(
                request.getMonthlyBudget());

        budget.setCategory(
                request.getCategory().trim());

        budget.setStartDate(
                request.getStartDate());

        budget.setEndDate(
                request.getEndDate());

        budget.setBudgetAmount(
                request.getBudgetAmount());

        budget.setBudgetName(
                request.getBudgetName().trim());

        return budgetRepository.save(budget);
    }

    // ==========================================================
    // GET ALL BUDGETS
    // ==========================================================

    public List<Budget> getAllBudgets() {

        return budgetRepository.findAll();
    }

    // ==========================================================
    // GET BUDGETS BY USER
    // ==========================================================

    public List<Budget> getBudgetsByUser(Long userId) {

        if (userId == null) {
            throw new RuntimeException("User ID is required.");
        }

        return budgetRepository.findAllByUserId(userId);
    }

    // ==========================================================
    // UPDATE BUDGET
    // ==========================================================

    public Budget updateBudget(
            Long id,
            BudgetRequest request) {

        // ------------------------------------------------------
        // FIND BUDGET
        // ------------------------------------------------------

        Budget budget = budgetRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Budget not found with ID: " + id));

        validateRequest(request);

        // ======================================================
        // CHECK DUPLICATE CATEGORY + MONTH
        // ======================================================

        Optional<Budget> duplicateBudget = budgetRepository
                .findByUserIdAndCategoryAndStartDateAndEndDate(
                        request.getUserId(),
                        request.getCategory(),
                        request.getStartDate(),
                        request.getEndDate());

        // ======================================================
        // DUPLICATE FOUND
        // ======================================================

        if (duplicateBudget.isPresent()
                && !duplicateBudget.get()
                        .getId()
                        .equals(id)) {

            Budget existingBudget = duplicateBudget.get();

            double existingAmount = parseBudgetAmount(
                    existingBudget.getBudgetAmount());

            double newAmount = parseBudgetAmount(
                    request.getBudgetAmount());

            double totalAmount = existingAmount + newAmount;

            existingBudget.setBudgetAmount(
                    String.valueOf(totalAmount));

            existingBudget.setMonthlyBudget(
                    totalAmount);

            if (request.getMonthlyIncome() != null) {

                existingBudget.setMonthlyIncome(
                        request.getMonthlyIncome());
            }

            if (request.getBudgetName() != null
                    && !request.getBudgetName().trim().isEmpty()) {

                existingBudget.setBudgetName(
                        request.getBudgetName().trim());
            }

            budgetRepository.delete(budget);

            return budgetRepository.save(existingBudget);
        }

        // ======================================================
        // NORMAL UPDATE
        // ======================================================

        budget.setUserId(
                request.getUserId());

        budget.setMonthlyIncome(
                request.getMonthlyIncome());

        budget.setMonthlyBudget(
                request.getMonthlyBudget());

        budget.setCategory(
                request.getCategory().trim());

        budget.setStartDate(
                request.getStartDate());

        budget.setEndDate(
                request.getEndDate());

        budget.setBudgetAmount(
                request.getBudgetAmount());

        budget.setBudgetName(
                request.getBudgetName().trim());

        return budgetRepository.save(budget);
    }

    // ==========================================================
    // DELETE BUDGET
    // ==========================================================

    public void deleteBudget(Long id) {

        Budget budget = budgetRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Budget not found with ID: " + id));

        budgetRepository.delete(budget);
    }

    // ==========================================================
    // VALIDATE REQUEST
    // ==========================================================

    private void validateRequest(BudgetRequest request) {

        if (request == null) {
            throw new RuntimeException(
                    "Budget request cannot be empty.");
        }

        // ------------------------------------------------------
        // USER
        // ------------------------------------------------------

        if (request.getUserId() == null) {
            throw new RuntimeException(
                    "User ID is required.");
        }

        // ------------------------------------------------------
        // CATEGORY
        // ------------------------------------------------------

        if (request.getCategory() == null
                || request.getCategory().trim().isEmpty()) {

            throw new RuntimeException(
                    "Category is required.");
        }

        // ------------------------------------------------------
        // BUDGET NAME
        // ------------------------------------------------------

        if (request.getBudgetName() == null
                || request.getBudgetName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Budget name is required.");
        }

        // ------------------------------------------------------
        // START DATE
        // ------------------------------------------------------

        if (request.getStartDate() == null
                || request.getStartDate().trim().isEmpty()) {

            throw new RuntimeException(
                    "Start date is required.");
        }

        // ------------------------------------------------------
        // END DATE
        // ------------------------------------------------------

        if (request.getEndDate() == null
                || request.getEndDate().trim().isEmpty()) {

            throw new RuntimeException(
                    "End date is required.");
        }

        // ------------------------------------------------------
        // BUDGET AMOUNT
        // ------------------------------------------------------

        double amount = parseBudgetAmount(
                request.getBudgetAmount());

        if (amount <= 0) {

            throw new RuntimeException(
                    "Budget amount must be greater than 0.");
        }
    }

    // ==========================================================
    // PARSE BUDGET AMOUNT
    // ==========================================================

    private double parseBudgetAmount(String amount) {

        if (amount == null
                || amount.trim().isEmpty()) {

            throw new RuntimeException(
                    "Budget amount is required.");
        }

        try {

            double value = Double.parseDouble(
                    amount.trim());

            if (value <= 0) {

                throw new RuntimeException(
                        "Budget amount must be greater than 0.");
            }

            return value;

        } catch (NumberFormatException e) {

            throw new RuntimeException(
                    "Invalid budget amount.");
        }
    }
}