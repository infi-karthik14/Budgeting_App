package com.budgetingapp.service;

import com.budgetingapp.dto.UserResponse;
import com.budgetingapp.entity.User;
import com.budgetingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

        @Autowired
        private UserRepository userRepository;

        // ==================================================
        // GET USER BY ID
        // ==================================================

        public User getUserById(Long id) {

                return userRepository.findById(id)
                                .orElseThrow(
                                                () -> new RuntimeException("User not found"));
        }

        // ==================================================
        // UPDATE PROFILE
        // ==================================================

        public User updateProfile(
                        Long id,
                        User updatedUser) {

                User user = getUserById(id);

                // ==================================================
                // FULL NAME
                // ==================================================

                if (updatedUser.getFullName() != null &&
                                !updatedUser.getFullName().trim().isEmpty()) {

                        String fullName = updatedUser.getFullName().trim();

                        user.setFullName(fullName);

                        // Keep legacy name field synchronized
                        user.setName(fullName);
                }

                // ==================================================
                // EMAIL
                // ==================================================

                if (updatedUser.getEmail() != null &&
                                !updatedUser.getEmail().trim().isEmpty()) {

                        user.setEmail(
                                        updatedUser.getEmail());
                }

                // ==================================================
                // PHONE NUMBER
                // ==================================================

                if (updatedUser.getPhoneNumber() != null &&
                                !updatedUser.getPhoneNumber().trim().isEmpty()) {

                        user.setPhoneNumber(
                                        updatedUser.getPhoneNumber());
                }

                // ==================================================
                // DATE OF BIRTH
                // ==================================================

                if (updatedUser.getDateOfBirth() != null) {

                        user.setDateOfBirth(
                                        updatedUser.getDateOfBirth());
                }

                // ==================================================
                // ADDRESS
                // ==================================================

                if (updatedUser.getAddress() != null) {

                        user.setAddress(
                                        updatedUser.getAddress());
                }

                // ==================================================
                // BIO
                // ==================================================

                if (updatedUser.getBio() != null) {

                        user.setBio(
                                        updatedUser.getBio());
                }

                // ==================================================
                // PASSWORD
                // ==================================================
                // Password is intentionally NOT updated here.
                //
                // Existing password remains unchanged.
                // ==================================================

                // ==================================================
                // PROFILE IMAGE
                // ==================================================
                // Profile image is updated separately through:
                //
                // POST /api/users/{id}/profile-image
                //
                // So we DO NOT touch the image here.
                // ==================================================

                return userRepository.save(user);
        }

        // ==================================================
        // UPDATE PROFILE IMAGE
        // ==================================================
        // Stores the actual image bytes inside MySQL LONGBLOB
        // ==================================================

        public User updateProfileImage(
                        Long id,
                        byte[] imageData,
                        String imageType) {

                User user = getUserById(id);

                // Save image bytes
                user.setProfileImage(imageData);

                // Save image MIME type
                // Example:
                // image/jpeg
                // image/png
                // image/webp
                user.setProfileImageType(imageType);

                return userRepository.save(user);
        }

        // ==================================================
        // GET USER RESPONSE
        // ==================================================

        public UserResponse getUserResponseById(Long id) {

                User user = getUserById(id);

                return new UserResponse(
                                user.getId(),
                                user.getName(),
                                user.getFullName(),
                                user.getEmail(),
                                user.getPhoneNumber(),
                                user.getDateOfBirth(),
                                user.getAddress(),
                                user.getBio(),
                                user.getJoinedDate());
        }

        // ==================================================
        // UPDATE USER RESPONSE
        // ==================================================

        public UserResponse updateProfileResponse(
                        Long id,
                        User updatedUser) {

                User user = updateProfile(id, updatedUser);

                return new UserResponse(
                                user.getId(),
                                user.getName(),
                                user.getFullName(),
                                user.getEmail(),
                                user.getPhoneNumber(),
                                user.getDateOfBirth(),
                                user.getAddress(),
                                user.getBio(),
                                user.getJoinedDate());
        }

        // ==================================================
        // SAVE USER
        // ==================================================

        public User saveUser(User user) {

                return userRepository.save(user);
        }
}