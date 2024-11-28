package com.qtma.be.model;

import lombok.*;

import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Course {
    private String title;
    private List<Assignment> assignments;
    private CourseInfo courseInfo;
}
