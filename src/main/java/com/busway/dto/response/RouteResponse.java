package com.busway.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class RouteResponse {
    private Long id;
    private String routeNumber;
    private String name;
    private String description;
    
    private Map<String, Object> geometry; // GeoJSON object for frontend mapping
    
    private Double totalDistance;
    private String estimatedDuration;
    private String direction;
    private Boolean isActive;
    private String color;
    private Integer stopCount;
    private List<String> stopNames;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}