package com.busway.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stops")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * PostGIS Point geometry for the stop location
     * SRID 4326 = WGS84 (standard GPS coordinates)
     */
    @Column(columnDefinition = "geometry(POINT, 4326)", nullable = false)
    private Point location;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(length = 50)
    private String zone;

    @Column(name = "has_shelter")
    private Boolean hasShelter = false;

    @Column(name = "has_bench")
    private Boolean hasBench = false;

    @Column(name = "wheelchair_accessible")
    private Boolean wheelchairAccessible = true;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "stop", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<RouteStop> routeStops = new ArrayList<>();

    @OneToMany(mappedBy = "stop", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Schedule> schedules = new ArrayList<>();

    @OneToMany(mappedBy = "nextStop")
    @JsonIgnore
    private List<Bus> busesAtStop = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}