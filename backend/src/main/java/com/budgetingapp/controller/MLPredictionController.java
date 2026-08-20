package com.budgetingapp.controller;

import com.budgetingapp.service.MLPredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ml")
@CrossOrigin(origins = "*")
public class MLPredictionController {

    private final MLPredictionService mlPredictionService;

    public MLPredictionController(
            MLPredictionService mlPredictionService) {
        this.mlPredictionService = mlPredictionService;
    }

    @PostMapping("/predict-expense")
    public ResponseEntity<?> predictExpense(
            @RequestBody Map<String, Object> request) {

        try {

            Double monthlyIncome = Double.valueOf(
                    request.get("monthly_income").toString());

            Double monthlyBudget = Double.valueOf(
                    request.get("monthly_budget").toString());

            String category = request.get("category").toString();

            String paymentMethod = request.get("payment_method").toString();

            String city = request.get("city").toString();

            String dayOfWeek = request.get("day_of_week").toString();

            Double prediction = mlPredictionService.predictExpense(
                    monthlyIncome,
                    monthlyBudget,
                    category,
                    paymentMethod,
                    city,
                    dayOfWeek);

            Map<String, Object> response = new HashMap<>();

            response.put(
                    "predicted_expense",
                    prediction);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            Map<String, String> error = new HashMap<>();

            error.put(
                    "error",
                    e.getMessage());

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }
}