package com.busway;

import com.busway.dto.request.StopRequest;
import com.busway.dto.response.ApiResponse;
import com.busway.dto.response.StopResponse;
import com.busway.service.StopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/busway/stops")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StopController {

    private final StopService stopService;

    // ========== GET METHODS ==========

    @GetMapping
    public ResponseEntity<ApiResponse<List<StopResponse>>> getAllStops() {
        List<StopResponse> stops = stopService.getAllActiveStops();
        return ResponseEntity.ok(ApiResponse.success("Stops retrieved successfully", stops));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StopResponse>> getStopById(@PathVariable Long id) {
        StopResponse stop = stopService.getStopById(id);
        return ResponseEntity.ok(ApiResponse.success("Stop retrieved successfully", stop));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<StopResponse>> getStopByCode(@PathVariable String code) {
        StopResponse stop = stopService.getStopByCode(code);
        return ResponseEntity.ok(ApiResponse.success("Stop retrieved successfully", stop));
    }

    @GetMapping("/nearest")
    public ResponseEntity<ApiResponse<List<StopResponse>>> findNearestStops(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "500") double radius) {
        List<StopResponse> stops = stopService.findNearestStops(lat, lng, radius);
        return ResponseEntity.ok(ApiResponse.success("Nearest stops found", stops));
    }

    @GetMapping("/top-nearest")
    public ResponseEntity<ApiResponse<List<StopResponse>>> findTopNearestStops(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") int limit) {
        List<StopResponse> stops = stopService.findTopNearestStops(lat, lng, limit);
        return ResponseEntity.ok(ApiResponse.success("Top nearest stops found", stops));
    }

    @GetMapping("/bbox")
    public ResponseEntity<ApiResponse<List<StopResponse>>> findStopsInBoundingBox(
            @RequestParam double minLon,
            @RequestParam double minLat,
            @RequestParam double maxLon,
            @RequestParam double maxLat) {
        List<StopResponse> stops = stopService.findStopsInBoundingBox(minLon, minLat, maxLon, maxLat);
        return ResponseEntity.ok(ApiResponse.success("Stops in bounding box found", stops));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<ApiResponse<List<StopResponse>>> getStopsByCity(@PathVariable String city) {
        List<StopResponse> stops = stopService.findStopsByCity(city);
        return ResponseEntity.ok(ApiResponse.success("Stops in " + city + " retrieved", stops));
    }

    @GetMapping("/accessible")
    public ResponseEntity<ApiResponse<List<StopResponse>>> getAccessibleStops() {
        List<StopResponse> stops = stopService.findAccessibleStops();
        return ResponseEntity.ok(ApiResponse.success("Accessible stops retrieved", stops));
    }

    @GetMapping("/with-shelter")
    public ResponseEntity<ApiResponse<List<StopResponse>>> getStopsWithShelter() {
        List<StopResponse> stops = stopService.findStopsWithShelter();
        return ResponseEntity.ok(ApiResponse.success("Stops with shelter retrieved", stops));
    }

    @GetMapping("/with-bench")
    public ResponseEntity<ApiResponse<List<StopResponse>>> getStopsWithBench() {
        List<StopResponse> stops = stopService.findStopsWithBench();
        return ResponseEntity.ok(ApiResponse.success("Stops with bench retrieved", stops));
    }

    @GetMapping("/with-facilities")
    public ResponseEntity<ApiResponse<List<StopResponse>>> getStopsWithBothFacilities() {
        List<StopResponse> stops = stopService.findStopsWithBothFacilities();
        return ResponseEntity.ok(ApiResponse.success("Stops with facilities retrieved", stops));
    }

    @GetMapping("/distance")
    public ResponseEntity<ApiResponse<Double>> calculateDistanceBetweenStops(
            @RequestParam Long stopId1,
            @RequestParam Long stopId2) {
        Double distance = stopService.calculateDistanceBetweenStops(stopId1, stopId2);
        return ResponseEntity.ok(ApiResponse.success("Distance calculated successfully", distance));
    }

    @GetMapping("/route/{routeId}")
    public ResponseEntity<ApiResponse<List<StopResponse>>> getStopsByRoute(@PathVariable Long routeId) {
        List<StopResponse> stops = stopService.findStopsByRouteId(routeId);
        return ResponseEntity.ok(ApiResponse.success("Stops on route retrieved", stops));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<StopResponse>>> searchStopsByName(@RequestParam String q) {
        List<StopResponse> stops = stopService.searchStopsByName(q);
        return ResponseEntity.ok(ApiResponse.success("Search results", stops));
    }

    @GetMapping("/zone/{zone}")
    public ResponseEntity<ApiResponse<List<StopResponse>>> getStopsByZone(@PathVariable String zone) {
        List<StopResponse> stops = stopService.findStopsByZone(zone);
        return ResponseEntity.ok(ApiResponse.success("Stops in zone " + zone + " retrieved", stops));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStopStatistics() {
        Map<String, Object> stats = stopService.getStopStatistics();
        return ResponseEntity.ok(ApiResponse.success("Statistics retrieved", stats));
    }

    @GetMapping("/geojson")
    public ResponseEntity<Map<String, Object>> exportStopsAsGeoJSON() {
        Map<String, Object> geojson = stopService.exportAsGeoJSON();
        return ResponseEntity.ok(geojson);
    }

    @GetMapping("/{id}/geojson")
    public ResponseEntity<Map<String, Object>> getStopAsGeoJSON(@PathVariable Long id) {
        Map<String, Object> geojson = stopService.getStopAsGeoJSON(id);
        return ResponseEntity.ok(geojson);
    }

    // ========== POST METHODS ==========

    @PostMapping
    public ResponseEntity<ApiResponse<StopResponse>> createStop(@Valid @RequestBody StopRequest request) {
        StopResponse created = stopService.createStop(request);
        return new ResponseEntity<>(ApiResponse.success("Stop created successfully", created), HttpStatus.CREATED);
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<StopResponse>>> createStops(@Valid @RequestBody List<StopRequest> requests) {
        List<StopResponse> created = stopService.createStops(requests);
        return new ResponseEntity<>(ApiResponse.success("Stops created successfully", created), HttpStatus.CREATED);
    }

    // ========== PUT METHODS ==========

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StopResponse>> updateStop(
            @PathVariable Long id,
            @Valid @RequestBody StopRequest request) {
        StopResponse updated = stopService.updateStop(id, request);
        return ResponseEntity.ok(ApiResponse.success("Stop updated successfully", updated));
    }

    // ========== PATCH METHODS ==========

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<StopResponse>> partialUpdateStop(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        StopResponse updated = stopService.partialUpdateStop(id, updates);
        return ResponseEntity.ok(ApiResponse.success("Stop partially updated", updated));
    }

    @PatchMapping("/{id}/location")
    public ResponseEntity<ApiResponse<StopResponse>> updateStopLocation(
            @PathVariable Long id,
            @RequestParam double lat,
            @RequestParam double lng) {
        StopResponse updated = stopService.updateStopLocation(id, lat, lng);
        return ResponseEntity.ok(ApiResponse.success("Stop location updated", updated));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<StopResponse>> toggleStopStatus(@PathVariable Long id) {
        StopResponse updated = stopService.toggleStopStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Stop status toggled", updated));
    }

    // ========== DELETE METHODS ==========

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStop(@PathVariable Long id) {
        stopService.deleteStop(id);
        return ResponseEntity.ok(ApiResponse.success("Stop deleted successfully", null));
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDeleteStop(@PathVariable Long id) {
        stopService.hardDeleteStop(id);
        return ResponseEntity.ok(ApiResponse.success("Stop permanently deleted", null));
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse<Void>> deleteStops(@RequestParam List<Long> ids) {
        stopService.deleteStops(ids);
        return ResponseEntity.ok(ApiResponse.success("Stops deleted successfully", null));
    }
}