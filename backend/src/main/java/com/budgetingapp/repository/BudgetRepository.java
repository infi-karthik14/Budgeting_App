package com.budgetingapp.repository;

import com.budgetingapp.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD

import java.util.List;
=======
>>>>>>> 1c084a1ad13f47dea69fed45d07930d2896aa02d
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

<<<<<<< HEAD
    // Get budget of a specific user
    Optional<Budget> findByUserId(Long userId);

    // Get all budgets of a user
    List<Budget> findAllByUserId(Long userId);

    // Check if a user has already created a budget
    boolean existsByUserId(Long userId);

=======
    Optional<Budget> findByUserIdAndMonthAndYear(
            Long userId,
            int month,
            int year
    );
>>>>>>> 1c084a1ad13f47dea69fed45d07930d2896aa02d
}