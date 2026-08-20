package com.budgetingapp.repository;

import com.budgetingapp.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // ==========================================================
    // GET ONE BUDGET BY USER
    // ==========================================================

    Optional<Budget> findByUserId(Long userId);

    // ==========================================================
    // GET ALL BUDGETS OF USER
    // ==========================================================

    List<Budget> findAllByUserId(Long userId);

    // ==========================================================
    // FIND BUDGET BY USER + CATEGORY + MONTH
    // ==========================================================

    Optional<Budget> findByUserIdAndCategoryAndStartDateAndEndDate(
            Long userId,
            String category,
            String startDate,
            String endDate);
}