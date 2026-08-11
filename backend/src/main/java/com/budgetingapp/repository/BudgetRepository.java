package com.budgetingapp.repository;

import com.budgetingapp.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // Get budget of a specific user
    Optional<Budget> findByUserId(Long userId);

    // Get all budgets of a user
    List<Budget> findAllByUserId(Long userId);

    // Check if a user has already created a budget
    boolean existsByUserId(Long userId);

}