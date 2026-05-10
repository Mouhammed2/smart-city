package com.busway.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalTime;

@Data
public class ScheduleRequest {

    @NotNull(message = "Route ID is required")
    private Long routeId;

    @NotNull(message = "Stop ID is required")
    private Long stopId;

    @NotNull(message = "Day of week is required")
    private Integer dayOfWeek; // 0=Sunday, 1=Monday, ..., 6=Saturday

    @NotNull(message = "Departure time is required")
    private LocalTime departureTime;

    @NotNull(message = "Arrival time is required")
    private LocalTime arrivalTime;

    @NotNull(message = "Sequence order is required")
    private Integer sequenceOrder;

    private Boolean isPeakHour = false;
    private String notes;
}