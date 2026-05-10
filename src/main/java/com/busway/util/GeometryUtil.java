package com.busway.util;

import org.locationtech.jts.geom.*;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.springframework.stereotype.Component;

@Component
public class GeometryUtil {

    private static final GeometryFactory geometryFactory =
            new GeometryFactory(new PrecisionModel(), 4326);

    private static final WKTReader wktReader = new WKTReader(geometryFactory);

    /**
     * Parse WKT string to LineString
     */
    public static LineString parseWktLineString(String wkt) {
        try {
            if (wkt == null || wkt.trim().isEmpty()) {
                return null;
            }
            Geometry geometry = wktReader.read(wkt);
            if (geometry instanceof LineString) {
                LineString lineString = (LineString) geometry;
                lineString.setSRID(4326);
                return lineString;
            }
            throw new IllegalArgumentException("WKT is not a LineString: " + wkt);
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid WKT format: " + wkt, e);
        }
    }

    /**
     * Create a Point from latitude and longitude
     * Note: PostGIS uses (longitude, latitude) order
     */
    public static Point createPoint(double latitude, double longitude) {
        return geometryFactory.createPoint(new Coordinate(longitude, latitude));
    }

    /**
     * Create a Point with SRID 4326
     */
    public static Point createPointWithSRID(double latitude, double longitude) {
        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        point.setSRID(4326);
        return point;
    }

    /**
     * Calculate distance between two points using Haversine formula (fallback)
     */
    public static double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in kilometers
    }
}