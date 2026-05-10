package com.busway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootApplication
public class BuswayApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(BuswayApplication.class, args);

        System.out.println("==========================================");
        System.out.println("🚌 BusWay GIS Microservice Started!");
        System.out.println("📊 Connected to PostgreSQL + PostGIS");
        System.out.println("==========================================");

        // DEBUG: Print all registered endpoints
        RequestMappingHandlerMapping mapping = context.getBean(RequestMappingHandlerMapping.class);
        mapping.getHandlerMethods().forEach((key, value) -> {
            System.out.println("✅ ENDPOINT: " + key + " -> " + value);
        });

        System.out.println("==========================================");
    }
}