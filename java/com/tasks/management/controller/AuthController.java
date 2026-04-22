package com.tasks.management.controller;

import com.tasks.management.model.User;
import com.tasks.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

// import java.util.Optional;




@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // manual constructor instead of @RequiredArgsConstructor
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        var found = userRepository.findByUsername(user.getUsername());

        if (found.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!passwordEncoder.matches(user.getPassword(), found.get().getPassword())) {
            return ResponseEntity.badRequest().body("Wrong password");
        }

        return ResponseEntity.ok(found.get().getUsername());
    }
    @GetMapping("/users")
public ResponseEntity<?> getAllUsers() {
    return ResponseEntity.ok(userRepository.findAll());
}
}