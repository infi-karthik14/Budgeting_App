package com.budgetingapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MLPredictionService {

    private final RestTemplate restTemplate;

    @Value("${ml.api.url:http://localhost:5000/predict-expense}")
    private String mlApiUrl;

    public MLPredictionService() {
        this.restTemplate = new RestTemplate();
    }

    public Double predictExpense(
            Double monthlyIncome,
            Double monthlyBudget,
            String category,
            String paymentMethod,
            String city,
            String dayOfWeek
    ) {

        Map<String, Object> request = new HashMap<>();

        request.put("monthly_income", monthlyIncome);
        request.put("monthly_budget", monthlyBudget);
        request.put("category", category);
        request.put("payment_method", paymentMethod);
        request.put("city", city);
        request.put("day_of_week", dayOfWeek);

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        mlApiUrl,
                        entity,
                        Map.class
                );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException(
                    "ML API returned status: "
                            + response.getStatusCode()
            );
        }

        Map body = response.getBody();

        if (body == null || !body.containsKey("predicted_expense")) {
            throw new RuntimeException(
                    "Invalid response from ML API"
            );
        }

        Number prediction =
                (Number) body.get("predicted_expense");

        return prediction.doubleValue();
    }
}