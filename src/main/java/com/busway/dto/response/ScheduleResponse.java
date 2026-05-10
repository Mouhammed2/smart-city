package com.busway.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalTime;

@Data
@Builder
public class ScheduleResponse {
    private Long id;
    private Long routeId;
    private String routeName;
    private String routeNumber;
    private Long stopId;
    private String stopName;
    private String stopCode;
    private Integer dayOfWeek;
    private String dayName;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private Integer sequenceOrder;
    private Boolean isPeakHour;
    private String notes;
}