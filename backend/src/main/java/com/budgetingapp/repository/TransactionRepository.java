package com.budgetingapp.repository;

import com.budgetingapp.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository
                extends JpaRepository<Transaction, Long> {

        List<Transaction> findByUserId(Long userId);

        List<Transaction> findByUserIdAndType(
                        Long userId,
                        String type);

        List<Transaction> findByUserIdAndCategory(
                        Long userId,
                        String category);

        Optional<Transaction> findByIdAndUserId(
                        Long id,
                        Long userId);

        boolean existsByIdAndUserId(
                        Long id,
                        Long userId);
}