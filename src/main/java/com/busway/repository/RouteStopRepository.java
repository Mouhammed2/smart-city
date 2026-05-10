package com.busway.repository;

import com.busway.entity.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {

    // Find all stops for a route in order
    List<RouteStop> findByRouteIdOrderBySequenceOrderAsc(Long routeId);

    // Find all routes that include a specific stop
    List<RouteStop> findByStopId(Long stopId);

    // Get the sequence number of a stop on a route
    @Query(value = "SELECT rs.sequenceOrder FROM RouteStop rs " +
            "WHERE rs.route.id = :routeId AND rs.stop.id = :stopId")
    Integer getStopSequence(@Param("routeId") Long routeId, @Param("stopId") Long stopId);

    // Get previous and next stops on a route
    @Query(value = "SELECT rs FROM RouteStop rs WHERE rs.route.id = :routeId " +
            "AND rs.sequenceOrder BETWEEN :startSeq AND :endSeq " +
            "ORDER BY rs.sequenceOrder")
    List<RouteStop> findStopsInSequenceRange(@Param("routeId") Long routeId,
                                             @Param("startSeq") Integer startSeq,
                                             @Param("endSeq") Integer endSeq);
}