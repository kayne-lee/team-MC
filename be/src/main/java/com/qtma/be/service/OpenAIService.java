package com.qtma.be.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.qtma.be.model.Assignment;
import com.qtma.be.model.ProgressionTask;
import com.qtma.be.model.Course;
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
import java.util.concurrent.TimeUnit;

@Service
public class OpenAIService {

    @Value("${openaikey}")
    private String API_KEY;

    @Autowired
    private UserCourseRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public JsonNode openaiCall(OpenAIRequest openAIRequest) throws IOException {
        final String API_URL = "https://api.openai.com/v1/chat/completions";
        OkHttpClient client = new OkHttpClient.Builder().connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build();

        JSONArray messages = new JSONArray();
        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        String prompt = openAIRequest.prompt + ": " + openAIRequest.input;
        userMessage.put("content", prompt);
        messages.put(userMessage);

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-4o-mini");
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.3);

        Request request = new Request.Builder()
                .url(API_URL)
                .addHeader("Authorization", "Bearer " + API_KEY)
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(requestBody.toString(), MediaType.parse("application/json")))
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String reply = response.body().string();
            
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(reply);

                JsonElement jsonElement = JsonParser.parseString(jsonNode.toString());
                JsonObject jsonObject = jsonElement.getAsJsonObject();

                String content = jsonObject
                        .getAsJsonArray("choices")
                        .get(0)
                        .getAsJsonObject()
                        .getAsJsonObject("message")
                        .get("content").getAsString();

                // Parse the JSON content into a Java object
                JsonObject resultObject = JsonParser.parseString(content).getAsJsonObject();

                String courseCode = resultObject.get("title").getAsString();
                JsonArray assignmentsArray = resultObject.getAsJsonArray("assignments");

                JsonElement courseInfo = resultObject.getAsJsonObject("courseInfo");

                // Convert assignments into a Java List
                List<Assignment> assignments = objectMapper.readValue(assignmentsArray.toString(), new TypeReference<List<Assignment>>() {});

                Object courseInfoObject = objectMapper.readValue(courseInfo.toString(), new TypeReference<Object>() {});

                // Create the final JSON object to return
                Map<String, Object> result = new HashMap<>();

                result.put("assignments", assignments);
                result.put("title", courseCode);
                result.put("courseInfo", courseInfoObject);

                // Return the final JSON object
                return objectMapper.convertValue(result, JsonNode.class);
            } else {
                System.out.println("Request failed: " + response);
                throw new IOException("OpenAI API request failed with status code: " + response.code());
            }
        }
    }


    public JsonNode extractAssignments(String syllabusText) throws IOException {
        // Refine the prompt for stricter formatting
        String prompt = "Extract all assignments, tests, midterms, and exams from the following syllabus. " +
                "The output must be ONLY A **valid JSON object** that STARTS WITH { and ENDS WITH } with the keys 'title', 'courseInfo' and 'assignments'. Please do not write anything outside of the {} brackets." +
                "The 'title' field should contain the course code, the 'courseInfo' field should be an object, and the 'assignments' field should be an array of assessments. " +
                "The courseInfo object should have the fields 'instructorName', 'instructorEmail', 'officeHoursTime', 'officeHoursLocation', 'requiredResouces', 'attendanceAndLate', 'gradingPolicy', 'teachingAssistantInfo', and 'category'" +
                "The category field MUST BE ONE OF THE FOLLOWING OPTIONS: science, math, art, business, coding, other. Pick the option based on the text in the input." +
                "requiredResources should pull the name of any textbooks or other resources mentioned, and attendanceAndLate should indicate if attendance is tracked and graded, and gradingPolicy should indidate the late policy for submitting assessments." +
                "If there is no info for any of these fields in the syllabus, LEAVE THEM BLANK EMPTY STRING. Do not make up information." +
                "We are in the year 2025." +
                "Example: {\"instructorName\": \"NAME_HERE\", \"instructorEmail\": \"example@queesnu.ca\", \"officeHoursTime\": \"DAY_OF_WEEK at TIME_OF_DAY\", \"officeHoursLocation\": \"LOCATION\", \"category\": \"CATEGORY\"} " +
                "If any of the above fields are missing for courseInfo, just leave them as an empty string." +
                "Each assessment should have the keys 'title', 'weight', 'description', 'progressionTasks' and 'dueDate'. " +
                "The progressionTasks will be an array of 2 objects, where each object will be a study session of work period to help the user stay on track to completing the work. " +
                "Each progressionTasks object should have the keys 'course' (same as assignments course), 'dueDate' (which should be a few days before the actual assignment is due), 'description', and 'title'" +
                "Example: {\"title\": \"COURSE_CODE\", \"assessments\": [{\"title\": \"ASSESSMENT_NAME\", \"weight\": \"WEIGHT\", \"description\": \"SHORT DESCRIPTION\", \"progressionTasks\": \"[{INSERT TWO TASKS HERE WITH CORRECT KEYS}]\", \"dueDate\": \"2025-12-10T23:59\"}]} " +
                "Additional requirements: " +
                "1. If the time is not specified, assume the time is 11:59 PM on the given date. " +
                "2. If a date is not specified, fill in December 1, 2024, with the assumed time of 11:59 PM. " +
                "3. The description should be one sentence long max for each, and if you cannot find anything to describe the assessment, leave the field blank." +
                "4. The semester is divided as follows: " +
                "   - Week 1 to Week 6: From January 6, 2025 (Monday of Week 1) to February 10, 2025 (Monday of Week 6). " +
                "   - Week 7 to Week 12: From February 24, 2025 (Monday of Week 7) to March 31, 2025 (Monday of Week 12). " +
                "5. Ensure that the total weight of all assessments adds up to exactly 100%. If you see a Final Exam mentioned, make sure to include it as well. If you find NO ASSESSMENTS AT ALL, return an empty JSON." +
                "Use these rules to generate the JSON object. " +
                "Input: " + syllabusText;

        // Create OpenAI request
        OpenAIRequest openAIRequest = new OpenAIRequest(syllabusText, prompt);

        // Get the response from OpenAI
        JsonNode response = null;

        int maxRetries = 5; // Set maximum retry attempts
        int attempt = 0;

        while (attempt < maxRetries) {
            try {
                attempt++;
                System.out.println("Attempt " + attempt + " to call OpenAI...");

                // Make the actual OpenAI call (adjust this method to your actual API calling logic)
                response = openaiCall(openAIRequest);

                // If successful, break the loop
                System.out.println("OpenAI call succeeded on attempt " + attempt);
                break;
            } catch (Exception e) {
                System.err.println("Error on attempt " + attempt + ": " + e.getMessage());

                // If max retries are reached, throw the exception
                if (attempt == maxRetries) {
                    System.err.println("Max retry attempts reached. Failing...");
                    throw new RuntimeException("Failed to call OpenAI after " + maxRetries + " attempts", e);
                }

                // Optional: Add a delay between retries
                try {
                    Thread.sleep(2000); // Wait 2 seconds before retrying
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Retrying interrupted", ie);
                }
            }
        }

        // Validate and parse the response
        try {
            return response;
        } catch (JSONException e) {
            e.printStackTrace();
            throw new IOException(e);
            // Log and handle the error
        }
    }

    public void saveCourseData(String email, JsonNode c) {
        // Find the user by email or create a new user if not found
        UserCourse user = userRepository.findByEmail(email).orElseGet(() -> {
            UserCourse newUser = new UserCourse();
            newUser.setEmail(email);
            return newUser;
        });
        
        // Create the course object
        Course course = new Course();
        course.setTitle(c.get("title").asText());
        
        JsonNode courseNode = c.get("courseInfo");
        CourseInfo courseInfo = new CourseInfo();
        courseInfo.setInstructorName(courseNode.get("instructorName").asText());
        courseInfo.setInstructorEmail(courseNode.get("instructorEmail").asText());
        courseInfo.setOfficeHoursTime(courseNode.get("officeHoursTime").asText());
        courseInfo.setOfficeHoursLocation(courseNode.get("officeHoursLocation").asText());
        courseInfo.setCategory(courseNode.get("category").asText());
        courseInfo.setRequiredResouces(courseNode.get("requiredResouces").asText());
        courseInfo.setAttendanceAndLate(courseNode.get("attendanceAndLate").asText());
        courseInfo.setGradingPolicy(courseNode.get("gradingPolicy").asText());
        courseInfo.setTeachingAssistantInfo(courseNode.get("teachingAssistantInfo").asText());
        course.setCourseInfo(courseInfo);
        // Extract assignments from the JsonNode
        List<Assignment> assignments = new ArrayList<>();
        if (c.has("assignments") && c.get("assignments").isArray()) {
            for (JsonNode assignmentNode : c.get("assignments")) {
                Assignment assignment = new Assignment();
                assignment.setTitle(assignmentNode.get("title").asText());
                assignment.setWeight(assignmentNode.get("weight").asText());
                assignment.setDueDate(assignmentNode.get("dueDate").asText());
                assignment.setDescription(assignmentNode.get("description").asText());
        
                // Extract progression tasks
                List<ProgressionTask> progressionTasks = new ArrayList<>();
                if (assignmentNode.has("progressionTasks") && assignmentNode.get("progressionTasks").isArray()) {
                    for (JsonNode taskNode : assignmentNode.get("progressionTasks")) {
                        ProgressionTask task = new ProgressionTask();
                        task.setCourse(taskNode.get("course").asText());
                        task.setDueDate(taskNode.get("dueDate").asText());
                        task.setDescription(taskNode.get("description").asText());
                        task.setTitle(taskNode.get("title").asText());
                        progressionTasks.add(task);
                    }
                }
                assignment.setProgressionTasks(progressionTasks);
        
                assignments.add(assignment);
            }
        }
        course.setAssignments(assignments);
        
        // Update the user's courses
        if (user.getCourses() == null) {
            user.setCourses(new ArrayList<>());
        }
        
        // Add the course to the user's courses list
        user.getCourses().add(course);
        
        // Save the user back to MongoDB
        userRepository.save(user);
    }
}
