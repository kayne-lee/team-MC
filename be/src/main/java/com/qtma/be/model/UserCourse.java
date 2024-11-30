package com.qtma.be.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "test")
public class UserCourse {
    @Id
    private String id;
    private String email;
    private List<Course> courses;
    private List<RandomTask> randomTasks;
}


