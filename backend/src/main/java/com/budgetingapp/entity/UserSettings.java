package com.budgetingapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_settings")
public class UserSettings {

    // ==================================================
    // ID
    // ==================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==================================================
    // USER
    // ==================================================

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // ==================================================
    // DARK MODE
    // ==================================================

    @Column(name = "dark_mode", nullable = false)
    private boolean darkMode = false;

    // ==================================================
    // CURRENCY
    // ==================================================

    @Column(name = "currency", nullable = false)
    private String currency = "INR";

    // ==================================================
    // LANGUAGE
    // ==================================================

    @Column(name = "language", nullable = false)
    private String language = "en";

    // ==================================================
    // NOTIFICATIONS
    // ==================================================

    @Column(name = "notifications", nullable = false)
    private boolean notifications = true;

    // ==================================================
    // BUDGET ALERTS
    // ==================================================

    @Column(name = "budget_alerts", nullable = false)
    private boolean budgetAlerts = true;

    // ==================================================
    // GETTERS AND SETTERS
    // ==================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isDarkMode() {
        return darkMode;
    }

    public void setDarkMode(boolean darkMode) {
        this.darkMode = darkMode;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public boolean isNotifications() {
        return notifications;
    }

    public void setNotifications(boolean notifications) {
        this.notifications = notifications;
    }

    public boolean isBudgetAlerts() {
        return budgetAlerts;
    }

    public void setBudgetAlerts(boolean budgetAlerts) {
        this.budgetAlerts = budgetAlerts;
    }
}