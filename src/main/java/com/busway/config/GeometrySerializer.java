package com.busway.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Coordinate;

import java.io.IOException;

/**
 * Custom serializer for JTS Geometry objects to prevent infinite recursion
 */
public class GeometrySerializer extends JsonSerializer<Geometry> {

    @Override
    public void serialize(Geometry geometry, JsonGenerator gen, SerializerProvider provider) throws IOException {
        if (geometry == null) {
            gen.writeNull();
            return;
        }

        gen.writeStartObject();
        gen.writeStringField("type", geometry.getGeometryType());
        
        if (geometry instanceof Point) {
            Point point = (Point) geometry;
            Coordinate coord = point.getCoordinate();
            gen.writeFieldName("coordinates");
            gen.writeStartArray();
            gen.writeNumber(coord.x);
            gen.writeNumber(coord.y);
            gen.writeEndArray();
        } else if (geometry instanceof LineString) {
            LineString lineString = (LineString) geometry;
            Coordinate[] coordinates = lineString.getCoordinates();
            gen.writeFieldName("coordinates");
            gen.writeStartArray();
            for (Coordinate coord : coordinates) {
                gen.writeStartArray();
                gen.writeNumber(coord.x);
                gen.writeNumber(coord.y);
                gen.writeEndArray();
            }
            gen.writeEndArray();
        }
        
        gen.writeEndObject();
    }
}
