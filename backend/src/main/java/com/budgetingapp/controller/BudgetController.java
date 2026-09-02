package com.budgetingapp.controller;

import com.budgetingapp.dto.BudgetRequest;
import com.budgetingapp.entity.Budget;
import com.budgetingapp.service.BudgetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetService budgetService;

    // ==========================================================
    // CONSTRUCTOR
    // ==========================================================

    public BudgetController(BudgetService budgetService) {

        this.budgetService = budgetService;
    }

    // ==========================================================
    // GET ALL
    // ==========================================================

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {

        return ResponseEntity.ok(
                budgetService.getAllBudgets());
    }

    // ==========================================================
    // GET USER BUDGETS
    // ==========================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Budget>> getBudgetsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                budgetService.getBudgetsByUser(userId));
    }

    // ==========================================================
    // CREATE
    // ==========================================================

    @PostMapping
    public ResponseEntity<Budget> addBudget(
            @RequestBody BudgetRequest request) {

        Budget budget = budgetService.createBudget(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(budget);
    }

    // ==========================================================
    // UPDATE
    // ==========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long id,
            @RequestBody BudgetRequest request) {

        Budget budget = budgetService.updateBudget(
                id,
                request);

        return ResponseEntity.ok(budget);
    }

    // ==========================================================
    // DELETE
    // ==========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long id) {

        budgetService.deleteBudget(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}