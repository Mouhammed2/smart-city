package com.busway.repository;

import com.busway.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.locationtech.jts.geom.Point;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

    Optional<Route> findByRouteNumber(String routeNumber);
    List<Route> findByIsActiveTrue();
    List<Route> findByNameContainingIgnoreCase(String name);

    // ========== JPQL QUERIES (use :param) ==========

    /**
     * Find routes near a point - JPQL with named parameter
     */
    @Query(value = "SELECT r FROM Route r WHERE distance(r.geometry, :point) <= :distanceInMeters")
    List<Route> findRoutesNearPoint(@Param("point") Point point,
                                    @Param("distanceInMeters") double distanceInMeters);

    /**
     * Find closest route to point - JPQL with named parameter
     */
    @Query(value = "SELECT r FROM Route r ORDER BY distance(r.geometry, :point) ASC LIMIT 1")
    Optional<Route> findClosestRouteToPoint(@Param("point") Point point);

    /**
     * Find connecting routes - JPQL with named parameter
     */
    @Query(value = "SELECT DISTINCT r FROM Route r JOIN r.routeStops rs " +
            "WHERE rs.stop.id IN (SELECT rs2.stop.id FROM RouteStop rs2 WHERE rs2.route.id = :routeId) " +
            "AND r.id != :routeId")
    List<Route> findConnectingRoutes(@Param("routeId") Long routeId);

    // ========== NATIVE QUERIES (use ?1 for parameters) ==========

    /**
     * Find routes in bounding box - Native query with positional parameter
     */
    @Query(value = "SELECT * FROM routes r WHERE ST_Intersects(r.geometry, " +
            "ST_MakeEnvelope(?1, ?2, ?3, ?4, 4326))",
            nativeQuery = true)
    List<Route> findRoutesInBoundingBox(double minLon, double minLat,
                                        double maxLon, double maxLat);

    /**
     * Calculate route length - Native query with positional parameter
     */
    @Query(value = "SELECT ST_Length(r.geometry::geography) FROM routes r WHERE r.id = ?1",
            nativeQuery = true)
    Double calculateRouteLength(Long routeId);

    /**
     * Get route GeoJSON - Native query with positional parameter
     */
    @Query(value = "SELECT ST_AsGeoJSON(r.geometry) FROM routes r WHERE r.id = ?1",
            nativeQuery = true)
    String getRouteGeoJson(Long routeId);
}