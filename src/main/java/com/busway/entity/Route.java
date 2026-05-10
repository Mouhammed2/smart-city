package com.busway.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.LineString;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "route_number", unique = true, nullable = false, length = 20)
    private String routeNumber;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * PostGIS LineString geometry for the route path
     * SRID 4326 = WGS84 (standard GPS coordinates)
     */
    @Column(columnDefinition = "geometry(LINESTRING, 4326)", nullable = false)
    private LineString geometry;

    @Column(name = "total_distance")
    private Double totalDistance; // in kilometers

    @Column(name = "estimated_duration")
    private Duration estimatedDuration;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Direction direction;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(length = 7)
    private String color = "#3366CC";

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Bus> buses = new ArrayList<>();

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<RouteStop> routeStops = new ArrayList<>();

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Schedule> schedules = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Direction {
        FORWARD, BACKWARD, BIDIRECTIONAL
    }
}