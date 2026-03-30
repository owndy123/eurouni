--
-- EuroUni Complete Seed - One File, No Dependencies
-- Run this in Supabase SQL Editor after setup-supabase.sql
--

SET session_replication_role = 'replica';

-- Clear
DELETE FROM program_versions; DELETE FROM programs;
DELETE FROM universities; DELETE FROM countries;
DELETE FROM languages; DELETE FROM degree_types;
DELETE FROM instruction_types; DELETE FROM study_fields;
DELETE FROM scoring_weight_configs;

SET session_replication_role = 'origin';

-- ===== REFERENCE TABLES =====
INSERT INTO countries (id, code, name, region) VALUES
('6abc0dd3-f459-a4fb-c269-4c0f7cd9757f', 'SVK', 'Slovakia', 'Central Europe'),
('f574ece9-b655-5f4e-331e-19fcd42a2bd8', 'CZE', 'Czech Republic', 'Central Europe'),
('4a10e933-5996-7de7-9db2-6ed0531af49a', 'AUT', 'Austria', 'Central Europe'),
('6f805bc5-bbdb-2ab1-0d84-9672c309a6cc', 'POL', 'Poland', 'Central Europe'),
('d4f57d10-8e24-4715-5789-c856b4332a53', 'HUN', 'Hungary', 'Central Europe'),
('2359d81e-641f-0370-37da-95207c38b0e3', 'DEU', 'Germany', 'Western Europe'),
('edc122ef-5431-f558-5c42-84d02a9fb75b', 'NLD', 'Netherlands', 'Western Europe');

