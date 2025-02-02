package com.qtma.be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BeApplication {

	public static void main(String[] args) {
		System.out.println("Application has started successfully! ish");
		SpringApplication.run(BeApplication.class, args);
	}

}
