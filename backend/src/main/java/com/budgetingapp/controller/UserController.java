package com.budgetingapp.controller;

import com.budgetingapp.dto.UserResponse;
import com.budgetingapp.entity.User;
import com.budgetingapp.service.UserService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
                "http://localhost:5500",
                "http://127.0.0.1:5500",
                "https://gregarious-communication-production-6879.up.railway.app"
})
public class UserController {

        private final UserService userService;

        // ==================================================
        // CONSTRUCTOR
        // ==================================================

        public UserController(UserService userService) {
                this.userService = userService;
        }

        // ==================================================
        // GET USER PROFILE
        // GET /api/users/{id}
        // ==================================================

        @GetMapping("/{id}")
        public ResponseEntity<UserResponse> getUser(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                userService.getUserResponseById(id));
        }

        // ==================================================
        // UPDATE USER PROFILE
        // PUT /api/users/{id}
        // ==================================================

        @PutMapping("/{id}")
        public ResponseEntity<UserResponse> updateProfile(
                        @PathVariable Long id,
                        @RequestBody User user) {

                return ResponseEntity.ok(
                                userService.updateProfileResponse(id, user));
        }

        // ==================================================
        // UPLOAD PROFILE IMAGE
        //
        // POST /api/users/{id}/profile-image
        // ==================================================

        @PostMapping("/{id}/profile-image")
        public ResponseEntity<User> uploadProfileImage(
                        @PathVariable Long id,
                        @RequestParam("image") MultipartFile image) {

                try {

                        // ==================================================
                        // CHECK IMAGE
                        // ==================================================

                        if (image == null || image.isEmpty()) {

                                return ResponseEntity
                                                .badRequest()
                                                .build();
                        }

                        // ==================================================
                        // CHECK IMAGE TYPE
                        // ==================================================

                        String contentType = image.getContentType();

                        if (contentType == null ||
                                        !contentType.startsWith("image/")) {

                                return ResponseEntity
                                                .badRequest()
                                                .build();
                        }

                        // ==================================================
                        // CHECK FILE SIZE
                        // Maximum 2 MB
                        // ==================================================

                        if (image.getSize() > 2 * 1024 * 1024) {

                                return ResponseEntity
                                                .badRequest()
                                                .build();
                        }

                        // ==================================================
                        // GET IMAGE BYTES
                        // ==================================================

                        byte[] imageData = image.getBytes();

                        // ==================================================
                        // SAVE IMAGE TO MYSQL
                        // ==================================================

                        User updatedUser = userService.updateProfileImage(
                                        id,
                                        imageData,
                                        contentType);

                        // ==================================================
                        // RETURN UPDATED USER
                        // ==================================================

                        return ResponseEntity.ok(
                                        updatedUser);

                } catch (IOException e) {

                        e.printStackTrace();

                        return ResponseEntity
                                        .internalServerError()
                                        .build();
                }
        }

        // ==================================================
        // GET PROFILE IMAGE
        //
        // GET /api/users/{id}/profile-image
        // ==================================================

        @GetMapping("/{id}/profile-image")
        public ResponseEntity<byte[]> getProfileImage(
                        @PathVariable Long id) {

                User user = userService.getUserById(id);

                // ==================================================
                // CHECK IMAGE
                // ==================================================

                if (user.getProfileImage() == null ||
                                user.getProfileImage().length == 0) {

                        return ResponseEntity
                                        .notFound()
                                        .build();
                }

                // ==================================================
                // GET IMAGE TYPE
                // ==================================================

                String imageType = user.getProfileImageType();

                if (imageType == null ||
                                imageType.isEmpty()) {

                        imageType = "image/jpeg";
                }

                // ==================================================
                // RETURN IMAGE
                // ==================================================

                return ResponseEntity.ok()
                                .header(
                                                HttpHeaders.CONTENT_TYPE,
                                                imageType)
                                .body(
                                                user.getProfileImage());
        }
}