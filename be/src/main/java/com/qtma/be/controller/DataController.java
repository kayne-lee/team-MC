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
import com.qtma.be.service.DatabaseService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*")
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
    private DatabaseService databaseSerivce;

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

    @PostMapping("/addRandomTask")
    public Boolean addRandomTask(@RequestBody JsonNode task, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String token = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Extract the token by removing the "Bearer " prefix
            token = authorizationHeader.substring(7);
        }
        if (token != null && !jwtUtil.isTokenExpired(token)) {
        
            String username = jwtUtil.extractUsername(token);
            Optional<User> user = userService.findById(username);
            
            databaseSerivce.addRandomTask(user.get().getEmail(), task);
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

    @GetMapping("/allCourses")
    public List<Map<String, Object>> getAllCourses(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        String token = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Extract the token by removing the "Bearer " prefix
            token = authorizationHeader.substring(7);
        }

        if (token != null && !jwtUtil.isTokenExpired(token)) {
            String username = jwtUtil.extractUsername(token);
            Optional<User> user = userService.findById(username);
            
            if (user.isPresent()) {
                String email = user.get().getEmail();

                // Fetch courses for the user from the database
                Optional<UserCourse> userCourseOpt = userCourseRepository.findByEmail(email);
                
                if (userCourseOpt.isPresent()) {
                    UserCourse userCourse = userCourseOpt.get(); // Extract the userCourse object

                    // Convert the courses to the desired format
                    return userCourse.getCourses().stream().map(course -> {
                        Map<String, Object> courseMap = new HashMap<>();

                        // Basic course info
                        courseMap.put("id", course.getTitle().hashCode()); // Use course title hash as a placeholder ID
                        courseMap.put("title", course.getTitle());
                        courseMap.put("instructor", course.getCourseInfo().getInstructorName());
                        courseMap.put("email", course.getCourseInfo().getInstructorEmail());
                        courseMap.put("officeLocation", course.getCourseInfo().getOfficeHoursLocation());
                        courseMap.put("officeHours", course.getCourseInfo().getOfficeHoursTime());
                        courseMap.put("category", course.getCourseInfo().getCategory());

                        // Assignments
                        List<Map<String, Object>> assignments = course.getAssignments().stream().map(assignment -> {
                            Map<String, Object> assignmentMap = new HashMap<>();
                            assignmentMap.put("id", assignment.getTitle().hashCode()); // Use title hash for assignment ID
                            assignmentMap.put("title", assignment.getTitle());
                            assignmentMap.put("weight", assignment.getWeight());
                            assignmentMap.put("dueDate", assignment.getDueDate().substring(0, 10)); // Extract just the date part
                            assignmentMap.put("description", assignment.getDescription());
                            return assignmentMap;
                        }).collect(Collectors.toList());

                        courseMap.put("assignments", assignments);

                        return courseMap;
                    }).collect(Collectors.toList());
                } else {
                    // Return an empty list if no courses are found
                    return List.of();
                }
            } else {
                // Return an empty list if the user is not found
                return List.of();
            }
        } else {
            // Return an empty list if the token is invalid or expired
            return List.of();
        }
    }

    @PostMapping("/updateGrades")
    public ResponseEntity<Map<String, Boolean>> updateGrades(
            @RequestBody List<Map<String, Object>> gradeUpdates,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }

        if (token != null && !jwtUtil.isTokenExpired(token)) {
            try {
                String username = jwtUtil.extractUsername(token);
                Optional<User> user = userService.findById(username);
                
                if (user.isPresent()) {
                    String email = user.get().getEmail();
                    Map<String, Boolean> results = new HashMap<>();

                    for (Map<String, Object> update : gradeUpdates) {
                        String courseTitle = (String) update.get("courseTitle");
                        String assignmentTitle = (String) update.get("assignmentTitle");
                        float grade = ((Number) update.get("grade")).floatValue();

                        boolean updated = databaseSerivce.updateAssignmentGrade(
                            email, 
                            courseTitle, 
                            assignmentTitle, 
                            grade
                        );

                        String key = courseTitle + "-" + assignmentTitle;
                        results.put(key, updated);
                    }

                    return ResponseEntity.ok(results);
                }
            } catch (Exception e) {
                logger.error("Error updating grades: ", e);
                return ResponseEntity.status(500).body(null);
            }
        }
        
        return ResponseEntity.status(401).body(null);
    }

}