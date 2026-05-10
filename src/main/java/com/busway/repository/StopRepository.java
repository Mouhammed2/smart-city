package com.busway.repository;

import com.busway.entity.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.locationtech.jts.geom.Point;

import java.util.List;
import java.util.Optional;

@Repository
public interface StopRepository extends JpaRepository<Stop, Long> {

    // Basic find methods
    Optional<Stop> findByCode(String code);
    List<Stop> findByCityIgnoreCase(String city);
    List<Stop> findByIsActiveTrue();
    List<Stop> findByWheelchairAccessibleTrue();

    // New find methods
    List<Stop> findByHasShelterTrue();
    List<Stop> findByHasBenchTrue();
    List<Stop> findByHasShelterTrueAndHasBenchTrue();
    List<Stop> findByNameContainingIgnoreCase(String name);
    List<Stop> findByZoneIgnoreCase(String zone);

    // Count methods
    long countByIsActiveTrue();
    long countByWheelchairAccessibleTrue();
    long countByHasShelterTrue();
    long countByHasBenchTrue();
    long countByHasShelterTrueAndHasBenchTrue();

    // ========== SPATIAL QUERIES ==========

    @Query(value = "SELECT s FROM Stop s WHERE distance(s.location, :point) <= :radiusInMeters " +
            "ORDER BY distance(s.location, :point) ASC")
    List<Stop> findNearestStops(@Param("point") Point point,
                                @Param("radiusInMeters") double radiusInMeters);

    @Query(value = "SELECT s FROM Stop s ORDER BY distance(s.location, :point) ASC LIMIT :limit")
    List<Stop> findTopNearestStops(@Param("point") Point point,
                                   @Param("limit") int limit);

    @Query(value = "SELECT * FROM stops s WHERE ST_Within(s.location, " +
            "ST_MakeEnvelope(?1, ?2, ?3, ?4, 4326))",
            nativeQuery = true)
    List<Stop> findStopsInBoundingBox(double minLon, double minLat,
                                      double maxLon, double maxLat);

    @Query(value = "SELECT ST_Distance(s1.location::geography, s2.location::geography) " +
            "FROM stops s1, stops s2 WHERE s1.id = ?1 AND s2.id = ?2",
            nativeQuery = true)
    Double calculateDistanceBetweenStops(Long stopId1, Long stopId2);

    @Query(value = "SELECT ST_AsGeoJSON(s.location) FROM stops s WHERE s.id = ?1",
            nativeQuery = true)
    String getStopGeoJson(Long stopId);

    // ========== ROUTE RELATIONSHIPS ==========

    @Query("SELECT s FROM Stop s JOIN s.routeStops rs WHERE rs.route.id = :routeId ORDER BY rs.sequenceOrder")
    List<Stop> findStopsByRouteId(@Param("routeId") Long routeId);

    // ========== STATISTICS QUERIES ==========

    @Query("SELECT s.city, COUNT(s) FROM Stop s WHERE s.city IS NOT NULL GROUP BY s.city")
    List<Object[]> countByCityRaw();

    @Query("SELECT s.zone, COUNT(s) FROM Stop s WHERE s.zone IS NOT NULL GROUP BY s.zone")
    List<Object[]> countByZoneRaw();
}