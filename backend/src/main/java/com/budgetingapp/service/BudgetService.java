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
        // CREATE BUDGET
        // ==========================================================

        public Budget createBudget(BudgetRequest request) {

                validateRequest(request);

                String category = request.getCategory().trim();

                String budgetName = request.getBudgetName().trim();

                /*
                 * Check whether the same user already has the
                 * same category for the same date range.
                 */

                Optional<Budget> existingBudget = budgetRepository
                                .findByUserIdAndCategoryAndStartDateAndEndDate(
                                                request.getUserId(),
                                                category,
                                                request.getStartDate(),
                                                request.getEndDate());

                // ======================================================
                // EXISTING CATEGORY
                // ======================================================

                if (existingBudget.isPresent()) {

                        Budget budget = existingBudget.get();

                        double oldAmount = budget.getBudgetAmount() == null
                                        ? 0
                                        : budget.getBudgetAmount();

                        double newAmount = request.getBudgetAmount();

                        double totalAmount = oldAmount + newAmount;

                        budget.setBudgetAmount(totalAmount);

                        if (request.getMonthlyIncome() != null) {

                                budget.setMonthlyIncome(
                                                request.getMonthlyIncome());
                        }

                        if (!budgetName.isEmpty()) {

                                budget.setBudgetName(budgetName);
                        }

                        return budgetRepository.save(budget);
                }

                // ======================================================
                // CREATE NEW CATEGORY
                // ======================================================

                Budget budget = new Budget();

                budget.setUserId(request.getUserId());

                budget.setCategory(category);

                budget.setBudgetName(budgetName);

                budget.setBudgetAmount(
                                request.getBudgetAmount());

                budget.setMonthlyIncome(
                                request.getMonthlyIncome());

                budget.setStartDate(
                                request.getStartDate());

                budget.setEndDate(
                                request.getEndDate());

                return budgetRepository.save(budget);
        }

        // ==========================================================
        // GET ALL BUDGETS
        // ==========================================================

        public List<Budget> getAllBudgets() {

                return budgetRepository.findAll();
        }

        // ==========================================================
        // GET USER BUDGETS
        // ==========================================================

        public List<Budget> getBudgetsByUser(Long userId) {

                if (userId == null) {

                        throw new RuntimeException(
                                        "User ID is required.");
                }

                return budgetRepository.findAllByUserId(userId);
        }

        // ==========================================================
        // UPDATE BUDGET
        // ==========================================================

        public Budget updateBudget(
                        Long id,
                        BudgetRequest request) {

                validateRequest(request);

                Budget budget = budgetRepository
                                .findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Budget not found with ID: " + id));

                String category = request.getCategory().trim();

                /*
                 * Check whether another budget already exists
                 * with the same user + category + date range.
                 */

                Optional<Budget> duplicateBudget = budgetRepository
                                .findByUserIdAndCategoryAndStartDateAndEndDate(
                                                request.getUserId(),
                                                category,
                                                request.getStartDate(),
                                                request.getEndDate());

                // ======================================================
                // DUPLICATE BUDGET
                // ======================================================

                if (duplicateBudget.isPresent()
                                && !duplicateBudget.get()
                                                .getId()
                                                .equals(id)) {

                        Budget existingBudget = duplicateBudget.get();

                        double existingAmount = existingBudget.getBudgetAmount() == null
                                        ? 0
                                        : existingBudget.getBudgetAmount();

                        double newAmount = request.getBudgetAmount();

                        existingBudget.setBudgetAmount(
                                        existingAmount + newAmount);

                        if (request.getMonthlyIncome() != null) {

                                existingBudget.setMonthlyIncome(
                                                request.getMonthlyIncome());
                        }

                        if (request.getBudgetName() != null
                                        && !request.getBudgetName()
                                                        .trim()
                                                        .isEmpty()) {

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

                budget.setCategory(
                                category);

                budget.setBudgetName(
                                request.getBudgetName().trim());

                budget.setBudgetAmount(
                                request.getBudgetAmount());

                budget.setMonthlyIncome(
                                request.getMonthlyIncome());

                budget.setStartDate(
                                request.getStartDate());

                budget.setEndDate(
                                request.getEndDate());

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

                if (request.getUserId() == null) {

                        throw new RuntimeException(
                                        "User ID is required.");
                }

                if (request.getCategory() == null
                                || request.getCategory()
                                                .trim()
                                                .isEmpty()) {

                        throw new RuntimeException(
                                        "Category is required.");
                }

                if (request.getBudgetName() == null
                                || request.getBudgetName()
                                                .trim()
                                                .isEmpty()) {

                        throw new RuntimeException(
                                        "Budget name is required.");
                }

                if (request.getStartDate() == null
                                || request.getStartDate()
                                                .trim()
                                                .isEmpty()) {

                        throw new RuntimeException(
                                        "Start date is required.");
                }

                if (request.getEndDate() == null
                                || request.getEndDate()
                                                .trim()
                                                .isEmpty()) {

                        throw new RuntimeException(
                                        "End date is required.");
                }

                if (request.getBudgetAmount() == null
                                || request.getBudgetAmount() <= 0) {

                        throw new RuntimeException(
                                        "Budget amount must be greater than 0.");
                }
        }
}