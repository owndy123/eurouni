-- ============================================================
-- EuroUni Self-Contained Seed (no subquery chains)
-- Run AFTER setup-supabase.sql
-- ============================================================

-- Disable FK checks for faster insert
SET session_replication_role = 'replica';

-- ============================================================
-- REFERENCE TABLES (use fixed UUIDs)
-- ============================================================

DELETE FROM countries; -- clear existing
INSERT INTO countries (id, code, name, region) VALUES
('00000000-0000-0000-0000-6abc0dd3f459', 'SVK', 'Slovakia', 'Central Europe'),
('00000000-0000-0000-0000-f574ece9b655', 'CZE', 'Czech Republic', 'Central Europe'),
('00000000-0000-0000-0000-4a10e9335996', 'AUT', 'Austria', 'Central Europe'),
('00000000-0000-0000-0000-6f805bc5bbdb', 'POL', 'Poland', 'Central Europe'),
('00000000-0000-0000-0000-d4f57d108e24', 'HUN', 'Hungary', 'Central Europe'),
('00000000-0000-0000-0000-2359d81e641f', 'DEU', 'Germany', 'Western Europe'),
('00000000-0000-0000-0000-edc122ef5431', 'NLD', 'Netherlands', 'Western Europe');

DELETE FROM languages;
INSERT INTO languages (id, code, name, is_local) VALUES
('00000000-0000-0000-0000-9cfefed8fb94', 'en', 'English', false),
('00000000-0000-0000-0000-5f02f0889301', 'de', 'German', true),
('00000000-0000-0000-0000-41d6ad0761a5', 'sk', 'Slovak', true),
('00000000-0000-0000-0000-95cc64dd2825', 'cs', 'Czech', true),
('00000000-0000-0000-0000-288404204e3d', 'pl', 'Polish', true),
('00000000-0000-0000-0000-18bd9197cb1d', 'hu', 'Hungarian', true),
('00000000-0000-0000-0000-1a13105b7e4e', 'nl', 'Dutch', true);

DELETE FROM degree_types;
INSERT INTO degree_types (id, slug, name, level) VALUES
('00000000-0000-0000-0000-c2b7dae3df98', 'bachelor', 'Bachelor', 6),
('00000000-0000-0000-0000-eb0a19179762', 'master', 'Master', 7);

DELETE FROM instruction_types;
INSERT INTO instruction_types (id, slug, name, description) VALUES
('00000000-0000-0000-0000-ba0a6ddd94c7', 'english', 'English Taught', 'Program taught entirely in English'),
('00000000-0000-0000-0000-f5ddaf0ca792', 'local', 'Local Language', 'Program taught in local language'),
('00000000-0000-0000-0000-f6cb3e816496', 'both', 'Mixed', 'Program available in both English and local language');

DELETE FROM study_fields;
INSERT INTO study_fields (id, slug, name, keywords) VALUES
('00000000-0000-0000-0000-5f928eb9cadb', 'computer-science', 'Computer Science', ARRAY['cs', 'computing', 'software']),
('00000000-0000-0000-0000-5d554bc5f3d2', 'engineering', 'Engineering', ARRAY['mechanical', 'electrical', 'civil']),
('00000000-0000-0000-0000-f5d7e2532cc9', 'business', 'Business & Economics', ARRAY['management', 'finance']),
('00000000-0000-0000-0000-d9e5d212320e', 'medicine', 'Medicine & Health', ARRAY['health', 'pharmacy']),
('00000000-0000-0000-0000-8cfb10d3dd0a', 'physics', 'Physics', ARRAY['astrophysics', 'quantum']),
('00000000-0000-0000-0000-6ae28a55456b', 'mathematics', 'Mathematics', ARRAY['stats', 'statistics']),
('00000000-0000-0000-0000-dce09f281c35', 'chemistry', 'Chemistry', ARRAY['biochemistry']),
('00000000-0000-0000-0000-3c575fe4b6c0', 'biology', 'Biology', ARRAY['biotechnology']),
('00000000-0000-0000-0000-1231d487d9ac', 'psychology', 'Psychology', ARRAY['counseling']),
('00000000-0000-0000-0000-829a56cc8ffa', 'law', 'Law', ARRAY['legal']),
('00000000-0000-0000-0000-2c5f64ab07cc', 'art', 'Art & Design', ARRAY['design', 'music']);

DELETE FROM scoring_weight_configs;
INSERT INTO scoring_weight_configs (name, description, academic, location, language, budget, career, is_active) VALUES
('default', 'Default EuroUni weights', 0.25, 0.15, 0.20, 0.20, 0.20, true);

-- ============================================================
-- UNIVERSITIES (with hardcoded IDs)
-- ============================================================

