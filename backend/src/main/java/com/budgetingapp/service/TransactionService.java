package com.budgetingapp.service;

import com.budgetingapp.dto.TransactionRequest;
import com.budgetingapp.entity.Transaction;
import com.budgetingapp.repository.TransactionRepository;
import com.budgetingapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

        private final TransactionRepository transactionRepository;

        private final UserRepository userRepository;

        // ==================================================
        // CONSTRUCTOR
        // ==================================================

        public TransactionService(
                        TransactionRepository transactionRepository,
                        UserRepository userRepository) {

                this.transactionRepository = transactionRepository;

                this.userRepository = userRepository;
        }

        // ==================================================
        // GET ALL TRANSACTIONS
        // ==================================================

        public List<Transaction> getAllTransactions() {

                return transactionRepository.findAll();
        }

        // ==================================================
        // GET TRANSACTION BY ID FOR USER
        // ==================================================

        public Transaction getTransaction(
                        Long id,
                        Long userId) {

                if (userId == null) {

                        throw new RuntimeException(
                                        "User ID is required.");
                }

                return transactionRepository
                                .findByIdAndUserId(id, userId)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "Transaction not found or access denied."));
        }

        // ==================================================
        // GET TRANSACTIONS BY USER
        // ==================================================

        public List<Transaction> getTransactionsByUser(
                        Long userId) {

                if (userId == null) {

                        throw new RuntimeException(
                                        "User ID is required.");
                }

                // Make sure user exists
                userRepository.findById(userId)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found with ID: " + userId));

                return transactionRepository.findByUserId(userId);
        }

        // ==================================================
        // GET TRANSACTIONS BY USER AND TYPE
        // ==================================================

        public List<Transaction> getTransactionsByType(
                        Long userId,
                        String type) {

                if (userId == null) {

                        throw new RuntimeException(
                                        "User ID is required.");
                }

                userRepository.findById(userId)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found with ID: " + userId));

                if (type == null ||
                                type.trim().isEmpty()) {

                        throw new RuntimeException(
                                        "Transaction type is required.");
                }

                return transactionRepository
                                .findByUserIdAndType(
                                                userId,
                                                type);
        }

        // ==================================================
        // GET TRANSACTIONS BY USER AND CATEGORY
        // ==================================================

        public List<Transaction> getTransactionsByCategory(
                        Long userId,
                        String category) {

                if (userId == null) {

                        throw new RuntimeException(
                                        "User ID is required.");
                }

                userRepository.findById(userId)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found with ID: " + userId));

                if (category == null ||
                                category.trim().isEmpty()) {

                        throw new RuntimeException(
                                        "Category is required.");
                }

                return transactionRepository
                                .findByUserIdAndCategory(
                                                userId,
                                                category);
        }

        // ==================================================
        // ADD TRANSACTION
        // ==================================================

        public Transaction addTransaction(
                        TransactionRequest request) {

                // ==================================================
                // VALIDATE REQUEST
                // ==================================================

                if (request == null) {

                        throw new RuntimeException(
                                        "Transaction data is required.");
                }

                // ==================================================
                // VALIDATE USER
                // ==================================================

                if (request.getUserId() == null) {

                        throw new RuntimeException(
                                        "User ID is required.");
                }

                Long userId = request.getUserId();

                userRepository.findById(userId)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found with ID: " + userId));

                // ==================================================
                // VALIDATE TYPE
                // ==================================================

                if (request.getType() == null ||
                                request.getType().trim().isEmpty()) {

                        throw new RuntimeException(
                                        "Transaction type is required.");
                }

                String type = request.getType()
                                .trim()
                                .toLowerCase();

                if (!type.equals("income") &&
                                !type.equals("expense")) {

                        throw new RuntimeException(
                                        "Transaction type must be income or expense.");
                }

                // ==================================================
                // VALIDATE CATEGORY
                // ==================================================

                if (request.getCategory() == null ||
                                request.getCategory().trim().isEmpty()) {

                        throw new RuntimeException(
                                        "Category is required.");
                }

                // ==================================================
                // VALIDATE AMOUNT
                // ==================================================

                if (request.getAmount() == null ||
                                request.getAmount() <= 0) {

                        throw new RuntimeException(
                                        "Amount must be greater than 0.");
                }

                // ==================================================
                // VALIDATE DATE
                // ==================================================

                if (request.getTransactionDate() == null ||
                                request.getTransactionDate().trim().isEmpty()) {

                        throw new RuntimeException(
                                        "Transaction date is required.");
                }

                // ==================================================
                // VALIDATE PAYMENT METHOD
                // ==================================================

                if (request.getPaymentMethod() == null ||
                                request.getPaymentMethod().trim().isEmpty()) {

                        throw new RuntimeException(
                                        "Payment method is required.");
                }

                // ==================================================
                // CREATE TRANSACTION
                // ==================================================

                Transaction transaction = new Transaction();

                transaction.setUserId(userId);

                transaction.setType(type);

                transaction.setCategory(
                                request.getCategory().trim());

                transaction.setAmount(
                                request.getAmount());

                transaction.setTransactionDate(
                                request.getTransactionDate());

                transaction.setDescription(
                                request.getDescription());

                transaction.setPaymentMethod(
                                request.getPaymentMethod());

                // ==================================================
                // STATUS
                // ==================================================

                if (request.getStatus() != null &&
                                !request.getStatus().trim().isEmpty()) {

                        transaction.setStatus(
                                        request.getStatus().trim());

                } else {

                        transaction.setStatus("Completed");
                }

                // ==================================================
                // MERCHANT
                // ==================================================

                transaction.setMerchant(
                                request.getMerchant());

                // ==================================================
                // SAVE
                // ==================================================

                return transactionRepository.save(
                                transaction);
        }

        // ==================================================
        // UPDATE TRANSACTION
        // ==================================================

        public Transaction updateTransaction(
                        Long id,
                        TransactionRequest request) {

                // ==================================================
                // VALIDATE REQUEST
                // ==================================================

                if (request == null) {

                        throw new RuntimeException(
                                        "Transaction data is required.");
                }

                // ==================================================
                // VALIDATE USER ID
                // ==================================================

                if (request.getUserId() == null) {

                        throw new RuntimeException(
                                        "User ID is required.");
                }

                Long userId = request.getUserId();

                // ==================================================
                // FIND ONLY USER'S TRANSACTION
                // ==================================================

                Transaction transaction = transactionRepository
                                .findByIdAndUserId(id, userId)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "Transaction not found or access denied."));

                // ==================================================
                // TYPE
                // ==================================================

                if (request.getType() != null &&
                                !request.getType().trim().isEmpty()) {

                        String type = request.getType()
                                        .trim()
                                        .toLowerCase();

                        if (!type.equals("income") &&
                                        !type.equals("expense")) {

                                throw new RuntimeException(
                                                "Transaction type must be income or expense.");
                        }

                        transaction.setType(type);
                }

                // ==================================================
                // CATEGORY
                // ==================================================

                if (request.getCategory() != null &&
                                !request.getCategory().trim().isEmpty()) {

                        transaction.setCategory(
                                        request.getCategory().trim());
                }

                // ==================================================
                // AMOUNT
                // ==================================================

                if (request.getAmount() != null) {

                        if (request.getAmount() <= 0) {

                                throw new RuntimeException(
                                                "Amount must be greater than 0.");
                        }

                        transaction.setAmount(
                                        request.getAmount());
                }

                // ==================================================
                // DATE
                // ==================================================

                if (request.getTransactionDate() != null &&
                                !request.getTransactionDate().trim().isEmpty()) {

                        transaction.setTransactionDate(
                                        request.getTransactionDate());
                }

                // ==================================================
                // DESCRIPTION
                // ==================================================

                transaction.setDescription(
                                request.getDescription());

                // ==================================================
                // PAYMENT METHOD
                // ==================================================

                if (request.getPaymentMethod() != null &&
                                !request.getPaymentMethod().trim().isEmpty()) {

                        transaction.setPaymentMethod(
                                        request.getPaymentMethod());
                }

                // ==================================================
                // STATUS
                // ==================================================

                if (request.getStatus() != null &&
                                !request.getStatus().trim().isEmpty()) {

                        transaction.setStatus(
                                        request.getStatus().trim());
                }

                // ==================================================
                // MERCHANT
                // ==================================================

                transaction.setMerchant(
                                request.getMerchant());

                // ==================================================
                // IMPORTANT
                // ==================================================
                // We DO NOT change userId here.
                //
                // The transaction remains owned by
                // the original user.
                // ==================================================

                return transactionRepository.save(
                                transaction);
        }

        // ==================================================
        // DELETE TRANSACTION
        // ==================================================

        public void deleteTransaction(
                        Long id,
                        Long userId) {

                // ==================================================
                // VALIDATE USER
                // ==================================================

                if (userId == null) {

                        throw new RuntimeException(
                                        "User ID is required.");
                }

                // ==================================================
                // CHECK OWNERSHIP
                // ==================================================

                if (!transactionRepository
                                .existsByIdAndUserId(id, userId)) {

                        throw new RuntimeException(
                                        "Transaction not found or access denied.");
                }

                // ==================================================
                // DELETE
                // ==================================================

                transactionRepository.deleteById(id);
        }
}