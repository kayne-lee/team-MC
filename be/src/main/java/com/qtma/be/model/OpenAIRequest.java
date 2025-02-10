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
public class OpenAIRequest {
    
    public String input;
    public String prompt;
  
}
