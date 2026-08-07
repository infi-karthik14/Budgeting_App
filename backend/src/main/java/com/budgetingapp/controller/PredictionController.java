package com.budgetingapp.controller;

import com.budgetingapp.dto.PredictionRequest;
import com.budgetingapp.service.PredictionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prediction")
@CrossOrigin(origins = "*")
public class PredictionController {

    private final PredictionService predictionService;

public PredictionController(PredictionService predictionService) {
    this.predictionService = predictionService;
}

    @PostMapping
    public Object predict(@RequestBody PredictionRequest request) {
        return predictionService.predictExpense(request);
    }
}