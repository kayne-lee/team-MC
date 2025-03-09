package com.qtma.be.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.qtma.be.model.Assignment;
import com.qtma.be.model.Course;
import com.qtma.be.model.RandomTask;
import com.qtma.be.model.User;
import com.qtma.be.model.CourseInfo;
import com.qtma.be.model.OpenAIRequest;
import com.qtma.be.model.UserCourse;
import com.qtma.be.repository.UserCourseRepository;
import com.qtma.be.repository.UserRepository;
import com.qtma.be.util.JwtUtil;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@Service
public class DatabaseService {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseService.class.getName());

    @Autowired
    private UserCourseRepository userCourseRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;

    public void addRandomTask(String email, JsonNode c) {
        // Find the user by email or create a new user if not found
        UserCourse user = userCourseRepository.findByEmail(email).orElseGet(() -> {
            UserCourse newUser = new UserCourse();
            newUser.setEmail(email);
            return newUser;
        });

        // Create the course object
        RandomTask task = new RandomTask();
        task.setTitle(c.get("title").asText());

        task.setDueDate(c.get("dueDate").asText());

        task.setDescription(c.get("description").asText());

        // Update the user's courses
        if (user.getRandomTasks() == null) {
            user.setRandomTasks(new ArrayList<>());
        }

        // Add the course to the user's courses list
        user.getRandomTasks().add(task);

        // Save the user back to MongoDB
        userCourseRepository.save(user);
    }

    public boolean updateAssignmentGrade(String email, String courseTitle, String assignmentTitle, float grade) {
        try {
            Optional<UserCourse> userCourseOpt = userCourseRepository.findByEmail(email);
            
            if (userCourseOpt.isPresent()) {
                UserCourse userCourse = userCourseOpt.get();
                
                // Find the course
                for (Course course : userCourse.getCourses()) {
                    if (course.getTitle().equals(courseTitle)) {
                        // Find the assignment
                        for (Assignment assignment : course.getAssignments()) {
                            if (assignment.getTitle().equals(assignmentTitle)) {
                                // Update the grade
                                assignment.setGrade(grade);
                                userCourseRepository.save(userCourse);
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        } catch (Exception e) {
            logger.error("Error updating assignment grade: ", e);
            return false;
        }
    }

    public boolean updateAssignmentCompletion(String email, String courseTitle, String assignmentTitle, boolean isCompleted) {
        try {
            Optional<UserCourse> userCourseOpt = userCourseRepository.findByEmail(email);
            
            if (userCourseOpt.isPresent()) {
                UserCourse userCourse = userCourseOpt.get();

                logger.info("Course title: " + courseTitle);

                if (courseTitle.equals("Extra Task")) {
                    logger.info(userCourse.getRandomTasks().toString());
                    for (RandomTask task : userCourse.getRandomTasks()) {
                        if (task.getTitle().equals(assignmentTitle)) {
                            task.setCompleted(isCompleted);
                            userCourseRepository.save(userCourse);
                            return true;
                        }
                    }
                }
                
                // Find the course
                for (Course course : userCourse.getCourses()) {
                    if (course.getTitle().equals(courseTitle)) {
                        // Find the assignment
                        for (Assignment assignment : course.getAssignments()) {
                            if (assignment.getTitle().equals(assignmentTitle)) {
                                // Update the completion status
                                assignment.setCompleted(isCompleted);
                                // logger.info("Assignment completion status updated: " + assignment.getTitle() + " " + isCompleted);
                                userCourseRepository.save(userCourse);
                                return true;
                            }
                        }
                    }
                }



            }
            return false;
        } catch (Exception e) {
            logger.error("Error updating assignment completion status: ", e);
            return false;
        }
    }
    public boolean updateNotes(String email, String courseTitle, String assignmentTitle, String notes) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<UserCourse> userC = userCourseRepository.findByEmail(email);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                UserCourse userCourse = userC.get();
                boolean updated = false;
    
                // Check assignments within courses
                for (Course course : userCourse.getCourses()) {
                    if (course.getTitle().equals(courseTitle)) {
                        for (Assignment assignment : course.getAssignments()) {
                            if (assignment.getTitle().equals(assignmentTitle)) {
                                assignment.setNotes(notes);
                                userCourseRepository.save(userCourse);
                                updated = true;
                            }
                        }
                    }
                }
    
                // If the courseTitle is "Random Task", check for randomTasks
                if (courseTitle.equals("Extra Task")) {
                    // logger.info(userCourse.getRandomTasks().toString());
                    for (RandomTask task : userCourse.getRandomTasks()) {
                        if (task.getTitle().equals(assignmentTitle)) {
                            task.setNotes(notes);
                            userCourseRepository.save(userCourse);
                            updated = true;
                        }
                    }
                }
    
                if (updated) {
                    userRepository.save(user);  // Save the updated user object
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            logger.error("Error updating notes: ", e);
            return false;
        }
    }
    

    
}
