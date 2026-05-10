package com.busway.repository;

import com.busway.entity.Bus;
import com.busway.entity.Bus.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {

    Optional<Bus> findByBusNumber(String busNumber);
    List<Bus> findByStatus(Status status);
    List<Bus> findByRouteIdAndStatus(Long routeId, Status status);

    // ========== JPQL QUERIES (use :param) ==========

    @Query(value = "SELECT b FROM Bus b WHERE b.status = 'ACTIVE' " +
            "AND b.currentLocation IS NOT NULL " +
            "AND distance(b.currentLocation, :point) <= :radiusInMeters " +
            "ORDER BY distance(b.currentLocation, :point) ASC")
    List<Bus> findNearestBuses(@Param("point") Point point,
                               @Param("radiusInMeters") double radiusInMeters);

    @Query(value = "SELECT b FROM Bus b WHERE b.status = 'ACTIVE' " +
            "AND b.currentLocation IS NOT NULL " +
            "ORDER BY distance(b.currentLocation, :point) ASC " +
            "LIMIT :limit")
    List<Bus> findTopNearestBuses(@Param("point") Point point,
                                  @Param("limit") int limit);

    @Query(value = "SELECT b FROM Bus b WHERE b.nextStop.id = :stopId " +
            "AND b.status = 'ACTIVE'")
    List<Bus> findBusesHeadingToStop(@Param("stopId") Long stopId);

    @Query(value = "SELECT b FROM Bus b WHERE b.lastUpdate < :threshold " +
            "AND b.status = 'ACTIVE'")
    List<Bus> findBusesWithStaleLocation(@Param("threshold") LocalDateTime threshold);

    @Modifying
    @Query(value = "UPDATE Bus b SET b.currentLocation = :location, " +
            "b.lastUpdate = CURRENT_TIMESTAMP, " +
            "b.currentSpeed = :speed, " +
            "b.direction = :direction " +
            "WHERE b.id = :busId")
    int updateBusLocation(@Param("busId") Long busId,
                          @Param("location") Point location,
                          @Param("speed") Double speed,
                          @Param("direction") Double direction);

    @Query(value = "SELECT b.route.id, COUNT(b) FROM Bus b " +
            "WHERE b.status = 'ACTIVE' GROUP BY b.route.id")
    List<Object[]> countActiveBusesPerRoute();

    // ========== NATIVE QUERIES (use ?1 for parameters) ==========

    /**
     * FIXED: Changed : to :: for PostgreSQL casting
     */
    @Query(value = "SELECT b.*, ST_Distance(b.current_location::geography, s.location::geography) as distance " +
            "FROM buses b, stops s WHERE b.next_stop_id = s.id AND s.id = ?1 " +
            "AND b.status = 'ACTIVE' " +
            "ORDER BY distance ASC",
            nativeQuery = true)
    List<Object[]> findBusesApproachingStop(Long stopId);

    /**
     * FIXED: Changed : to :: for PostgreSQL casting
     */
    @Query(value = "SELECT ST_AsGeoJSON(b.current_location) FROM buses b WHERE b.id = ?1",
            nativeQuery = true)
    String getBusLocationGeoJson(Long busId);

    @Query(value = "SELECT * FROM buses b WHERE ST_Within(b.current_location, " +
            "ST_GeomFromText(?1, 4326)) AND b.status = 'ACTIVE'",
            nativeQuery = true)
    List<Bus> findBusesInZone(String zoneWkt);
}