DELETE FROM universities;

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-9c6f48812ad5', 'stuba', 'Slovak University of Technology in Bratislava', 'stuba', '00000000-0000-0000-0000-6abc0dd3f459', 'Bratislava', 'bratislava', 48.1538, 17.1071, 'https://www.stuba.sk', '🎓', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-21e54c6506d3', 'uniba', 'Comenius University in Bratislava', 'uniba', '00000000-0000-0000-0000-6abc0dd3f459', 'Bratislava', 'bratislava', 48.1409, 17.1127, 'https://www.uniba.sk', '📚', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-0751a57e358a', 'ukf', 'Constantine the Philosopher University in Nitra', 'ukf', '00000000-0000-0000-0000-6abc0dd3f459', 'Nitra', 'nitra', 48.3063, 18.0865, 'https://www.ukf.sk', '🏛️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-4ef3f1a25627', 'tuke', 'Technical University of Košice', 'tuke', '00000000-0000-0000-0000-6abc0dd3f459', 'Košice', 'koice', 48.7305, 21.2489, 'https://www.tuke.sk', '⚙️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-9b405d28f3d5', 'upjs', 'University of Pavol Jozef Šafárik in Košice', 'upjs', '00000000-0000-0000-0000-6abc0dd3f459', 'Košice', 'koice', 48.7167, 21.2333, 'https://www.upjs.sk', '🔬', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-a775e10b39f7', 'tu-zvolen', 'Technical University in Zvolen', 'tu-zvolen', '00000000-0000-0000-0000-6abc0dd3f459', 'Zvolen', 'zvolen', 48.5744, 19.1175, 'https://www.tuzvo.sk', '🌲', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-73a5c42a33b7', 'uvm', 'University of Veterinary Medicine in Košice', 'uvm', '00000000-0000-0000-0000-6abc0dd3f459', 'Košice', 'koice', 48.7489, 21.2254, 'https://www.uvm.sk', '🐾', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-ed9aed910f6f', 'akademia', 'Academy of Performing Arts in Bratislava', 'akademia', '00000000-0000-0000-0000-6abc0dd3f459', 'Bratislava', 'bratislava', 48.1456, 17.1073, 'https://www.akademia.sk', '🎭', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-f814368546cd', 'cuni', 'Charles University', 'cuni', '00000000-0000-0000-0000-f574ece9b655', 'Prague', 'prague', 50.0875, 14.4214, 'https://www.cuni.cz', '👑', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-7efdb7a39363', 'cvut', 'Czech Technical University in Prague', 'cvut', '00000000-0000-0000-0000-f574ece9b655', 'Prague', 'prague', 50.1028, 14.3902, 'https://www.cvut.cz', '⚡', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-2dce04b8fdef', 'vut-brno', 'Brno University of Technology', 'vut-brno', '00000000-0000-0000-0000-f574ece9b655', 'Brno', 'brno', 49.201, 16.6068, 'https://www.vut.cz', '🔧', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-29cf705cdb6d', 'muni', 'Masaryk University', 'muni', '00000000-0000-0000-0000-f574ece9b655', 'Brno', 'brno', 49.1999, 16.6068, 'https://www.muni.cz', '🎓', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-b560adc2e2f8', 'czu', 'Czech University of Life Sciences Prague', 'czu', '00000000-0000-0000-0000-f574ece9b655', 'Prague', 'prague', 50.1295, 14.3732, 'https://www.czu.cz', '🌾', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-a0fe045a2e46', 'upol', 'Palacký University Olomouc', 'upol', '00000000-0000-0000-0000-f574ece9b655', 'Olomouc', 'olomouc', 49.5939, 17.2508, 'https://www.upol.cz', '📖', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-a0485de5d321', 'osu', 'University of Ostrava', 'osu', '00000000-0000-0000-0000-f574ece9b655', 'Ostrava', 'ostrava', 49.8209, 18.2625, 'https://www.osu.cz', '🏭', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-12c1fdd074e0', 'utb', 'Tomas Bata University in Zlín', 'utb', '00000000-0000-0000-0000-f574ece9b655', 'Zlín', 'zln', 49.2401, 17.6667, 'https://www.utb.cz', '👟', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-bfa7c7c8b663', 'ujep', 'Jan Evangelista Purkyně University', 'ujep', '00000000-0000-0000-0000-f574ece9b655', 'Ústí nad Labem', 'st-nad-labem', 50.7714, 14.0419, 'https://www.ujep.cz', '🔬', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-74d6b467cc54', 'uwb', 'University of West Bohemia', 'uwb', '00000000-0000-0000-0000-f574ece9b655', 'Pilsen', 'pilsen', 49.7384, 13.3646, 'https://www.zcu.cz', '🎓', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-afaa18d16474', 'univie', 'University of Vienna', 'univie', '00000000-0000-0000-0000-4a10e9335996', 'Vienna', 'vienna', 48.2105, 16.3599, 'https://www.univie.ac.at', '🏰', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-1584dd753e55', 'tuw', 'TU Wien', 'tuw', '00000000-0000-0000-0000-4a10e9335996', 'Vienna', 'vienna', 48.1986, 16.3692, 'https://www.tuwien.ac.at', '⚙️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-cf336089a924', 'tu-graz', 'Graz University of Technology', 'tu-graz', '00000000-0000-0000-0000-4a10e9335996', 'Graz', 'graz', 47.0667, 15.45, 'https://www.tugraz.at', '🔩', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-f70add67369e', 'jku', 'Johannes Kepler University Linz', 'jku', '00000000-0000-0000-0000-4a10e9335996', 'Linz', 'linz', 48.3333, 14.2833, 'https://www.jku.at', '📊', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-a2bf9c55df2e', 'uibk', 'University of Innsbruck', 'uibk', '00000000-0000-0000-0000-4a10e9335996', 'Innsbruck', 'innsbruck', 47.2692, 11.4041, 'https://www.uibk.ac.at', '🏔️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-037b02f21d87', 'sbg', 'University of Salzburg', 'sbg', '00000000-0000-0000-0000-4a10e9335996', 'Salzburg', 'salzburg', 47.7964, 13.0456, 'https://www.plus.ac.at', '🎵', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-5aee53a60424', 'wu-wien', 'Vienna University of Economics and Business', 'wu-wien', '00000000-0000-0000-0000-4a10e9335996', 'Vienna', 'vienna', 48.2108, 16.3685, 'https://www.wu.ac.at', '💼', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-d0615ffdca85', 'mu-wien', 'Medical University of Vienna', 'mu-wien', '00000000-0000-0000-0000-4a10e9335996', 'Vienna', 'vienna', 48.2208, 16.3498, 'https://www.meduniwien.ac.at', '⚕️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-3eae63594a41', 'uw', 'University of Warsaw', 'uw', '00000000-0000-0000-0000-6f805bc5bbdb', 'Warsaw', 'warsaw', 52.2391, 21.0206, 'https://www.uw.edu.pl', '📚', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-8fe4c1145128', 'pw', 'Warsaw University of Technology', 'pw', '00000000-0000-0000-0000-6f805bc5bbdb', 'Warsaw', 'warsaw', 52.219, 21.0138, 'https://www.pw.edu.pl', '🔧', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-3d2c350ce8ca', 'uj', 'Jagiellonian University', 'uj', '00000000-0000-0000-0000-6f805bc5bbdb', 'Kraków', 'krakw', 50.0579, 19.9492, 'https://www.uj.edu.pl', '👑', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-5de08b97cd5c', 'agh', 'AGH University of Science and Technology', 'agh', '00000000-0000-0000-0000-6f805bc5bbdb', 'Kraków', 'krakw', 50.0657, 19.923, 'https://www.agh.edu.pl', '⚒️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-8e13ffc9fd9d', 'put', 'Poznań University of Technology', 'put', '00000000-0000-0000-0000-6f805bc5bbdb', 'Poznań', 'pozna', 52.4066, 16.9265, 'https://www.put.poznan.pl', '⚙️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-0df09d36ae7b', 'amu', 'Adam Mickiewicz University', 'amu', '00000000-0000-0000-0000-6f805bc5bbdb', 'Poznań', 'pozna', 52.4074, 16.9338, 'https://www.amu.edu.pl', '🎓', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-e0c2f4149272', 'uw-edu', 'University of Wrocław', 'uw-edu', '00000000-0000-0000-0000-6f805bc5bbdb', 'Wrocław', 'wrocaw', 51.1102, 17.032, 'https://www.uw.edu.pl', '📖', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-128d2ab4b71b', 'pwr', 'Wrocław University of Science and Technology', 'pwr', '00000000-0000-0000-0000-6f805bc5bbdb', 'Wrocław', 'wrocaw', 51.1075, 17.0592, 'https://www.pwr.edu.pl', '🔬', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-2a0617accf8b', 'ug', 'University of Gdańsk', 'ug', '00000000-0000-0000-0000-6f805bc5bbdb', 'Gdańsk', 'gdask', 54.4461, 18.5698, 'https://www.ug.edu.pl', '⚓', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-235ec52392b7', 'pg', 'Gdańsk University of Technology', 'pg', '00000000-0000-0000-0000-6f805bc5bbdb', 'Gdańsk', 'gdask', 54.4416, 18.5561, 'https://www.pg.edu.pl', '🏗️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-9db3976d35a1', 'elte', 'Eötvös Loránd University', 'elte', '00000000-0000-0000-0000-d4f57d108e24', 'Budapest', 'budapest', 47.4908, 19.0617, 'https://www.elte.hu', '📚', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-698458dc93cf', 'bme', 'Budapest University of Technology and Economics', 'bme', '00000000-0000-0000-0000-d4f57d108e24', 'Budapest', 'budapest', 47.4739, 19.0577, 'https://www.bme.hu', '⚙️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-0f998a5d9a9c', 'elte-ik', 'Eötvös Loránd University - Faculty of Informatics', 'elte-ik', '00000000-0000-0000-0000-d4f57d108e24', 'Budapest', 'budapest', 47.4935, 19.0626, 'https://www.inf.elte.hu', '💻', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-125b3331cb12', 'semmelweis', 'Semmelweis University', 'semmelweis', '00000000-0000-0000-0000-d4f57d108e24', 'Budapest', 'budapest', 47.5068, 19.0729, 'https://www.semmelweis.hu', '⚕️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-af06d04cb1c1', 'uni-miskolc', 'University of Miskolc', 'uni-miskolc', '00000000-0000-0000-0000-d4f57d108e24', 'Miskolc', 'miskolc', 48.1036, 20.7833, 'https://www.uni-miskolc.hu', '🏭', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-bcdae8bc747a', 'pte', 'University of Pécs', 'pte', '00000000-0000-0000-0000-d4f57d108e24', 'Pécs', 'pcs', 46.0807, 18.2183, 'https://www.pte.hu', '🎓', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-32be833c9d42', 'szte', 'University of Szeged', 'szte', '00000000-0000-0000-0000-d4f57d108e24', 'Szeged', 'szeged', 46.2469, 20.1456, 'https://www.u-szeged.hu', '☀️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-1e4071820b8b', 'debrecen', 'University of Debrecen', 'debrecen', '00000000-0000-0000-0000-d4f57d108e24', 'Debrecen', 'debrecen', 47.553, 21.6392, 'https://www.unideb.hu', '🌳', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-dc802ca9ea42', 'tum', 'Technical University of Munich', 'tum', '00000000-0000-0000-0000-2359d81e641f', 'Munich', 'munich', 48.396, 11.722, 'https://www.tum.de', '🏛️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-e67c711c0f6d', 'tum-wsi', 'TUM School of Management', 'tum-wsi', '00000000-0000-0000-0000-2359d81e641f', 'Munich', 'munich', 48.3744, 11.8533, 'https://www.wsi.tum.de', '💼', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-74b59ffc5c0b', 'tu-berlin', 'Technical University of Berlin', 'tu-berlin', '00000000-0000-0000-0000-2359d81e641f', 'Berlin', 'berlin', 52.5112, 13.397, 'https://www.tu.berlin', '⚡', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-3f2c02300113', 'rwth', 'RWTH Aachen University', 'rwth', '00000000-0000-0000-0000-2359d81e641f', 'Aachen', 'aachen', 50.7753, 6.0839, 'https://www.rwth-aachen.de', '🔬', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-ffa044f5d189', 'kit', 'Karlsruhe Institute of Technology', 'kit', '00000000-0000-0000-0000-2359d81e641f', 'Karlsruhe', 'karlsruhe', 49.0069, 8.4197, 'https://www.kit.edu', '🧪', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-e03d88c67062', 'tum-phy', 'TUM Department of Physics', 'tum-phy', '00000000-0000-0000-0000-2359d81e641f', 'Garching', 'garching', 48.2656, 11.6722, 'https://www.ph.tum.de', '⚛️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-6aa53a22ce1c', 'fub', 'Freie Universität Berlin', 'fub', '00000000-0000-0000-0000-2359d81e641f', 'Berlin', 'berlin', 52.4324, 13.5285, 'https://www.fu-berlin.de', '🕊️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-a814968cf84f', 'hu-berlin', 'Humboldt University of Berlin', 'hu-berlin', '00000000-0000-0000-0000-2359d81e641f', 'Berlin', 'berlin', 52.5169, 13.3976, 'https://www.hu-berlin.de', '🎭', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-5e43449506f7', 'lmu', 'Ludwig Maximilian University of Munich', 'lmu', '00000000-0000-0000-0000-2359d81e641f', 'Munich', 'munich', 48.1508, 11.5808, 'https://www.lmu.de', '👑', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-ec6f644a9e5c', 'heidelberg', 'Heidelberg University', 'heidelberg', '00000000-0000-0000-0000-2359d81e641f', 'Heidelberg', 'heidelberg', 49.3988, 8.6724, 'https://www.uni-heidelberg.de', '🏰', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-d3da5eb0da68', 'uva', 'University of Amsterdam', 'uva', '00000000-0000-0000-0000-edc122ef5431', 'Amsterdam', 'amsterdam', 52.3555, 4.9555, 'https://www.uva.nl', '🎓', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-29034b2eefb2', 'tue', 'Eindhoven University of Technology', 'tue', '00000000-0000-0000-0000-edc122ef5431', 'Eindhoven', 'eindhoven', 51.4416, 5.4697, 'https://www.tue.nl', '💡', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-d710b24bd72f', 'tudelft', 'Delft University of Technology', 'tudelft', '00000000-0000-0000-0000-edc122ef5431', 'Delft', 'delft', 51.9974, 4.3578, 'https://www.tudelft.nl', '⚙️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-ad009fb86b8e', 'leiden', 'Leiden University', 'leiden', '00000000-0000-0000-0000-edc122ef5431', 'Leiden', 'leiden', 52.1667, 4.4667, 'https://www.universiteitleiden.nl', '📜', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-1fee5882460d', 'utwente', 'University of Twente', 'utwente', '00000000-0000-0000-0000-edc122ef5431', 'Enschede', 'enschede', 52.2408, 6.8517, 'https://www.utwente.nl', '🔧', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-717de68e813c', 'rug', 'University of Groningen', 'rug', '00000000-0000-0000-0000-edc122ef5431', 'Groningen', 'groningen', 53.2194, 6.5665, 'https://www.rug.nl', '🌟', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-0730b75e96c0', 'vu', 'Vrije Universiteit Amsterdam', 'vu', '00000000-0000-0000-0000-edc122ef5431', 'Amsterdam', 'amsterdam', 52.3336, 4.8636, 'https://www.vu.nl', '✝️', true);

INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('00000000-0000-0000-0000-60a67f258110', 'radboud', 'Radboud University', 'radboud', '00000000-0000-0000-0000-edc122ef5431', 'Nijmegen', 'nijmegen', 51.8167, 5.8667, 'https://www.ru.nl', '🎓', true);

-- ============================================================
-- PROGRAMS (with hardcoded IDs, inline university lookups)
-- ============================================================

DELETE FROM programs;

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-f40d97722077', 'stuba-cs', '00000000-0000-0000-0000-9c6f48812ad5', 'Computer Science', 'stuba-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Premier technical program in Slovakia. Strong focus on algorithms, software engineering, and AI.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-f40d97722077', '2026/27', '2026-09-01', true, 180, 36, 0, 'Premier technical program in Slovakia. Strong focus on algorithms, software engineering, and AI.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-63a4724aa18e', 'stuba-arch', '00000000-0000-0000-0000-9c6f48812ad5', 'Architecture', 'stuba-arch', '00000000-0000-0000-0000-2c5f64ab07cc', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Design-focused architecture program with studio work and technical courses.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-63a4724aa18e', '2026/27', '2026-09-01', true, 300, 60, 0, 'Design-focused architecture program with studio work and technical courses.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-4854c07640b6', 'stuba-mech', '00000000-0000-0000-0000-9c6f48812ad5', 'Mechanical Engineering', 'stuba-mech', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Advanced mechanical engineering with focus on automotive and industrial design.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-4854c07640b6', '2026/27', '2026-09-01', true, 120, 24, 0, 'Advanced mechanical engineering with focus on automotive and industrial design.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-46e0a4704707', 'uniba-medicine', '00000000-0000-0000-0000-21e54c6506d3', 'General Medicine', 'uniba-medicine', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', '6-year medical program in English, recognized across EU. Clinical training in Bratislava hospitals.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-46e0a4704707', '2026/27', '2026-09-01', true, 360, 72, 10000, '6-year medical program in English, recognized across EU. Clinical training in Bratislava hospitals.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-2d1885b7075d', 'uniba-law', '00000000-0000-0000-0000-21e54c6506d3', 'Law', 'uniba-law', '00000000-0000-0000-0000-829a56cc8ffa', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Traditional law program preparing for legal careers in Slovakia and EU.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-2d1885b7075d', '2026/27', '2026-09-01', true, 240, 48, 0, 'Traditional law program preparing for legal careers in Slovakia and EU.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-0644a0c20857', 'uniba-psych', '00000000-0000-0000-0000-21e54c6506d3', 'Psychology', 'uniba-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Comprehensive psychology covering clinical, counseling, and research tracks.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-0644a0c20857', '2026/27', '2026-09-01', true, 180, 36, 0, 'Comprehensive psychology covering clinical, counseling, and research tracks.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-fdf891e05f43', 'uniba-pharm', '00000000-0000-0000-0000-21e54c6506d3', 'Pharmacy', 'uniba-pharm', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', '5-year pharmacy program in English, gateway to pharmaceutical careers.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-fdf891e05f43', '2026/27', '2026-09-01', true, 300, 60, 9000, '5-year pharmacy program in English, gateway to pharmaceutical careers.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-51e3f7359df4', 'tuke-cs', '00000000-0000-0000-0000-4ef3f1a25627', 'Computer Science', 'tuke-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Technical CS program in eastern Slovakia with strong industry connections.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-51e3f7359df4', '2026/27', '2026-09-01', true, 180, 36, 0, 'Technical CS program in eastern Slovakia with strong industry connections.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-e28cfe4e2973', 'tuke-mining', '00000000-0000-0000-0000-4ef3f1a25627', 'Mining Engineering', 'tuke-mining', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Unique program in mining, geology, and resource management.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-e28cfe4e2973', '2026/27', '2026-09-01', true, 180, 36, 0, 'Unique program in mining, geology, and resource management.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-03ba4a253ee5', 'upjs-cs', '00000000-0000-0000-0000-9b405d28f3d5', 'Applied Mathematics', 'upjs-cs', '00000000-0000-0000-0000-6ae28a55456b', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Research-focused mathematics with applications in cryptography and data science.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-03ba4a253ee5', '2026/27', '2026-09-01', true, 120, 24, 0, 'Research-focused mathematics with applications in cryptography and data science.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-6e9caa37bbc8', 'upjs-medicine', '00000000-0000-0000-0000-9b405d28f3d5', 'General Medicine', 'upjs-medicine', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'English-taught medical program in Kosice, modern facilities.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-6e9caa37bbc8', '2026/27', '2026-09-01', true, 360, 72, 10500, 'English-taught medical program in Kosice, modern facilities.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-99dfad5cf2f8', 'ukf-edu', '00000000-0000-0000-0000-0751a57e358a', 'Teacher Training', 'ukf-edu', '00000000-0000-0000-0000-2c5f64ab07cc', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Education program preparing teachers for primary and secondary schools.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-99dfad5cf2f8', '2026/27', '2026-09-01', true, 180, 36, 0, 'Education program preparing teachers for primary and secondary schools.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-3d5d7e5894d0', 'cvut-cs', '00000000-0000-0000-0000-7efdb7a39363', 'Computer Science', 'cvut-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Top-tier technical CS program in Prague. Strong in algorithms and systems.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-3d5d7e5894d0', '2026/27', '2026-09-01', true, 180, 36, 0, 'Top-tier technical CS program in Prague. Strong in algorithms and systems.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-ed986c112a84', 'cvut-ai', '00000000-0000-0000-0000-7efdb7a39363', 'Artificial Intelligence', 'cvut-ai', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Advanced AI program covering ML, deep learning, and robotics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-ed986c112a84', '2026/27', '2026-09-01', true, 120, 24, 0, 'Advanced AI program covering ML, deep learning, and robotics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-b063f4bf386e', 'cvut-civil', '00000000-0000-0000-0000-7efdb7a39363', 'Civil Engineering', 'cvut-civil', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Comprehensive civil engineering with structural and infrastructure focus.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-b063f4bf386e', '2026/27', '2026-09-01', true, 240, 48, 0, 'Comprehensive civil engineering with structural and infrastructure focus.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-2921a20a53ea', 'muni-cs', '00000000-0000-0000-0000-29cf705cdb6d', 'Computer Science', 'muni-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Modern CS program in Brno with specializations in AI, security, and web.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-2921a20a53ea', '2026/27', '2026-09-01', true, 180, 36, 2000, 'Modern CS program in Brno with specializations in AI, security, and web.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-6ce66e6b6015', 'muni-data', '00000000-0000-0000-0000-29cf705cdb6d', 'Data Science', 'muni-data', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Data science program covering ML, statistics, and big data technologies.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-6ce66e6b6015', '2026/27', '2026-09-01', true, 120, 24, 2500, 'Data science program covering ML, statistics, and big data technologies.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-84682109e528', 'muni-econ', '00000000-0000-0000-0000-29cf705cdb6d', 'Economics', 'muni-econ', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Economics with focus on data analysis and international markets.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-84682109e528', '2026/27', '2026-09-01', true, 180, 36, 1500, 'Economics with focus on data analysis and international markets.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-656683193fb2', 'muni-psych', '00000000-0000-0000-0000-29cf705cdb6d', 'Psychology', 'muni-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Research-oriented psychology program in English.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-656683193fb2', '2026/27', '2026-09-01', true, 180, 36, 2500, 'Research-oriented psychology program in English.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-a785866e7c4a', 'vut-ee', '00000000-0000-0000-0000-2dce04b8fdef', 'Electrical Engineering', 'vut-ee', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Strong EE program with focus on electronics and power systems.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-a785866e7c4a', '2026/27', '2026-09-01', true, 180, 36, 0, 'Strong EE program with focus on electronics and power systems.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-c017baabfb92', 'vut-mech', '00000000-0000-0000-0000-2dce04b8fdef', 'Mechanical Engineering', 'vut-mech', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Advanced mechanical engineering with industry partnerships.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-c017baabfb92', '2026/27', '2026-09-01', true, 120, 24, 0, 'Advanced mechanical engineering with industry partnerships.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-a4bb31137d06', 'upol-cs', '00000000-0000-0000-0000-a0fe045a2e46', 'Informatics', 'upol-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Comprehensive informatics program in historic Olomouc.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-a4bb31137d06', '2026/27', '2026-09-01', true, 180, 36, 0, 'Comprehensive informatics program in historic Olomouc.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-b64d03f4b9da', 'tu-graz-cs', '00000000-0000-0000-0000-cf336089a924', 'Computer Science', 'tu-graz-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Technical CS in German with strong industry links in Austria.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-b64d03f4b9da', '2026/27', '2026-09-01', true, 180, 36, 0, 'Technical CS in German with strong industry links in Austria.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-583625441dcd', 'tu-graz-se', '00000000-0000-0000-0000-cf336089a924', 'Software Engineering', 'tu-graz-se', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'English-taught SE masters with industry projects.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-583625441dcd', '2026/27', '2026-09-01', true, 120, 24, 0, 'English-taught SE masters with industry projects.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-da19615d90e0', 'jku-cs', '00000000-0000-0000-0000-f70add67369e', 'Computer Science', 'jku-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'CS in Linz with special focus on AI and data science.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-da19615d90e0', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in Linz with special focus on AI and data science.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-2ec23b4a983d', 'jku-mgt', '00000000-0000-0000-0000-f70add67369e', 'Business Informatics', 'jku-mgt', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Combination of business and IT in German.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-2ec23b4a983d', '2026/27', '2026-09-01', true, 120, 24, 0, 'Combination of business and IT in German.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-f76bdc9e847d', 'wu-wien-ib', '00000000-0000-0000-0000-5aee53a60424', 'International Business', 'wu-wien-ib', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Top business program in Vienna, German instruction.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-f76bdc9e847d', '2026/27', '2026-09-01', true, 180, 36, 0, 'Top business program in Vienna, German instruction.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-024328cedf55', 'wu-wien-fin', '00000000-0000-0000-0000-5aee53a60424', 'Finance', 'wu-wien-fin', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'English-taught finance masters in Vienna.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-024328cedf55', '2026/27', '2026-09-01', true, 120, 24, 0, 'English-taught finance masters in Vienna.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-a937f36c78ee', 'uw-cs', '00000000-0000-0000-0000-3eae63594a41', 'Computer Science', 'uw-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-288404204e3d', 'Top CS in Poland, Warsaw. Polish instruction.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-a937f36c78ee', '2026/27', '2026-09-01', true, 180, 36, 0, 'Top CS in Poland, Warsaw. Polish instruction.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-7999cc942b3c', 'uw-phys', '00000000-0000-0000-0000-3eae63594a41', 'Physics', 'uw-phys', '00000000-0000-0000-0000-8cfb10d3dd0a', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-288404204e3d', 'Research-focused physics in Warsaw.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-7999cc942b3c', '2026/27', '2026-09-01', true, 180, 36, 0, 'Research-focused physics in Warsaw.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-6f58459bea7d', 'agh-cs', '00000000-0000-0000-0000-5de08b97cd5c', 'Computer Science', 'agh-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'English-taught CS at top Polish technical university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-6f58459bea7d', '2026/27', '2026-09-01', true, 180, 36, 0, 'English-taught CS at top Polish technical university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-2864160484c4', 'uj-medicine', '00000000-0000-0000-0000-3d2c350ce8ca', 'General Medicine', 'uj-medicine', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'English medical program in historic Krakow.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-2864160484c4', '2026/27', '2026-09-01', true, 360, 72, 12000, 'English medical program in historic Krakow.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-2675574de46a', 'elte-cs', '00000000-0000-0000-0000-9db3976d35a1', 'Computer Science', 'elte-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-18bd9197cb1d', 'Top CS at Hungarys largest university, Budapest.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-2675574de46a', '2026/27', '2026-09-01', true, 180, 36, 0, 'Top CS at Hungarys largest university, Budapest.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-f155fe5ebc3f', 'elte-math', '00000000-0000-0000-0000-9db3976d35a1', 'Mathematics', 'elte-math', '00000000-0000-0000-0000-6ae28a55456b', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-18bd9197cb1d', 'Strong math program with various specializations.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-f155fe5ebc3f', '2026/27', '2026-09-01', true, 180, 36, 0, 'Strong math program with various specializations.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-a9b73618f9e3', 'bme-ee', '00000000-0000-0000-0000-698458dc93cf', 'Electrical Engineering', 'bme-ee', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-18bd9197cb1d', 'Premier engineering at Budapests technical university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-a9b73618f9e3', '2026/27', '2026-09-01', true, 210, 42, 0, 'Premier engineering at Budapests technical university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-b53dc7439972', 'bme-cs', '00000000-0000-0000-0000-698458dc93cf', 'Computer Science', 'bme-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'English-taught CS masters at top technical university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-b53dc7439972', '2026/27', '2026-09-01', true, 120, 24, 0, 'English-taught CS masters at top technical university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-6c56b3136055', 'semmelweis-med', '00000000-0000-0000-0000-125b3331cb12', 'General Medicine', 'semmelweis-med', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Medical program in English, oldest medical school in Hungary.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-6c56b3136055', '2026/27', '2026-09-01', true, 360, 72, 12000, 'Medical program in English, oldest medical school in Hungary.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-130cd511be8b', 'debrecen-cs', '00000000-0000-0000-0000-1e4071820b8b', 'Computer Science', 'debrecen-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'English-taught CS in eastern Hungary.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-130cd511be8b', '2026/27', '2026-09-01', true, 180, 36, 0, 'English-taught CS in eastern Hungary.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-86134ff63db5', 'tu-berlin-cs', '00000000-0000-0000-0000-74b59ffc5c0b', 'Computer Science', 'tu-berlin-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'CS in Berlin, German instruction.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-86134ff63db5', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in Berlin, German instruction.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-3c31afd424c8', 'tu-berlin-data', '00000000-0000-0000-0000-74b59ffc5c0b', 'Data Engineering', 'tu-berlin-data', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'English-taught data engineering in Berlin.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-3c31afd424c8', '2026/27', '2026-09-01', true, 120, 24, 0, 'English-taught data engineering in Berlin.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-aa72624d5198', 'rwth-cs', '00000000-0000-0000-0000-3f2c02300113', 'Computer Science', 'rwth-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Top CS at Germanys technical elite university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-aa72624d5198', '2026/27', '2026-09-01', true, 180, 36, 0, 'Top CS at Germanys technical elite university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-963c103ad332', 'kit-cs', '00000000-0000-0000-0000-ffa044f5d189', 'Computer Science', 'kit-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Excellent CS in Karlsruhe, tech hub.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-963c103ad332', '2026/27', '2026-09-01', true, 180, 36, 0, 'Excellent CS in Karlsruhe, tech hub.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-09800679ee8d', 'kit-data', '00000000-0000-0000-0000-ffa044f5d189', 'Data Science', 'kit-data', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Data science at top German research university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-09800679ee8d', '2026/27', '2026-09-01', true, 120, 24, 0, 'Data science at top German research university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-705fdb850309', 'tudelft-ae', '00000000-0000-0000-0000-d710b24bd72f', 'Aerospace Engineering', 'tudelft-ae', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'World-class aerospace program in Delft.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-705fdb850309', '2026/27', '2026-09-01', true, 180, 36, 2000, 'World-class aerospace program in Delft.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-bf3463f8df94', 'tudelft-cs', '00000000-0000-0000-0000-d710b24bd72f', 'Computer Science', 'tudelft-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Elite CS masters in Netherlands.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-bf3463f8df94', '2026/27', '2026-09-01', true, 120, 24, 2500, 'Elite CS masters in Netherlands.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-667a4eb903c3', 'tue-cs', '00000000-0000-0000-0000-29034b2eefb2', 'Computer Science', 'tue-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Tech-focused CS in Eindhoven tech hub.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-667a4eb903c3', '2026/27', '2026-09-01', true, 180, 36, 2000, 'Tech-focused CS in Eindhoven tech hub.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-467208871fa6', 'rug-cs', '00000000-0000-0000-0000-717de68e813c', 'Computer Science', 'rug-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'CS in northern Netherlands, English taught.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-467208871fa6', '2026/27', '2026-09-01', true, 180, 36, 2000, 'CS in northern Netherlands, English taught.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-edf3567ce573', 'rug-ai', '00000000-0000-0000-0000-717de68e813c', 'Artificial Intelligence', 'rug-ai', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'AI masters in Groningen.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-edf3567ce573', '2026/27', '2026-09-01', true, 120, 24, 2500, 'AI masters in Groningen.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-d1d03aaf31f8', 'ukf-psych', '00000000-0000-0000-0000-0751a57e358a', 'Psychology', 'ukf-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Psychology program focusing on clinical and counseling applications.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-d1d03aaf31f8', '2026/27', '2026-09-01', true, 180, 36, 0, 'Psychology program focusing on clinical and counseling applications.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-c8fad0b81636', 'ukf-business', '00000000-0000-0000-0000-0751a57e358a', 'Business Administration', 'ukf-business', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Business program with focus on management and marketing.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-c8fad0b81636', '2026/27', '2026-09-01', true, 180, 36, 0, 'Business program with focus on management and marketing.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-cefe10ceaa74', 'tuzvolen-forest', '00000000-0000-0000-0000-a775e10b39f7', 'Forestry', 'tuzvolen-forest', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Sustainable forest management and wood science.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-cefe10ceaa74', '2026/27', '2026-09-01', true, 180, 36, 0, 'Sustainable forest management and wood science.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-40f796607d07', 'tuzvolen-env', '00000000-0000-0000-0000-a775e10b39f7', 'Environmental Engineering', 'tuzvolen-env', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Environmental protection and sustainable development.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-40f796607d07', '2026/27', '2026-09-01', true, 120, 24, 0, 'Environmental protection and sustainable development.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-3063cd7874ad', 'uvm-vet', '00000000-0000-0000-0000-73a5c42a33b7', 'Veterinary Medicine', 'uvm-vet', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', '6-year veterinary program recognized in EU.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-3063cd7874ad', '2026/27', '2026-09-01', true, 360, 72, 11000, '6-year veterinary program recognized in EU.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-7d95e28be56f', 'uvm-animal', '00000000-0000-0000-0000-73a5c42a33b7', 'Animal Science', 'uvm-animal', '00000000-0000-0000-0000-3c575fe4b6c0', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Advanced animal husbandry and welfare.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-7d95e28be56f', '2026/27', '2026-09-01', true, 120, 24, 5000, 'Advanced animal husbandry and welfare.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-a7358e659b80', 'akademia-music', '00000000-0000-0000-0000-ed9aed910f6f', 'Music Performance', 'akademia-music', '00000000-0000-0000-0000-2c5f64ab07cc', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Performance degrees in classical music.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-a7358e659b80', '2026/27', '2026-09-01', true, 120, 24, 0, 'Performance degrees in classical music.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-0447a24caa48', 'akademia-theater', '00000000-0000-0000-0000-ed9aed910f6f', 'Theater Studies', 'akademia-theater', '00000000-0000-0000-0000-2c5f64ab07cc', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Acting and theater production.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-0447a24caa48', '2026/27', '2026-09-01', true, 180, 36, 0, 'Acting and theater production.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-bc9054b23031', 'cuni-cs', '00000000-0000-0000-0000-f814368546cd', 'Computer Science', 'cuni-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Premier CS program at Czech oldest university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-bc9054b23031', '2026/27', '2026-09-01', true, 180, 36, 0, 'Premier CS program at Czech oldest university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-3c37205482ef', 'cuni-math', '00000000-0000-0000-0000-f814368546cd', 'Mathematics', 'cuni-math', '00000000-0000-0000-0000-6ae28a55456b', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Pure and applied mathematics in Prague.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-3c37205482ef', '2026/27', '2026-09-01', true, 180, 36, 0, 'Pure and applied mathematics in Prague.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-9db8720dced9', 'cuni-phys', '00000000-0000-0000-0000-f814368546cd', 'Physics', 'cuni-phys', '00000000-0000-0000-0000-8cfb10d3dd0a', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Theoretical and experimental physics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-9db8720dced9', '2026/27', '2026-09-01', true, 180, 36, 0, 'Theoretical and experimental physics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-601082fd7969', 'cuni-psych', '00000000-0000-0000-0000-f814368546cd', 'Psychology', 'cuni-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Clinical and research psychology.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-601082fd7969', '2026/27', '2026-09-01', true, 120, 24, 3000, 'Clinical and research psychology.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-97693beded13', 'cuni-law', '00000000-0000-0000-0000-f814368546cd', 'Law', 'cuni-law', '00000000-0000-0000-0000-829a56cc8ffa', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Traditional law degree in Prague.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-97693beded13', '2026/27', '2026-09-01', true, 240, 48, 0, 'Traditional law degree in Prague.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-af9555fd75b2', 'czu-agri', '00000000-0000-0000-0000-b560adc2e2f8', 'Agriculture', 'czu-agri', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Modern agriculture and food sciences.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-af9555fd75b2', '2026/27', '2026-09-01', true, 180, 36, 0, 'Modern agriculture and food sciences.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-463bf3140c35', 'czu-env', '00000000-0000-0000-0000-b560adc2e2f8', 'Environmental Science', 'czu-env', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Sustainable resource management.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-463bf3140c35', '2026/27', '2026-09-01', true, 120, 24, 0, 'Sustainable resource management.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-15e6b39a9552', 'czu-econ', '00000000-0000-0000-0000-b560adc2e2f8', 'Economics', 'czu-econ', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Agricultural and resource economics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-15e6b39a9552', '2026/27', '2026-09-01', true, 180, 36, 0, 'Agricultural and resource economics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-651712771d83', 'osu-cs', '00000000-0000-0000-0000-a0485de5d321', 'Computer Science', 'osu-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'CS program in industrial Moravia.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-651712771d83', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS program in industrial Moravia.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-b6f2eee07f21', 'osu-psych', '00000000-0000-0000-0000-a0485de5d321', 'Psychology', 'osu-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Psychology with clinical focus.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-b6f2eee07f21', '2026/27', '2026-09-01', true, 180, 36, 0, 'Psychology with clinical focus.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-7e0fb9c97055', 'osu-teacher', '00000000-0000-0000-0000-a0485de5d321', 'Teacher Training', 'osu-teacher', '00000000-0000-0000-0000-2c5f64ab07cc', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Secondary school teacher education.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-7e0fb9c97055', '2026/27', '2026-09-01', true, 120, 24, 0, 'Secondary school teacher education.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-713360ddea4a', 'utb-business', '00000000-0000-0000-0000-12c1fdd074e0', 'Business Administration', 'utb-business', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Modern business in emerging region.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-713360ddea4a', '2026/27', '2026-09-01', true, 180, 36, 1500, 'Modern business in emerging region.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-e523e42d417d', 'utb-multimedia', '00000000-0000-0000-0000-12c1fdd074e0', 'Multimedia Communication', 'utb-multimedia', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Digital media and communications.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-e523e42d417d', '2026/27', '2026-09-01', true, 120, 24, 2000, 'Digital media and communications.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-5c34debce7a9', 'ujep-cs', '00000000-0000-0000-0000-bfa7c7c8b663', 'Informatics', 'ujep-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Applied informatics in north Bohemia.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-5c34debce7a9', '2026/27', '2026-09-01', true, 180, 36, 0, 'Applied informatics in north Bohemia.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-f24b6193791f', 'ujep-phys', '00000000-0000-0000-0000-bfa7c7c8b663', 'Physics', 'ujep-phys', '00000000-0000-0000-0000-8cfb10d3dd0a', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Applied physics program.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-f24b6193791f', '2026/27', '2026-09-01', true, 120, 24, 0, 'Applied physics program.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-0fb569fcc6ac', 'uwb-cs', '00000000-0000-0000-0000-74d6b467cc54', 'Computer Science', 'uwb-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'CS in western Bohemia.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-0fb569fcc6ac', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in western Bohemia.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-22214218baf9', 'uwb-electrical', '00000000-0000-0000-0000-74d6b467cc54', 'Electrical Engineering', 'uwb-electrical', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Power systems and electronics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-22214218baf9', '2026/27', '2026-09-01', true, 120, 24, 0, 'Power systems and electronics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-37069d07675b', 'uwb-mech', '00000000-0000-0000-0000-74d6b467cc54', 'Mechanical Engineering', 'uwb-mech', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Design and manufacturing.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-37069d07675b', '2026/27', '2026-09-01', true, 180, 36, 0, 'Design and manufacturing.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-aa434a23762d', 'univie-cs', '00000000-0000-0000-0000-afaa18d16474', 'Computer Science', 'univie-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'CS at Austrias largest university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-aa434a23762d', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS at Austrias largest university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-6a8f2c547e50', 'univie-psych', '00000000-0000-0000-0000-afaa18d16474', 'Psychology', 'univie-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Research-oriented psychology in Vienna.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-6a8f2c547e50', '2026/27', '2026-09-01', true, 180, 36, 0, 'Research-oriented psychology in Vienna.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-2c4f1a0afc08', 'univie-phys', '00000000-0000-0000-0000-afaa18d16474', 'Physics', 'univie-phys', '00000000-0000-0000-0000-8cfb10d3dd0a', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Theoretical and experimental physics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-2c4f1a0afc08', '2026/27', '2026-09-01', true, 120, 24, 0, 'Theoretical and experimental physics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-dd918724fda4', 'univie-math', '00000000-0000-0000-0000-afaa18d16474', 'Mathematics', 'univie-math', '00000000-0000-0000-0000-6ae28a55456b', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Pure and applied mathematics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-dd918724fda4', '2026/27', '2026-09-01', true, 180, 36, 0, 'Pure and applied mathematics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-1b1625703bab', 'univie-law', '00000000-0000-0000-0000-afaa18d16474', 'Law', 'univie-law', '00000000-0000-0000-0000-829a56cc8ffa', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Traditional law program in Vienna.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-1b1625703bab', '2026/27', '2026-09-01', true, 240, 48, 0, 'Traditional law program in Vienna.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-dd56a46fce64', 'tuw-cs', '00000000-0000-0000-0000-1584dd753e55', 'Computer Science', 'tuw-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Technical CS at Vienna University of Technology.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-dd56a46fce64', '2026/27', '2026-09-01', true, 180, 36, 0, 'Technical CS at Vienna University of Technology.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-c2aa5ec9f504', 'tuw-software', '00000000-0000-0000-0000-1584dd753e55', 'Software Engineering', 'tuw-software', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'English-taught SE masters.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-c2aa5ec9f504', '2026/27', '2026-09-01', true, 120, 24, 0, 'English-taught SE masters.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-810489cefb51', 'tuw-mech', '00000000-0000-0000-0000-1584dd753e55', 'Mechanical Engineering', 'tuw-mech', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Full mechanical engineering program.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-810489cefb51', '2026/27', '2026-09-01', true, 240, 48, 0, 'Full mechanical engineering program.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-87fbbfce1825', 'uibk-cs', '00000000-0000-0000-0000-a2bf9c55df2e', 'Computer Science', 'uibk-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'CS in Tyrol with Alpine research.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-87fbbfce1825', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in Tyrol with Alpine research.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-c10d645ebd96', 'uibk-sports', '00000000-0000-0000-0000-a2bf9c55df2e', 'Sports Science', 'uibk-sports', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Sports physiology and coaching.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-c10d645ebd96', '2026/27', '2026-09-01', true, 120, 24, 0, 'Sports physiology and coaching.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-70aa5b379932', 'uibk-env', '00000000-0000-0000-0000-a2bf9c55df2e', 'Environmental Science', 'uibk-env', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Alpine ecology and climate.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-70aa5b379932', '2026/27', '2026-09-01', true, 120, 24, 0, 'Alpine ecology and climate.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-de64f8afa156', 'sbg-cs', '00000000-0000-0000-0000-037b02f21d87', 'Computer Science', 'sbg-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'CS in historic Salzburg.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-de64f8afa156', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in historic Salzburg.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-093edc5f8001', 'sbg-edu', '00000000-0000-0000-0000-037b02f21d87', 'Education Science', 'sbg-edu', '00000000-0000-0000-0000-2c5f64ab07cc', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Teacher education research.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-093edc5f8001', '2026/27', '2026-09-01', true, 120, 24, 0, 'Teacher education research.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-c00f0c6b41f9', 'mu-wien-med', '00000000-0000-0000-0000-d0615ffdca85', 'General Medicine', 'mu-wien-med', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Medical program in German at Medical University of Vienna.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-c00f0c6b41f9', '2026/27', '2026-09-01', true, 360, 72, 0, 'Medical program in German at Medical University of Vienna.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-59cd1311a01b', 'mu-wien-dent', '00000000-0000-0000-0000-d0615ffdca85', 'Dental Medicine', 'mu-wien-dent', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Dental surgery program.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-59cd1311a01b', '2026/27', '2026-09-01', true, 300, 60, 0, 'Dental surgery program.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-805dd8f33d26', 'pw-cs', '00000000-0000-0000-0000-8fe4c1145128', 'Computer Science', 'pw-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-288404204e3d', 'Premier technical CS in Poland.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-805dd8f33d26', '2026/27', '2026-09-01', true, 210, 42, 0, 'Premier technical CS in Poland.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-d49b248a3672', 'pw-electrical', '00000000-0000-0000-0000-8fe4c1145128', 'Electrical Engineering', 'pw-electrical', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-288404204e3d', 'Power systems and automation.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-d49b248a3672', '2026/27', '2026-09-01', true, 210, 42, 0, 'Power systems and automation.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-2e941d2dc281', 'pw-mech', '00000000-0000-0000-0000-8fe4c1145128', 'Mechanical Engineering', 'pw-mech', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Advanced mechanical design.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-2e941d2dc281', '2026/27', '2026-09-01', true, 120, 24, 0, 'Advanced mechanical design.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-21aece5cf553', 'put-cs', '00000000-0000-0000-0000-8e13ffc9fd9d', 'Computer Science', 'put-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'English CS in western Poland.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-21aece5cf553', '2026/27', '2026-09-01', true, 210, 42, 0, 'English CS in western Poland.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-35eba701e27d', 'put-electrical', '00000000-0000-0000-0000-8e13ffc9fd9d', 'Electrical Engineering', 'put-electrical', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-288404204e3d', 'Electronics and telecommunications.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-35eba701e27d', '2026/27', '2026-09-01', true, 210, 42, 0, 'Electronics and telecommunications.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-8c06237df644', 'amu-psych', '00000000-0000-0000-0000-0df09d36ae7b', 'Psychology', 'amu-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Clinical and counseling psychology.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-8c06237df644', '2026/27', '2026-09-01', true, 180, 36, 0, 'Clinical and counseling psychology.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-699dffaf4229', 'amu-history', '00000000-0000-0000-0000-0df09d36ae7b', 'History', 'amu-history', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-288404204e3d', 'Polish and European history.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-699dffaf4229', '2026/27', '2026-09-01', true, 180, 36, 0, 'Polish and European history.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-3c1df00fde4a', 'amu-math', '00000000-0000-0000-0000-0df09d36ae7b', 'Mathematics', 'amu-math', '00000000-0000-0000-0000-6ae28a55456b', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Pure and applied mathematics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-3c1df00fde4a', '2026/27', '2026-09-01', true, 120, 24, 0, 'Pure and applied mathematics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-1e96695ab9dc', 'uw-edu-cs', '00000000-0000-0000-0000-e0c2f4149272', 'Computer Science', 'uw-edu-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'CS in Lower Silesia.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-1e96695ab9dc', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in Lower Silesia.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-a09e8887d0eb', 'uw-edu-phys', '00000000-0000-0000-0000-e0c2f4149272', 'Physics', 'uw-edu-phys', '00000000-0000-0000-0000-8cfb10d3dd0a', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-288404204e3d', 'Physics and astronomy.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-a09e8887d0eb', '2026/27', '2026-09-01', true, 180, 36, 0, 'Physics and astronomy.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-2621df064e3a', 'pwr-cs', '00000000-0000-0000-0000-128d2ab4b71b', 'Computer Science', 'pwr-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Technical CS in Wroclaw.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-2621df064e3a', '2026/27', '2026-09-01', true, 210, 42, 0, 'Technical CS in Wroclaw.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-451fd71d3502', 'pwr-data', '00000000-0000-0000-0000-128d2ab4b71b', 'Data Science', 'pwr-data', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'ML and big data analytics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-451fd71d3502', '2026/27', '2026-09-01', true, 120, 24, 0, 'ML and big data analytics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-8981153d0bb5', 'pwr-chem', '00000000-0000-0000-0000-128d2ab4b71b', 'Chemical Engineering', 'pwr-chem', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-288404204e3d', 'Process engineering and chemistry.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-8981153d0bb5', '2026/27', '2026-09-01', true, 210, 42, 0, 'Process engineering and chemistry.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-0405fed91383', 'ug-cs', '00000000-0000-0000-0000-2a0617accf8b', 'Computer Science', 'ug-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'CS on Baltic coast.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-0405fed91383', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS on Baltic coast.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-8ae5b86f6512', 'ug-law', '00000000-0000-0000-0000-2a0617accf8b', 'Law', 'ug-law', '00000000-0000-0000-0000-829a56cc8ffa', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-288404204e3d', 'Maritime and international law.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-8ae5b86f6512', '2026/27', '2026-09-01', true, 240, 48, 0, 'Maritime and international law.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-fbd5dcb52d58', 'ug-psych', '00000000-0000-0000-0000-2a0617accf8b', 'Psychology', 'ug-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Clinical psychology on Baltic coast.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-fbd5dcb52d58', '2026/27', '2026-09-01', true, 120, 24, 0, 'Clinical psychology on Baltic coast.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-fdb155fad169', 'pg-cs', '00000000-0000-0000-0000-235ec52392b7', 'Computer Science', 'pg-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Technical CS for Baltic tech hub.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-fdb155fad169', '2026/27', '2026-09-01', true, 210, 42, 0, 'Technical CS for Baltic tech hub.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-4b58202e1405', 'pg-civil', '00000000-0000-0000-0000-235ec52392b7', 'Civil Engineering', 'pg-civil', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Structural and maritime engineering.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-4b58202e1405', '2026/27', '2026-09-01', true, 120, 24, 0, 'Structural and maritime engineering.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-9d9170cc4b74', 'elte-ik-cs', '00000000-0000-0000-0000-0f998a5d9a9c', 'Computer Science', 'elte-ik-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-18bd9197cb1d', 'CS at ELTE Faculty of Informatics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-9d9170cc4b74', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS at ELTE Faculty of Informatics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-51b1f1956874', 'elte-ik-gamedev', '00000000-0000-0000-0000-0f998a5d9a9c', 'Game Development', 'elte-ik-gamedev', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Digital media and game design.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-51b1f1956874', '2026/27', '2026-09-01', true, 120, 24, 0, 'Digital media and game design.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-6819f789a6db', 'uni-misc-cs', '00000000-0000-0000-0000-af06d04cb1c1', 'Computer Science', 'uni-misc-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-18bd9197cb1d', 'CS in industrial Hungary.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-6819f789a6db', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in industrial Hungary.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-acf1d892033e', 'uni-misc-eng', '00000000-0000-0000-0000-af06d04cb1c1', 'Materials Science', 'uni-misc-eng', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Metallurgy and material engineering.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-acf1d892033e', '2026/27', '2026-09-01', true, 120, 24, 0, 'Metallurgy and material engineering.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-3c2c4667c5e7', 'uni-misc-law', '00000000-0000-0000-0000-af06d04cb1c1', 'Law', 'uni-misc-law', '00000000-0000-0000-0000-829a56cc8ffa', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-18bd9197cb1d', 'Traditional law degree.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-3c2c4667c5e7', '2026/27', '2026-09-01', true, 240, 48, 0, 'Traditional law degree.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-7a863e3ada34', 'pte-cs', '00000000-0000-0000-0000-bcdae8bc747a', 'Computer Science', 'pte-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'CS in southern Hungary.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-7a863e3ada34', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in southern Hungary.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-8307f4ce9e80', 'pte-psych', '00000000-0000-0000-0000-bcdae8bc747a', 'Psychology', 'pte-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-18bd9197cb1d', 'Clinical and educational psychology.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-8307f4ce9e80', '2026/27', '2026-09-01', true, 180, 36, 0, 'Clinical and educational psychology.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-613a145471fe', 'pte-bus', '00000000-0000-0000-0000-bcdae8bc747a', 'Business Administration', 'pte-bus', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'International business management.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-613a145471fe', '2026/27', '2026-09-01', true, 120, 24, 0, 'International business management.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-aeddf6df5ff6', 'szte-cs', '00000000-0000-0000-0000-32be833c9d42', 'Computer Science', 'szte-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'CS in sunny southern Hungary.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-aeddf6df5ff6', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in sunny southern Hungary.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-86bc7ad1821f', 'szte-medicine', '00000000-0000-0000-0000-32be833c9d42', 'General Medicine', 'szte-medicine', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'English medical program in Szeged.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-86bc7ad1821f', '2026/27', '2026-09-01', true, 360, 72, 8000, 'English medical program in Szeged.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-24b7c2da1af2', 'szte-edu', '00000000-0000-0000-0000-32be833c9d42', 'Teacher Training', 'szte-edu', '00000000-0000-0000-0000-2c5f64ab07cc', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-18bd9197cb1d', 'Primary and secondary teacher education.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-24b7c2da1af2', '2026/27', '2026-09-01', true, 180, 36, 0, 'Primary and secondary teacher education.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-f0cd317a6d20', 'tum-cs', '00000000-0000-0000-0000-dc802ca9ea42', 'Computer Science', 'tum-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Elite CS at Bavarias top university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-f0cd317a6d20', '2026/27', '2026-09-01', true, 180, 36, 0, 'Elite CS at Bavarias top university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-22cb07681cbf', 'tum-robotics', '00000000-0000-0000-0000-dc802ca9ea42', 'Robotics', 'tum-robotics', '00000000-0000-0000-0000-5d554bc5f3d2', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Advanced robotics and AI.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-22cb07681cbf', '2026/27', '2026-09-01', true, 120, 24, 0, 'Advanced robotics and AI.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-509578116fa5', 'tum-med', '00000000-0000-0000-0000-dc802ca9ea42', 'Medicine', 'tum-med', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', '6-year medical program, Germany top.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-509578116fa5', '2026/27', '2026-09-01', true, 360, 72, 0, '6-year medical program, Germany top.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-2944e1a0efa0', 'tum-wsi-bus', '00000000-0000-0000-0000-e67c711c0f6d', 'Business Administration', 'tum-wsi-bus', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Management at TUM School of Management.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-2944e1a0efa0', '2026/27', '2026-09-01', true, 180, 36, 0, 'Management at TUM School of Management.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-131ab966a64a', 'tum-wsi-fin', '00000000-0000-0000-0000-e67c711c0f6d', 'Finance', 'tum-wsi-fin', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Quantitative finance at TUM.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-131ab966a64a', '2026/27', '2026-09-01', true, 120, 24, 0, 'Quantitative finance at TUM.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-3110fe51da35', 'tum-phy-phys', '00000000-0000-0000-0000-e03d88c67062', 'Physics', 'tum-phy-phys', '00000000-0000-0000-0000-8cfb10d3dd0a', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Research physics at TUM.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-3110fe51da35', '2026/27', '2026-09-01', true, 180, 36, 0, 'Research physics at TUM.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-7da8c2e81b90', 'tum-phy-astroph', '00000000-0000-0000-0000-e03d88c67062', 'Astrophysics', 'tum-phy-astroph', '00000000-0000-0000-0000-8cfb10d3dd0a', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Astrophysics and space science.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-7da8c2e81b90', '2026/27', '2026-09-01', true, 120, 24, 0, 'Astrophysics and space science.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-2daac538c7f7', 'fub-cs', '00000000-0000-0000-0000-6aa53a22ce1c', 'Computer Science', 'fub-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'CS at Free University Berlin.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-2daac538c7f7', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS at Free University Berlin.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-a58b10e1b364', 'fub-math', '00000000-0000-0000-0000-6aa53a22ce1c', 'Mathematics', 'fub-math', '00000000-0000-0000-0000-6ae28a55456b', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Pure and applied mathematics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-a58b10e1b364', '2026/27', '2026-09-01', true, 120, 24, 0, 'Pure and applied mathematics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-2fa77229c056', 'fub-psych', '00000000-0000-0000-0000-6aa53a22ce1c', 'Psychology', 'fub-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Research psychology in Berlin.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-2fa77229c056', '2026/27', '2026-09-01', true, 180, 36, 0, 'Research psychology in Berlin.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-16c48a1c53f3', 'hu-berlin-cs', '00000000-0000-0000-0000-a814968cf84f', 'Computer Science', 'hu-berlin-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'CS at Humboldt University.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-16c48a1c53f3', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS at Humboldt University.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-c6c602da4a31', 'hu-berlin-phys', '00000000-0000-0000-0000-a814968cf84f', 'Physics', 'hu-berlin-phys', '00000000-0000-0000-0000-8cfb10d3dd0a', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Physics with strong research.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-c6c602da4a31', '2026/27', '2026-09-01', true, 180, 36, 0, 'Physics with strong research.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-f96ed85dcdf9', 'hu-berlin-law', '00000000-0000-0000-0000-a814968cf84f', 'Law', 'hu-berlin-law', '00000000-0000-0000-0000-829a56cc8ffa', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'German law at top university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-f96ed85dcdf9', '2026/27', '2026-09-01', true, 240, 48, 0, 'German law at top university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-a41a093e74cb', 'lmu-cs', '00000000-0000-0000-0000-5e43449506f7', 'Computer Science', 'lmu-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'CS at Munichs elite university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-a41a093e74cb', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS at Munichs elite university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-1e9e112bc7d3', 'lmu-psych', '00000000-0000-0000-0000-5e43449506f7', 'Psychology', 'lmu-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Clinical psychology at LMU.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-1e9e112bc7d3', '2026/27', '2026-09-01', true, 120, 24, 0, 'Clinical psychology at LMU.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-952846a95c9e', 'lmu-math', '00000000-0000-0000-0000-5e43449506f7', 'Mathematics', 'lmu-math', '00000000-0000-0000-0000-6ae28a55456b', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Mathematics at historic university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-952846a95c9e', '2026/27', '2026-09-01', true, 180, 36, 0, 'Mathematics at historic university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-32b580b3c04e', 'heidelberg-cs', '00000000-0000-0000-0000-ec6f644a9e5c', 'Computer Science', 'heidelberg-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'CS in historic Heidelberg.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-32b580b3c04e', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in historic Heidelberg.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-e4f805f84949', 'heidelberg-med', '00000000-0000-0000-0000-ec6f644a9e5c', 'Medicine', 'heidelberg-med', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'German medical program at top university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-e4f805f84949', '2026/27', '2026-09-01', true, 360, 72, 0, 'German medical program at top university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-938dc2596b1e', 'heidelberg-law', '00000000-0000-0000-0000-ec6f644a9e5c', 'Law', 'heidelberg-law', '00000000-0000-0000-0000-829a56cc8ffa', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-5f02f0889301', 'Traditional law at top German university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-938dc2596b1e', '2026/27', '2026-09-01', true, 240, 48, 0, 'Traditional law at top German university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-4d8fef7c85eb', 'uva-cs', '00000000-0000-0000-0000-d3da5eb0da68', 'Computer Science', 'uva-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'CS at University of Amsterdam.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-4d8fef7c85eb', '2026/27', '2026-09-01', true, 180, 36, 5000, 'CS at University of Amsterdam.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-a1d6a0509d9d', 'uva-psych', '00000000-0000-0000-0000-d3da5eb0da68', 'Psychology', 'uva-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Psychology program in Amsterdam.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-a1d6a0509d9d', '2026/27', '2026-09-01', true, 180, 36, 5000, 'Psychology program in Amsterdam.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-12cae5427a5c', 'uva-econ', '00000000-0000-0000-0000-d3da5eb0da68', 'Economics', 'uva-econ', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Economics and econometrics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-12cae5427a5c', '2026/27', '2026-09-01', true, 120, 24, 7500, 'Economics and econometrics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-ab5f3aa1799c', 'uva-law', '00000000-0000-0000-0000-d3da5eb0da68', 'Law', 'uva-law', '00000000-0000-0000-0000-829a56cc8ffa', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'International law in Amsterdam.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-ab5f3aa1799c', '2026/27', '2026-09-01', true, 180, 36, 6000, 'International law in Amsterdam.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-1efcee61352e', 'leiden-cs', '00000000-0000-0000-0000-ad009fb86b8e', 'Computer Science', 'leiden-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'CS at historic Leiden University.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-1efcee61352e', '2026/27', '2026-09-01', true, 180, 36, 5000, 'CS at historic Leiden University.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-5af209f04490', 'leiden-ai', '00000000-0000-0000-0000-ad009fb86b8e', 'Artificial Intelligence', 'leiden-ai', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'AI research masters.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-5af209f04490', '2026/27', '2026-09-01', true, 120, 24, 6000, 'AI research masters.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-1776cd064dd8', 'leiden-phys', '00000000-0000-0000-0000-ad009fb86b8e', 'Physics', 'leiden-phys', '00000000-0000-0000-0000-8cfb10d3dd0a', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Physics with research focus.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-1776cd064dd8', '2026/27', '2026-09-01', true, 180, 36, 5000, 'Physics with research focus.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-1e7345e9e240', 'utwente-cs', '00000000-0000-0000-0000-1fee5882460d', 'Computer Science', 'utwente-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Tech-focused CS in eastern Netherlands.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-1e7345e9e240', '2026/27', '2026-09-01', true, 180, 36, 5000, 'Tech-focused CS in eastern Netherlands.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-60622446a36e', 'utwente-data', '00000000-0000-0000-0000-1fee5882460d', 'Data Science', 'utwente-data', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Applied data science.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-60622446a36e', '2026/27', '2026-09-01', true, 120, 24, 6000, 'Applied data science.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-f46bc30e50f2', 'utwente-bus', '00000000-0000-0000-0000-1fee5882460d', 'Business Administration', 'utwente-bus', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'International business.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-f46bc30e50f2', '2026/27', '2026-09-01', true, 180, 36, 5000, 'International business.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-9e6dbdc6d27f', 'vu-cs', '00000000-0000-0000-0000-0730b75e96c0', 'Computer Science', 'vu-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'CS at Vrije Universiteit Amsterdam.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-9e6dbdc6d27f', '2026/27', '2026-09-01', true, 180, 36, 5000, 'CS at Vrije Universiteit Amsterdam.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-5149ec393d71', 'vu-med', '00000000-0000-0000-0000-0730b75e96c0', 'Medicine', 'vu-med', '00000000-0000-0000-0000-d9e5d212320e', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-f5ddaf0ca792', '00000000-0000-0000-0000-41d6ad0761a5', 'Medical program in Dutch.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-5149ec393d71', '2026/27', '2026-09-01', true, 360, 72, 5000, 'Medical program in Dutch.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-a87f9106d3a4', 'vu-psych', '00000000-0000-0000-0000-0730b75e96c0', 'Psychology', 'vu-psych', '00000000-0000-0000-0000-1231d487d9ac', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Clinical psychology at VU.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-a87f9106d3a4', '2026/27', '2026-09-01', true, 120, 24, 6000, 'Clinical psychology at VU.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-61bd527a1510', 'radboud-cs', '00000000-0000-0000-0000-60a67f258110', 'Computer Science', 'radboud-cs', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-c2b7dae3df98', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'CS at Radboud in Nijmegen.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-61bd527a1510', '2026/27', '2026-09-01', true, 180, 36, 5000, 'CS at Radboud in Nijmegen.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-afeba1587065', 'radboud-ai', '00000000-0000-0000-0000-60a67f258110', 'Artificial Intelligence', 'radboud-ai', '00000000-0000-0000-0000-5f928eb9cadb', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'AI special at Radboud.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-afeba1587065', '2026/27', '2026-09-01', true, 120, 24, 6000, 'AI special at Radboud.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-4f0c2f14700b', 'radboud-math', '00000000-0000-0000-0000-60a67f258110', 'Mathematics', 'radboud-math', '00000000-0000-0000-0000-6ae28a55456b', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'Applied mathematics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-4f0c2f14700b', '2026/27', '2026-09-01', true, 120, 24, 5000, 'Applied mathematics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('00000000-0000-0000-0000-cd99ed4bf7e0', 'radboud-bus', '00000000-0000-0000-0000-60a67f258110', 'Business', 'radboud-bus', '00000000-0000-0000-0000-f5d7e2532cc9', '00000000-0000-0000-0000-eb0a19179762', '00000000-0000-0000-0000-ba0a6ddd94c7', '00000000-0000-0000-0000-9cfefed8fb94', 'International business program.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-cd99ed4bf7e0', '2026/27', '2026-09-01', true, 120, 24, 7000, 'International business program.', 'manual');

SET session_replication_role = 'origin';
-- ============================================================
-- Done! Verify:
-- SELECT count(*) FROM universities;  -- should be 62
-- SELECT count(*) FROM programs;       -- should be 154
-- SELECT count(*) FROM program_versions; -- should be 154
-- ============================================================
