package com.budgetingapp.service;

import com.budgetingapp.dto.TransactionRequest;
import com.budgetingapp.entity.Transaction;
import com.budgetingapp.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // ==================================================
    // ADD TRANSACTION
    // ==================================================

    public Transaction addTransaction(TransactionRequest request) {

        Transaction transaction = new Transaction();

        transaction.setUserId(request.getUserId());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setDescription(request.getDescription());

        return transactionRepository.save(transaction);
    }

    // ==================================================
    // GET TRANSACTION BY ID
    // ==================================================

    public Transaction getTransaction(Long id) {

        return transactionRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Transaction not found"));
    }

    // ==================================================
    // GET ALL TRANSACTIONS
    // ==================================================

    public List<Transaction> getAllTransactions() {

        return transactionRepository.findAll();
    }

    // ==================================================
    // GET USER TRANSACTIONS
    // ==================================================

    public List<Transaction> getTransactionsByUser(Long userId) {

        return transactionRepository.findByUserId(userId);
    }

    // ==================================================
    // GET USER TRANSACTIONS BY TYPE
    // ==================================================

    public List<Transaction> getTransactionsByType(
            Long userId,
            String type) {

        return transactionRepository.findByUserIdAndType(
                userId,
                type);
    }

    // ==================================================
    // GET USER TRANSACTIONS BY CATEGORY
    // ==================================================

    public List<Transaction> getTransactionsByCategory(
            Long userId,
            String category) {

        return transactionRepository.findByUserIdAndCategory(
                userId,
                category);
    }

    // ==================================================
    // UPDATE TRANSACTION
    // ==================================================

    public Transaction updateTransaction(
            Long id,
            TransactionRequest request) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Transaction not found"));

        transaction.setUserId(request.getUserId());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setDescription(request.getDescription());

        return transactionRepository.save(transaction);
    }

    // ==================================================
    // DELETE TRANSACTION
    // ==================================================

    public void deleteTransaction(Long id) {

        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found");
        }

        transactionRepository.deleteById(id);
    }
}