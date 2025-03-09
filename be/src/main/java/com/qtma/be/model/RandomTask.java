package com.qtma.be.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RandomTask {
    
    public String title;
    public String dueDate;
    public String description;
    private String notes;
    private boolean completed;
}
