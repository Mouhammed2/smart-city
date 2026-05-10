package com.busway.service;

import com.busway.dto.request.ScheduleRequest;
import com.busway.dto.response.ScheduleResponse;
import com.busway.entity.Route;
import com.busway.entity.Schedule;
import com.busway.entity.Stop;
import com.busway.exception.BusinessException;
import com.busway.exception.ResourceNotFoundException;
import com.busway.repository.RouteRepository;
import com.busway.repository.RouteStopRepository;
import com.busway.repository.ScheduleRepository;
import com.busway.repository.StopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final RouteStopRepository routeStopRepository;

    private static final String[] DAY_NAMES = {
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    };

    // ========== PUBLIC METHODS ==========

    /**
     * Get schedules for a route
     */
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getSchedulesByRoute(Long routeId) {
        if (!routeRepository.existsById(routeId)) {
            throw ResourceNotFoundException.forRoute(routeId);
        }

        return scheduleRepository.findByRouteIdOrderBySequenceOrderAsc(routeId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get schedules for a stop
     */
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getSchedulesByStop(Long stopId) {
        if (!stopRepository.existsById(stopId)) {
            throw ResourceNotFoundException.forStop(stopId);
        }

        return scheduleRepository.findByStopIdOrderByDepartureTimeAsc(stopId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get schedules for a route on a specific day
     */
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getSchedulesByRouteAndDay(Long routeId, Integer dayOfWeek) {
        if (!routeRepository.existsById(routeId)) {
            throw ResourceNotFoundException.forRoute(routeId);
        }

        validateDayOfWeek(dayOfWeek);

        return scheduleRepository.findByRouteIdAndDayOfWeekOrderBySequenceOrderAsc(routeId, dayOfWeek)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming departures from a stop - CONSULT SCHEDULES feature
     */
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getUpcomingDepartures(Long stopId, Integer dayOfWeek, LocalTime currentTime) {
        if (!stopRepository.existsById(stopId)) {
            throw ResourceNotFoundException.forStop(stopId);
        }

        validateDayOfWeek(dayOfWeek);

        return scheduleRepository.findUpcomingDepartures(stopId, dayOfWeek, currentTime)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get schedule between two stops on a route
     */
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getScheduleBetweenStops(Long routeId, Long fromStopId, Long toStopId) {
        if (!routeRepository.existsById(routeId)) {
            throw ResourceNotFoundException.forRoute(routeId);
        }
        if (!stopRepository.existsById(fromStopId)) {
            throw ResourceNotFoundException.forStop(fromStopId);
        }
        if (!stopRepository.existsById(toStopId)) {
            throw ResourceNotFoundException.forStop(toStopId);
        }

        // Verify that both stops are on the route and in correct order
        Integer fromSeq = routeStopRepository.getStopSequence(routeId, fromStopId);
        Integer toSeq = routeStopRepository.getStopSequence(routeId, toStopId);

        if (fromSeq == null) {
            throw new BusinessException("Stop " + fromStopId + " is not on route " + routeId);
        }
        if (toSeq == null) {
            throw new BusinessException("Stop " + toStopId + " is not on route " + routeId);
        }
        if (fromSeq >= toSeq) {
            throw new BusinessException("From stop must come before to stop on the route");
        }

        List<Object[]> results = scheduleRepository.findScheduleBetweenStops(routeId, fromStopId, toStopId);

        return results.stream()
                .map(result -> {
                    Schedule fromSchedule = (Schedule) result[0];
                    Schedule toSchedule = (Schedule) result[1];

                    // Create a combined response
                    return ScheduleResponse.builder()
                            .id(fromSchedule.getId())
                            .routeId(routeId)
                            .routeName(fromSchedule.getRoute().getName())
                            .routeNumber(fromSchedule.getRoute().getRouteNumber())
                            .stopId(fromStopId)
                            .stopName(fromSchedule.getStop().getName())
                            .stopCode(fromSchedule.getStop().getCode())
                            .dayOfWeek(fromSchedule.getDayOfWeek())
                            .dayName(DAY_NAMES[fromSchedule.getDayOfWeek()])
                            .departureTime(fromSchedule.getDepartureTime())
                            .arrivalTime(toSchedule.getArrivalTime())
                            .sequenceOrder(fromSchedule.getSequenceOrder())
                            .isPeakHour(fromSchedule.getIsPeakHour())
                            .notes("Travel from " + fromSchedule.getStop().getName() +
                                    " to " + toSchedule.getStop().getName())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // ========== ADMIN METHODS ==========

    /**
     * Create new schedule entry
     */
    @Transactional
    public ScheduleResponse createSchedule(ScheduleRequest request) {
        validateScheduleRequest(request);

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> ResourceNotFoundException.forRoute(request.getRouteId()));

        Stop stop = stopRepository.findById(request.getStopId())
                .orElseThrow(() -> ResourceNotFoundException.forStop(request.getStopId()));

        Schedule schedule = new Schedule();
        schedule.setRoute(route);
        schedule.setStop(stop);
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setDepartureTime(request.getDepartureTime());
        schedule.setArrivalTime(request.getArrivalTime());
        schedule.setSequenceOrder(request.getSequenceOrder());
        schedule.setIsPeakHour(request.getIsPeakHour());
        schedule.setNotes(request.getNotes());

        Schedule savedSchedule = scheduleRepository.save(schedule);
        return mapToResponse(savedSchedule);
    }

    /**
     * Update schedule
     */
    @Transactional
    public ScheduleResponse updateSchedule(Long id, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));

        validateScheduleRequest(request);

        if (!schedule.getRoute().getId().equals(request.getRouteId())) {
            Route route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> ResourceNotFoundException.forRoute(request.getRouteId()));
            schedule.setRoute(route);
        }

        if (!schedule.getStop().getId().equals(request.getStopId())) {
            Stop stop = stopRepository.findById(request.getStopId())
                    .orElseThrow(() -> ResourceNotFoundException.forStop(request.getStopId()));
            schedule.setStop(stop);
        }

        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setDepartureTime(request.getDepartureTime());
        schedule.setArrivalTime(request.getArrivalTime());
        schedule.setSequenceOrder(request.getSequenceOrder());
        schedule.setIsPeakHour(request.getIsPeakHour());
        schedule.setNotes(request.getNotes());

        Schedule updatedSchedule = scheduleRepository.save(schedule);
        return mapToResponse(updatedSchedule);
    }

    /**
     * Delete schedule
     */
    @Transactional
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found with id: " + id);
        }
        scheduleRepository.deleteById(id);
    }

    // ========== HELPER METHODS ==========

    private void validateScheduleRequest(ScheduleRequest request) {
        validateDayOfWeek(request.getDayOfWeek());

        if (request.getArrivalTime().isBefore(request.getDepartureTime())) {
            throw BusinessException.invalidSchedule();
        }
    }

    private void validateDayOfWeek(Integer dayOfWeek) {
        if (dayOfWeek == null || dayOfWeek < 0 || dayOfWeek > 6) {
            throw new BusinessException("Day of week must be between 0 and 6");
        }
    }

    private ScheduleResponse mapToResponse(Schedule schedule) {
        return ScheduleResponse.builder()
                .id(schedule.getId())
                .routeId(schedule.getRoute().getId())
                .routeName(schedule.getRoute().getName())
                .routeNumber(schedule.getRoute().getRouteNumber())
                .stopId(schedule.getStop().getId())
                .stopName(schedule.getStop().getName())
                .stopCode(schedule.getStop().getCode())
                .dayOfWeek(schedule.getDayOfWeek())
                .dayName(DAY_NAMES[schedule.getDayOfWeek()])
                .departureTime(schedule.getDepartureTime())
                .arrivalTime(schedule.getArrivalTime())
                .sequenceOrder(schedule.getSequenceOrder())
                .isPeakHour(schedule.getIsPeakHour())
                .notes(schedule.getNotes())
                .build();
    }
}