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
    // GET ALL BUDGETS
    // ==========================================================

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {

        List<Budget> budgets = budgetService.getAllBudgets();

        return ResponseEntity.ok(budgets);
    }

    // ==========================================================
    // GET BUDGETS BY USER
    // ==========================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Budget>> getBudgetsByUser(
            @PathVariable Long userId) {

        List<Budget> budgets = budgetService.getBudgetsByUser(userId);

        return ResponseEntity.ok(budgets);
    }

    // ==========================================================
    // ADD BUDGET
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
    // UPDATE BUDGET
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
    // DELETE BUDGET
    // ==========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long id) {

        budgetService.deleteBudget(id);

        return ResponseEntity.noContent().build();
    }
}