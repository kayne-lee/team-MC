package com.qtma.be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // Enables scheduling of tasks
public class BeApplication {

    public static void main(String[] args) {
        System.out.println("Application has started successfully!");
        SpringApplication.run(BeApplication.class, args);
    }
}
