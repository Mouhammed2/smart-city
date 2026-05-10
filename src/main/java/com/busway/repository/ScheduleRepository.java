package com.busway.repository;

import com.busway.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // Find schedules by route
    List<Schedule> findByRouteIdOrderBySequenceOrderAsc(Long routeId);

    // Find schedules by stop
    List<Schedule> findByStopIdOrderByDepartureTimeAsc(Long stopId);

    // Find schedules by day of week
    List<Schedule> findByDayOfWeek(Integer dayOfWeek);

    // ========== COMPLEX QUERIES ==========

    /**
     * Find schedules for a route on a specific day
     */
    List<Schedule> findByRouteIdAndDayOfWeekOrderBySequenceOrderAsc(Long routeId, Integer dayOfWeek);

    /**
     * Find upcoming departures from a stop
     */
    @Query(value = "SELECT s FROM Schedule s WHERE s.stop.id = :stopId " +
            "AND s.dayOfWeek = :dayOfWeek " +
            "AND s.departureTime >= :currentTime " +
            "ORDER BY s.departureTime ASC")
    List<Schedule> findUpcomingDepartures(@Param("stopId") Long stopId,
                                          @Param("dayOfWeek") Integer dayOfWeek,
                                          @Param("currentTime") LocalTime currentTime);

    /**
     * Find schedules between two stops on a route
     */
    @Query(value = "SELECT s1, s2 FROM Schedule s1, Schedule s2 " +
            "WHERE s1.route.id = :routeId AND s2.route.id = :routeId " +
            "AND s1.stop.id = :fromStopId AND s2.stop.id = :toStopId " +
            "AND s1.dayOfWeek = s2.dayOfWeek " +
            "AND s1.sequenceOrder < s2.sequenceOrder " +
            "AND s1.departureTime <= s2.arrivalTime")
    List<Object[]> findScheduleBetweenStops(@Param("routeId") Long routeId,
                                            @Param("fromStopId") Long fromStopId,
                                            @Param("toStopId") Long toStopId);

    /**
     * Get peak hour schedules
     */
    List<Schedule> findByIsPeakHourTrue();

    /**
     * Check if a stop has service at a specific time
     */
    boolean existsByStopIdAndDayOfWeekAndDepartureTimeBetween(
            Long stopId, Integer dayOfWeek, LocalTime startTime, LocalTime endTime);
}