package com.qtma.be.service;

import com.qtma.be.model.OpenAIRequest;
import com.qtma.be.model.User;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class OpenAIService {

    
    @Value("${openaikey}")
    private String API_KEY;

    public String openaiCall(OpenAIRequest openAIRequest) throws IOException {
        // Encrypt the password
        
        final String API_URL = "https://api.openai.com/v1/chat/completions";
        OkHttpClient client = new OkHttpClient();

        // Create the JSON request body
        JSONObject message = new JSONObject();
        message.put("role", "user");
        message.put("content", openAIRequest.input);

        JSONArray messages = new JSONArray();
        messages.put(message);

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-4-turbo");
        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 100);

        // Build the request
        Request request = new Request.Builder()
                .url(API_URL)
                .addHeader("Authorization", "Bearer " + API_KEY)
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(requestBody.toString(), MediaType.parse("application/json")))
                .build();

        // Execute the request and get the response
        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                JSONObject jsonResponse = new JSONObject(response.body().string());
                JSONArray choices = jsonResponse.getJSONArray("choices");
                String reply = choices.getJSONObject(0).getJSONObject("message").getString("content");
                System.out.println("ChatGPT: " + reply);
                return reply;
            } else {
                System.out.println("Request failed: " + response);
                return "failed";
            }
        }
    
    }
}
