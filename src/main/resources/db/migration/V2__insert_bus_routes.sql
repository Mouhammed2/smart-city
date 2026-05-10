-- =============================================================================
-- Route: Centre Ville → Université Mohammed Premier (Oujda)
-- Around 20 logical stops between the two terminus
-- =============================================================================

-- =============================================================================
-- INSERT STOPS
-- =============================================================================

INSERT INTO stops
(code, name, description, location, address, city, zone, has_shelter, has_bench, wheelchair_accessible, is_active, created_at, updated_at)
VALUES

-- Terminus Start
(
    'OUJ001',
    'Centre Ville',
    'Centre principal de la ville d’Oujda',
    ST_SetSRID(ST_MakePoint(-1.9070, 34.6810), 4326),
    'Boulevard Mohammed V',
    'Oujda',
    'Centre',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ002',
    'Bab Sidi Abdelwahab',
    'Zone commerciale populaire',
    ST_SetSRID(ST_MakePoint(-1.9100, 34.6840), 4326),
    'Bab Sidi Abdelwahab',
    'Oujda',
    'Médina',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ003',
    'Place 16 Août',
    'Grande place publique',
    ST_SetSRID(ST_MakePoint(-1.9125, 34.6870), 4326),
    'Place 16 Août',
    'Oujda',
    'Centre',
    true, false, true, true,
    NOW(), NOW()
),

(
    'OUJ004',
    'Hay El Qods',
    'Quartier résidentiel',
    ST_SetSRID(ST_MakePoint(-1.9160, 34.6910), 4326),
    'Hay El Qods',
    'Oujda',
    'El Qods',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ005',
    'Mosquée Mohammed VI',
    'Mosquée principale',
    ST_SetSRID(ST_MakePoint(-1.9200, 34.6950), 4326),
    'Avenue Mohammed VI',
    'Oujda',
    'Mohammed VI',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ006',
    'Clinique Al Farabi',
    'Zone médicale',
    ST_SetSRID(ST_MakePoint(-1.9240, 34.6990), 4326),
    'Rue Al Farabi',
    'Oujda',
    'Santé',
    true, false, true, true,
    NOW(), NOW()
),

(
    'OUJ007',
    'Hay Nahda',
    'Quartier Nahda',
    ST_SetSRID(ST_MakePoint(-1.9280, 34.7030), 4326),
    'Hay Nahda',
    'Oujda',
    'Nahda',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ008',
    'Marché Nahda',
    'Marché local',
    ST_SetSRID(ST_MakePoint(-1.9310, 34.7060), 4326),
    'Marché Nahda',
    'Oujda',
    'Nahda',
    false, true, false, true,
    NOW(), NOW()
),

(
    'OUJ009',
    'Hay Salam',
    'Zone résidentielle',
    ST_SetSRID(ST_MakePoint(-1.9340, 34.7090), 4326),
    'Hay Salam',
    'Oujda',
    'Salam',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ010',
    'Complexe Sportif',
    'Stade et installations sportives',
    ST_SetSRID(ST_MakePoint(-1.9370, 34.7120), 4326),
    'Complexe Sportif',
    'Oujda',
    'Sport',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ011',
    'Hay Riad',
    'Quartier moderne',
    ST_SetSRID(ST_MakePoint(-1.9400, 34.7150), 4326),
    'Hay Riad',
    'Oujda',
    'Riad',
    true, false, true, true,
    NOW(), NOW()
),

(
    'OUJ012',
    'École Technique',
    'Institut technique',
    ST_SetSRID(ST_MakePoint(-1.9430, 34.7180), 4326),
    'Route Universitaire',
    'Oujda',
    'Éducation',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ013',
    'Cité Administrative',
    'Services administratifs',
    ST_SetSRID(ST_MakePoint(-1.9460, 34.7210), 4326),
    'Boulevard Administratif',
    'Oujda',
    'Administration',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ014',
    'Hay Andalouss',
    'Quartier Andalouss',
    ST_SetSRID(ST_MakePoint(-1.9490, 34.7240), 4326),
    'Hay Andalouss',
    'Oujda',
    'Andalouss',
    true, false, true, true,
    NOW(), NOW()
),

(
    'OUJ015',
    'Centre Commercial',
    'Zone commerciale moderne',
    ST_SetSRID(ST_MakePoint(-1.9520, 34.7270), 4326),
    'Centre Commercial',
    'Oujda',
    'Commerce',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ016',
    'Faculté de Droit',
    'Université - Faculté de droit',
    ST_SetSRID(ST_MakePoint(-1.9550, 34.7300), 4326),
    'Campus Universitaire',
    'Oujda',
    'Université',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ017',
    'Faculté des Sciences',
    'Université - Sciences',
    ST_SetSRID(ST_MakePoint(-1.9580, 34.7330), 4326),
    'Campus Universitaire',
    'Oujda',
    'Université',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ018',
    'Bibliothèque Universitaire',
    'Bibliothèque principale',
    ST_SetSRID(ST_MakePoint(-1.9610, 34.7360), 4326),
    'Campus Universitaire',
    'Oujda',
    'Université',
    true, true, true, true,
    NOW(), NOW()
),

(
    'OUJ019',
    'Résidence Universitaire',
    'Cité universitaire',
    ST_SetSRID(ST_MakePoint(-1.9640, 34.7390), 4326),
    'Résidence Universitaire',
    'Oujda',
    'Université',
    true, true, true, true,
    NOW(), NOW()
),

