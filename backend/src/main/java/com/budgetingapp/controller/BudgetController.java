package com.budgetingapp.controller;

import com.budgetingapp.dto.BudgetRequest;
import com.budgetingapp.entity.Budget;
import com.budgetingapp.service.BudgetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {
    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }   

    @GetMapping
    public List<Budget> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    @PostMapping
    public Budget addBudget(@RequestBody BudgetRequest request) {
        return budgetService.createBudget(request);
    }

    @PutMapping("/{id}")
    public Budget updateBudget(@PathVariable Long id,
                               @RequestBody BudgetRequest request) {
        return budgetService.updateBudget(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
    }
}