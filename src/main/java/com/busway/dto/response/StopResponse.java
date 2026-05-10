package com.busway.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;
import org.locationtech.jts.geom.Point;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class StopResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    
    @JsonIgnore
    private Point location;
    
    private String locationGeoJson;
    private Double latitude;
    private Double longitude;
    private String address;
    private String city;
    private String postalCode;
    private String zone;
    private Boolean hasShelter;
    private Boolean hasBench;
    private Boolean wheelchairAccessible;
    private Boolean isActive;
    private List<String> routeNames;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}