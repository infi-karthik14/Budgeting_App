package com.budgetingapp.repository;

import com.budgetingapp.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // ==========================================================
    // ALL BUDGETS OF USER
    // ==========================================================

    List<Budget> findAllByUserId(Long userId);

    // ==========================================================
    // FIND SAME USER + CATEGORY + DATE RANGE
    // ==========================================================

    Optional<Budget> findByUserIdAndCategoryAndStartDateAndEndDate(
            Long userId,
            String category,
            String startDate,
            String endDate);
}