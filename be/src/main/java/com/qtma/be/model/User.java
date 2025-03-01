package com.qtma.be.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private List<String> friends;
    private int streak;
    private String googleEmail;

    public void setgoogleEmail(String googleEmail) {
        this.googleEmail = googleEmail;
    }
    private List<Integer> notificationCount;
    private String phone;
}