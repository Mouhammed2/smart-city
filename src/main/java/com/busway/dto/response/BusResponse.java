package com.busway.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;
import org.locationtech.jts.geom.Point;
import java.time.LocalDateTime;

@Data
@Builder
public class BusResponse {
    private Long id;
    private String busNumber;
    private String licensePlate;
    
    @JsonIgnore
    private Point currentLocation;
    
    private String locationGeoJson;
    private Double latitude;
    private Double longitude;
    private String status;
    private Double currentSpeed;
    private Double direction;
    private Long routeId;
    private String routeName;
    private String routeNumber;
    private Integer capacity;
    private Integer currentPassengers;
    private Integer occupancyPercentage;
    private String occupancyStatus; // AVAILABLE, BUSY, FULL
    private Long nextStopId;
    private String nextStopName;
    private LocalDateTime estimatedArrival;
    private LocalDateTime lastUpdate;
}