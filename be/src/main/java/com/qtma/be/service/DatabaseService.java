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
import com.qtma.be.model.CourseInfo;
import com.qtma.be.model.OpenAIRequest;
import com.qtma.be.model.UserCourse;
import com.qtma.be.repository.UserCourseRepository;
import com.qtma.be.repository.UserRepository;
import com.qtma.be.util.JwtUtil;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONException;
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

@Service
public class DatabaseService {

    @Autowired
    private UserCourseRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public void addRandomTask(String email, JsonNode c) {
        // Find the user by email or create a new user if not found
        UserCourse user = userRepository.findByEmail(email).orElseGet(() -> {
            UserCourse newUser = new UserCourse();
            newUser.setEmail(email);
            return newUser;
        });

        // Create the course object
        RandomTask task = new RandomTask();
        task.setTitle(c.get("title").asText());

        task.setDueDate(c.get("dueDate").asText());

        // Update the user's courses
        if (user.getRandomTasks() == null) {
            user.setRandomTasks(new ArrayList<>());
        }

        // Add the course to the user's courses list
        user.getRandomTasks().add(task);

        // Save the user back to MongoDB
        userRepository.save(user);
    }
}
