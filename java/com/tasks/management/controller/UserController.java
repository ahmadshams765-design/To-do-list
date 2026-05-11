package com.tasks.management.controller;

// import com.tasks.management.model.User;
import com.tasks.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET profile by username
    @GetMapping("/{username}")
public ResponseEntity<?> getProfile(@PathVariable String username) {
    return userRepository.findByUsername(username)
            .map(user -> ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "profilePic", user.getProfilePic() != null ? user.getProfilePic() : ""
            )))
            .orElse(ResponseEntity.notFound().build());
}

    // PUT update username and/or password
    @PutMapping("/{username}")
    public ResponseEntity<?> updateProfile(
            @PathVariable String username,
            @RequestBody Map<String, String> body) {

        return userRepository.findByUsername(username).map(user -> {

            String newUsername = body.get("newUsername");
            String newPassword = body.get("newPassword");

            // update username if provided and not taken
            if (newUsername != null && !newUsername.isBlank() && !newUsername.equals(username)) {
                if (userRepository.findByUsername(newUsername).isPresent()) {
                    return ResponseEntity.badRequest().body("Username already taken");
                }
                user.setUsername(newUsername);
            }

            // update password if provided
            if (newPassword != null && !newPassword.isBlank()) {
                user.setPassword(passwordEncoder.encode(newPassword));
            }
                  
            String newProfilePic = body.get("profilePic");
        if (newProfilePic != null && !newProfilePic.isBlank()) {
            user.setProfilePic(newProfilePic);
        }
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("username", user.getUsername()));

        }).orElse(ResponseEntity.notFound().build());
    }
}