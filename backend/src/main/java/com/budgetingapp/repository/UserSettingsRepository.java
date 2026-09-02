package com.budgetingapp.repository;

import com.budgetingapp.entity.User;
import com.budgetingapp.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingsRepository
        extends JpaRepository<UserSettings, Long> {

    // Find settings using User ID
    Optional<UserSettings> findByUserId(Long userId);

    // Find settings using User
    Optional<UserSettings> findByUser(User user);
}