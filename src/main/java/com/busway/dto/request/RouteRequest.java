package com.busway.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.locationtech.jts.geom.LineString;

@Data
public class RouteRequest {

    @NotBlank(message = "Route number is required")
    private String routeNumber;

    @NotBlank(message = "Route name is required")
    private String name;

    private String description;

    @NotBlank(message = "Route geometry is required")
    private String geometry;

    private Double totalDistance;

    private String estimatedDuration;

    @Pattern(regexp = "FORWARD|BACKWARD|BIDIRECTIONAL",
            message = "Direction must be FORWARD, BACKWARD, or BIDIRECTIONAL")
    private String direction;

    private Boolean isActive = true;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
            message = "Color must be a valid hex color (e.g., #3366CC)")
    private String color = "#3366CC";
}