INSERT INTO languages (id, code, name, is_local) VALUES
('9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'en', 'English', false),
('5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'de', 'German', true),
('41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'sk', 'Slovak', true),
('95cc64dd-2825-f9df-13ec-4ad683ecf339', 'cs', 'Czech', true),
('28840420-4e3d-4522-2930-8317344a285d', 'pl', 'Polish', true),
('18bd9197-cb1d-833b-c352-f47535c00320', 'hu', 'Hungarian', true),
('1a13105b-7e4e-b5fb-2e7c-9515ac06aa48', 'nl', 'Dutch', true);

INSERT INTO degree_types (id, slug, name, level) VALUES
('c2b7dae3-df98-5507-63df-aa494e550aeb', 'bachelor', 'Bachelor', 6),
('eb0a1917-9762-4dd3-a48f-a681d3061212', 'master', 'Master', 7);

INSERT INTO instruction_types (id, slug, name, description) VALUES
('ba0a6ddd-94c7-3698-a365-8f92ac222f8a', 'english', 'English Taught', 'Full English'),
('f5ddaf0c-a792-9578-b408-c909429f68f2', 'local', 'Local Language', 'Local'),
('f6cb3e81-6496-528d-4187-db53bc66567f', 'both', 'Mixed', 'Both');

INSERT INTO study_fields (id, slug, name, keywords) VALUES
('5f928eb9-cadb-d41e-0198-99ab63e33e10', 'computer-science', 'Computer Science', ARRAY['cs','software','it']),
('5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'engineering', 'Engineering', ARRAY['mechanical','electrical']),
('f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'business', 'Business & Economics', ARRAY['management','finance']),
('d9e5d212-320e-7d96-e921-831554be696d', 'medicine', 'Medicine & Health', ARRAY['health','pharmacy']),
('8cfb10d3-dd0a-e49a-8732-0653cbfa587e', 'physics', 'Physics', ARRAY['astrophysics']),
('6ae28a55-456b-101b-e826-1e5dee44cd3e', 'mathematics', 'Mathematics', ARRAY['stats']),
('dce09f28-1c35-f49c-2f58-ea7580b530b7', 'chemistry', 'Chemistry', ARRAY['biochemistry']),
('3c575fe4-b6c0-23e3-3eb3-22f74890d090', 'biology', 'Biology', ARRAY['biotechnology']),
('1231d487-d9ac-27b6-5795-56329bf2a71b', 'psychology', 'Psychology', ARRAY['counseling']),
('829a56cc-8ffa-5620-9e3a-10b80d0bbdf8', 'law', 'Law', ARRAY['legal']),
('2c5f64ab-07cc-b3e4-10aa-97fc09687cc3', 'art', 'Art & Design', ARRAY['design']);

INSERT INTO scoring_weight_configs (name, description, academic, location, language, budget, career, is_active) VALUES
('default', 'Default EuroUni weights', 0.25, 0.15, 0.20, 0.20, 0.20, true);

-- ===== UNIVERSITIES =====
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('9c6f4881-2ad5-73b4-0443-e12129b6883c', 'stuba', 'Slovak University of Technology in Bratislava', 'stuba', '6abc0dd3-f459-a4fb-c269-4c0f7cd9757f', 'Bratislava', 'bratislava', 48.1538, 17.1071, 'https://www.stuba.sk', '🎓', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('21e54c65-06d3-7d5a-d6c4-1ba5cff9f59c', 'uniba', 'Comenius University in Bratislava', 'uniba', '6abc0dd3-f459-a4fb-c269-4c0f7cd9757f', 'Bratislava', 'bratislava', 48.1409, 17.1127, 'https://www.uniba.sk', '📚', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('0751a57e-358a-b012-9c55-af7753293a24', 'ukf', 'Constantine the Philosopher University in Nitra', 'ukf', '6abc0dd3-f459-a4fb-c269-4c0f7cd9757f', 'Nitra', 'nitra', 48.3063, 18.0865, 'https://www.ukf.sk', '🏛️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('4ef3f1a2-5627-a8fc-0305-86eed9bdfbbc', 'tuke', 'Technical University of Košice', 'tuke', '6abc0dd3-f459-a4fb-c269-4c0f7cd9757f', 'Košice', 'koice', 48.7305, 21.2489, 'https://www.tuke.sk', '⚙️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('9b405d28-f3d5-5ec4-3255-6ebadf27b195', 'upjs', 'University of Pavol Jozef Šafárik in Košice', 'upjs', '6abc0dd3-f459-a4fb-c269-4c0f7cd9757f', 'Košice', 'koice', 48.7167, 21.2333, 'https://www.upjs.sk', '🔬', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('a775e10b-39f7-5c7e-2f23-ac6c1d910247', 'tu-zvolen', 'Technical University in Zvolen', 'tu-zvolen', '6abc0dd3-f459-a4fb-c269-4c0f7cd9757f', 'Zvolen', 'zvolen', 48.5744, 19.1175, 'https://www.tuzvo.sk', '🌲', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('73a5c42a-33b7-83ed-7bef-602326f8f864', 'uvm', 'University of Veterinary Medicine in Košice', 'uvm', '6abc0dd3-f459-a4fb-c269-4c0f7cd9757f', 'Košice', 'koice', 48.7489, 21.2254, 'https://www.uvm.sk', '🐾', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('ed9aed91-0f6f-d339-ee22-ab530057610c', 'akademia', 'Academy of Performing Arts in Bratislava', 'akademia', '6abc0dd3-f459-a4fb-c269-4c0f7cd9757f', 'Bratislava', 'bratislava', 48.1456, 17.1073, 'https://www.akademia.sk', '🎭', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('f8143685-46cd-bf62-9517-c5965d3dd4be', 'cuni', 'Charles University', 'cuni', 'f574ece9-b655-5f4e-331e-19fcd42a2bd8', 'Prague', 'prague', 50.0875, 14.4214, 'https://www.cuni.cz', '👑', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('7efdb7a3-9363-7e7a-1d5d-7c67cd5a3e93', 'cvut', 'Czech Technical University in Prague', 'cvut', 'f574ece9-b655-5f4e-331e-19fcd42a2bd8', 'Prague', 'prague', 50.1028, 14.3902, 'https://www.cvut.cz', '⚡', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('2dce04b8-fdef-c5d8-fba3-f2f5c272084a', 'vut-brno', 'Brno University of Technology', 'vut-brno', 'f574ece9-b655-5f4e-331e-19fcd42a2bd8', 'Brno', 'brno', 49.201, 16.6068, 'https://www.vut.cz', '🔧', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('29cf705c-db6d-057e-1e51-697d3d6dc957', 'muni', 'Masaryk University', 'muni', 'f574ece9-b655-5f4e-331e-19fcd42a2bd8', 'Brno', 'brno', 49.1999, 16.6068, 'https://www.muni.cz', '🎓', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('b560adc2-e2f8-bff1-1e62-428576eac8e9', 'czu', 'Czech University of Life Sciences Prague', 'czu', 'f574ece9-b655-5f4e-331e-19fcd42a2bd8', 'Prague', 'prague', 50.1295, 14.3732, 'https://www.czu.cz', '🌾', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('a0fe045a-2e46-cf5a-51db-add5a9938b60', 'upol', 'Palacký University Olomouc', 'upol', 'f574ece9-b655-5f4e-331e-19fcd42a2bd8', 'Olomouc', 'olomouc', 49.5939, 17.2508, 'https://www.upol.cz', '📖', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('a0485de5-d321-3f4b-c5c3-8e2d302bd169', 'osu', 'University of Ostrava', 'osu', 'f574ece9-b655-5f4e-331e-19fcd42a2bd8', 'Ostrava', 'ostrava', 49.8209, 18.2625, 'https://www.osu.cz', '🏭', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('12c1fdd0-74e0-95be-3dbb-b82f8b926a08', 'utb', 'Tomas Bata University in Zlín', 'utb', 'f574ece9-b655-5f4e-331e-19fcd42a2bd8', 'Zlín', 'zln', 49.2401, 17.6667, 'https://www.utb.cz', '👟', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('bfa7c7c8-b663-0381-684c-65526761f31d', 'ujep', 'Jan Evangelista Purkyně University', 'ujep', 'f574ece9-b655-5f4e-331e-19fcd42a2bd8', 'Ústí nad Labem', 'st-nad-labem', 50.7714, 14.0419, 'https://www.ujep.cz', '🔬', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('74d6b467-cc54-aaff-7bbb-ccb78ffd6c7b', 'uwb', 'University of West Bohemia', 'uwb', 'f574ece9-b655-5f4e-331e-19fcd42a2bd8', 'Pilsen', 'pilsen', 49.7384, 13.3646, 'https://www.zcu.cz', '🎓', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('afaa18d1-6474-b4bf-9967-2b29a7d5791c', 'univie', 'University of Vienna', 'univie', '4a10e933-5996-7de7-9db2-6ed0531af49a', 'Vienna', 'vienna', 48.2105, 16.3599, 'https://www.univie.ac.at', '🏰', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('1584dd75-3e55-55dc-732c-a2f8292ab7a0', 'tuw', 'TU Wien', 'tuw', '4a10e933-5996-7de7-9db2-6ed0531af49a', 'Vienna', 'vienna', 48.1986, 16.3692, 'https://www.tuwien.ac.at', '⚙️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('cf336089-a924-dd2e-a6ce-a4c483f02b87', 'tu-graz', 'Graz University of Technology', 'tu-graz', '4a10e933-5996-7de7-9db2-6ed0531af49a', 'Graz', 'graz', 47.0667, 15.45, 'https://www.tugraz.at', '🔩', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('f70add67-369e-1797-af27-7925d29544ce', 'jku', 'Johannes Kepler University Linz', 'jku', '4a10e933-5996-7de7-9db2-6ed0531af49a', 'Linz', 'linz', 48.3333, 14.2833, 'https://www.jku.at', '📊', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('a2bf9c55-df2e-c985-7eb1-ac593c8906c5', 'uibk', 'University of Innsbruck', 'uibk', '4a10e933-5996-7de7-9db2-6ed0531af49a', 'Innsbruck', 'innsbruck', 47.2692, 11.4041, 'https://www.uibk.ac.at', '🏔️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('037b02f2-1d87-7dfa-5fc5-bf220d47471b', 'sbg', 'University of Salzburg', 'sbg', '4a10e933-5996-7de7-9db2-6ed0531af49a', 'Salzburg', 'salzburg', 47.7964, 13.0456, 'https://www.plus.ac.at', '🎵', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('5aee53a6-0424-75c9-d8b7-494487180e45', 'wu-wien', 'Vienna University of Economics and Business', 'wu-wien', '4a10e933-5996-7de7-9db2-6ed0531af49a', 'Vienna', 'vienna', 48.2108, 16.3685, 'https://www.wu.ac.at', '💼', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('d0615ffd-ca85-ee81-6d97-9e5f01e7ba2b', 'mu-wien', 'Medical University of Vienna', 'mu-wien', '4a10e933-5996-7de7-9db2-6ed0531af49a', 'Vienna', 'vienna', 48.2208, 16.3498, 'https://www.meduniwien.ac.at', '⚕️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('3eae6359-4a41-739e-8714-1e8333d15f73', 'uw', 'University of Warsaw', 'uw', '6f805bc5-bbdb-2ab1-0d84-9672c309a6cc', 'Warsaw', 'warsaw', 52.2391, 21.0206, 'https://www.uw.edu.pl', '📚', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('8fe4c114-5128-1c09-4a65-78e6ddbf5eed', 'pw', 'Warsaw University of Technology', 'pw', '6f805bc5-bbdb-2ab1-0d84-9672c309a6cc', 'Warsaw', 'warsaw', 52.219, 21.0138, 'https://www.pw.edu.pl', '🔧', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('3d2c350c-e8ca-f278-3ee0-9f5f8f9cd5e3', 'uj', 'Jagiellonian University', 'uj', '6f805bc5-bbdb-2ab1-0d84-9672c309a6cc', 'Kraków', 'krakw', 50.0579, 19.9492, 'https://www.uj.edu.pl', '👑', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('5de08b97-cd5c-d898-e5af-0a129df65c49', 'agh', 'AGH University of Science and Technology', 'agh', '6f805bc5-bbdb-2ab1-0d84-9672c309a6cc', 'Kraków', 'krakw', 50.0657, 19.923, 'https://www.agh.edu.pl', '⚒️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('8e13ffc9-fd9d-6a67-6123-1a764bdf106b', 'put', 'Poznań University of Technology', 'put', '6f805bc5-bbdb-2ab1-0d84-9672c309a6cc', 'Poznań', 'pozna', 52.4066, 16.9265, 'https://www.put.poznan.pl', '⚙️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('0df09d36-ae7b-d590-fd51-6684dd4f89f3', 'amu', 'Adam Mickiewicz University', 'amu', '6f805bc5-bbdb-2ab1-0d84-9672c309a6cc', 'Poznań', 'pozna', 52.4074, 16.9338, 'https://www.amu.edu.pl', '🎓', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('e0c2f414-9272-44a4-87dd-322a1cb0ff8b', 'uw-edu', 'University of Wrocław', 'uw-edu', '6f805bc5-bbdb-2ab1-0d84-9672c309a6cc', 'Wrocław', 'wrocaw', 51.1102, 17.032, 'https://www.uw.edu.pl', '📖', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('128d2ab4-b71b-0aac-a5d6-cdd9defcc306', 'pwr', 'Wrocław University of Science and Technology', 'pwr', '6f805bc5-bbdb-2ab1-0d84-9672c309a6cc', 'Wrocław', 'wrocaw', 51.1075, 17.0592, 'https://www.pwr.edu.pl', '🔬', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('2a0617ac-cf8b-b862-5c43-e2ffeb5b8d5b', 'ug', 'University of Gdańsk', 'ug', '6f805bc5-bbdb-2ab1-0d84-9672c309a6cc', 'Gdańsk', 'gdask', 54.4461, 18.5698, 'https://www.ug.edu.pl', '⚓', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('235ec523-92b7-7977-539c-f78b62e708d3', 'pg', 'Gdańsk University of Technology', 'pg', '6f805bc5-bbdb-2ab1-0d84-9672c309a6cc', 'Gdańsk', 'gdask', 54.4416, 18.5561, 'https://www.pg.edu.pl', '🏗️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('9db3976d-35a1-f10f-bc55-ac60986c9af0', 'elte', 'Eötvös Loránd University', 'elte', 'd4f57d10-8e24-4715-5789-c856b4332a53', 'Budapest', 'budapest', 47.4908, 19.0617, 'https://www.elte.hu', '📚', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('698458dc-93cf-1f38-bd6a-9436c20a4e34', 'bme', 'Budapest University of Technology and Economics', 'bme', 'd4f57d10-8e24-4715-5789-c856b4332a53', 'Budapest', 'budapest', 47.4739, 19.0577, 'https://www.bme.hu', '⚙️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('0f998a5d-9a9c-0415-88ec-bbe01882159b', 'elte-ik', 'Eötvös Loránd University - Faculty of Informatics', 'elte-ik', 'd4f57d10-8e24-4715-5789-c856b4332a53', 'Budapest', 'budapest', 47.4935, 19.0626, 'https://www.inf.elte.hu', '💻', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('125b3331-cb12-284b-b372-d24c4b3e1038', 'semmelweis', 'Semmelweis University', 'semmelweis', 'd4f57d10-8e24-4715-5789-c856b4332a53', 'Budapest', 'budapest', 47.5068, 19.0729, 'https://www.semmelweis.hu', '⚕️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('af06d04c-b1c1-3d70-047f-d53d7f4c6392', 'uni-miskolc', 'University of Miskolc', 'uni-miskolc', 'd4f57d10-8e24-4715-5789-c856b4332a53', 'Miskolc', 'miskolc', 48.1036, 20.7833, 'https://www.uni-miskolc.hu', '🏭', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('bcdae8bc-747a-067b-741a-b203c7454b43', 'pte', 'University of Pécs', 'pte', 'd4f57d10-8e24-4715-5789-c856b4332a53', 'Pécs', 'pcs', 46.0807, 18.2183, 'https://www.pte.hu', '🎓', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('32be833c-9d42-8cde-c1c6-efed824f3204', 'szte', 'University of Szeged', 'szte', 'd4f57d10-8e24-4715-5789-c856b4332a53', 'Szeged', 'szeged', 46.2469, 20.1456, 'https://www.u-szeged.hu', '☀️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('1e407182-0b8b-0457-7953-c5440b2ac8e4', 'debrecen', 'University of Debrecen', 'debrecen', 'd4f57d10-8e24-4715-5789-c856b4332a53', 'Debrecen', 'debrecen', 47.553, 21.6392, 'https://www.unideb.hu', '🌳', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('dc802ca9-ea42-1d0e-ff00-4f467a45ccd6', 'tum', 'Technical University of Munich', 'tum', '2359d81e-641f-0370-37da-95207c38b0e3', 'Munich', 'munich', 48.396, 11.722, 'https://www.tum.de', '🏛️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('e67c711c-0f6d-31f0-7592-137a6d30746a', 'tum-wsi', 'TUM School of Management', 'tum-wsi', '2359d81e-641f-0370-37da-95207c38b0e3', 'Munich', 'munich', 48.3744, 11.8533, 'https://www.wsi.tum.de', '💼', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('74b59ffc-5c0b-3d04-e9b9-99babd6f8e8b', 'tu-berlin', 'Technical University of Berlin', 'tu-berlin', '2359d81e-641f-0370-37da-95207c38b0e3', 'Berlin', 'berlin', 52.5112, 13.397, 'https://www.tu.berlin', '⚡', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('3f2c0230-0113-9275-12e5-e7d35f9f8625', 'rwth', 'RWTH Aachen University', 'rwth', '2359d81e-641f-0370-37da-95207c38b0e3', 'Aachen', 'aachen', 50.7753, 6.0839, 'https://www.rwth-aachen.de', '🔬', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('ffa044f5-d189-74a3-264c-23a5e1e06217', 'kit', 'Karlsruhe Institute of Technology', 'kit', '2359d81e-641f-0370-37da-95207c38b0e3', 'Karlsruhe', 'karlsruhe', 49.0069, 8.4197, 'https://www.kit.edu', '🧪', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('e03d88c6-7062-1c36-12f3-3b3ca41ba987', 'tum-phy', 'TUM Department of Physics', 'tum-phy', '2359d81e-641f-0370-37da-95207c38b0e3', 'Garching', 'garching', 48.2656, 11.6722, 'https://www.ph.tum.de', '⚛️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('6aa53a22-ce1c-8c2b-9bf9-03fef3b3cd1f', 'fub', 'Freie Universität Berlin', 'fub', '2359d81e-641f-0370-37da-95207c38b0e3', 'Berlin', 'berlin', 52.4324, 13.5285, 'https://www.fu-berlin.de', '🕊️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('a814968c-f84f-192e-3332-593524562dbc', 'hu-berlin', 'Humboldt University of Berlin', 'hu-berlin', '2359d81e-641f-0370-37da-95207c38b0e3', 'Berlin', 'berlin', 52.5169, 13.3976, 'https://www.hu-berlin.de', '🎭', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('5e434495-06f7-da0c-5354-6df4d3556ed1', 'lmu', 'Ludwig Maximilian University of Munich', 'lmu', '2359d81e-641f-0370-37da-95207c38b0e3', 'Munich', 'munich', 48.1508, 11.5808, 'https://www.lmu.de', '👑', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('ec6f644a-9e5c-180e-cc3b-21684df6ef90', 'heidelberg', 'Heidelberg University', 'heidelberg', '2359d81e-641f-0370-37da-95207c38b0e3', 'Heidelberg', 'heidelberg', 49.3988, 8.6724, 'https://www.uni-heidelberg.de', '🏰', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('d3da5eb0-da68-70ae-c229-7a935d7159a8', 'uva', 'University of Amsterdam', 'uva', 'edc122ef-5431-f558-5c42-84d02a9fb75b', 'Amsterdam', 'amsterdam', 52.3555, 4.9555, 'https://www.uva.nl', '🎓', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('29034b2e-efb2-a581-a7c7-a11cfc307776', 'tue', 'Eindhoven University of Technology', 'tue', 'edc122ef-5431-f558-5c42-84d02a9fb75b', 'Eindhoven', 'eindhoven', 51.4416, 5.4697, 'https://www.tue.nl', '💡', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('d710b24b-d72f-aace-eebb-0343605dd766', 'tudelft', 'Delft University of Technology', 'tudelft', 'edc122ef-5431-f558-5c42-84d02a9fb75b', 'Delft', 'delft', 51.9974, 4.3578, 'https://www.tudelft.nl', '⚙️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('ad009fb8-6b8e-e663-f5e3-5d963a900095', 'leiden', 'Leiden University', 'leiden', 'edc122ef-5431-f558-5c42-84d02a9fb75b', 'Leiden', 'leiden', 52.1667, 4.4667, 'https://www.universiteitleiden.nl', '📜', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('1fee5882-460d-514e-cd30-48a0370fcab6', 'utwente', 'University of Twente', 'utwente', 'edc122ef-5431-f558-5c42-84d02a9fb75b', 'Enschede', 'enschede', 52.2408, 6.8517, 'https://www.utwente.nl', '🔧', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('717de68e-813c-2596-d41f-edd5f5733ccf', 'rug', 'University of Groningen', 'rug', 'edc122ef-5431-f558-5c42-84d02a9fb75b', 'Groningen', 'groningen', 53.2194, 6.5665, 'https://www.rug.nl', '🌟', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('0730b75e-96c0-453b-1b19-6be7ff4fa194', 'vu', 'Vrije Universiteit Amsterdam', 'vu', 'edc122ef-5431-f558-5c42-84d02a9fb75b', 'Amsterdam', 'amsterdam', 52.3336, 4.8636, 'https://www.vu.nl', '✝️', true);
INSERT INTO universities (id, legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active) VALUES
('60a67f25-8110-e369-2850-a39227d9d458', 'radboud', 'Radboud University', 'radboud', 'edc122ef-5431-f558-5c42-84d02a9fb75b', 'Nijmegen', 'nijmegen', 51.8167, 5.8667, 'https://www.ru.nl', '🎓', true);

-- ===== PROGRAMS + VERSIONS =====

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('f40d9772-2077-f5c1-4c43-c420736b8bd6', 'stuba-cs', '9c6f4881-2ad5-73b4-0443-e12129b6883c', 'Computer Science', 'stuba-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Premier technical program in Slovakia. Strong focus on algorithms, software engineering, and AI.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'f40d9772-2077-f5c1-4c43-c420736b8bd6', '2026/27', '2026-09-01', true, 180, 36, 0, 'Premier technical program in Slovakia. Strong focus on algorithms, software engineering, and AI.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('63a4724a-a18e-f884-6115-0bc760f1adc7', 'stuba-arch', '9c6f4881-2ad5-73b4-0443-e12129b6883c', 'Architecture', 'stuba-arch', '2c5f64ab-07cc-b3e4-10aa-97fc09687cc3', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Design-focused architecture program with studio work and technical courses.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '63a4724a-a18e-f884-6115-0bc760f1adc7', '2026/27', '2026-09-01', true, 300, 60, 0, 'Design-focused architecture program with studio work and technical courses.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('4854c076-40b6-9d75-cd3f-d20b9e4a2254', 'stuba-mech', '9c6f4881-2ad5-73b4-0443-e12129b6883c', 'Mechanical Engineering', 'stuba-mech', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Advanced mechanical engineering with focus on automotive and industrial design.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '4854c076-40b6-9d75-cd3f-d20b9e4a2254', '2026/27', '2026-09-01', true, 120, 24, 0, 'Advanced mechanical engineering with focus on automotive and industrial design.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('46e0a470-4707-e84b-cdae-7b8421fa79b1', 'uniba-medicine', '21e54c65-06d3-7d5a-d6c4-1ba5cff9f59c', 'General Medicine', 'uniba-medicine', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', '6-year medical program in English, recognized across EU. Clinical training in Bratislava hospitals.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '46e0a470-4707-e84b-cdae-7b8421fa79b1', '2026/27', '2026-09-01', true, 360, 72, 10000, '6-year medical program in English, recognized across EU. Clinical training in Bratislava hospitals.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('2d1885b7-075d-32ec-f6eb-3ae0c25d1858', 'uniba-law', '21e54c65-06d3-7d5a-d6c4-1ba5cff9f59c', 'Law', 'uniba-law', '829a56cc-8ffa-5620-9e3a-10b80d0bbdf8', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Traditional law program preparing for legal careers in Slovakia and EU.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '2d1885b7-075d-32ec-f6eb-3ae0c25d1858', '2026/27', '2026-09-01', true, 240, 48, 0, 'Traditional law program preparing for legal careers in Slovakia and EU.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('0644a0c2-0857-9434-e14b-f9b32d407951', 'uniba-psych', '21e54c65-06d3-7d5a-d6c4-1ba5cff9f59c', 'Psychology', 'uniba-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Comprehensive psychology covering clinical, counseling, and research tracks.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '0644a0c2-0857-9434-e14b-f9b32d407951', '2026/27', '2026-09-01', true, 180, 36, 0, 'Comprehensive psychology covering clinical, counseling, and research tracks.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('fdf891e0-5f43-b089-3e2f-9b815170eb4f', 'uniba-pharm', '21e54c65-06d3-7d5a-d6c4-1ba5cff9f59c', 'Pharmacy', 'uniba-pharm', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', '5-year pharmacy program in English, gateway to pharmaceutical careers.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'fdf891e0-5f43-b089-3e2f-9b815170eb4f', '2026/27', '2026-09-01', true, 300, 60, 9000, '5-year pharmacy program in English, gateway to pharmaceutical careers.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('51e3f735-9df4-9b6e-a52a-916c1f09079f', 'tuke-cs', '4ef3f1a2-5627-a8fc-0305-86eed9bdfbbc', 'Computer Science', 'tuke-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Technical CS program in eastern Slovakia with strong industry connections.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '51e3f735-9df4-9b6e-a52a-916c1f09079f', '2026/27', '2026-09-01', true, 180, 36, 0, 'Technical CS program in eastern Slovakia with strong industry connections.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('e28cfe4e-2973-689c-03d0-2cc76158dfb8', 'tuke-mining', '4ef3f1a2-5627-a8fc-0305-86eed9bdfbbc', 'Mining Engineering', 'tuke-mining', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Unique program in mining, geology, and resource management.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'e28cfe4e-2973-689c-03d0-2cc76158dfb8', '2026/27', '2026-09-01', true, 180, 36, 0, 'Unique program in mining, geology, and resource management.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('03ba4a25-3ee5-a8e0-a009-9fdbc5ed3143', 'upjs-cs', '9b405d28-f3d5-5ec4-3255-6ebadf27b195', 'Applied Mathematics', 'upjs-cs', '6ae28a55-456b-101b-e826-1e5dee44cd3e', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Research-focused mathematics with applications in cryptography and data science.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '03ba4a25-3ee5-a8e0-a009-9fdbc5ed3143', '2026/27', '2026-09-01', true, 120, 24, 0, 'Research-focused mathematics with applications in cryptography and data science.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('6e9caa37-bbc8-aaab-0f1e-1737e7a9365d', 'upjs-medicine', '9b405d28-f3d5-5ec4-3255-6ebadf27b195', 'General Medicine', 'upjs-medicine', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'English-taught medical program in Kosice, modern facilities.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '6e9caa37-bbc8-aaab-0f1e-1737e7a9365d', '2026/27', '2026-09-01', true, 360, 72, 10500, 'English-taught medical program in Kosice, modern facilities.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('99dfad5c-f2f8-a3e1-970f-fb1a7ff1bec4', 'ukf-edu', '0751a57e-358a-b012-9c55-af7753293a24', 'Teacher Training', 'ukf-edu', '2c5f64ab-07cc-b3e4-10aa-97fc09687cc3', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Education program preparing teachers for primary and secondary schools.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '99dfad5c-f2f8-a3e1-970f-fb1a7ff1bec4', '2026/27', '2026-09-01', true, 180, 36, 0, 'Education program preparing teachers for primary and secondary schools.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('3d5d7e58-94d0-f9c4-37ed-58f7cfede28e', 'cvut-cs', '7efdb7a3-9363-7e7a-1d5d-7c67cd5a3e93', 'Computer Science', 'cvut-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Top-tier technical CS program in Prague. Strong in algorithms and systems.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '3d5d7e58-94d0-f9c4-37ed-58f7cfede28e', '2026/27', '2026-09-01', true, 180, 36, 0, 'Top-tier technical CS program in Prague. Strong in algorithms and systems.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('ed986c11-2a84-e5c3-c173-102dc3e7d3f2', 'cvut-ai', '7efdb7a3-9363-7e7a-1d5d-7c67cd5a3e93', 'Artificial Intelligence', 'cvut-ai', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Advanced AI program covering ML, deep learning, and robotics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'ed986c11-2a84-e5c3-c173-102dc3e7d3f2', '2026/27', '2026-09-01', true, 120, 24, 0, 'Advanced AI program covering ML, deep learning, and robotics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('b063f4bf-386e-ebbf-9c7a-7aa44feade47', 'cvut-civil', '7efdb7a3-9363-7e7a-1d5d-7c67cd5a3e93', 'Civil Engineering', 'cvut-civil', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Comprehensive civil engineering with structural and infrastructure focus.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'b063f4bf-386e-ebbf-9c7a-7aa44feade47', '2026/27', '2026-09-01', true, 240, 48, 0, 'Comprehensive civil engineering with structural and infrastructure focus.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('2921a20a-53ea-b46f-5fd4-245a2a2b9299', 'muni-cs', '29cf705c-db6d-057e-1e51-697d3d6dc957', 'Computer Science', 'muni-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Modern CS program in Brno with specializations in AI, security, and web.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '2921a20a-53ea-b46f-5fd4-245a2a2b9299', '2026/27', '2026-09-01', true, 180, 36, 2000, 'Modern CS program in Brno with specializations in AI, security, and web.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('6ce66e6b-6015-987d-5b19-5c224f290803', 'muni-data', '29cf705c-db6d-057e-1e51-697d3d6dc957', 'Data Science', 'muni-data', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Data science program covering ML, statistics, and big data technologies.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '6ce66e6b-6015-987d-5b19-5c224f290803', '2026/27', '2026-09-01', true, 120, 24, 2500, 'Data science program covering ML, statistics, and big data technologies.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('84682109-e528-8a1a-7abd-7861c328ebf2', 'muni-econ', '29cf705c-db6d-057e-1e51-697d3d6dc957', 'Economics', 'muni-econ', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Economics with focus on data analysis and international markets.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '84682109-e528-8a1a-7abd-7861c328ebf2', '2026/27', '2026-09-01', true, 180, 36, 1500, 'Economics with focus on data analysis and international markets.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('65668319-3fb2-2a89-a10d-6ea24d7ea54f', 'muni-psych', '29cf705c-db6d-057e-1e51-697d3d6dc957', 'Psychology', 'muni-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Research-oriented psychology program in English.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '65668319-3fb2-2a89-a10d-6ea24d7ea54f', '2026/27', '2026-09-01', true, 180, 36, 2500, 'Research-oriented psychology program in English.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('a785866e-7c4a-ea7c-ddda-395619c7b739', 'vut-ee', '2dce04b8-fdef-c5d8-fba3-f2f5c272084a', 'Electrical Engineering', 'vut-ee', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Strong EE program with focus on electronics and power systems.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'a785866e-7c4a-ea7c-ddda-395619c7b739', '2026/27', '2026-09-01', true, 180, 36, 0, 'Strong EE program with focus on electronics and power systems.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('c017baab-fb92-ebf9-e4bc-7ea4e0bedb7f', 'vut-mech', '2dce04b8-fdef-c5d8-fba3-f2f5c272084a', 'Mechanical Engineering', 'vut-mech', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Advanced mechanical engineering with industry partnerships.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'c017baab-fb92-ebf9-e4bc-7ea4e0bedb7f', '2026/27', '2026-09-01', true, 120, 24, 0, 'Advanced mechanical engineering with industry partnerships.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('a4bb3113-7d06-fde3-2837-a1f619cfa985', 'upol-cs', 'a0fe045a-2e46-cf5a-51db-add5a9938b60', 'Informatics', 'upol-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Comprehensive informatics program in historic Olomouc.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'a4bb3113-7d06-fde3-2837-a1f619cfa985', '2026/27', '2026-09-01', true, 180, 36, 0, 'Comprehensive informatics program in historic Olomouc.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('b64d03f4-b9da-9d20-3ff5-b6379c6221bc', 'tu-graz-cs', 'cf336089-a924-dd2e-a6ce-a4c483f02b87', 'Computer Science', 'tu-graz-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Technical CS in German with strong industry links in Austria.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'b64d03f4-b9da-9d20-3ff5-b6379c6221bc', '2026/27', '2026-09-01', true, 180, 36, 0, 'Technical CS in German with strong industry links in Austria.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('58362544-1dcd-57db-ca98-1de0c04bca90', 'tu-graz-se', 'cf336089-a924-dd2e-a6ce-a4c483f02b87', 'Software Engineering', 'tu-graz-se', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'English-taught SE masters with industry projects.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '58362544-1dcd-57db-ca98-1de0c04bca90', '2026/27', '2026-09-01', true, 120, 24, 0, 'English-taught SE masters with industry projects.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('da19615d-90e0-ae26-2f16-e80b1413a9cc', 'jku-cs', 'f70add67-369e-1797-af27-7925d29544ce', 'Computer Science', 'jku-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'CS in Linz with special focus on AI and data science.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'da19615d-90e0-ae26-2f16-e80b1413a9cc', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in Linz with special focus on AI and data science.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('2ec23b4a-983d-b04d-2678-8ad7867506b5', 'jku-mgt', 'f70add67-369e-1797-af27-7925d29544ce', 'Business Informatics', 'jku-mgt', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Combination of business and IT in German.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '2ec23b4a-983d-b04d-2678-8ad7867506b5', '2026/27', '2026-09-01', true, 120, 24, 0, 'Combination of business and IT in German.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('f76bdc9e-847d-63ee-941d-6e9c82d30637', 'wu-wien-ib', '5aee53a6-0424-75c9-d8b7-494487180e45', 'International Business', 'wu-wien-ib', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Top business program in Vienna, German instruction.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'f76bdc9e-847d-63ee-941d-6e9c82d30637', '2026/27', '2026-09-01', true, 180, 36, 0, 'Top business program in Vienna, German instruction.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('024328ce-df55-0079-e8bf-a5b10687bbaf', 'wu-wien-fin', '5aee53a6-0424-75c9-d8b7-494487180e45', 'Finance', 'wu-wien-fin', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'English-taught finance masters in Vienna.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '024328ce-df55-0079-e8bf-a5b10687bbaf', '2026/27', '2026-09-01', true, 120, 24, 0, 'English-taught finance masters in Vienna.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('a937f36c-78ee-e5dc-ac3f-5e3f6b74d139', 'uw-cs', '3eae6359-4a41-739e-8714-1e8333d15f73', 'Computer Science', 'uw-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '28840420-4e3d-4522-2930-8317344a285d', 'Top CS in Poland, Warsaw. Polish instruction.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'a937f36c-78ee-e5dc-ac3f-5e3f6b74d139', '2026/27', '2026-09-01', true, 180, 36, 0, 'Top CS in Poland, Warsaw. Polish instruction.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('7999cc94-2b3c-baae-3c4a-e059a656e627', 'uw-phys', '3eae6359-4a41-739e-8714-1e8333d15f73', 'Physics', 'uw-phys', '8cfb10d3-dd0a-e49a-8732-0653cbfa587e', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '28840420-4e3d-4522-2930-8317344a285d', 'Research-focused physics in Warsaw.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '7999cc94-2b3c-baae-3c4a-e059a656e627', '2026/27', '2026-09-01', true, 180, 36, 0, 'Research-focused physics in Warsaw.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('6f58459b-ea7d-50eb-1567-e4fa36db1ea4', 'agh-cs', '5de08b97-cd5c-d898-e5af-0a129df65c49', 'Computer Science', 'agh-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'English-taught CS at top Polish technical university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '6f58459b-ea7d-50eb-1567-e4fa36db1ea4', '2026/27', '2026-09-01', true, 180, 36, 0, 'English-taught CS at top Polish technical university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('28641604-84c4-54c1-d002-6d39fd7a0678', 'uj-medicine', '3d2c350c-e8ca-f278-3ee0-9f5f8f9cd5e3', 'General Medicine', 'uj-medicine', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'English medical program in historic Krakow.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '28641604-84c4-54c1-d002-6d39fd7a0678', '2026/27', '2026-09-01', true, 360, 72, 12000, 'English medical program in historic Krakow.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('2675574d-e46a-9d14-a7d4-d70b53973a8b', 'elte-cs', '9db3976d-35a1-f10f-bc55-ac60986c9af0', 'Computer Science', 'elte-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '18bd9197-cb1d-833b-c352-f47535c00320', 'Top CS at Hungarys largest university, Budapest.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '2675574d-e46a-9d14-a7d4-d70b53973a8b', '2026/27', '2026-09-01', true, 180, 36, 0, 'Top CS at Hungarys largest university, Budapest.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('f155fe5e-bc3f-2b8e-e8ec-705d66787db8', 'elte-math', '9db3976d-35a1-f10f-bc55-ac60986c9af0', 'Mathematics', 'elte-math', '6ae28a55-456b-101b-e826-1e5dee44cd3e', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '18bd9197-cb1d-833b-c352-f47535c00320', 'Strong math program with various specializations.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'f155fe5e-bc3f-2b8e-e8ec-705d66787db8', '2026/27', '2026-09-01', true, 180, 36, 0, 'Strong math program with various specializations.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('a9b73618-f9e3-873b-e7c4-cb60063472b8', 'bme-ee', '698458dc-93cf-1f38-bd6a-9436c20a4e34', 'Electrical Engineering', 'bme-ee', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '18bd9197-cb1d-833b-c352-f47535c00320', 'Premier engineering at Budapests technical university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'a9b73618-f9e3-873b-e7c4-cb60063472b8', '2026/27', '2026-09-01', true, 210, 42, 0, 'Premier engineering at Budapests technical university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('b53dc743-9972-2966-8bf7-e5dc175580fb', 'bme-cs', '698458dc-93cf-1f38-bd6a-9436c20a4e34', 'Computer Science', 'bme-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'English-taught CS masters at top technical university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'b53dc743-9972-2966-8bf7-e5dc175580fb', '2026/27', '2026-09-01', true, 120, 24, 0, 'English-taught CS masters at top technical university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('6c56b313-6055-f5eb-43c4-678446d38035', 'semmelweis-med', '125b3331-cb12-284b-b372-d24c4b3e1038', 'General Medicine', 'semmelweis-med', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Medical program in English, oldest medical school in Hungary.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '6c56b313-6055-f5eb-43c4-678446d38035', '2026/27', '2026-09-01', true, 360, 72, 12000, 'Medical program in English, oldest medical school in Hungary.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('130cd511-be8b-8a7b-f4f4-239d1b233ca0', 'debrecen-cs', '1e407182-0b8b-0457-7953-c5440b2ac8e4', 'Computer Science', 'debrecen-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'English-taught CS in eastern Hungary.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '130cd511-be8b-8a7b-f4f4-239d1b233ca0', '2026/27', '2026-09-01', true, 180, 36, 0, 'English-taught CS in eastern Hungary.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('86134ff6-3db5-a762-c2d3-15e3dffdbee1', 'tu-berlin-cs', '74b59ffc-5c0b-3d04-e9b9-99babd6f8e8b', 'Computer Science', 'tu-berlin-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'CS in Berlin, German instruction.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '86134ff6-3db5-a762-c2d3-15e3dffdbee1', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in Berlin, German instruction.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('3c31afd4-24c8-a8c3-653c-65987276de5d', 'tu-berlin-data', '74b59ffc-5c0b-3d04-e9b9-99babd6f8e8b', 'Data Engineering', 'tu-berlin-data', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'English-taught data engineering in Berlin.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '3c31afd4-24c8-a8c3-653c-65987276de5d', '2026/27', '2026-09-01', true, 120, 24, 0, 'English-taught data engineering in Berlin.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('aa72624d-5198-8087-1ff3-c405fb8a127a', 'rwth-cs', '3f2c0230-0113-9275-12e5-e7d35f9f8625', 'Computer Science', 'rwth-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Top CS at Germanys technical elite university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'aa72624d-5198-8087-1ff3-c405fb8a127a', '2026/27', '2026-09-01', true, 180, 36, 0, 'Top CS at Germanys technical elite university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('963c103a-d332-452a-763b-ec84fa547859', 'kit-cs', 'ffa044f5-d189-74a3-264c-23a5e1e06217', 'Computer Science', 'kit-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Excellent CS in Karlsruhe, tech hub.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '963c103a-d332-452a-763b-ec84fa547859', '2026/27', '2026-09-01', true, 180, 36, 0, 'Excellent CS in Karlsruhe, tech hub.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('09800679-ee8d-9f6b-b829-2448b61601b2', 'kit-data', 'ffa044f5-d189-74a3-264c-23a5e1e06217', 'Data Science', 'kit-data', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Data science at top German research university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '09800679-ee8d-9f6b-b829-2448b61601b2', '2026/27', '2026-09-01', true, 120, 24, 0, 'Data science at top German research university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('705fdb85-0309-9ab3-b81d-75b0861a4ad3', 'tudelft-ae', 'd710b24b-d72f-aace-eebb-0343605dd766', 'Aerospace Engineering', 'tudelft-ae', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'World-class aerospace program in Delft.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '705fdb85-0309-9ab3-b81d-75b0861a4ad3', '2026/27', '2026-09-01', true, 180, 36, 2000, 'World-class aerospace program in Delft.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('bf3463f8-df94-d0cf-3f87-ce67f625b06d', 'tudelft-cs', 'd710b24b-d72f-aace-eebb-0343605dd766', 'Computer Science', 'tudelft-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Elite CS masters in Netherlands.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'bf3463f8-df94-d0cf-3f87-ce67f625b06d', '2026/27', '2026-09-01', true, 120, 24, 2500, 'Elite CS masters in Netherlands.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('667a4eb9-03c3-d079-71f9-0d385f94eaa2', 'tue-cs', '29034b2e-efb2-a581-a7c7-a11cfc307776', 'Computer Science', 'tue-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Tech-focused CS in Eindhoven tech hub.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '667a4eb9-03c3-d079-71f9-0d385f94eaa2', '2026/27', '2026-09-01', true, 180, 36, 2000, 'Tech-focused CS in Eindhoven tech hub.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('46720887-1fa6-ed9b-8f58-c0bf14a237a6', 'rug-cs', '717de68e-813c-2596-d41f-edd5f5733ccf', 'Computer Science', 'rug-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'CS in northern Netherlands, English taught.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '46720887-1fa6-ed9b-8f58-c0bf14a237a6', '2026/27', '2026-09-01', true, 180, 36, 2000, 'CS in northern Netherlands, English taught.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('edf3567c-e573-4591-6d0d-bf46b93f710e', 'rug-ai', '717de68e-813c-2596-d41f-edd5f5733ccf', 'Artificial Intelligence', 'rug-ai', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'AI masters in Groningen.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'edf3567c-e573-4591-6d0d-bf46b93f710e', '2026/27', '2026-09-01', true, 120, 24, 2500, 'AI masters in Groningen.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('d1d03aaf-31f8-be1e-634a-dbcfd0ffb131', 'ukf-psych', '0751a57e-358a-b012-9c55-af7753293a24', 'Psychology', 'ukf-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Psychology program focusing on clinical and counseling applications.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'd1d03aaf-31f8-be1e-634a-dbcfd0ffb131', '2026/27', '2026-09-01', true, 180, 36, 0, 'Psychology program focusing on clinical and counseling applications.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('c8fad0b8-1636-5b26-dfe9-319764e76931', 'ukf-business', '0751a57e-358a-b012-9c55-af7753293a24', 'Business Administration', 'ukf-business', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Business program with focus on management and marketing.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'c8fad0b8-1636-5b26-dfe9-319764e76931', '2026/27', '2026-09-01', true, 180, 36, 0, 'Business program with focus on management and marketing.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('cefe10ce-aa74-b40b-1656-ba3fbde46b5c', 'tuzvolen-forest', 'a775e10b-39f7-5c7e-2f23-ac6c1d910247', 'Forestry', 'tuzvolen-forest', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Sustainable forest management and wood science.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'cefe10ce-aa74-b40b-1656-ba3fbde46b5c', '2026/27', '2026-09-01', true, 180, 36, 0, 'Sustainable forest management and wood science.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('40f79660-7d07-5916-5347-46cfe72849fb', 'tuzvolen-env', 'a775e10b-39f7-5c7e-2f23-ac6c1d910247', 'Environmental Engineering', 'tuzvolen-env', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Environmental protection and sustainable development.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '40f79660-7d07-5916-5347-46cfe72849fb', '2026/27', '2026-09-01', true, 120, 24, 0, 'Environmental protection and sustainable development.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('3063cd78-74ad-a21a-64a5-b2cb10446d1f', 'uvm-vet', '73a5c42a-33b7-83ed-7bef-602326f8f864', 'Veterinary Medicine', 'uvm-vet', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', '6-year veterinary program recognized in EU.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '3063cd78-74ad-a21a-64a5-b2cb10446d1f', '2026/27', '2026-09-01', true, 360, 72, 11000, '6-year veterinary program recognized in EU.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('7d95e28b-e56f-cd37-79f3-02e8d23863fe', 'uvm-animal', '73a5c42a-33b7-83ed-7bef-602326f8f864', 'Animal Science', 'uvm-animal', '3c575fe4-b6c0-23e3-3eb3-22f74890d090', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Advanced animal husbandry and welfare.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '7d95e28b-e56f-cd37-79f3-02e8d23863fe', '2026/27', '2026-09-01', true, 120, 24, 5000, 'Advanced animal husbandry and welfare.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('a7358e65-9b80-387c-45d9-32c557f2a201', 'akademia-music', 'ed9aed91-0f6f-d339-ee22-ab530057610c', 'Music Performance', 'akademia-music', '2c5f64ab-07cc-b3e4-10aa-97fc09687cc3', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Performance degrees in classical music.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'a7358e65-9b80-387c-45d9-32c557f2a201', '2026/27', '2026-09-01', true, 120, 24, 0, 'Performance degrees in classical music.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('0447a24c-aa48-1603-86bc-7a05d80a8d9c', 'akademia-theater', 'ed9aed91-0f6f-d339-ee22-ab530057610c', 'Theater Studies', 'akademia-theater', '2c5f64ab-07cc-b3e4-10aa-97fc09687cc3', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Acting and theater production.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '0447a24c-aa48-1603-86bc-7a05d80a8d9c', '2026/27', '2026-09-01', true, 180, 36, 0, 'Acting and theater production.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('bc9054b2-3031-4e8d-b84b-08ac57920613', 'cuni-cs', 'f8143685-46cd-bf62-9517-c5965d3dd4be', 'Computer Science', 'cuni-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Premier CS program at Czech oldest university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'bc9054b2-3031-4e8d-b84b-08ac57920613', '2026/27', '2026-09-01', true, 180, 36, 0, 'Premier CS program at Czech oldest university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('3c372054-82ef-7dc6-9441-c520b88a360d', 'cuni-math', 'f8143685-46cd-bf62-9517-c5965d3dd4be', 'Mathematics', 'cuni-math', '6ae28a55-456b-101b-e826-1e5dee44cd3e', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Pure and applied mathematics in Prague.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '3c372054-82ef-7dc6-9441-c520b88a360d', '2026/27', '2026-09-01', true, 180, 36, 0, 'Pure and applied mathematics in Prague.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('9db8720d-ced9-ab89-7148-b84e55b31802', 'cuni-phys', 'f8143685-46cd-bf62-9517-c5965d3dd4be', 'Physics', 'cuni-phys', '8cfb10d3-dd0a-e49a-8732-0653cbfa587e', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Theoretical and experimental physics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '9db8720d-ced9-ab89-7148-b84e55b31802', '2026/27', '2026-09-01', true, 180, 36, 0, 'Theoretical and experimental physics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('601082fd-7969-0bf3-9b02-493d3c73c557', 'cuni-psych', 'f8143685-46cd-bf62-9517-c5965d3dd4be', 'Psychology', 'cuni-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Clinical and research psychology.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '601082fd-7969-0bf3-9b02-493d3c73c557', '2026/27', '2026-09-01', true, 120, 24, 3000, 'Clinical and research psychology.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('97693bed-ed13-17c9-b913-0f343e3a0f86', 'cuni-law', 'f8143685-46cd-bf62-9517-c5965d3dd4be', 'Law', 'cuni-law', '829a56cc-8ffa-5620-9e3a-10b80d0bbdf8', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Traditional law degree in Prague.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '97693bed-ed13-17c9-b913-0f343e3a0f86', '2026/27', '2026-09-01', true, 240, 48, 0, 'Traditional law degree in Prague.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('af9555fd-75b2-9bce-47a5-5b0b47c784da', 'czu-agri', 'b560adc2-e2f8-bff1-1e62-428576eac8e9', 'Agriculture', 'czu-agri', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Modern agriculture and food sciences.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'af9555fd-75b2-9bce-47a5-5b0b47c784da', '2026/27', '2026-09-01', true, 180, 36, 0, 'Modern agriculture and food sciences.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('463bf314-0c35-b336-92a1-2284554dd23c', 'czu-env', 'b560adc2-e2f8-bff1-1e62-428576eac8e9', 'Environmental Science', 'czu-env', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Sustainable resource management.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '463bf314-0c35-b336-92a1-2284554dd23c', '2026/27', '2026-09-01', true, 120, 24, 0, 'Sustainable resource management.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('15e6b39a-9552-ce20-ab64-f27678833886', 'czu-econ', 'b560adc2-e2f8-bff1-1e62-428576eac8e9', 'Economics', 'czu-econ', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Agricultural and resource economics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '15e6b39a-9552-ce20-ab64-f27678833886', '2026/27', '2026-09-01', true, 180, 36, 0, 'Agricultural and resource economics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('65171277-1d83-cd3a-d71c-b3228413ef11', 'osu-cs', 'a0485de5-d321-3f4b-c5c3-8e2d302bd169', 'Computer Science', 'osu-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'CS program in industrial Moravia.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '65171277-1d83-cd3a-d71c-b3228413ef11', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS program in industrial Moravia.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('b6f2eee0-7f21-76cc-5779-9b657a249db8', 'osu-psych', 'a0485de5-d321-3f4b-c5c3-8e2d302bd169', 'Psychology', 'osu-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Psychology with clinical focus.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'b6f2eee0-7f21-76cc-5779-9b657a249db8', '2026/27', '2026-09-01', true, 180, 36, 0, 'Psychology with clinical focus.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('7e0fb9c9-7055-f372-27b3-03484120fa72', 'osu-teacher', 'a0485de5-d321-3f4b-c5c3-8e2d302bd169', 'Teacher Training', 'osu-teacher', '2c5f64ab-07cc-b3e4-10aa-97fc09687cc3', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Secondary school teacher education.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '7e0fb9c9-7055-f372-27b3-03484120fa72', '2026/27', '2026-09-01', true, 120, 24, 0, 'Secondary school teacher education.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('713360dd-ea4a-292e-9b85-dc99f6aa038f', 'utb-business', '12c1fdd0-74e0-95be-3dbb-b82f8b926a08', 'Business Administration', 'utb-business', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Modern business in emerging region.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '713360dd-ea4a-292e-9b85-dc99f6aa038f', '2026/27', '2026-09-01', true, 180, 36, 1500, 'Modern business in emerging region.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('e523e42d-417d-0db9-57b3-28001409f3d6', 'utb-multimedia', '12c1fdd0-74e0-95be-3dbb-b82f8b926a08', 'Multimedia Communication', 'utb-multimedia', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Digital media and communications.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'e523e42d-417d-0db9-57b3-28001409f3d6', '2026/27', '2026-09-01', true, 120, 24, 2000, 'Digital media and communications.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('5c34debc-e7a9-224b-9d86-28970c418320', 'ujep-cs', 'bfa7c7c8-b663-0381-684c-65526761f31d', 'Informatics', 'ujep-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Applied informatics in north Bohemia.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '5c34debc-e7a9-224b-9d86-28970c418320', '2026/27', '2026-09-01', true, 180, 36, 0, 'Applied informatics in north Bohemia.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('f24b6193-791f-5c2f-cc00-9f7c9c3b9899', 'ujep-phys', 'bfa7c7c8-b663-0381-684c-65526761f31d', 'Physics', 'ujep-phys', '8cfb10d3-dd0a-e49a-8732-0653cbfa587e', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Applied physics program.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'f24b6193-791f-5c2f-cc00-9f7c9c3b9899', '2026/27', '2026-09-01', true, 120, 24, 0, 'Applied physics program.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('0fb569fc-c6ac-910f-6376-e7ec7deef586', 'uwb-cs', '74d6b467-cc54-aaff-7bbb-ccb78ffd6c7b', 'Computer Science', 'uwb-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'CS in western Bohemia.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '0fb569fc-c6ac-910f-6376-e7ec7deef586', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in western Bohemia.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('22214218-baf9-ee60-5aa6-92eca84c02e0', 'uwb-electrical', '74d6b467-cc54-aaff-7bbb-ccb78ffd6c7b', 'Electrical Engineering', 'uwb-electrical', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Power systems and electronics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '22214218-baf9-ee60-5aa6-92eca84c02e0', '2026/27', '2026-09-01', true, 120, 24, 0, 'Power systems and electronics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('37069d07-675b-25e1-7b23-ae2d3af61843', 'uwb-mech', '74d6b467-cc54-aaff-7bbb-ccb78ffd6c7b', 'Mechanical Engineering', 'uwb-mech', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Design and manufacturing.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '37069d07-675b-25e1-7b23-ae2d3af61843', '2026/27', '2026-09-01', true, 180, 36, 0, 'Design and manufacturing.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('aa434a23-762d-4a43-5dad-32d298f73909', 'univie-cs', 'afaa18d1-6474-b4bf-9967-2b29a7d5791c', 'Computer Science', 'univie-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'CS at Austrias largest university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'aa434a23-762d-4a43-5dad-32d298f73909', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS at Austrias largest university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('6a8f2c54-7e50-edbe-068a-2d149f688f79', 'univie-psych', 'afaa18d1-6474-b4bf-9967-2b29a7d5791c', 'Psychology', 'univie-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Research-oriented psychology in Vienna.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '6a8f2c54-7e50-edbe-068a-2d149f688f79', '2026/27', '2026-09-01', true, 180, 36, 0, 'Research-oriented psychology in Vienna.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('2c4f1a0a-fc08-ce66-bdf5-34b9d7372ede', 'univie-phys', 'afaa18d1-6474-b4bf-9967-2b29a7d5791c', 'Physics', 'univie-phys', '8cfb10d3-dd0a-e49a-8732-0653cbfa587e', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Theoretical and experimental physics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '2c4f1a0a-fc08-ce66-bdf5-34b9d7372ede', '2026/27', '2026-09-01', true, 120, 24, 0, 'Theoretical and experimental physics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('dd918724-fda4-b0a8-e3c4-f61ac5012ce2', 'univie-math', 'afaa18d1-6474-b4bf-9967-2b29a7d5791c', 'Mathematics', 'univie-math', '6ae28a55-456b-101b-e826-1e5dee44cd3e', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Pure and applied mathematics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'dd918724-fda4-b0a8-e3c4-f61ac5012ce2', '2026/27', '2026-09-01', true, 180, 36, 0, 'Pure and applied mathematics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('1b162570-3bab-f108-8aaf-a632e5df8301', 'univie-law', 'afaa18d1-6474-b4bf-9967-2b29a7d5791c', 'Law', 'univie-law', '829a56cc-8ffa-5620-9e3a-10b80d0bbdf8', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Traditional law program in Vienna.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '1b162570-3bab-f108-8aaf-a632e5df8301', '2026/27', '2026-09-01', true, 240, 48, 0, 'Traditional law program in Vienna.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('dd56a46f-ce64-7e30-1e42-c72809dfc2d9', 'tuw-cs', '1584dd75-3e55-55dc-732c-a2f8292ab7a0', 'Computer Science', 'tuw-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Technical CS at Vienna University of Technology.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'dd56a46f-ce64-7e30-1e42-c72809dfc2d9', '2026/27', '2026-09-01', true, 180, 36, 0, 'Technical CS at Vienna University of Technology.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('c2aa5ec9-f504-1925-9aab-00942991ebcf', 'tuw-software', '1584dd75-3e55-55dc-732c-a2f8292ab7a0', 'Software Engineering', 'tuw-software', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'English-taught SE masters.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'c2aa5ec9-f504-1925-9aab-00942991ebcf', '2026/27', '2026-09-01', true, 120, 24, 0, 'English-taught SE masters.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('810489ce-fb51-b93a-c1bc-796425b681ba', 'tuw-mech', '1584dd75-3e55-55dc-732c-a2f8292ab7a0', 'Mechanical Engineering', 'tuw-mech', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Full mechanical engineering program.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '810489ce-fb51-b93a-c1bc-796425b681ba', '2026/27', '2026-09-01', true, 240, 48, 0, 'Full mechanical engineering program.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('87fbbfce-1825-7a0e-77ad-54bb3d2a3a70', 'uibk-cs', 'a2bf9c55-df2e-c985-7eb1-ac593c8906c5', 'Computer Science', 'uibk-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'CS in Tyrol with Alpine research.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '87fbbfce-1825-7a0e-77ad-54bb3d2a3a70', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in Tyrol with Alpine research.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('c10d645e-bd96-a9a7-6a10-14b5ac51fafc', 'uibk-sports', 'a2bf9c55-df2e-c985-7eb1-ac593c8906c5', 'Sports Science', 'uibk-sports', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Sports physiology and coaching.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'c10d645e-bd96-a9a7-6a10-14b5ac51fafc', '2026/27', '2026-09-01', true, 120, 24, 0, 'Sports physiology and coaching.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('70aa5b37-9932-d9fd-190a-f713afe3f340', 'uibk-env', 'a2bf9c55-df2e-c985-7eb1-ac593c8906c5', 'Environmental Science', 'uibk-env', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Alpine ecology and climate.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '70aa5b37-9932-d9fd-190a-f713afe3f340', '2026/27', '2026-09-01', true, 120, 24, 0, 'Alpine ecology and climate.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('de64f8af-a156-bc60-73ee-05c61c5a544c', 'sbg-cs', '037b02f2-1d87-7dfa-5fc5-bf220d47471b', 'Computer Science', 'sbg-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'CS in historic Salzburg.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'de64f8af-a156-bc60-73ee-05c61c5a544c', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in historic Salzburg.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('093edc5f-8001-5c83-da93-64d102335913', 'sbg-edu', '037b02f2-1d87-7dfa-5fc5-bf220d47471b', 'Education Science', 'sbg-edu', '2c5f64ab-07cc-b3e4-10aa-97fc09687cc3', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Teacher education research.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '093edc5f-8001-5c83-da93-64d102335913', '2026/27', '2026-09-01', true, 120, 24, 0, 'Teacher education research.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('c00f0c6b-41f9-ee8d-7323-e110e02e82b7', 'mu-wien-med', 'd0615ffd-ca85-ee81-6d97-9e5f01e7ba2b', 'General Medicine', 'mu-wien-med', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Medical program in German at Medical University of Vienna.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'c00f0c6b-41f9-ee8d-7323-e110e02e82b7', '2026/27', '2026-09-01', true, 360, 72, 0, 'Medical program in German at Medical University of Vienna.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('59cd1311-a01b-9bb1-2cc4-c3e5ca678d25', 'mu-wien-dent', 'd0615ffd-ca85-ee81-6d97-9e5f01e7ba2b', 'Dental Medicine', 'mu-wien-dent', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Dental surgery program.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '59cd1311-a01b-9bb1-2cc4-c3e5ca678d25', '2026/27', '2026-09-01', true, 300, 60, 0, 'Dental surgery program.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('805dd8f3-3d26-c18b-3f2c-009e67264c60', 'pw-cs', '8fe4c114-5128-1c09-4a65-78e6ddbf5eed', 'Computer Science', 'pw-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '28840420-4e3d-4522-2930-8317344a285d', 'Premier technical CS in Poland.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '805dd8f3-3d26-c18b-3f2c-009e67264c60', '2026/27', '2026-09-01', true, 210, 42, 0, 'Premier technical CS in Poland.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('d49b248a-3672-e408-8e52-962c4a233a31', 'pw-electrical', '8fe4c114-5128-1c09-4a65-78e6ddbf5eed', 'Electrical Engineering', 'pw-electrical', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '28840420-4e3d-4522-2930-8317344a285d', 'Power systems and automation.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'd49b248a-3672-e408-8e52-962c4a233a31', '2026/27', '2026-09-01', true, 210, 42, 0, 'Power systems and automation.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('2e941d2d-c281-c281-66b9-3df10cc0a4cd', 'pw-mech', '8fe4c114-5128-1c09-4a65-78e6ddbf5eed', 'Mechanical Engineering', 'pw-mech', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Advanced mechanical design.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '2e941d2d-c281-c281-66b9-3df10cc0a4cd', '2026/27', '2026-09-01', true, 120, 24, 0, 'Advanced mechanical design.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('21aece5c-f553-18b5-0e84-108791605d19', 'put-cs', '8e13ffc9-fd9d-6a67-6123-1a764bdf106b', 'Computer Science', 'put-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'English CS in western Poland.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '21aece5c-f553-18b5-0e84-108791605d19', '2026/27', '2026-09-01', true, 210, 42, 0, 'English CS in western Poland.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('35eba701-e27d-d266-e8c8-31c2fe4fb39b', 'put-electrical', '8e13ffc9-fd9d-6a67-6123-1a764bdf106b', 'Electrical Engineering', 'put-electrical', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '28840420-4e3d-4522-2930-8317344a285d', 'Electronics and telecommunications.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '35eba701-e27d-d266-e8c8-31c2fe4fb39b', '2026/27', '2026-09-01', true, 210, 42, 0, 'Electronics and telecommunications.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('8c06237d-f644-ca66-669a-e02f11dff193', 'amu-psych', '0df09d36-ae7b-d590-fd51-6684dd4f89f3', 'Psychology', 'amu-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Clinical and counseling psychology.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '8c06237d-f644-ca66-669a-e02f11dff193', '2026/27', '2026-09-01', true, 180, 36, 0, 'Clinical and counseling psychology.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('699dffaf-4229-a11f-9235-97414a8a7910', 'amu-history', '0df09d36-ae7b-d590-fd51-6684dd4f89f3', 'History', 'amu-history', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '28840420-4e3d-4522-2930-8317344a285d', 'Polish and European history.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '699dffaf-4229-a11f-9235-97414a8a7910', '2026/27', '2026-09-01', true, 180, 36, 0, 'Polish and European history.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('3c1df00f-de4a-9972-6198-7abc11ca893b', 'amu-math', '0df09d36-ae7b-d590-fd51-6684dd4f89f3', 'Mathematics', 'amu-math', '6ae28a55-456b-101b-e826-1e5dee44cd3e', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Pure and applied mathematics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '3c1df00f-de4a-9972-6198-7abc11ca893b', '2026/27', '2026-09-01', true, 120, 24, 0, 'Pure and applied mathematics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('1e96695a-b9dc-9fe5-ab24-8545467305fe', 'uw-edu-cs', 'e0c2f414-9272-44a4-87dd-322a1cb0ff8b', 'Computer Science', 'uw-edu-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'CS in Lower Silesia.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '1e96695a-b9dc-9fe5-ab24-8545467305fe', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in Lower Silesia.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('a09e8887-d0eb-1949-5806-223652e6ec34', 'uw-edu-phys', 'e0c2f414-9272-44a4-87dd-322a1cb0ff8b', 'Physics', 'uw-edu-phys', '8cfb10d3-dd0a-e49a-8732-0653cbfa587e', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '28840420-4e3d-4522-2930-8317344a285d', 'Physics and astronomy.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'a09e8887-d0eb-1949-5806-223652e6ec34', '2026/27', '2026-09-01', true, 180, 36, 0, 'Physics and astronomy.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('2621df06-4e3a-8d40-124a-407440bdeea0', 'pwr-cs', '128d2ab4-b71b-0aac-a5d6-cdd9defcc306', 'Computer Science', 'pwr-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Technical CS in Wroclaw.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '2621df06-4e3a-8d40-124a-407440bdeea0', '2026/27', '2026-09-01', true, 210, 42, 0, 'Technical CS in Wroclaw.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('451fd71d-3502-9b31-bfed-e41d29e2320c', 'pwr-data', '128d2ab4-b71b-0aac-a5d6-cdd9defcc306', 'Data Science', 'pwr-data', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'ML and big data analytics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '451fd71d-3502-9b31-bfed-e41d29e2320c', '2026/27', '2026-09-01', true, 120, 24, 0, 'ML and big data analytics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('8981153d-0bb5-e93f-257f-4fa3aae5c531', 'pwr-chem', '128d2ab4-b71b-0aac-a5d6-cdd9defcc306', 'Chemical Engineering', 'pwr-chem', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '28840420-4e3d-4522-2930-8317344a285d', 'Process engineering and chemistry.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '8981153d-0bb5-e93f-257f-4fa3aae5c531', '2026/27', '2026-09-01', true, 210, 42, 0, 'Process engineering and chemistry.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('0405fed9-1383-55fa-5b76-492387306eb8', 'ug-cs', '2a0617ac-cf8b-b862-5c43-e2ffeb5b8d5b', 'Computer Science', 'ug-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'CS on Baltic coast.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '0405fed9-1383-55fa-5b76-492387306eb8', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS on Baltic coast.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('8ae5b86f-6512-e669-df2e-2b0e3e10924e', 'ug-law', '2a0617ac-cf8b-b862-5c43-e2ffeb5b8d5b', 'Law', 'ug-law', '829a56cc-8ffa-5620-9e3a-10b80d0bbdf8', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '28840420-4e3d-4522-2930-8317344a285d', 'Maritime and international law.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '8ae5b86f-6512-e669-df2e-2b0e3e10924e', '2026/27', '2026-09-01', true, 240, 48, 0, 'Maritime and international law.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('fbd5dcb5-2d58-06fb-d3b6-3df5193d95b3', 'ug-psych', '2a0617ac-cf8b-b862-5c43-e2ffeb5b8d5b', 'Psychology', 'ug-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Clinical psychology on Baltic coast.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'fbd5dcb5-2d58-06fb-d3b6-3df5193d95b3', '2026/27', '2026-09-01', true, 120, 24, 0, 'Clinical psychology on Baltic coast.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('fdb155fa-d169-2faa-d6ec-022e3d90f7ed', 'pg-cs', '235ec523-92b7-7977-539c-f78b62e708d3', 'Computer Science', 'pg-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Technical CS for Baltic tech hub.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'fdb155fa-d169-2faa-d6ec-022e3d90f7ed', '2026/27', '2026-09-01', true, 210, 42, 0, 'Technical CS for Baltic tech hub.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('4b58202e-1405-13f5-354e-77d9f3d0793f', 'pg-civil', '235ec523-92b7-7977-539c-f78b62e708d3', 'Civil Engineering', 'pg-civil', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Structural and maritime engineering.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '4b58202e-1405-13f5-354e-77d9f3d0793f', '2026/27', '2026-09-01', true, 120, 24, 0, 'Structural and maritime engineering.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('9d9170cc-4b74-038e-7866-297ce91c499f', 'elte-ik-cs', '0f998a5d-9a9c-0415-88ec-bbe01882159b', 'Computer Science', 'elte-ik-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '18bd9197-cb1d-833b-c352-f47535c00320', 'CS at ELTE Faculty of Informatics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '9d9170cc-4b74-038e-7866-297ce91c499f', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS at ELTE Faculty of Informatics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('51b1f195-6874-44fc-5d45-1026bd727cde', 'elte-ik-gamedev', '0f998a5d-9a9c-0415-88ec-bbe01882159b', 'Game Development', 'elte-ik-gamedev', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Digital media and game design.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '51b1f195-6874-44fc-5d45-1026bd727cde', '2026/27', '2026-09-01', true, 120, 24, 0, 'Digital media and game design.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('6819f789-a6db-9a30-c565-104d60706a1e', 'uni-misc-cs', 'af06d04c-b1c1-3d70-047f-d53d7f4c6392', 'Computer Science', 'uni-misc-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '18bd9197-cb1d-833b-c352-f47535c00320', 'CS in industrial Hungary.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '6819f789-a6db-9a30-c565-104d60706a1e', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in industrial Hungary.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('acf1d892-033e-6881-f12b-2caf79bded14', 'uni-misc-eng', 'af06d04c-b1c1-3d70-047f-d53d7f4c6392', 'Materials Science', 'uni-misc-eng', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Metallurgy and material engineering.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'acf1d892-033e-6881-f12b-2caf79bded14', '2026/27', '2026-09-01', true, 120, 24, 0, 'Metallurgy and material engineering.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('3c2c4667-c5e7-b6a8-122c-25ea48966a17', 'uni-misc-law', 'af06d04c-b1c1-3d70-047f-d53d7f4c6392', 'Law', 'uni-misc-law', '829a56cc-8ffa-5620-9e3a-10b80d0bbdf8', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '18bd9197-cb1d-833b-c352-f47535c00320', 'Traditional law degree.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '3c2c4667-c5e7-b6a8-122c-25ea48966a17', '2026/27', '2026-09-01', true, 240, 48, 0, 'Traditional law degree.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('7a863e3a-da34-8040-375e-f98a81028ee9', 'pte-cs', 'bcdae8bc-747a-067b-741a-b203c7454b43', 'Computer Science', 'pte-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'CS in southern Hungary.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '7a863e3a-da34-8040-375e-f98a81028ee9', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in southern Hungary.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('8307f4ce-9e80-52f0-23ca-caabe11e6592', 'pte-psych', 'bcdae8bc-747a-067b-741a-b203c7454b43', 'Psychology', 'pte-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '18bd9197-cb1d-833b-c352-f47535c00320', 'Clinical and educational psychology.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '8307f4ce-9e80-52f0-23ca-caabe11e6592', '2026/27', '2026-09-01', true, 180, 36, 0, 'Clinical and educational psychology.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('613a1454-71fe-158a-a474-0703645c0d20', 'pte-bus', 'bcdae8bc-747a-067b-741a-b203c7454b43', 'Business Administration', 'pte-bus', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'International business management.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '613a1454-71fe-158a-a474-0703645c0d20', '2026/27', '2026-09-01', true, 120, 24, 0, 'International business management.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('aeddf6df-5ff6-794b-9baf-36ae21030b34', 'szte-cs', '32be833c-9d42-8cde-c1c6-efed824f3204', 'Computer Science', 'szte-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'CS in sunny southern Hungary.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'aeddf6df-5ff6-794b-9baf-36ae21030b34', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in sunny southern Hungary.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('86bc7ad1-821f-acf6-cb6a-0b438bc8e369', 'szte-medicine', '32be833c-9d42-8cde-c1c6-efed824f3204', 'General Medicine', 'szte-medicine', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'English medical program in Szeged.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '86bc7ad1-821f-acf6-cb6a-0b438bc8e369', '2026/27', '2026-09-01', true, 360, 72, 8000, 'English medical program in Szeged.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('24b7c2da-1af2-09e2-0f37-019c84e98da5', 'szte-edu', '32be833c-9d42-8cde-c1c6-efed824f3204', 'Teacher Training', 'szte-edu', '2c5f64ab-07cc-b3e4-10aa-97fc09687cc3', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '18bd9197-cb1d-833b-c352-f47535c00320', 'Primary and secondary teacher education.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '24b7c2da-1af2-09e2-0f37-019c84e98da5', '2026/27', '2026-09-01', true, 180, 36, 0, 'Primary and secondary teacher education.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('f0cd317a-6d20-17f5-7517-1c05f1cc1284', 'tum-cs', 'dc802ca9-ea42-1d0e-ff00-4f467a45ccd6', 'Computer Science', 'tum-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Elite CS at Bavarias top university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'f0cd317a-6d20-17f5-7517-1c05f1cc1284', '2026/27', '2026-09-01', true, 180, 36, 0, 'Elite CS at Bavarias top university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('22cb0768-1cbf-1a13-e302-d479ee50567f', 'tum-robotics', 'dc802ca9-ea42-1d0e-ff00-4f467a45ccd6', 'Robotics', 'tum-robotics', '5d554bc5-f3d2-cd18-2cdd-0952b1fb87ca', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Advanced robotics and AI.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '22cb0768-1cbf-1a13-e302-d479ee50567f', '2026/27', '2026-09-01', true, 120, 24, 0, 'Advanced robotics and AI.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('50957811-6fa5-9349-ce54-b1746c06d3ee', 'tum-med', 'dc802ca9-ea42-1d0e-ff00-4f467a45ccd6', 'Medicine', 'tum-med', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', '6-year medical program, Germany top.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '50957811-6fa5-9349-ce54-b1746c06d3ee', '2026/27', '2026-09-01', true, 360, 72, 0, '6-year medical program, Germany top.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('2944e1a0-efa0-5391-1c1d-0d3418eda65d', 'tum-wsi-bus', 'e67c711c-0f6d-31f0-7592-137a6d30746a', 'Business Administration', 'tum-wsi-bus', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Management at TUM School of Management.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '2944e1a0-efa0-5391-1c1d-0d3418eda65d', '2026/27', '2026-09-01', true, 180, 36, 0, 'Management at TUM School of Management.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('131ab966-a64a-4573-dcac-eae735c072a2', 'tum-wsi-fin', 'e67c711c-0f6d-31f0-7592-137a6d30746a', 'Finance', 'tum-wsi-fin', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Quantitative finance at TUM.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '131ab966-a64a-4573-dcac-eae735c072a2', '2026/27', '2026-09-01', true, 120, 24, 0, 'Quantitative finance at TUM.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('3110fe51-da35-981e-6ac8-68056487ed31', 'tum-phy-phys', 'e03d88c6-7062-1c36-12f3-3b3ca41ba987', 'Physics', 'tum-phy-phys', '8cfb10d3-dd0a-e49a-8732-0653cbfa587e', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Research physics at TUM.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '3110fe51-da35-981e-6ac8-68056487ed31', '2026/27', '2026-09-01', true, 180, 36, 0, 'Research physics at TUM.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('7da8c2e8-1b90-9148-4671-959f843b3d9d', 'tum-phy-astroph', 'e03d88c6-7062-1c36-12f3-3b3ca41ba987', 'Astrophysics', 'tum-phy-astroph', '8cfb10d3-dd0a-e49a-8732-0653cbfa587e', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Astrophysics and space science.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '7da8c2e8-1b90-9148-4671-959f843b3d9d', '2026/27', '2026-09-01', true, 120, 24, 0, 'Astrophysics and space science.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('2daac538-c7f7-c729-b848-0ef7ca7591e1', 'fub-cs', '6aa53a22-ce1c-8c2b-9bf9-03fef3b3cd1f', 'Computer Science', 'fub-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'CS at Free University Berlin.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '2daac538-c7f7-c729-b848-0ef7ca7591e1', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS at Free University Berlin.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('a58b10e1-b364-dcfa-9974-0d7a950e3b3d', 'fub-math', '6aa53a22-ce1c-8c2b-9bf9-03fef3b3cd1f', 'Mathematics', 'fub-math', '6ae28a55-456b-101b-e826-1e5dee44cd3e', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Pure and applied mathematics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'a58b10e1-b364-dcfa-9974-0d7a950e3b3d', '2026/27', '2026-09-01', true, 120, 24, 0, 'Pure and applied mathematics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('2fa77229-c056-c1ab-07d5-a31fff957aa8', 'fub-psych', '6aa53a22-ce1c-8c2b-9bf9-03fef3b3cd1f', 'Psychology', 'fub-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Research psychology in Berlin.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '2fa77229-c056-c1ab-07d5-a31fff957aa8', '2026/27', '2026-09-01', true, 180, 36, 0, 'Research psychology in Berlin.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('16c48a1c-53f3-c623-7d10-7aea145e7957', 'hu-berlin-cs', 'a814968c-f84f-192e-3332-593524562dbc', 'Computer Science', 'hu-berlin-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'CS at Humboldt University.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '16c48a1c-53f3-c623-7d10-7aea145e7957', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS at Humboldt University.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('c6c602da-4a31-4ae1-8959-9ef728c25bc1', 'hu-berlin-phys', 'a814968c-f84f-192e-3332-593524562dbc', 'Physics', 'hu-berlin-phys', '8cfb10d3-dd0a-e49a-8732-0653cbfa587e', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Physics with strong research.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'c6c602da-4a31-4ae1-8959-9ef728c25bc1', '2026/27', '2026-09-01', true, 180, 36, 0, 'Physics with strong research.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('f96ed85d-cdf9-6835-99d1-1952c5aa5798', 'hu-berlin-law', 'a814968c-f84f-192e-3332-593524562dbc', 'Law', 'hu-berlin-law', '829a56cc-8ffa-5620-9e3a-10b80d0bbdf8', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'German law at top university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'f96ed85d-cdf9-6835-99d1-1952c5aa5798', '2026/27', '2026-09-01', true, 240, 48, 0, 'German law at top university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('a41a093e-74cb-112f-c833-93cda1c98846', 'lmu-cs', '5e434495-06f7-da0c-5354-6df4d3556ed1', 'Computer Science', 'lmu-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'CS at Munichs elite university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'a41a093e-74cb-112f-c833-93cda1c98846', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS at Munichs elite university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('1e9e112b-c7d3-0c13-b62e-7fe1df0daf24', 'lmu-psych', '5e434495-06f7-da0c-5354-6df4d3556ed1', 'Psychology', 'lmu-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Clinical psychology at LMU.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '1e9e112b-c7d3-0c13-b62e-7fe1df0daf24', '2026/27', '2026-09-01', true, 120, 24, 0, 'Clinical psychology at LMU.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('952846a9-5c9e-54b0-9d04-727abe5ebf08', 'lmu-math', '5e434495-06f7-da0c-5354-6df4d3556ed1', 'Mathematics', 'lmu-math', '6ae28a55-456b-101b-e826-1e5dee44cd3e', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Mathematics at historic university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '952846a9-5c9e-54b0-9d04-727abe5ebf08', '2026/27', '2026-09-01', true, 180, 36, 0, 'Mathematics at historic university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('32b580b3-c04e-30de-6ba6-da732a0f2132', 'heidelberg-cs', 'ec6f644a-9e5c-180e-cc3b-21684df6ef90', 'Computer Science', 'heidelberg-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'CS in historic Heidelberg.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '32b580b3-c04e-30de-6ba6-da732a0f2132', '2026/27', '2026-09-01', true, 180, 36, 0, 'CS in historic Heidelberg.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('e4f805f8-4949-dc5a-db6c-16b3c9cef37c', 'heidelberg-med', 'ec6f644a-9e5c-180e-cc3b-21684df6ef90', 'Medicine', 'heidelberg-med', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'German medical program at top university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'e4f805f8-4949-dc5a-db6c-16b3c9cef37c', '2026/27', '2026-09-01', true, 360, 72, 0, 'German medical program at top university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('938dc259-6b1e-f6de-f167-04989b1bb199', 'heidelberg-law', 'ec6f644a-9e5c-180e-cc3b-21684df6ef90', 'Law', 'heidelberg-law', '829a56cc-8ffa-5620-9e3a-10b80d0bbdf8', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '5f02f088-9301-fd7b-e1ac-972c11bf3e7d', 'Traditional law at top German university.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '938dc259-6b1e-f6de-f167-04989b1bb199', '2026/27', '2026-09-01', true, 240, 48, 0, 'Traditional law at top German university.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('4d8fef7c-85eb-fa50-4632-0fd46f226c34', 'uva-cs', 'd3da5eb0-da68-70ae-c229-7a935d7159a8', 'Computer Science', 'uva-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'CS at University of Amsterdam.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '4d8fef7c-85eb-fa50-4632-0fd46f226c34', '2026/27', '2026-09-01', true, 180, 36, 5000, 'CS at University of Amsterdam.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('a1d6a050-9d9d-711e-3f6d-6e70a52e32da', 'uva-psych', 'd3da5eb0-da68-70ae-c229-7a935d7159a8', 'Psychology', 'uva-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Psychology program in Amsterdam.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'a1d6a050-9d9d-711e-3f6d-6e70a52e32da', '2026/27', '2026-09-01', true, 180, 36, 5000, 'Psychology program in Amsterdam.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('12cae542-7a5c-5e79-d82d-3b28b610a202', 'uva-econ', 'd3da5eb0-da68-70ae-c229-7a935d7159a8', 'Economics', 'uva-econ', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Economics and econometrics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '12cae542-7a5c-5e79-d82d-3b28b610a202', '2026/27', '2026-09-01', true, 120, 24, 7500, 'Economics and econometrics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('ab5f3aa1-799c-2bc0-f3cc-79875d102650', 'uva-law', 'd3da5eb0-da68-70ae-c229-7a935d7159a8', 'Law', 'uva-law', '829a56cc-8ffa-5620-9e3a-10b80d0bbdf8', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'International law in Amsterdam.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'ab5f3aa1-799c-2bc0-f3cc-79875d102650', '2026/27', '2026-09-01', true, 180, 36, 6000, 'International law in Amsterdam.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('1efcee61-352e-ce08-861d-b61cf183e91e', 'leiden-cs', 'ad009fb8-6b8e-e663-f5e3-5d963a900095', 'Computer Science', 'leiden-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'CS at historic Leiden University.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '1efcee61-352e-ce08-861d-b61cf183e91e', '2026/27', '2026-09-01', true, 180, 36, 5000, 'CS at historic Leiden University.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('5af209f0-4490-c15c-40f0-460b1c12ca85', 'leiden-ai', 'ad009fb8-6b8e-e663-f5e3-5d963a900095', 'Artificial Intelligence', 'leiden-ai', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'AI research masters.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '5af209f0-4490-c15c-40f0-460b1c12ca85', '2026/27', '2026-09-01', true, 120, 24, 6000, 'AI research masters.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('1776cd06-4dd8-8c83-116a-62c51c67c3d0', 'leiden-phys', 'ad009fb8-6b8e-e663-f5e3-5d963a900095', 'Physics', 'leiden-phys', '8cfb10d3-dd0a-e49a-8732-0653cbfa587e', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Physics with research focus.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '1776cd06-4dd8-8c83-116a-62c51c67c3d0', '2026/27', '2026-09-01', true, 180, 36, 5000, 'Physics with research focus.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('1e7345e9-e240-a358-fb4e-3bf46d7ff33f', 'utwente-cs', '1fee5882-460d-514e-cd30-48a0370fcab6', 'Computer Science', 'utwente-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Tech-focused CS in eastern Netherlands.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '1e7345e9-e240-a358-fb4e-3bf46d7ff33f', '2026/27', '2026-09-01', true, 180, 36, 5000, 'Tech-focused CS in eastern Netherlands.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('60622446-a36e-471e-221c-20e3fafffc0d', 'utwente-data', '1fee5882-460d-514e-cd30-48a0370fcab6', 'Data Science', 'utwente-data', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Applied data science.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '60622446-a36e-471e-221c-20e3fafffc0d', '2026/27', '2026-09-01', true, 120, 24, 6000, 'Applied data science.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('f46bc30e-50f2-863a-9ca3-6babc2aaa167', 'utwente-bus', '1fee5882-460d-514e-cd30-48a0370fcab6', 'Business Administration', 'utwente-bus', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'International business.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'f46bc30e-50f2-863a-9ca3-6babc2aaa167', '2026/27', '2026-09-01', true, 180, 36, 5000, 'International business.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('9e6dbdc6-d27f-e563-238c-57d36f9d76ce', 'vu-cs', '0730b75e-96c0-453b-1b19-6be7ff4fa194', 'Computer Science', 'vu-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'CS at Vrije Universiteit Amsterdam.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '9e6dbdc6-d27f-e563-238c-57d36f9d76ce', '2026/27', '2026-09-01', true, 180, 36, 5000, 'CS at Vrije Universiteit Amsterdam.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('5149ec39-3d71-38f7-d522-390cefaa3ad9', 'vu-med', '0730b75e-96c0-453b-1b19-6be7ff4fa194', 'Medicine', 'vu-med', 'd9e5d212-320e-7d96-e921-831554be696d', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'f5ddaf0c-a792-9578-b408-c909429f68f2', '41d6ad07-61a5-d27a-9e1b-d567041ce9e9', 'Medical program in Dutch.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '5149ec39-3d71-38f7-d522-390cefaa3ad9', '2026/27', '2026-09-01', true, 360, 72, 5000, 'Medical program in Dutch.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('a87f9106-d3a4-2520-54cd-c1de4770a021', 'vu-psych', '0730b75e-96c0-453b-1b19-6be7ff4fa194', 'Psychology', 'vu-psych', '1231d487-d9ac-27b6-5795-56329bf2a71b', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Clinical psychology at VU.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'a87f9106-d3a4-2520-54cd-c1de4770a021', '2026/27', '2026-09-01', true, 120, 24, 6000, 'Clinical psychology at VU.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('61bd527a-1510-3891-7a41-aae26625c0aa', 'radboud-cs', '60a67f25-8110-e369-2850-a39227d9d458', 'Computer Science', 'radboud-cs', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'c2b7dae3-df98-5507-63df-aa494e550aeb', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'CS at Radboud in Nijmegen.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '61bd527a-1510-3891-7a41-aae26625c0aa', '2026/27', '2026-09-01', true, 180, 36, 5000, 'CS at Radboud in Nijmegen.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('afeba158-7065-0456-ce14-0204e0835340', 'radboud-ai', '60a67f25-8110-e369-2850-a39227d9d458', 'Artificial Intelligence', 'radboud-ai', '5f928eb9-cadb-d41e-0198-99ab63e33e10', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'AI special at Radboud.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'afeba158-7065-0456-ce14-0204e0835340', '2026/27', '2026-09-01', true, 120, 24, 6000, 'AI special at Radboud.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('4f0c2f14-700b-048e-014c-56b147e7453d', 'radboud-math', '60a67f25-8110-e369-2850-a39227d9d458', 'Mathematics', 'radboud-math', '6ae28a55-456b-101b-e826-1e5dee44cd3e', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'Applied mathematics.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), '4f0c2f14-700b-048e-014c-56b147e7453d', '2026/27', '2026-09-01', true, 120, 24, 5000, 'Applied mathematics.', 'manual');

INSERT INTO programs (id, legacy_id, university_id, name, slug, field_id, degree_type_id, instruction_type_id, primary_language_id, description, is_active) VALUES
('cd99ed4b-f7e0-d1e7-366d-a0b08af0df54', 'radboud-bus', '60a67f25-8110-e369-2850-a39227d9d458', 'Business', 'radboud-bus', 'f5d7e253-2cc9-ad16-bc2a-41222d76f269', 'eb0a1917-9762-4dd3-a48f-a681d3061212', 'ba0a6ddd-94c7-3698-a365-8f92ac222f8a', '9cfefed8-fb94-97ba-a5cd-519d7d2bb5d7', 'International business program.', true);
INSERT INTO program_versions (id, program_id, academic_year, effective_from, is_current, ects, duration_months, tuition_eur, description, data_source) VALUES
(gen_random_uuid(), 'cd99ed4b-f7e0-d1e7-366d-a0b08af0df54', '2026/27', '2026-09-01', true, 120, 24, 7000, 'International business program.', 'manual');

-- Verify:
-- SELECT count(*) as universities FROM universities;
-- SELECT count(*) as programs FROM programs;
-- SELECT count(*) as versions FROM program_versions;
