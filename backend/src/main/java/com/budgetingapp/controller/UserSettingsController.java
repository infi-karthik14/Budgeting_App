package com.budgetingapp.controller;

import com.budgetingapp.entity.UserSettings;
import com.budgetingapp.service.UserSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://gregarious-communication-production-6879.up.railway.app"
})
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    // ==================================================
    // CONSTRUCTOR
    // ==================================================

    public UserSettingsController(
            UserSettingsService userSettingsService) {

        this.userSettingsService = userSettingsService;
    }

    // ==================================================
    // GET USER SETTINGS
    //
    // GET:
    // /api/users/{userId}/settings
    // ==================================================

    @GetMapping("/{userId}/settings")
    public ResponseEntity<UserSettings> getSettings(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                userSettingsService.getSettings(userId));
    }

    // ==================================================
    // UPDATE USER SETTINGS
    //
    // PUT:
    // /api/users/{userId}/settings
    // ==================================================

    @PutMapping("/{userId}/settings")
    public ResponseEntity<UserSettings> updateSettings(
            @PathVariable Long userId,
            @RequestBody UserSettings settings) {

        return ResponseEntity.ok(
                userSettingsService.updateSettings(
                        userId,
                        settings));
    }

    // ==================================================
    // RESET USER SETTINGS
    //
    // POST:
    // /api/users/{userId}/settings/reset
    // ==================================================

    @PostMapping("/{userId}/settings/reset")
    public ResponseEntity<UserSettings> resetSettings(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                userSettingsService.resetSettings(userId));
    }
}