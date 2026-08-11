-- ============================================================
-- LUXDRIVE — Migration 005: Seed Data
-- Development seed data — do NOT run in production with real data
-- ============================================================

-- ── Locations ─────────────────────────────────────────────────
INSERT INTO public.locations (name, slug, address, city, country, delivery_available, delivery_fee, is_active)
VALUES
  ('Nairobi CBD Hub',       'nairobi-cbd',         'Upper Hill, Nairobi',             'Nairobi',  'Kenya', TRUE,  3000.00, TRUE),
  ('Westlands Branch',      'westlands',           'Westlands Road, Westlands',        'Nairobi',  'Kenya', TRUE,  2500.00, TRUE),
  ('Jomo Kenyatta Airport', 'jkia',                'JKIA Terminal, Embakasi',          'Nairobi',  'Kenya', TRUE,  5000.00, TRUE),
  ('Karen Branch',          'karen',               'Karen Road, Karen',                'Nairobi',  'Kenya', TRUE,  3500.00, TRUE),
  ('Mombasa Branch',        'mombasa',             'Moi Avenue, Mombasa',             'Mombasa',  'Kenya', TRUE,  4000.00, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ── Sample Cars (Development only) ───────────────────────────
-- Remove or replace with real fleet data in production
DO $$
DECLARE
  nairobi_id UUID;
  westlands_id UUID;
  jkia_id UUID;
BEGIN
  SELECT id INTO nairobi_id   FROM public.locations WHERE slug = 'nairobi-cbd';
  SELECT id INTO westlands_id FROM public.locations WHERE slug = 'westlands';
  SELECT id INTO jkia_id      FROM public.locations WHERE slug = 'jkia';

  INSERT INTO public.cars (
    brand, model, year, category, description,
    daily_rate, chauffeur_daily_rate, security_deposit,
    transmission, fuel_type, engine, horsepower,
    seats, doors, drive_type, color,
    location_id, status, featured
  ) VALUES
  (
    'BMW', 'M4 Competition', 2024, 'SPORTS_CAR',
    'The BMW M4 Competition is the pinnacle of performance engineering. With a twin-turbo inline-six producing 503hp, it delivers an extraordinary driving experience wrapped in luxury.',
    25000.00, 35000.00, 50000.00,
    'AUTOMATIC', 'PETROL', '3.0L Twin Turbo', 503,
    4, 2, 'AWD', 'Alpine White',
    westlands_id, 'AVAILABLE', TRUE
  ),
  (
    'Mercedes-Benz', 'G63 AMG', 2023, 'SUV',
    'The Mercedes-AMG G 63 is an icon reimagined. Combining legendary off-road capability with handcrafted AMG performance and unmistakeable luxury.',
    45000.00, 60000.00, 100000.00,
    'AUTOMATIC', 'PETROL', '4.0L Biturbo V8', 585,
    5, 4, 'AWD', 'Obsidian Black',
    nairobi_id, 'AVAILABLE', TRUE
  ),
  (
    'Porsche', '911 Carrera S', 2024, 'SPORTS_CAR',
    'The Porsche 911 Carrera S is synonymous with pure driving pleasure. Its rear-mounted flat-six engine and iconic silhouette make every journey an event.',
    35000.00, 48000.00, 75000.00,
    'AUTOMATIC', 'PETROL', '3.0L Twin Turbo Flat-6', 443,
    4, 2, 'RWD', 'GT Silver Metallic',
    westlands_id, 'AVAILABLE', FALSE
  ),
  (
    'Range Rover', 'Autobiography', 2024, 'SUV',
    'The Range Rover Autobiography defines supreme luxury motoring. Handcrafted interiors, commanding road presence, and effortless capability across any terrain.',
    40000.00, 55000.00, 90000.00,
    'AUTOMATIC', 'PETROL', '5.0L Supercharged V8', 518,
    5, 4, 'AWD', 'Santorini Black',
    jkia_id, 'AVAILABLE', TRUE
  ),
  (
    'Bentley', 'Continental GT', 2023, 'COUPE',
    'The Bentley Continental GT is the definitive grand tourer. Sculpted exterior, exquisite interior craftsmanship, and effortless power define this British icon.',
    80000.00, 100000.00, 200000.00,
    'AUTOMATIC', 'PETROL', '6.0L W12 Biturbo', 626,
    4, 2, 'AWD', 'Midnight Emerald',
    nairobi_id, 'AVAILABLE', TRUE
  ),
  (
    'Audi', 'RS7 Sportback', 2024, 'LUXURY_SEDAN',
    'The Audi RS7 Sportback blends supercar performance with everyday practicality. Four doors, five seats, 591hp, and a silhouette that commands attention.',
    30000.00, 42000.00, 65000.00,
    'AUTOMATIC', 'PETROL', '4.0L TFSI V8', 591,
    5, 4, 'AWD', 'Nardo Gray',
    westlands_id, 'AVAILABLE', FALSE
  )
  ON CONFLICT DO NOTHING;
END $$;

SELECT 'Migration 005 complete: Seed data inserted' AS result;
