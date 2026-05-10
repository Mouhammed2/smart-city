package com.busway.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.locationtech.jts.geom.Point;

@Data
public class BusRequest {

    @NotBlank(message = "Bus number is required")
    private String busNumber;

    @NotBlank(message = "License plate is required")
    private String licensePlate;

    private Point currentLocation;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "ACTIVE|INACTIVE|MAINTENANCE")
    private String status = "INACTIVE";

    private Double currentSpeed;
    private Double direction;
    private Long routeId;
    private Integer capacity = 50;
    private Integer currentPassengers = 0;
    private Long nextStopId;
}