-- Terminus End
(
    'OUJ020',
    'Université Mohammed Premier',
    'Terminus université',
    ST_SetSRID(ST_MakePoint(-1.9670, 34.7420), 4326),
    'Université Mohammed Premier',
    'Oujda',
    'Université',
    true, true, true, true,
    NOW(), NOW()
)

ON CONFLICT (code) DO NOTHING;

-- =============================================================================
-- INSERT ROUTE
-- =============================================================================

INSERT INTO routes
(route_number, name, description, geometry, total_distance, estimated_duration, direction, is_active, color, created_at, updated_at)
VALUES
    (
        'U1',
        'Centre Ville - Université Mohammed Premier',
        'Ligne reliant le centre ville à l’université',

        ST_SetSRID(ST_MakeLine(ARRAY[
            ST_MakePoint(-1.9070, 34.6810),
            ST_MakePoint(-1.9100, 34.6840),
            ST_MakePoint(-1.9125, 34.6870),
            ST_MakePoint(-1.9160, 34.6910),
            ST_MakePoint(-1.9200, 34.6950),
            ST_MakePoint(-1.9240, 34.6990),
            ST_MakePoint(-1.9280, 34.7030),
            ST_MakePoint(-1.9310, 34.7060),
            ST_MakePoint(-1.9340, 34.7090),
            ST_MakePoint(-1.9370, 34.7120),
            ST_MakePoint(-1.9400, 34.7150),
            ST_MakePoint(-1.9430, 34.7180),
            ST_MakePoint(-1.9460, 34.7210),
            ST_MakePoint(-1.9490, 34.7240),
            ST_MakePoint(-1.9520, 34.7270),
            ST_MakePoint(-1.9550, 34.7300),
            ST_MakePoint(-1.9580, 34.7330),
            ST_MakePoint(-1.9610, 34.7360),
            ST_MakePoint(-1.9640, 34.7390),
            ST_MakePoint(-1.9670, 34.7420)
            ]), 4326),

        9.5,
        40,
        'FORWARD',
        true,
        '#E53935',
        NOW(),
        NOW()
    )

ON CONFLICT (route_number) DO NOTHING;

-- =============================================================================
-- LINK ROUTE TO STOPS
-- =============================================================================

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 1, 0
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ001'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 1);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 2, 2
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ002'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 2);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 3, 4
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ003'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 3);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 4, 6
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ004'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 4);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 5, 8
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ005'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 5);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 6, 10
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ006'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 6);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 7, 12
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ007'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 7);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 8, 14
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ008'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 8);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 9, 16
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ009'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 9);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 10, 18
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ010'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 10);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 11, 20
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ011'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 11);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 12, 22
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ012'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 12);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 13, 24
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ013'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 13);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 14, 26
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ014'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 14);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 15, 28
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ015'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 15);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 16, 30
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ016'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 16);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 17, 32
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ017'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 17);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 18, 34
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ018'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 18);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 19, 36
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ019'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 19);

INSERT INTO route_stops (route_id, stop_id, sequence_order, estimated_travel_time)
SELECT r.id, s.id, 20, 40
FROM routes r, stops s
WHERE r.route_number = 'U1' AND s.code = 'OUJ020'
  AND NOT EXISTS (SELECT 1 FROM route_stops rs WHERE rs.route_id = r.id AND rs.stop_id = s.id AND rs.sequence_order = 20);
-- =============================================================================
-- INSERT ROUTE
-- =============================================================================

INSERT INTO routes
(route_number, name, description, geometry, total_distance, estimated_duration, direction, is_active, color, created_at, updated_at)
VALUES
    (
        'U1',
        'Centre Ville - Université Mohammed Premier',
        'Ligne reliant le centre ville à l’université',

        ST_SetSRID(ST_MakeLine(ARRAY[
            ST_MakePoint(-1.9070, 34.6810),
            ST_MakePoint(-1.9100, 34.6840),
            ST_MakePoint(-1.9125, 34.6870),
            ST_MakePoint(-1.9160, 34.6910),
            ST_MakePoint(-1.9200, 34.6950),
            ST_MakePoint(-1.9240, 34.6990),
            ST_MakePoint(-1.9280, 34.7030),
            ST_MakePoint(-1.9310, 34.7060),
            ST_MakePoint(-1.9340, 34.7090),
            ST_MakePoint(-1.9370, 34.7120),
            ST_MakePoint(-1.9400, 34.7150),
            ST_MakePoint(-1.9430, 34.7180),
            ST_MakePoint(-1.9460, 34.7210),
            ST_MakePoint(-1.9490, 34.7240),
            ST_MakePoint(-1.9520, 34.7270),
            ST_MakePoint(-1.9550, 34.7300),
            ST_MakePoint(-1.9580, 34.7330),
            ST_MakePoint(-1.9610, 34.7360),
            ST_MakePoint(-1.9640, 34.7390),
            ST_MakePoint(-1.9670, 34.7420)
            ]), 4326),

        9.5,
        40,
        'FORWARD',
        true,
        '#E53935',
        NOW(),
        NOW()
    )

ON CONFLICT (route_number) DO NOTHING;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name IN ('routes', 'route_stops')
  AND column_name LIKE 'estimated%';

