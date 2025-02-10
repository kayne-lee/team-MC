package com.qtma.be.model;

import lombok.*;

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

}
