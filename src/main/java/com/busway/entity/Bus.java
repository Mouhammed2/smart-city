package com.busway.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;

@Entity
@Table(name = "buses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_number", unique = true, nullable = false, length = 20)
    private String busNumber;

    @Column(name = "license_plate", unique = true, nullable = false, length = 20)
    private String licensePlate;

    /**
     * PostGIS Point geometry for current bus location
     * SRID 4326 = WGS84
     */
    @Column(name = "current_location", columnDefinition = "geometry(POINT, 4326)")
    private Point currentLocation;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status = Status.INACTIVE;

    @Column(name = "current_speed")
    private Double currentSpeed; // km/h


    private Double direction; // degrees 0-360

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    @JsonIgnore
    private Route route;

    @Column
    private Integer capacity = 50;

    @Column(name = "current_passengers")
    private Integer currentPassengers = 0;

    @Column(name = "last_update")
    private LocalDateTime lastUpdate = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "next_stop_id")
    @JsonIgnore
    private Stop nextStop;

    @Column(name = "estimated_arrival")
    private LocalDateTime estimatedArrival;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Status {
        ACTIVE, INACTIVE, MAINTENANCE
    }

    @PreUpdate
    @PrePersist
    public void updateTimestamp() {
        lastUpdate = LocalDateTime.now();
    }
}