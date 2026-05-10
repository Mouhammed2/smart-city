package com.busway.service;

import com.busway.dto.request.RouteRequest;
import com.busway.dto.response.RouteResponse;
import com.busway.entity.Route;
import com.busway.exception.BusinessException;
import com.busway.exception.ResourceNotFoundException;
import com.busway.repository.RouteRepository;
import com.busway.repository.RouteStopRepository;
import com.busway.util.GeometryUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ========== PUBLIC METHODS ==========

    /**
     * Get all active routes
     */
    @Transactional(readOnly = true)
    public List<RouteResponse> getAllActiveRoutes() {
        return routeRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get route by ID
     */
    @Transactional(readOnly = true)
    public RouteResponse getRouteById(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forRoute(id));
        return mapToResponse(route);
    }

    /**
     * Get route by route number
     */
    @Transactional(readOnly = true)
    public RouteResponse getRouteByNumber(String routeNumber) {
        Route route = routeRepository.findByRouteNumber(routeNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with number: " + routeNumber));
        return mapToResponse(route);
    }

    /**
     * Search routes by name
     */
    @Transactional(readOnly = true)
    public List<RouteResponse> searchRoutesByName(String query) {
        return routeRepository.findByNameContainingIgnoreCase(query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Find nearest routes to a point
     */
    @Transactional(readOnly = true)
    public List<RouteResponse> findNearestRoutes(double latitude, double longitude, double radiusMeters) {
        Point point = GeometryUtil.createPoint(latitude, longitude);
        return routeRepository.findRoutesNearPoint(point, radiusMeters)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Find routes in bounding box (for map view)
     */
    @Transactional(readOnly = true)
    public List<RouteResponse> findRoutesInBoundingBox(
            double minLon, double minLat, double maxLon, double maxLat) {
        return routeRepository.findRoutesInBoundingBox(minLon, minLat, maxLon, maxLat)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get route length in kilometers
     */
    @Transactional(readOnly = true)
    public Double getRouteLength(Long routeId) {
        if (!routeRepository.existsById(routeId)) {
            throw ResourceNotFoundException.forRoute(routeId);
        }
        Double lengthInMeters = routeRepository.calculateRouteLength(routeId);
        return lengthInMeters != null ? lengthInMeters / 1000.0 : null; // Convert to km
    }

    /**
     * Get connecting routes (for transfers)
     */
    @Transactional(readOnly = true)
    public List<RouteResponse> getConnectingRoutes(Long routeId) {
        if (!routeRepository.existsById(routeId)) {
            throw ResourceNotFoundException.forRoute(routeId);
        }
        return routeRepository.findConnectingRoutes(routeId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ========== ADMIN METHODS ==========

    /**
     * Create new route
     */
    @Transactional
    public RouteResponse createRoute(RouteRequest request) {
        // Check if route number already exists
        if (routeRepository.findByRouteNumber(request.getRouteNumber()).isPresent()) {
            throw BusinessException.duplicateRouteNumber(request.getRouteNumber());
        }

        Route route = new Route();
        updateRouteFromRequest(route, request);

        Route savedRoute = routeRepository.save(route);
        return mapToResponse(savedRoute);
    }

    /**
     * Update existing route
     */
    @Transactional
    public RouteResponse updateRoute(Long id, RouteRequest request) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forRoute(id));

        // Check if new route number conflicts with existing route
        if (!route.getRouteNumber().equals(request.getRouteNumber())) {
            routeRepository.findByRouteNumber(request.getRouteNumber())
                    .ifPresent(r -> {
                        throw BusinessException.duplicateRouteNumber(request.getRouteNumber());
                    });
        }

        updateRouteFromRequest(route, request);
        Route updatedRoute = routeRepository.save(route);
        return mapToResponse(updatedRoute);
    }

    /**
     * Delete route (soft delete)
     */
    @Transactional
    public void deleteRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forRoute(id));

        // Soft delete - just mark as inactive
        route.setIsActive(false);
        routeRepository.save(route);
    }

    /**
     * Hard delete (only for testing)
     */
    @Transactional
    public void hardDeleteRoute(Long id) {
        if (!routeRepository.existsById(id)) {
            throw ResourceNotFoundException.forRoute(id);
        }
        routeRepository.deleteById(id);
    }

    // ========== HELPER METHODS ==========

    private void updateRouteFromRequest(Route route, RouteRequest request) {
        route.setRouteNumber(request.getRouteNumber());
        route.setName(request.getName());
        route.setDescription(request.getDescription());
        // Convert WKT string to LineString
        route.setGeometry(GeometryUtil.parseWktLineString(request.getGeometry()));
        route.setTotalDistance(request.getTotalDistance());

        if (request.getEstimatedDuration() != null) {
            route.setEstimatedDuration(java.time.Duration.parse(request.getEstimatedDuration()));
        }

        if (request.getDirection() != null) {
            route.setDirection(Route.Direction.valueOf(request.getDirection()));
        }

        route.setIsActive(request.getIsActive());
        route.setColor(request.getColor());
    }

    private Map<String, Object> parseGeoJson(String geoJson) {
        try {
            if (geoJson == null) return null;
            return objectMapper.readValue(geoJson, Map.class);
        } catch (Exception e) {
            return null;
        }
    }

    private RouteResponse mapToResponse(Route route) {
        Integer stopCount = routeStopRepository.findByRouteIdOrderBySequenceOrderAsc(route.getId()).size();

        return RouteResponse.builder()
                .id(route.getId())
                .routeNumber(route.getRouteNumber())
                .name(route.getName())
                .description(route.getDescription())
                .geometry(parseGeoJson(routeRepository.getRouteGeoJson(route.getId())))
                .totalDistance(route.getTotalDistance())
                .estimatedDuration(route.getEstimatedDuration() != null ?
                        route.getEstimatedDuration().toString() : null)
                .direction(route.getDirection() != null ? route.getDirection().name() : null)
                .isActive(route.getIsActive())
                .color(route.getColor())
                .stopCount(stopCount)
                .stopNames(route.getRouteStops().stream()
                        .limit(5)
                        .map(rs -> rs.getStop().getName())
                        .collect(Collectors.toList()))
                .createdAt(route.getCreatedAt())
                .updatedAt(route.getUpdatedAt())
                .build();
    }
}