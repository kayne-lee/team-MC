package com.qtma.be.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.qtma.be.model.Assignment;
import com.qtma.be.model.OpenAIRequest;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class OpenAIService {

    @Value("${openaikey}")
    private String API_KEY;

    public List<Assignment> openaiCall(OpenAIRequest openAIRequest) throws IOException {
        final String API_URL = "https://api.openai.com/v1/chat/completions";
        OkHttpClient client = new OkHttpClient();

        JSONArray messages = new JSONArray();
        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        String prompt = openAIRequest.prompt + ": " + openAIRequest.input;
        userMessage.put("content", prompt);
        messages.put(userMessage);

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 1000);

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

                List<Assignment> assignments = objectMapper.readValue(content, new TypeReference<List<Assignment>>() {});

                return assignments;
            } else {
                System.out.println("Request failed: " + response);
                throw new IOException("OpenAI API request failed with status code: " + response.code());
            }
        }
    }


    public List<Assignment> extractAssignments(String syllabusText) throws IOException {
        // Refine the prompt for stricter formatting
        String prompt = "Extract all assignments, tests, midterms, and exams from the following syllabus. " +
                "Return the output as a **valid JSON array** where each object has the keys 'title', 'weight', and 'dueDate'. " +
                "Ensure the response starts with '[' and ends with ']'. " +
                "Example: [{\"title\": \"Assignment 1\", \"weight\": \"15%\", \"dueDate\": \"2024-12-10T23:59:00.000+00:00\"}] " +
                "Additional requirements: " +
                "1. If the time is not specified, assume the time is 11:59 PM on the given date. " +
                "2. If a date is not specified, fill in December 1, 2024, with the assumed time of 11:59 PM. " +
                "3. The semester is divided as follows: " +
                "   - Week 1 to Week 6: From September 2, 2024 (Monday of Week 1) to October 7, 2024 (Monday of Week 6). " +
                "   - Week 7 to Week 12: From October 21, 2024 (Monday of Week 7) to November 25, 2024 (Monday of Week 12). " +
                "Use these rules to generate the JSON array. " +
                "Input: " + syllabusText;

        // Create OpenAI request
        OpenAIRequest openAIRequest = new OpenAIRequest(syllabusText, prompt);

        // Get the response from OpenAI
        List<Assignment> response = openaiCall(openAIRequest);

        // Validate and parse the response
        try {
            return response;
        } catch (JSONException e) {
            e.printStackTrace();
            throw new IOException(e);
            // Log and handle the error
        }
    }
}
