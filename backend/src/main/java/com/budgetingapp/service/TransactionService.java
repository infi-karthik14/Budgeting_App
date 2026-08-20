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
        // GET TRANSACTION BY ID
        // ==================================================

        public Transaction getTransaction(Long id) {

                return transactionRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Transaction not found with ID: " + id));
        }

        // ==================================================
        // GET TRANSACTIONS BY USER
        // ==================================================

        public List<Transaction> getTransactionsByUser(Long userId) {

                return transactionRepository.findByUserId(userId);
        }

        // ==================================================
        // GET TRANSACTIONS BY USER AND TYPE
        // ==================================================

        public List<Transaction> getTransactionsByType(
                        Long userId,
                        String type) {

                return transactionRepository.findByUserIdAndType(
                                userId,
                                type);
        }

        // ==================================================
        // GET TRANSACTIONS BY USER AND CATEGORY
        // ==================================================

        public List<Transaction> getTransactionsByCategory(
                        Long userId,
                        String category) {

                return transactionRepository.findByUserIdAndCategory(
                                userId,
                                category);
        }

        // ==================================================
        // ADD TRANSACTION
        // ==================================================

        public Transaction addTransaction(
                        TransactionRequest request) {

                // -----------------------------------------------
                // VALIDATE USER ID
                // -----------------------------------------------

                if (request.getUserId() == null) {

                        throw new RuntimeException(
                                        "User ID is required.");
                }

                // -----------------------------------------------
                // CHECK USER EXISTS
                // -----------------------------------------------

                userRepository.findById(request.getUserId())
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found with ID: "
                                                                + request.getUserId()));

                // -----------------------------------------------
                // CREATE NEW TRANSACTION
                // -----------------------------------------------

                Transaction transaction = new Transaction();

                transaction.setUserId(
                                request.getUserId());

                transaction.setType(
                                request.getType());

                transaction.setCategory(
                                request.getCategory());

                transaction.setAmount(
                                request.getAmount());

                transaction.setTransactionDate(
                                request.getTransactionDate());

                transaction.setDescription(
                                request.getDescription());

                transaction.setPaymentMethod(
                                request.getPaymentMethod());

                transaction.setStatus(
                                request.getStatus());

                // NEW: MERCHANT
                transaction.setMerchant(
                                request.getMerchant());

                // -----------------------------------------------
                // SAVE TRANSACTION
                // -----------------------------------------------

                return transactionRepository.save(transaction);
        }

        // ==================================================
        // UPDATE TRANSACTION
        // ==================================================

        public Transaction updateTransaction(
                        Long id,
                        TransactionRequest request) {

                // -----------------------------------------------
                // FIND EXISTING TRANSACTION
                // -----------------------------------------------

                Transaction transaction = transactionRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Transaction not found with ID: "
                                                                + id));

                // -----------------------------------------------
                // VALIDATE USER ID
                // -----------------------------------------------

                if (request.getUserId() == null) {

                        throw new RuntimeException(
                                        "User ID is required.");
                }

                // -----------------------------------------------
                // CHECK USER EXISTS
                // -----------------------------------------------

                userRepository.findById(request.getUserId())
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found with ID: "
                                                                + request.getUserId()));

                // -----------------------------------------------
                // UPDATE EXISTING TRANSACTION
                // -----------------------------------------------

                // Do NOT create a new Transaction().
                // Do NOT change the existing transaction ID.

                transaction.setUserId(
                                request.getUserId());

                transaction.setType(
                                request.getType());

                transaction.setCategory(
                                request.getCategory());

                transaction.setAmount(
                                request.getAmount());

                transaction.setTransactionDate(
                                request.getTransactionDate());

                transaction.setDescription(
                                request.getDescription());

                transaction.setPaymentMethod(
                                request.getPaymentMethod());

                transaction.setStatus(
                                request.getStatus());

                // NEW: MERCHANT
                transaction.setMerchant(
                                request.getMerchant());

                // -----------------------------------------------
                // SAVE UPDATED TRANSACTION
                // -----------------------------------------------

                return transactionRepository.save(transaction);
        }

        // ==================================================
        // DELETE TRANSACTION
        // ==================================================

        public void deleteTransaction(Long id) {

                if (!transactionRepository.existsById(id)) {

                        throw new RuntimeException(
                                        "Transaction not found with ID: " + id);
                }

                transactionRepository.deleteById(id);
        }
}