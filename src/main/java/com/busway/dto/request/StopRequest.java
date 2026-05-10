package com.busway.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.locationtech.jts.geom.Point;

@Data
public class StopRequest {

    @NotBlank(message = "Stop code is required")
    private String code;

    @NotBlank(message = "Stop name is required")
    private String name;

    private String description;

    @NotNull(message = "Location is required")
    private Point location;

    private String address;
    private String city;
    private String postalCode;
    private String zone;
    private Boolean hasShelter = false;
    private Boolean hasBench = false;
    private Boolean wheelchairAccessible = true;
    private Boolean isActive = true;
}