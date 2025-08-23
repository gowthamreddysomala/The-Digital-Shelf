package com.thedigitalshelf.books;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
public class TheDigitalShelfApplication {

	public static void main(String[] args) {
		SpringApplication.run(TheDigitalShelfApplication.class, args);
	}

}
