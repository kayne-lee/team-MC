package com.qtma.be.model;

import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CourseInfo {
    private String instructorName;
    private String instructorEmail;
    private String officeHoursTime;
    private String officeHoursLocation;
    private String category;
    private String requiredResouces;
    private String attendanceAndLate;
    private String gradingPolicy;
    private String teachingAssistantInfo;

}
