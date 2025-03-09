package com.qtma.be.model;

import lombok.*;

import java.util.List;
@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Assignment {
    private String title;
    private String weight;
    private String dueDate;
    private String description;
    private float grade;
    private boolean completed;
    private List<Object> progressionTasks;
    private String notes;
}
