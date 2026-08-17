package com.budgetingapp.repository;

import com.budgetingapp.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Get all expenses of a particular user
    List<Expense> findByUserId(Long userId);

    // Get expenses by category
    List<Expense> findByCategory(String category);

    // Get expenses between two dates
    List<Expense> findByExpenseDateBetween(String startDate, String endDate);

    // Get expenses of a user by category
    List<Expense> findByUserIdAndCategory(Long userId, String category);

    // Get expenses of a user between two dates
    List<Expense> findByUserIdAndExpenseDateBetween(
            Long userId,
            String startDate,
            String endDate);
}