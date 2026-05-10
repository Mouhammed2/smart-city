package com.busway.service;

import com.busway.dto.request.BusRequest;
import com.busway.dto.response.BusResponse;
import com.busway.entity.Bus;
import com.busway.entity.Route;
import com.busway.entity.Stop;
import com.busway.exception.BusinessException;
import com.busway.exception.ResourceNotFoundException;
import com.busway.repository.BusRepository;
import com.busway.repository.RouteRepository;
import com.busway.repository.StopRepository;
import com.busway.util.GeometryUtil;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;

    // ========== PUBLIC METHODS ==========

    /**
     * Get all active buses
     */
    @Transactional(readOnly = true)
    public List<BusResponse> getAllActiveBuses() {
        return busRepository.findByStatus(Bus.Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get bus by ID
     */
    @Transactional(readOnly = true)
    public BusResponse getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forBus(id));
        return mapToResponse(bus);
    }

    /**
     * Get bus by bus number
     */
    @Transactional(readOnly = true)
    public BusResponse getBusByNumber(String busNumber) {
        Bus bus = busRepository.findByBusNumber(busNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with number: " + busNumber));
        return mapToResponse(bus);
    }

    /**
     * FIND NEAREST BUSES - Core feature from requirements
     * This is the main method for "Trouver le bus le plus proche"
     */
    @Transactional(readOnly = true)
    public List<BusResponse> findNearestBuses(double latitude, double longitude, double radiusMeters) {
        Point point = GeometryUtil.createPoint(latitude, longitude);
        return busRepository.findNearestBuses(point, radiusMeters)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Find top N nearest buses
     */
    @Transactional(readOnly = true)
    public List<BusResponse> findTopNearestBuses(double latitude, double longitude, int limit) {
        Point point = GeometryUtil.createPoint(latitude, longitude);
        return busRepository.findTopNearestBuses(point, limit)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get buses on a specific route
     */
    @Transactional(readOnly = true)
    public List<BusResponse> getBusesOnRoute(Long routeId) {
        if (!routeRepository.existsById(routeId)) {
            throw ResourceNotFoundException.forRoute(routeId);
        }

        return busRepository.findByRouteIdAndStatus(routeId, Bus.Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get buses heading to a specific stop
     */
    @Transactional(readOnly = true)
    public List<BusResponse> getBusesHeadingToStop(Long stopId) {
        if (!stopRepository.existsById(stopId)) {
            throw ResourceNotFoundException.forStop(stopId);
        }

        return busRepository.findBusesHeadingToStop(stopId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get buses approaching a stop with estimated arrival
     */
    @Transactional(readOnly = true)
    public List<BusResponse> getBusesApproachingStop(Long stopId) {
        if (!stopRepository.existsById(stopId)) {
            throw ResourceNotFoundException.forStop(stopId);
        }

        List<Object[]> results = busRepository.findBusesApproachingStop(stopId);

        return results.stream()
                .map(result -> {
                    Bus bus = (Bus) result[0];
                    Double distance = (Double) result[1];

                    BusResponse response = mapToResponse(bus);

                    // Calculate estimated arrival time based on distance and speed
                    if (bus.getCurrentSpeed() != null && bus.getCurrentSpeed() > 0) {
                        double timeInHours = distance / 1000.0 / bus.getCurrentSpeed(); // distance in km, speed km/h
                        int minutes = (int) (timeInHours * 60);
                        response.setEstimatedArrival(LocalDateTime.now().plusMinutes(minutes));
                    }

                    return response;
                })
                .collect(Collectors.toList());
    }

    // ========== ADMIN/TRACKING METHODS ==========

    /**
     * Create new bus
     */
    @Transactional
    public BusResponse createBus(BusRequest request) {
        // Check if bus number already exists
        if (busRepository.findByBusNumber(request.getBusNumber()).isPresent()) {
            throw new BusinessException("Bus number already exists: " + request.getBusNumber());
        }

        Bus bus = new Bus();
        updateBusFromRequest(bus, request);

        Bus savedBus = busRepository.save(bus);
        return mapToResponse(savedBus);
    }

    /**
     * Update bus information
     */
    @Transactional
    public BusResponse updateBus(Long id, BusRequest request) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forBus(id));

        updateBusFromRequest(bus, request);
        Bus updatedBus = busRepository.save(bus);
        return mapToResponse(updatedBus);
    }

    /**
     * Update bus location (real-time tracking)
     */
    @Transactional
    public BusResponse updateBusLocation(Long id, double latitude, double longitude,
                                         Double speed, Double direction) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forBus(id));

        Point location = GeometryUtil.createPoint(latitude, longitude);

        bus.setCurrentLocation(location);
        bus.setCurrentSpeed(speed);
        bus.setDirection(direction);
        bus.setLastUpdate(LocalDateTime.now());

        Bus updatedBus = busRepository.save(bus);
        return mapToResponse(updatedBus);
    }

    /**
     * Update bus occupancy
     */
    @Transactional
    public BusResponse updateBusOccupancy(Long id, int passengers) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forBus(id));

        if (passengers < 0 || passengers > bus.getCapacity()) {
            throw new BusinessException("Invalid passenger count. Must be between 0 and " + bus.getCapacity());
        }

        bus.setCurrentPassengers(passengers);
        Bus updatedBus = busRepository.save(bus);
        return mapToResponse(updatedBus);
    }

    /**
     * Update bus next stop
     */
    @Transactional
    public BusResponse updateBusNextStop(Long id, Long nextStopId) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forBus(id));

        Stop nextStop = stopRepository.findById(nextStopId)
                .orElseThrow(() -> ResourceNotFoundException.forStop(nextStopId));

        bus.setNextStop(nextStop);
        Bus updatedBus = busRepository.save(bus);
        return mapToResponse(updatedBus);
    }

    /**
     * Change bus status
     */
    @Transactional
    public BusResponse changeBusStatus(Long id, String status) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forBus(id));

        try {
            Bus.Status newStatus = Bus.Status.valueOf(status);
            bus.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid status: " + status);
        }

        Bus updatedBus = busRepository.save(bus);
        return mapToResponse(updatedBus);
    }

    /**
     * Delete bus
     */
    @Transactional
    public void deleteBus(Long id) {
        if (!busRepository.existsById(id)) {
            throw ResourceNotFoundException.forBus(id);
        }
        busRepository.deleteById(id);
    }

    // ========== HELPER METHODS ==========

    private void updateBusFromRequest(Bus bus, BusRequest request) {
        bus.setBusNumber(request.getBusNumber());
        bus.setLicensePlate(request.getLicensePlate());
        bus.setCurrentLocation(request.getCurrentLocation());

        if (request.getStatus() != null) {
            try {
                bus.setStatus(Bus.Status.valueOf(request.getStatus()));
            } catch (IllegalArgumentException e) {
                throw new BusinessException("Invalid status: " + request.getStatus());
            }
        }

        bus.setCurrentSpeed(request.getCurrentSpeed());
        bus.setDirection(request.getDirection());
        bus.setCapacity(request.getCapacity());
        bus.setCurrentPassengers(request.getCurrentPassengers());

        if (request.getRouteId() != null) {
            Route route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> ResourceNotFoundException.forRoute(request.getRouteId()));
            bus.setRoute(route);
        }

        if (request.getNextStopId() != null) {
            Stop nextStop = stopRepository.findById(request.getNextStopId())
                    .orElseThrow(() -> ResourceNotFoundException.forStop(request.getNextStopId()));
            bus.setNextStop(nextStop);
        }

        bus.setLastUpdate(LocalDateTime.now());
    }

    private BusResponse mapToResponse(Bus bus) {
        int occupancyPercentage = bus.getCapacity() != null && bus.getCapacity() > 0 ?
                (bus.getCurrentPassengers() * 100 / bus.getCapacity()) : 0;

        String occupancyStatus;
        if (occupancyPercentage >= 90) {
            occupancyStatus = "FULL";
        } else if (occupancyPercentage >= 70) {
            occupancyStatus = "BUSY";
        } else {
            occupancyStatus = "AVAILABLE";
        }

        return BusResponse.builder()
                .id(bus.getId())
                .busNumber(bus.getBusNumber())
                .licensePlate(bus.getLicensePlate())
                // .currentLocation(bus.getCurrentLocation()) // Removed - using locationGeoJson instead
                .locationGeoJson(busRepository.getBusLocationGeoJson(bus.getId()))
                .latitude(bus.getCurrentLocation() != null ? bus.getCurrentLocation().getY() : null)
                .longitude(bus.getCurrentLocation() != null ? bus.getCurrentLocation().getX() : null)
                .status(bus.getStatus() != null ? bus.getStatus().name() : null)
                .currentSpeed(bus.getCurrentSpeed())
                .direction(bus.getDirection())
                .routeId(bus.getRoute() != null ? bus.getRoute().getId() : null)
                .routeName(bus.getRoute() != null ? bus.getRoute().getName() : null)
                .routeNumber(bus.getRoute() != null ? bus.getRoute().getRouteNumber() : null)
                .capacity(bus.getCapacity())
                .currentPassengers(bus.getCurrentPassengers())
                .occupancyPercentage(occupancyPercentage)
                .occupancyStatus(occupancyStatus)
                .nextStopId(bus.getNextStop() != null ? bus.getNextStop().getId() : null)
                .nextStopName(bus.getNextStop() != null ? bus.getNextStop().getName() : null)
                .lastUpdate(bus.getLastUpdate())
                .build();
    }
}