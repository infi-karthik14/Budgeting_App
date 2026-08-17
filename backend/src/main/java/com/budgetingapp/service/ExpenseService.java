package com.budgetingapp.service;

import com.budgetingapp.dto.ExpenseRequest;
import com.budgetingapp.entity.Expense;
import com.budgetingapp.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    // Add Expense
    public Expense addExpense(ExpenseRequest request) {

        Expense expense = new Expense();

        expense.setMonthlyIncome(request.getMonthlyIncome());
        expense.setMonthlyBudget(request.getMonthlyBudget());

        expense.setCategory(request.getCategory());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setCity(request.getCity());

        expense.setTitle(request.getTitle());
        expense.setDayOfWeek(request.getDayOfWeek());

        expense.setAmount(request.getAmount());
        expense.setPredictedExpense(request.getPredictedExpense());

        expense.setExpenseDate(request.getExpenseDate());

        expense.setUserId(request.getUserId());

        return expenseRepository.save(expense);
    }

    // Get Expense By ID
    public Expense getExpense(Long id) {

        return expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }

    // Get All Expenses
    public List<Expense> getAllExpenses() {

        return expenseRepository.findAll();
    }

    // Get Expenses By User
    public List<Expense> getExpensesByUser(Long userId) {

        return expenseRepository.findByUserId(userId);
    }

    // Delete Expense
    public void deleteExpense(Long id) {

        if (!expenseRepository.existsById(id)) {
            throw new RuntimeException("Expense not found with id: " + id);
        }

        expenseRepository.deleteById(id);
    }

    // Update Expense
    public Expense updateExpense(Long id, ExpenseRequest request) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));

        expense.setMonthlyIncome(request.getMonthlyIncome());
        expense.setMonthlyBudget(request.getMonthlyBudget());

        expense.setCategory(request.getCategory());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setCity(request.getCity());

        expense.setTitle(request.getTitle());
        expense.setDayOfWeek(request.getDayOfWeek());

        expense.setAmount(request.getAmount());
        expense.setPredictedExpense(request.getPredictedExpense());

        expense.setExpenseDate(request.getExpenseDate());

        expense.setUserId(request.getUserId());

        return expenseRepository.save(expense);
    }
}