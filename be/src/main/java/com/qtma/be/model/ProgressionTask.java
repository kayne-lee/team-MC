package com.qtma.be.model;

import lombok.*;

import java.util.List;
@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProgressionTask {
    private String course;
    private String title;
    private String dueDate;
    private String description;
}
