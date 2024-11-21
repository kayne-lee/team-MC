package com.qtma.be.controller;

import com.fasterxml.jackson.core.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.jsontype.TypeSerializer;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import com.google.gson.JsonArray;
import com.qtma.be.model.Assignment;
import com.qtma.be.model.OpenAIRequest;
import com.qtma.be.model.User;
import com.qtma.be.model.UserCourse;
import com.qtma.be.repository.UserCourseRepository;
import com.qtma.be.service.OpenAIService;
import com.qtma.be.service.UserService;
import com.qtma.be.util.JwtUtil;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "http://localhost:3000")
public class DataController {

    private static final Logger logger = LoggerFactory.getLogger(DataController.class);

    @Autowired
    private JwtUtil jwtUtil;

    // You can inject any required services here
    @Autowired
    private UserService userService;

    @Autowired
    private OpenAIService openaiService;

    @Autowired
    private UserCourseRepository userCourseRepository;

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
    @PostMapping("/openai")
    public JsonNode extractAssignments(@RequestBody OpenAIRequest openaiRequest, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String token = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Extract the token by removing the "Bearer " prefix
            token = authorizationHeader.substring(7);
        }

        if (token != null && !jwtUtil.isTokenExpired(token)) {
            try {
                String username = jwtUtil.extractUsername(token);
                Optional<User> user = userService.findById(username);
                JsonNode res = openaiService.extractAssignments(openaiRequest.input);
                // openaiService.saveCourseData(user.get().getEmail(), res);
                return res;
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        } else {
            return null;
        }

    }

    @PostMapping("/saveCourse")
    public Boolean saveCourseInfo(@RequestBody JsonNode course, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String token = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Extract the token by removing the "Bearer " prefix
            token = authorizationHeader.substring(7);
        }
        if (token != null && !jwtUtil.isTokenExpired(token)) {
        
            String username = jwtUtil.extractUsername(token);
            Optional<User> user = userService.findById(username);
            
            openaiService.saveCourseData(user.get().getEmail(), course);
            return true;
            
        } else {
            return null;
        }
    }

    @GetMapping("/courses")
    public List<UserCourse> getCourses(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        String token = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Extract the token by removing the "Bearer " prefix
            token = authorizationHeader.substring(7);
        }

        if (token != null && !jwtUtil.isTokenExpired(token)) {
            String username = jwtUtil.extractUsername(token);
            Optional<User> user = userService.findById(username);
            if (user.isPresent()) {
                // Get the email of the user and find their courses
                String email = user.get().getEmail();
                return userCourseRepository.findByEmail(email)
                        .map(userCourse -> List.of(userCourse)) // Return a list with the user's courses
                        .orElse(List.of()); // Return an empty list if no courses are found
            } else {
                // If the user is not found, return an empty list
                return List.of();
            }
        } else {
            return List.of();
        }
    }
}