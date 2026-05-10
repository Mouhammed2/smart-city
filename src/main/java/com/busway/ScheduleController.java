package com.busway;

import com.busway.dto.request.ScheduleRequest;
import com.busway.dto.response.ApiResponse;
import com.busway.dto.response.ScheduleResponse;
import com.busway.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/busway/schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ScheduleController {

    private final ScheduleService scheduleService;

    // ========== GET METHODS ==========

    @GetMapping("/route/{routeId}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedulesByRoute(@PathVariable Long routeId) {
        List<ScheduleResponse> schedules = scheduleService.getSchedulesByRoute(routeId);
        return ResponseEntity.ok(ApiResponse.success("Schedules retrieved successfully", schedules));
    }

    @GetMapping("/stop/{stopId}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedulesByStop(@PathVariable Long stopId) {
        List<ScheduleResponse> schedules = scheduleService.getSchedulesByStop(stopId);
        return ResponseEntity.ok(ApiResponse.success("Schedules retrieved successfully", schedules));
    }

    @GetMapping("/route/{routeId}/day/{day}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedulesByRouteAndDay(
            @PathVariable Long routeId,
            @PathVariable Integer day) {
        List<ScheduleResponse> schedules = scheduleService.getSchedulesByRouteAndDay(routeId, day);
        return ResponseEntity.ok(ApiResponse.success("Schedules retrieved successfully", schedules));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getUpcomingDepartures(
            @RequestParam Long stopId,
            @RequestParam Integer dayOfWeek,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime currentTime) {
        List<ScheduleResponse> schedules = scheduleService.getUpcomingDepartures(stopId, dayOfWeek, currentTime);
        return ResponseEntity.ok(ApiResponse.success("Upcoming departures retrieved", schedules));
    }

    @GetMapping("/between-stops")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getScheduleBetweenStops(
            @RequestParam Long routeId,
            @RequestParam Long fromStopId,
            @RequestParam Long toStopId) {
        List<ScheduleResponse> schedules = scheduleService.getScheduleBetweenStops(routeId, fromStopId, toStopId);
        return ResponseEntity.ok(ApiResponse.success("Schedule retrieved successfully", schedules));
    }

    // ========== POST METHODS ==========

    @PostMapping
    public ResponseEntity<ApiResponse<ScheduleResponse>> createSchedule(@Valid @RequestBody ScheduleRequest request) {
        ScheduleResponse created = scheduleService.createSchedule(request);
        return new ResponseEntity<>(ApiResponse.success("Schedule created successfully", created), HttpStatus.CREATED);
    }

    // ========== PUT METHODS ==========

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody ScheduleRequest request) {
        ScheduleResponse updated = scheduleService.updateSchedule(id, request);
        return ResponseEntity.ok(ApiResponse.success("Schedule updated successfully", updated));
    }

    // ========== DELETE METHODS ==========

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("Schedule deleted successfully", null));
    }
}