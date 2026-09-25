package com.Taller.Mecanico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MecanicoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MecanicoApplication.class, args);
	}

}
