package com.busway.seeder;

import com.busway.entity.Route;
import com.busway.entity.RouteStop;
import com.busway.entity.Stop;
import com.busway.repository.RouteRepository;
import com.busway.repository.RouteStopRepository;
import com.busway.repository.StopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * Seeder for initial bus routes in Algiers
 * Routes:
 * - 1: وسط المدينة → الولاية → سيدي يحيى
 * - 1B: وسط المدينة → سهب الخيل
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class BusRouteSeeder implements CommandLineRunner {

    private final StopRepository stopRepository;
    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;

    private final GeometryFactory geometryFactory = 
            new GeometryFactory(new PrecisionModel(), 4326);

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting bus route seeder...");
        
        // Only seed if no routes exist
        if (routeRepository.count() > 0) {
            log.info("Routes already exist, skipping seeder");
            return;
        }

        try {
            // Create stops
            Stop stopCentral = createStopIfNotExists(
                    "STP001", 
                    "وسط المدينة", 
                    "مركز المدينة - منطقة البريد المركزي",
                    36.7765, 3.0587,
                    "شارع لاربي بن مهيدي",
                    "وسط المدينة",
                    true, true, true
            );

            Stop stopWilaya = createStopIfNotExists(
                    "STP002", 
                    "الولاية", 
                    "مبنى مقر الولاية",
                    36.7650, 3.0500,
                    "شارع محمد بلوزداد",
                    "الحامة",
                    true, true, true
            );

            Stop stopSidiYahia = createStopIfNotExists(
                    "STP003", 
                    "سيدي يحيى", 
                    "حي سيدي يحيى - حيدرة",
                    36.7450, 3.0350,
                    "طريق سيدي يحيى",
                    "حيدرة",
                    true, false, true
            );

            Stop stopSahelKhail = createStopIfNotExists(
                    "STP004", 
                    "سهب الخيل", 
                    "منطقة سهب الخيل - التلال الجنوبية",
                    36.7550, 3.0650,
                    "طريق السحاب",
                    "بوزريعة",
                    false, false, false
            );

            // Create Route 1: وسط المدينة → الولاية → سيدي يحيى
            if (routeRepository.findByRouteNumber("1").isEmpty()) {
                LineString route1Geometry = createRoute1Geometry();
                Route route1 = new Route();
                route1.setRouteNumber("1");
                route1.setName("وسط المدينة - الولاية - سيدي يحيى");
                route1.setDescription("خط يمر من وسط المدينة عبر الولاية إلى حي سيدي يحيى");
                route1.setGeometry(route1Geometry);
                route1.setTotalDistance(5.2);
                route1.setEstimatedDuration(Duration.ofMinutes(25));
                route1.setDirection(Route.Direction.FORWARD);
                route1.setIsActive(true);
                route1.setColor("#2196F3");
                
                route1 = routeRepository.save(route1);
                log.info("Created Route 1 with ID: {}", route1.getId());

                // Link stops to route
                createRouteStop(route1, stopCentral, 1, Duration.ZERO);
                createRouteStop(route1, stopWilaya, 2, Duration.ofMinutes(10));
                createRouteStop(route1, stopSidiYahia, 3, Duration.ofMinutes(25));
                
                log.info("Linked stops to Route 1");
            }

            // Create Route 1B: وسط المدينة → سهب الخيل
            if (routeRepository.findByRouteNumber("1B").isEmpty()) {
                LineString route1bGeometry = createRoute1BGeometry();
                Route route1b = new Route();
                route1b.setRouteNumber("1B");
                route1b.setName("وسط المدينة - سهب الخيل");
                route1b.setDescription("خط مباشر من وسط المدينة إلى منطقة سهب الخيل");
                route1b.setGeometry(route1bGeometry);
                route1b.setTotalDistance(3.8);
                route1b.setEstimatedDuration(Duration.ofMinutes(18));
                route1b.setDirection(Route.Direction.FORWARD);
                route1b.setIsActive(true);
                route1b.setColor("#4CAF50");
                
                route1b = routeRepository.save(route1b);
                log.info("Created Route 1B with ID: {}", route1b.getId());

                // Link stops to route
                createRouteStop(route1b, stopCentral, 1, Duration.ZERO);
                createRouteStop(route1b, stopSahelKhail, 2, Duration.ofMinutes(18));
                
                log.info("Linked stops to Route 1B");
            }

            log.info("Bus route seeder completed successfully!");
            
        } catch (Exception e) {
            log.error("Error seeding bus routes: {}", e.getMessage(), e);
        }
    }

    private Stop createStopIfNotExists(String code, String name, String description,
                                        double lat, double lng, String address, 
                                        String zone, boolean shelter, boolean bench, 
                                        boolean wheelchair) {
        return stopRepository.findByCode(code)
                .orElseGet(() -> {
                    Point location = geometryFactory.createPoint(new Coordinate(lng, lat));
                    location.setSRID(4326);
                    
                    Stop stop = new Stop();
                    stop.setCode(code);
                    stop.setName(name);
                    stop.setDescription(description);
                    stop.setLocation(location);
                    stop.setAddress(address);
                    stop.setCity("الجزائر العاصمة");
                    stop.setZone(zone);
                    stop.setHasShelter(shelter);
                    stop.setHasBench(bench);
                    stop.setWheelchairAccessible(wheelchair);
                    stop.setIsActive(true);
                    
                    Stop saved = stopRepository.save(stop);
                    log.info("Created stop: {} ({})", name, code);
                    return saved;
                });
    }

    private void createRouteStop(Route route, Stop stop, int sequence, Duration travelTime) {
        RouteStop routeStop = new RouteStop();
        routeStop.setRoute(route);
        routeStop.setStop(stop);
        routeStop.setSequenceOrder(sequence);
        routeStop.setEstimatedTravelTime(travelTime);
        routeStopRepository.save(routeStop);
    }

    /**
     * Create geometry for Route 1 following actual streets:
     * وسط المدينة → الولاية → سيدي يحيى
     * Path follows: Larbi Ben M'hidi → Mohamed Boudiaf → Sidi Yahia Road
     */
    private LineString createRoute1Geometry() {
        List<Coordinate> coordinates = new ArrayList<>();
        
        // وسط المدينة (City Center - Grande Poste)
        coordinates.add(new Coordinate(3.0587, 36.7765));
        
        // Along Larbi Ben M'hidi Street (heading southwest)
        coordinates.add(new Coordinate(3.0570, 36.7740));
        coordinates.add(new Coordinate(3.0550, 36.7710));
        
        // Turn toward Wilaya building
        coordinates.add(new Coordinate(3.0520, 36.7670));
        
        // الولاية (Wilaya building)
        coordinates.add(new Coordinate(3.0500, 36.7650));
        
        // Continue south through Hamma
        coordinates.add(new Coordinate(3.0470, 36.7600));
        coordinates.add(new Coordinate(3.0440, 36.7550));
        
        // Enter Hydra area
        coordinates.add(new Coordinate(3.0400, 36.7500));
        coordinates.add(new Coordinate(3.0370, 36.7460));
        
        // سيدي يحيى (Sidi Yahia - Hydra)
        coordinates.add(new Coordinate(3.0350, 36.7450));
        
        LineString lineString = geometryFactory.createLineString(
                coordinates.toArray(new Coordinate[0])
        );
        lineString.setSRID(4326);
        return lineString;
    }

    /**
     * Create geometry for Route 1B following actual streets:
     * وسط المدينة → سهب الخيل
     * Path goes northeast through El Biar area toward Sahel hills
     */
    private LineString createRoute1BGeometry() {
        List<Coordinate> coordinates = new ArrayList<>();
        
        // وسط المدينة (City Center)
        coordinates.add(new Coordinate(3.0587, 36.7765));
        
        // Head east/northeast toward El Biar
        coordinates.add(new Coordinate(3.0600, 36.7750));
        coordinates.add(new Coordinate(3.0615, 36.7720));
        
        // Climb through El Biar area
        coordinates.add(new Coordinate(3.0625, 36.7680));
        coordinates.add(new Coordinate(3.0635, 36.7640));
        
        // Continue toward Sahel El Khail
        coordinates.add(new Coordinate(3.0645, 36.7600));
        coordinates.add(new Coordinate(3.0650, 36.7570));
        
        // سهب الخيل (Sahel El Khail)
        coordinates.add(new Coordinate(3.0650, 36.7550));
        
        LineString lineString = geometryFactory.createLineString(
                coordinates.toArray(new Coordinate[0])
        );
        lineString.setSRID(4326);
        return lineString;
    }
}
