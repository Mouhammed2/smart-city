package com.busway.service;

import com.busway.dto.request.StopRequest;
import com.busway.dto.response.StopResponse;
import com.busway.entity.Stop;
import com.busway.exception.BusinessException;
import com.busway.exception.ResourceNotFoundException;
import com.busway.repository.StopRepository;
import com.busway.util.GeometryUtil;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StopService {

    private final StopRepository stopRepository;

    // ========== PUBLIC METHODS ==========

    @Transactional(readOnly = true)
    public List<StopResponse> getAllActiveStops() {
        return stopRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StopResponse getStopById(Long id) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forStop(id));
        return mapToResponse(stop);
    }

    @Transactional(readOnly = true)
    public StopResponse getStopByCode(String code) {
        Stop stop = stopRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Stop not found with code: " + code));
        return mapToResponse(stop);
    }

    @Transactional(readOnly = true)
    public List<StopResponse> findNearestStops(double latitude, double longitude, double radiusMeters) {
        Point point = GeometryUtil.createPoint(latitude, longitude);
        return stopRepository.findNearestStops(point, radiusMeters)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StopResponse> findTopNearestStops(double latitude, double longitude, int limit) {
        Point point = GeometryUtil.createPoint(latitude, longitude);
        return stopRepository.findTopNearestStops(point, limit)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StopResponse> findStopsInBoundingBox(double minLon, double minLat, double maxLon, double maxLat) {
        return stopRepository.findStopsInBoundingBox(minLon, minLat, maxLon, maxLat)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StopResponse> findStopsByCity(String city) {
        return stopRepository.findByCityIgnoreCase(city)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StopResponse> findAccessibleStops() {
        return stopRepository.findByWheelchairAccessibleTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StopResponse> findStopsWithShelter() {
        return stopRepository.findByHasShelterTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StopResponse> findStopsWithBench() {
        return stopRepository.findByHasBenchTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StopResponse> findStopsWithBothFacilities() {
        return stopRepository.findByHasShelterTrueAndHasBenchTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double calculateDistanceBetweenStops(Long stopId1, Long stopId2) {
        return stopRepository.calculateDistanceBetweenStops(stopId1, stopId2);
    }

    @Transactional(readOnly = true)
    public List<StopResponse> findStopsByRouteId(Long routeId) {
        return stopRepository.findStopsByRouteId(routeId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StopResponse> searchStopsByName(String name) {
        return stopRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StopResponse> findStopsByZone(String zone) {
        return stopRepository.findByZoneIgnoreCase(zone)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStopStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalActive", stopRepository.countByIsActiveTrue());
        stats.put("accessible", stopRepository.countByWheelchairAccessibleTrue());
        stats.put("withShelter", stopRepository.countByHasShelterTrue());
        stats.put("withBench", stopRepository.countByHasBenchTrue());
        stats.put("withBothFacilities", stopRepository.countByHasShelterTrueAndHasBenchTrue());
        return stats;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> exportAsGeoJSON() {
        List<Stop> stops = stopRepository.findByIsActiveTrue();
        List<Map<String, Object>> features = stops.stream()
                .map(stop -> {
                    Map<String, Object> feature = new HashMap<>();
                    feature.put("type", "Feature");
                    feature.put("properties", Map.of(
                            "id", stop.getId(),
                            "code", stop.getCode(),
                            "name", stop.getName()
                    ));
                    feature.put("geometry", stopRepository.getStopGeoJson(stop.getId()));
                    return feature;
                })
                .collect(Collectors.toList());

        Map<String, Object> geojson = new HashMap<>();
        geojson.put("type", "FeatureCollection");
        geojson.put("features", features);
        return geojson;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStopAsGeoJSON(Long id) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forStop(id));

        Map<String, Object> feature = new HashMap<>();
        feature.put("type", "Feature");
        feature.put("properties", Map.of(
                "id", stop.getId(),
                "code", stop.getCode(),
                "name", stop.getName()
        ));
        feature.put("geometry", stopRepository.getStopGeoJson(stop.getId()));
        return feature;
    }

    // ========== ADMIN METHODS ==========

    @Transactional
    public StopResponse createStop(StopRequest request) {
        if (stopRepository.findByCode(request.getCode()).isPresent()) {
            throw BusinessException.duplicateStopCode(request.getCode());
        }

        Stop stop = new Stop();
        updateStopFromRequest(stop, request);

        Stop savedStop = stopRepository.save(stop);
        return mapToResponse(savedStop);
    }

    @Transactional
    public StopResponse updateStop(Long id, StopRequest request) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forStop(id));

        if (!stop.getCode().equals(request.getCode())) {
            stopRepository.findByCode(request.getCode())
                    .ifPresent(s -> {
                        throw BusinessException.duplicateStopCode(request.getCode());
                    });
        }

        updateStopFromRequest(stop, request);
        Stop updatedStop = stopRepository.save(stop);
        return mapToResponse(updatedStop);
    }

    @Transactional
    public List<StopResponse> createStops(List<StopRequest> requests) {
        return requests.stream()
                .map(this::createStop)
                .collect(Collectors.toList());
    }

    @Transactional
    public StopResponse partialUpdateStop(Long id, Map<String, Object> updates) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forStop(id));

        if (updates.containsKey("name")) {
            stop.setName((String) updates.get("name"));
        }
        if (updates.containsKey("description")) {
            stop.setDescription((String) updates.get("description"));
        }
        if (updates.containsKey("address")) {
            stop.setAddress((String) updates.get("address"));
        }
        if (updates.containsKey("city")) {
            stop.setCity((String) updates.get("city"));
        }
        if (updates.containsKey("postalCode")) {
            stop.setPostalCode((String) updates.get("postalCode"));
        }
        if (updates.containsKey("zone")) {
            stop.setZone((String) updates.get("zone"));
        }
        if (updates.containsKey("hasShelter")) {
            stop.setHasShelter((Boolean) updates.get("hasShelter"));
        }
        if (updates.containsKey("hasBench")) {
            stop.setHasBench((Boolean) updates.get("hasBench"));
        }
        if (updates.containsKey("wheelchairAccessible")) {
            stop.setWheelchairAccessible((Boolean) updates.get("wheelchairAccessible"));
        }
        if (updates.containsKey("isActive")) {
            stop.setIsActive((Boolean) updates.get("isActive"));
        }

        stop.setUpdatedAt(LocalDateTime.now());
        Stop updatedStop = stopRepository.save(stop);
        return mapToResponse(updatedStop);
    }

    @Transactional
    public StopResponse updateStopLocation(Long id, double lat, double lng) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forStop(id));

        Point point = GeometryUtil.createPoint(lat, lng);
        stop.setLocation(point);
        stop.setUpdatedAt(LocalDateTime.now());

        Stop updatedStop = stopRepository.save(stop);
        return mapToResponse(updatedStop);
    }

    @Transactional
    public StopResponse toggleStopStatus(Long id) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forStop(id));

        stop.setIsActive(!stop.getIsActive());
        stop.setUpdatedAt(LocalDateTime.now());

        Stop updatedStop = stopRepository.save(stop);
        return mapToResponse(updatedStop);
    }

    @Transactional
    public void deleteStop(Long id) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forStop(id));

        stop.setIsActive(false);
        stop.setUpdatedAt(LocalDateTime.now());
        stopRepository.save(stop);
    }

    @Transactional
    public void hardDeleteStop(Long id) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forStop(id));
        stopRepository.delete(stop);
    }

    @Transactional
    public void deleteStops(List<Long> ids) {
        ids.forEach(this::deleteStop);
    }

    // ========== HELPER METHODS ==========

    private void updateStopFromRequest(Stop stop, StopRequest request) {
        stop.setCode(request.getCode());
        stop.setName(request.getName());
        stop.setDescription(request.getDescription());
        stop.setLocation(request.getLocation());
        stop.setAddress(request.getAddress());
        stop.setCity(request.getCity());
        stop.setPostalCode(request.getPostalCode());
        stop.setZone(request.getZone());
        stop.setHasShelter(request.getHasShelter() != null ? request.getHasShelter() : false);
        stop.setHasBench(request.getHasBench() != null ? request.getHasBench() : false);
        stop.setWheelchairAccessible(request.getWheelchairAccessible() != null ?
                request.getWheelchairAccessible() : true);
        stop.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        stop.setUpdatedAt(LocalDateTime.now());
    }

    private StopResponse mapToResponse(Stop stop) {
        return StopResponse.builder()
                .id(stop.getId())
                .code(stop.getCode())
                .name(stop.getName())
                .description(stop.getDescription())
                // .location(stop.getLocation()) // Removed - using locationGeoJson instead
                .locationGeoJson(stopRepository.getStopGeoJson(stop.getId()))
                .latitude(stop.getLocation() != null ? stop.getLocation().getY() : null)
                .longitude(stop.getLocation() != null ? stop.getLocation().getX() : null)
                .address(stop.getAddress())
                .city(stop.getCity())
                .postalCode(stop.getPostalCode())
                .zone(stop.getZone())
                .hasShelter(stop.getHasShelter())
                .hasBench(stop.getHasBench())
                .wheelchairAccessible(stop.getWheelchairAccessible())
                .isActive(stop.getIsActive())
                .routeNames(stop.getRouteStops().stream()
                        .map(rs -> rs.getRoute().getName())
                        .collect(Collectors.toList()))
                .createdAt(stop.getCreatedAt())
                .updatedAt(stop.getUpdatedAt())
                .build();
    }
}
