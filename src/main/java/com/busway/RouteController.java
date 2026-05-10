package com.busway;

import com.busway.dto.request.RouteRequest;
import com.busway.dto.response.ApiResponse;
import com.busway.dto.response.RouteResponse;
import com.busway.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/busway/routes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RouteController {

    private final RouteService routeService;

    // ========== GET METHODS ==========

    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAllRoutes() {
        List<RouteResponse> routes = routeService.getAllActiveRoutes();
        return ResponseEntity.ok(ApiResponse.success("Routes retrieved successfully", routes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteById(@PathVariable Long id) {
        RouteResponse route = routeService.getRouteById(id);
        return ResponseEntity.ok(ApiResponse.success("Route retrieved successfully", route));
    }

    @GetMapping("/number/{routeNumber}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteByNumber(@PathVariable String routeNumber) {
        RouteResponse route = routeService.getRouteByNumber(routeNumber);
        return ResponseEntity.ok(ApiResponse.success("Route retrieved successfully", route));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> searchRoutes(@RequestParam String q) {
        List<RouteResponse> routes = routeService.searchRoutesByName(q);
        return ResponseEntity.ok(ApiResponse.success("Search results", routes));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> findNearbyRoutes(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1000") double radius) {
        List<RouteResponse> routes = routeService.findNearestRoutes(lat, lng, radius);
        return ResponseEntity.ok(ApiResponse.success("Nearby routes found", routes));
    }

    @GetMapping("/bbox")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> findRoutesInBoundingBox(
            @RequestParam double minLon,
            @RequestParam double minLat,
            @RequestParam double maxLon,
            @RequestParam double maxLat) {
        List<RouteResponse> routes = routeService.findRoutesInBoundingBox(minLon, minLat, maxLon, maxLat);
        return ResponseEntity.ok(ApiResponse.success("Routes in bounding box found", routes));
    }

    @GetMapping("/{id}/length")
    public ResponseEntity<ApiResponse<Double>> getRouteLength(@PathVariable Long id) {
        Double length = routeService.getRouteLength(id);
        return ResponseEntity.ok(ApiResponse.success("Route length in kilometers", length));
    }

    @GetMapping("/{id}/connections")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getConnectingRoutes(@PathVariable Long id) {
        List<RouteResponse> connections = routeService.getConnectingRoutes(id);
        return ResponseEntity.ok(ApiResponse.success("Connecting routes found", connections));
    }

    // ========== POST METHODS ==========

    @PostMapping
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(@Valid @RequestBody RouteRequest request) {
        RouteResponse created = routeService.createRoute(request);
        return new ResponseEntity<>(ApiResponse.success("Route created successfully", created), HttpStatus.CREATED);
    }

    // ========== PUT METHODS ==========

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> updateRoute(
            @PathVariable Long id,
            @Valid @RequestBody RouteRequest request) {
        RouteResponse updated = routeService.updateRoute(id, request);
        return ResponseEntity.ok(ApiResponse.success("Route updated successfully", updated));
    }

    // ========== DELETE METHODS ==========

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok(ApiResponse.success("Route deleted successfully", null));
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDeleteRoute(@PathVariable Long id) {
        routeService.hardDeleteRoute(id);
        return ResponseEntity.ok(ApiResponse.success("Route permanently deleted", null));
    }
}