package com.budgetingapp.controller;

import com.budgetingapp.dto.TransactionRequest;
import com.budgetingapp.entity.Transaction;
import com.budgetingapp.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // ==================================================
    // GET ALL TRANSACTIONS
    // ==================================================

    @GetMapping
    public List<Transaction> getAllTransactions() {

        return transactionService.getAllTransactions();
    }

    // ==================================================
    // GET TRANSACTION BY ID
    // ==================================================

    @GetMapping("/{id}")
    public Transaction getTransaction(@PathVariable Long id) {

        return transactionService.getTransaction(id);
    }

    // ==================================================
    // GET TRANSACTIONS BY USER
    // ==================================================

    @GetMapping("/user/{userId}")
    public List<Transaction> getTransactionsByUser(
            @PathVariable Long userId) {

        return transactionService.getTransactionsByUser(userId);
    }

    // ==================================================
    // GET TRANSACTIONS BY USER AND TYPE
    // ==================================================

    @GetMapping("/user/{userId}/type/{type}")
    public List<Transaction> getTransactionsByType(
            @PathVariable Long userId,
            @PathVariable String type) {

        return transactionService.getTransactionsByType(
                userId,
                type);
    }

    // ==================================================
    // GET TRANSACTIONS BY USER AND CATEGORY
    // ==================================================

    @GetMapping("/user/{userId}/category/{category}")
    public List<Transaction> getTransactionsByCategory(
            @PathVariable Long userId,
            @PathVariable String category) {

        return transactionService.getTransactionsByCategory(
                userId,
                category);
    }

    // ==================================================
    // ADD TRANSACTION
    // ==================================================

    @PostMapping
    public Transaction addTransaction(
            @RequestBody TransactionRequest request) {

        return transactionService.addTransaction(request);
    }

    // ==================================================
    // UPDATE TRANSACTION
    // ==================================================

    @PutMapping("/{id}")
    public Transaction updateTransaction(
            @PathVariable Long id,
            @RequestBody TransactionRequest request) {

        return transactionService.updateTransaction(
                id,
                request);
    }

    // ==================================================
    // DELETE TRANSACTION
    // ==================================================

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {

        transactionService.deleteTransaction(id);
    }
}