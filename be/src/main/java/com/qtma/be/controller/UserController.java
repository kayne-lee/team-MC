package com.qtma.be.controller;

import com.qtma.be.model.User;
import com.qtma.be.service.UserService;

import com.qtma.be.util.JwtUtil;
import com.qtma.be.util.NotificationUtil;
import com.twilio.rest.api.v2010.account.Notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private NotificationUtil notificationUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/googlelogin")
    public ResponseEntity<String> googleLogin(@RequestBody User request) {
        String googleEmail = request.getGoogleEmail();

        if (googleEmail == null || googleEmail.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        Optional<User> userOpt = userService.findBygoogleEmail(googleEmail);

        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get(); // Existing user, proceed with login
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(token);
        } else {
            // Create a new user entry with the Google email
            // user = new User();
            // user.setgoogleEmail(googleEmail);
            userService.registerUser(request);
        }

        // Generate and return JWT token
        String token = jwtUtil.generateToken(request);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginRequest) {
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            // If the user is not found, return a 404 NOT FOUND response
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // If the password does not match, return a 400 BAD REQUEST response
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        // Return the JWT token if the login is successful
        return ResponseEntity.ok(jwtUtil.generateToken(user));
    }

    @PutMapping("/notifications")
    public ResponseEntity<String> updateNotificationCount(
            @RequestBody Map<String, List<Integer>> request,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }

        if (token != null && !jwtUtil.isTokenExpired(token)) {
            try {
                String username = jwtUtil.extractUsername(token);
                Optional<User> userOpt = userService.findById(username);
                
                if (userOpt.isPresent()) {
                    List<Integer> notificationCounts = request.get("notificationCount");
                    if (notificationCounts == null) {
                        return ResponseEntity.badRequest().body("Notification count is required");
                    }
                    
                    User user = userOpt.get();
                    user.setNotificationCount(notificationCounts);
                    userService.save(user);
                    
                    return ResponseEntity.ok("Notification count updated successfully");
                }
                
                return ResponseEntity.notFound().build();
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Error updating notification count");
            }
        }
        
        return ResponseEntity.status(401).body("Unauthorized");
    }
}
