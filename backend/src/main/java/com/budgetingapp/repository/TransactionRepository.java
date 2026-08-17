package com.budgetingapp.repository;

import com.budgetingapp.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Get all transactions of a user
    List<Transaction> findByUserId(Long userId);

    // Get transactions by type
    List<Transaction> findByUserIdAndType(Long userId, String type);

    // Get transactions by category
    List<Transaction> findByUserIdAndCategory(Long userId, String category);
}