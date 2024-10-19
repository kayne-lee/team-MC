package com.qtma.be.controller;

import com.qtma.be.model.User;
import com.qtma.be.service.UserService;
import com.qtma.be.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/data")
public class DataController {

    private static final Logger logger = LoggerFactory.getLogger(DataController.class);

    @Autowired
    private JwtUtil jwtUtil;

    // You can inject any required services here
    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public ResponseEntity<Optional<User>> getUserData(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String token = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Extract the token by removing the "Bearer " prefix
            token = authorizationHeader.substring(7);
        }

        if (token != null && !jwtUtil.isTokenExpired(token)) {
            // Token is valid, extract user information (e.g., user ID)
            String username = jwtUtil.extractUsername(token); // Assuming you have this method in JwtUtil

            // Retrieve the user from the database using the username
            Optional<User> user = userService.findById(username); // Adjust this method according to your UserService
            logger.info(username);

            if (user.isPresent()) {
                return ResponseEntity.ok(user); // Return the user data
            } else {
                logger.info("here");
                return ResponseEntity.status(404).body(Optional.empty()); // User not found
            }
        } else {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
    }
}