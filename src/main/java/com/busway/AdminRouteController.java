package com.busway;

import com.busway.dto.request.RouteRequest;
import com.busway.dto.response.ApiResponse;
import com.busway.dto.response.RouteResponse;
import com.busway.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/busway/admin/routes")
public class AdminRouteController {

    private final RouteService routeService;

    public AdminRouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(
            @Valid @RequestBody RouteRequest request,
            @RequestAttribute(value = "userId", required = false) String userId,
            @RequestAttribute(value = "userRole", required = false) String userRole) {

        // You can use userId for auditing (who created this)
        RouteResponse created = routeService.createRoute(request);
        return ResponseEntity.ok(ApiResponse.success("Route created by user " + userId, created));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(
            @PathVariable Long id,
            @RequestAttribute("userId") String userId) {

        routeService.deleteRoute(id);
        return ResponseEntity.ok(ApiResponse.success("Route deleted by admin " + userId, null));
    }
}