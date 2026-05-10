package com.busway;

import com.busway.dto.request.BusRequest;
import com.busway.dto.response.ApiResponse;
import com.busway.dto.response.BusResponse;
import com.busway.service.BusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/busway/buses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BusController {

    private final BusService busService;

    // ========== GET METHODS ==========

    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllBuses() {
        List<BusResponse> buses = busService.getAllActiveBuses();
        return ResponseEntity.ok(ApiResponse.success("Buses retrieved successfully", buses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BusResponse>> getBusById(@PathVariable Long id) {
        BusResponse bus = busService.getBusById(id);
        return ResponseEntity.ok(ApiResponse.success("Bus retrieved successfully", bus));
    }

    @GetMapping("/number/{busNumber}")
    public ResponseEntity<ApiResponse<BusResponse>> getBusByNumber(@PathVariable String busNumber) {
        BusResponse bus = busService.getBusByNumber(busNumber);
        return ResponseEntity.ok(ApiResponse.success("Bus retrieved successfully", bus));
    }

    @GetMapping("/nearest")
    public ResponseEntity<ApiResponse<List<BusResponse>>> findNearestBuses(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "2000") double radius) {
        List<BusResponse> buses = busService.findNearestBuses(lat, lng, radius);
        return ResponseEntity.ok(ApiResponse.success("Nearest buses found", buses));
    }

    @GetMapping("/top-nearest")
    public ResponseEntity<ApiResponse<List<BusResponse>>> findTopNearestBuses(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") int limit) {
        List<BusResponse> buses = busService.findTopNearestBuses(lat, lng, limit);
        return ResponseEntity.ok(ApiResponse.success("Top nearest buses found", buses));
    }

    @GetMapping("/route/{routeId}")
    public ResponseEntity<ApiResponse<List<BusResponse>>> getBusesOnRoute(@PathVariable Long routeId) {
        List<BusResponse> buses = busService.getBusesOnRoute(routeId);
        return ResponseEntity.ok(ApiResponse.success("Buses on route retrieved", buses));
    }

    @GetMapping("/heading-to-stop/{stopId}")
    public ResponseEntity<ApiResponse<List<BusResponse>>> getBusesHeadingToStop(@PathVariable Long stopId) {
        List<BusResponse> buses = busService.getBusesHeadingToStop(stopId);
        return ResponseEntity.ok(ApiResponse.success("Buses heading to stop retrieved", buses));
    }

    @GetMapping("/approaching/{stopId}")
    public ResponseEntity<ApiResponse<List<BusResponse>>> getBusesApproachingStop(@PathVariable Long stopId) {
        List<BusResponse> buses = busService.getBusesApproachingStop(stopId);
        return ResponseEntity.ok(ApiResponse.success("Buses approaching stop retrieved", buses));
    }

    // ========== POST METHODS ==========

    @PostMapping
    public ResponseEntity<ApiResponse<BusResponse>> createBus(@Valid @RequestBody BusRequest request) {
        BusResponse created = busService.createBus(request);
        return new ResponseEntity<>(ApiResponse.success("Bus created successfully", created), HttpStatus.CREATED);
    }

    // ========== PUT METHODS ==========

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BusResponse>> updateBus(
            @PathVariable Long id,
            @Valid @RequestBody BusRequest request) {
        BusResponse updated = busService.updateBus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Bus updated successfully", updated));
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<ApiResponse<BusResponse>> updateBusLocation(
            @PathVariable Long id,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(required = false) Double speed,
            @RequestParam(required = false) Double direction) {
        BusResponse updated = busService.updateBusLocation(id, lat, lng, speed, direction);
        return ResponseEntity.ok(ApiResponse.success("Bus location updated", updated));
    }

    @PutMapping("/{id}/occupancy")
    public ResponseEntity<ApiResponse<BusResponse>> updateBusOccupancy(
            @PathVariable Long id,
            @RequestParam int passengers) {
        BusResponse updated = busService.updateBusOccupancy(id, passengers);
        return ResponseEntity.ok(ApiResponse.success("Bus occupancy updated", updated));
    }

    @PutMapping("/{id}/next-stop/{stopId}")
    public ResponseEntity<ApiResponse<BusResponse>> updateBusNextStop(
            @PathVariable Long id,
            @PathVariable Long stopId) {
        BusResponse updated = busService.updateBusNextStop(id, stopId);
        return ResponseEntity.ok(ApiResponse.success("Bus next stop updated", updated));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BusResponse>> changeBusStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        BusResponse updated = busService.changeBusStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Bus status changed to " + status, updated));
    }

    // ========== DELETE METHODS ==========

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.ok(ApiResponse.success("Bus deleted successfully", null));
    }
}