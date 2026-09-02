package com.budgetingapp.service;

import com.budgetingapp.entity.User;
import com.budgetingapp.entity.UserSettings;
import com.budgetingapp.repository.UserRepository;
import com.budgetingapp.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;

    public UserSettingsService(
            UserSettingsRepository userSettingsRepository,
            UserRepository userRepository) {

        this.userSettingsRepository = userSettingsRepository;
        this.userRepository = userRepository;
    }

    // ==================================================
    // GET USER SETTINGS
    // ==================================================

    public UserSettings getSettings(Long userId) {

        return userSettingsRepository
                .findByUserId(userId)
                .orElseGet(() -> createDefaultSettings(userId));
    }

    // ==================================================
    // CREATE DEFAULT SETTINGS
    // ==================================================

    private UserSettings createDefaultSettings(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserSettings settings = new UserSettings();

        settings.setUser(user);

        settings.setDarkMode(false);
        settings.setCurrency("INR");
        settings.setLanguage("en");
        settings.setNotifications(true);
        settings.setBudgetAlerts(true);

        return userSettingsRepository.save(settings);
    }

    // ==================================================
    // UPDATE SETTINGS
    // ==================================================

    public UserSettings updateSettings(
            Long userId,
            UserSettings updatedSettings) {

        UserSettings settings = getSettings(userId);

        // Dark Mode
        settings.setDarkMode(
                updatedSettings.isDarkMode());

        // Currency
        if (updatedSettings.getCurrency() != null &&
                !updatedSettings.getCurrency().trim().isEmpty()) {

            settings.setCurrency(
                    updatedSettings.getCurrency());
        }

        // Language
        if (updatedSettings.getLanguage() != null &&
                !updatedSettings.getLanguage().trim().isEmpty()) {

            settings.setLanguage(
                    updatedSettings.getLanguage());
        }

        // Notifications
        settings.setNotifications(
                updatedSettings.isNotifications());

        // Budget Alerts
        settings.setBudgetAlerts(
                updatedSettings.isBudgetAlerts());

        return userSettingsRepository.save(settings);
    }

    // ==================================================
    // RESET SETTINGS
    // ==================================================

    public UserSettings resetSettings(Long userId) {

        UserSettings settings = getSettings(userId);

        settings.setDarkMode(false);
        settings.setCurrency("INR");
        settings.setLanguage("en");
        settings.setNotifications(true);
        settings.setBudgetAlerts(true);

        return userSettingsRepository.save(settings);
    }
}