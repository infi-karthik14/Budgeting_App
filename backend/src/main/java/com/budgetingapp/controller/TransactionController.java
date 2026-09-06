package com.budgetingapp.controller;

import com.budgetingapp.dto.TransactionRequest;
import com.budgetingapp.entity.Transaction;
import com.budgetingapp.service.TransactionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = {
                "http://localhost:5500",
                "http://127.0.0.1:5500",
                "https://gregarious-communication-production-6879.up.railway.app"
})
public class TransactionController {

        private final TransactionService transactionService;

        // ==================================================
        // CONSTRUCTOR
        // ==================================================

        public TransactionController(
                        TransactionService transactionService) {

                this.transactionService = transactionService;
        }

        // ==================================================
        // GET ALL TRANSACTIONS
        // GET /api/transactions
        // ==================================================

        @GetMapping
        public List<Transaction> getAllTransactions() {

                return transactionService.getAllTransactions();
        }

        // ==================================================
        // GET TRANSACTION BY ID
        // GET /api/transactions/{id}?userId=1
        // ==================================================

        @GetMapping("/{id}")
        public ResponseEntity<Transaction> getTransaction(
                        @PathVariable Long id,
                        @RequestParam Long userId) {

                return ResponseEntity.ok(
                                transactionService.getTransaction(
                                                id,
                                                userId));
        }

        // ==================================================
        // GET USER TRANSACTIONS
        // GET /api/transactions/user/{userId}
        // ==================================================

        @GetMapping("/user/{userId}")
        public List<Transaction> getTransactionsByUser(
                        @PathVariable Long userId) {

                return transactionService.getTransactionsByUser(
                                userId);
        }

        // ==================================================
        // GET USER TRANSACTIONS BY TYPE
        // GET /api/transactions/user/{userId}/type/{type}
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
        // GET USER TRANSACTIONS BY CATEGORY
        // GET /api/transactions/user/{userId}/category/{category}
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
        // POST /api/transactions
        // ==================================================

        @PostMapping
        public ResponseEntity<Transaction> addTransaction(
                        @RequestBody TransactionRequest request) {

                return ResponseEntity.ok(
                                transactionService.addTransaction(
                                                request));
        }

        // ==================================================
        // UPDATE TRANSACTION
        // PUT /api/transactions/{id}
        // ==================================================

        @PutMapping("/{id}")
        public ResponseEntity<Transaction> updateTransaction(
                        @PathVariable Long id,
                        @RequestBody TransactionRequest request) {

                return ResponseEntity.ok(
                                transactionService.updateTransaction(
                                                id,
                                                request));
        }

        // ==================================================
        // DELETE TRANSACTION
        // DELETE /api/transactions/{id}?userId=1
        // ==================================================

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteTransaction(
                        @PathVariable Long id,
                        @RequestParam Long userId) {

                transactionService.deleteTransaction(
                                id,
                                userId);

                return ResponseEntity
                                .noContent()
                                .build();
        }
}