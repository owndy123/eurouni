-- ============================================================
-- EuroUni Seed: Universities + Programs + Current Versions
-- Run this AFTER setup-supabase.sql
-- Paste into Supabase SQL Editor and run
-- ============================================================

-- Countries were already seeded by setup-supabase.sql
-- This file seeds: universities, programs, program_versions

-- ===================== UNIVERSITIES =====================

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'stuba', 'Slovak University of Technology in Bratislava', 'stuba', (SELECT id FROM countries WHERE code = 'SVK'), 'Bratislava', 'bratislava', 48.1538, 17.1071, 'https://www.stuba.sk', '🎓', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'stuba');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'uniba', 'Comenius University in Bratislava', 'uniba', (SELECT id FROM countries WHERE code = 'SVK'), 'Bratislava', 'bratislava', 48.1409, 17.1127, 'https://www.uniba.sk', '📚', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'uniba');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'ukf', 'Constantine the Philosopher University in Nitra', 'ukf', (SELECT id FROM countries WHERE code = 'SVK'), 'Nitra', 'nitra', 48.3063, 18.0865, 'https://www.ukf.sk', '🏛️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'ukf');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'tuke', 'Technical University of Košice', 'tuke', (SELECT id FROM countries WHERE code = 'SVK'), 'Košice', 'kosice', 48.7305, 21.2489, 'https://www.tuke.sk', '⚙️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'tuke');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'upjs', 'University of Pavol Jozef Šafárik in Košice', 'upjs', (SELECT id FROM countries WHERE code = 'SVK'), 'Košice', 'kosice', 48.7167, 21.2333, 'https://www.upjs.sk', '🔬', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'upjs');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'tu-zvolen', 'Technical University in Zvolen', 'tu-zvolen', (SELECT id FROM countries WHERE code = 'SVK'), 'Zvolen', 'zvolen', 48.5744, 19.1175, 'https://www.tuzvo.sk', '🌲', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'tu-zvolen');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'uvm', 'University of Veterinary Medicine in Košice', 'uvm', (SELECT id FROM countries WHERE code = 'SVK'), 'Košice', 'kosice', 48.7489, 21.2254, 'https://www.uvm.sk', '🐾', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'uvm');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'akademia', 'Academy of Performing Arts in Bratislava', 'akademia', (SELECT id FROM countries WHERE code = 'SVK'), 'Bratislava', 'bratislava', 48.1456, 17.1073, 'https://www.akademia.sk', '🎭', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'akademia');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'cuni', 'Charles University', 'cuni', (SELECT id FROM countries WHERE code = 'CZE'), 'Prague', 'prague', 50.0875, 14.4214, 'https://www.cuni.cz', '👑', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'cuni');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'cvut', 'Czech Technical University in Prague', 'cvut', (SELECT id FROM countries WHERE code = 'CZE'), 'Prague', 'prague', 50.1028, 14.3902, 'https://www.cvut.cz', '⚡', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'cvut');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'vut-brno', 'Brno University of Technology', 'vut-brno', (SELECT id FROM countries WHERE code = 'CZE'), 'Brno', 'brno', 49.201, 16.6068, 'https://www.vut.cz', '🔧', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'vut-brno');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'muni', 'Masaryk University', 'muni', (SELECT id FROM countries WHERE code = 'CZE'), 'Brno', 'brno', 49.1999, 16.6068, 'https://www.muni.cz', '🎓', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'muni');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'czu', 'Czech University of Life Sciences Prague', 'czu', (SELECT id FROM countries WHERE code = 'CZE'), 'Prague', 'prague', 50.1295, 14.3732, 'https://www.czu.cz', '🌾', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'czu');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'upol', 'Palacký University Olomouc', 'upol', (SELECT id FROM countries WHERE code = 'CZE'), 'Olomouc', 'olomouc', 49.5939, 17.2508, 'https://www.upol.cz', '📖', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'upol');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'osu', 'University of Ostrava', 'osu', (SELECT id FROM countries WHERE code = 'CZE'), 'Ostrava', 'ostrava', 49.8209, 18.2625, 'https://www.osu.cz', '🏭', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'osu');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'utb', 'Tomas Bata University in Zlín', 'utb', (SELECT id FROM countries WHERE code = 'CZE'), 'Zlín', 'zlin', 49.2401, 17.6667, 'https://www.utb.cz', '👟', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'utb');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'ujep', 'Jan Evangelista Purkyně University', 'ujep', (SELECT id FROM countries WHERE code = 'CZE'), 'Ústí nad Labem', 'usti-nad-labem', 50.7714, 14.0419, 'https://www.ujep.cz', '🔬', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'ujep');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'uwb', 'University of West Bohemia', 'uwb', (SELECT id FROM countries WHERE code = 'CZE'), 'Pilsen', 'pilsen', 49.7384, 13.3646, 'https://www.zcu.cz', '🎓', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'uwb');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'univie', 'University of Vienna', 'univie', (SELECT id FROM countries WHERE code = 'AUT'), 'Vienna', 'vienna', 48.2105, 16.3599, 'https://www.univie.ac.at', '🏰', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'univie');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'tuw', 'TU Wien', 'tuw', (SELECT id FROM countries WHERE code = 'AUT'), 'Vienna', 'vienna', 48.1986, 16.3692, 'https://www.tuwien.ac.at', '⚙️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'tuw');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'tu-graz', 'Graz University of Technology', 'tu-graz', (SELECT id FROM countries WHERE code = 'AUT'), 'Graz', 'graz', 47.0667, 15.45, 'https://www.tugraz.at', '🔩', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'tu-graz');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'jku', 'Johannes Kepler University Linz', 'jku', (SELECT id FROM countries WHERE code = 'AUT'), 'Linz', 'linz', 48.3333, 14.2833, 'https://www.jku.at', '📊', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'jku');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'uibk', 'University of Innsbruck', 'uibk', (SELECT id FROM countries WHERE code = 'AUT'), 'Innsbruck', 'innsbruck', 47.2692, 11.4041, 'https://www.uibk.ac.at', '🏔️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'uibk');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'sbg', 'University of Salzburg', 'sbg', (SELECT id FROM countries WHERE code = 'AUT'), 'Salzburg', 'salzburg', 47.7964, 13.0456, 'https://www.plus.ac.at', '🎵', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'sbg');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'wu-wien', 'Vienna University of Economics and Business', 'wu-wien', (SELECT id FROM countries WHERE code = 'AUT'), 'Vienna', 'vienna', 48.2108, 16.3685, 'https://www.wu.ac.at', '💼', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'wu-wien');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'mu-wien', 'Medical University of Vienna', 'mu-wien', (SELECT id FROM countries WHERE code = 'AUT'), 'Vienna', 'vienna', 48.2208, 16.3498, 'https://www.meduniwien.ac.at', '⚕️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'mu-wien');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'uw', 'University of Warsaw', 'uw', (SELECT id FROM countries WHERE code = 'POL'), 'Warsaw', 'warsaw', 52.2391, 21.0206, 'https://www.uw.edu.pl', '📚', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'uw');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'pw', 'Warsaw University of Technology', 'pw', (SELECT id FROM countries WHERE code = 'POL'), 'Warsaw', 'warsaw', 52.219, 21.0138, 'https://www.pw.edu.pl', '🔧', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'pw');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'uj', 'Jagiellonian University', 'uj', (SELECT id FROM countries WHERE code = 'POL'), 'Kraków', 'krakow', 50.0579, 19.9492, 'https://www.uj.edu.pl', '👑', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'uj');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'agh', 'AGH University of Science and Technology', 'agh', (SELECT id FROM countries WHERE code = 'POL'), 'Kraków', 'krakow', 50.0657, 19.923, 'https://www.agh.edu.pl', '⚒️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'agh');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'put', 'Poznań University of Technology', 'put', (SELECT id FROM countries WHERE code = 'POL'), 'Poznań', 'poznan', 52.4066, 16.9265, 'https://www.put.poznan.pl', '⚙️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'put');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'amu', 'Adam Mickiewicz University', 'amu', (SELECT id FROM countries WHERE code = 'POL'), 'Poznań', 'poznan', 52.4074, 16.9338, 'https://www.amu.edu.pl', '🎓', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'amu');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'uw-edu', 'University of Wrocław', 'uw-edu', (SELECT id FROM countries WHERE code = 'POL'), 'Wrocław', 'wroclaw', 51.1102, 17.032, 'https://www.uw.edu.pl', '📖', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'uw-edu');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'pwr', 'Wrocław University of Science and Technology', 'pwr', (SELECT id FROM countries WHERE code = 'POL'), 'Wrocław', 'wroclaw', 51.1075, 17.0592, 'https://www.pwr.edu.pl', '🔬', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'pwr');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'ug', 'University of Gdańsk', 'ug', (SELECT id FROM countries WHERE code = 'POL'), 'Gdańsk', 'gdansk', 54.4461, 18.5698, 'https://www.ug.edu.pl', '⚓', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'ug');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'pg', 'Gdańsk University of Technology', 'pg', (SELECT id FROM countries WHERE code = 'POL'), 'Gdańsk', 'gdansk', 54.4416, 18.5561, 'https://www.pg.edu.pl', '🏗️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'pg');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'elte', 'Eötvös Loránd University', 'elte', (SELECT id FROM countries WHERE code = 'HUN'), 'Budapest', 'budapest', 47.4908, 19.0617, 'https://www.elte.hu', '📚', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'elte');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'bme', 'Budapest University of Technology and Economics', 'bme', (SELECT id FROM countries WHERE code = 'HUN'), 'Budapest', 'budapest', 47.4739, 19.0577, 'https://www.bme.hu', '⚙️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'bme');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'elte-ik', 'Eötvös Loránd University - Faculty of Informatics', 'elte-ik', (SELECT id FROM countries WHERE code = 'HUN'), 'Budapest', 'budapest', 47.4935, 19.0626, 'https://www.inf.elte.hu', '💻', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'elte-ik');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'semmelweis', 'Semmelweis University', 'semmelweis', (SELECT id FROM countries WHERE code = 'HUN'), 'Budapest', 'budapest', 47.5068, 19.0729, 'https://www.semmelweis.hu', '⚕️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'semmelweis');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'uni-miskolc', 'University of Miskolc', 'uni-miskolc', (SELECT id FROM countries WHERE code = 'HUN'), 'Miskolc', 'miskolc', 48.1036, 20.7833, 'https://www.uni-miskolc.hu', '🏭', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'uni-miskolc');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'pte', 'University of Pécs', 'pte', (SELECT id FROM countries WHERE code = 'HUN'), 'Pécs', 'pecs', 46.0807, 18.2183, 'https://www.pte.hu', '🎓', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'pte');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'szte', 'University of Szeged', 'szte', (SELECT id FROM countries WHERE code = 'HUN'), 'Szeged', 'szeged', 46.2469, 20.1456, 'https://www.u-szeged.hu', '☀️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'szte');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'debrecen', 'University of Debrecen', 'debrecen', (SELECT id FROM countries WHERE code = 'HUN'), 'Debrecen', 'debrecen', 47.553, 21.6392, 'https://www.unideb.hu', '🌳', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'debrecen');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'tum', 'Technical University of Munich', 'tum', (SELECT id FROM countries WHERE code = 'DEU'), 'Munich', 'munich', 48.396, 11.722, 'https://www.tum.de', '🏛️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'tum');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'tum-wsi', 'TUM School of Management', 'tum-wsi', (SELECT id FROM countries WHERE code = 'DEU'), 'Munich', 'munich', 48.3744, 11.8533, 'https://www.wsi.tum.de', '💼', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'tum-wsi');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'tu-berlin', 'Technical University of Berlin', 'tu-berlin', (SELECT id FROM countries WHERE code = 'DEU'), 'Berlin', 'berlin', 52.5112, 13.397, 'https://www.tu.berlin', '⚡', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'tu-berlin');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'rwth', 'RWTH Aachen University', 'rwth', (SELECT id FROM countries WHERE code = 'DEU'), 'Aachen', 'aachen', 50.7753, 6.0839, 'https://www.rwth-aachen.de', '🔬', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'rwth');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'kit', 'Karlsruhe Institute of Technology', 'kit', (SELECT id FROM countries WHERE code = 'DEU'), 'Karlsruhe', 'karlsruhe', 49.0069, 8.4197, 'https://www.kit.edu', '🧪', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'kit');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'tum-phy', 'TUM Department of Physics', 'tum-phy', (SELECT id FROM countries WHERE code = 'DEU'), 'Garching', 'garching', 48.2656, 11.6722, 'https://www.ph.tum.de', '⚛️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'tum-phy');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'fub', 'Freie Universität Berlin', 'fub', (SELECT id FROM countries WHERE code = 'DEU'), 'Berlin', 'berlin', 52.4324, 13.5285, 'https://www.fu-berlin.de', '🕊️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'fub');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'hu-berlin', 'Humboldt University of Berlin', 'hu-berlin', (SELECT id FROM countries WHERE code = 'DEU'), 'Berlin', 'berlin', 52.5169, 13.3976, 'https://www.hu-berlin.de', '🎭', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'hu-berlin');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'lmu', 'Ludwig Maximilian University of Munich', 'lmu', (SELECT id FROM countries WHERE code = 'DEU'), 'Munich', 'munich', 48.1508, 11.5808, 'https://www.lmu.de', '👑', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'lmu');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'heidelberg', 'Heidelberg University', 'heidelberg', (SELECT id FROM countries WHERE code = 'DEU'), 'Heidelberg', 'heidelberg', 49.3988, 8.6724, 'https://www.uni-heidelberg.de', '🏰', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'heidelberg');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'uva', 'University of Amsterdam', 'uva', (SELECT id FROM countries WHERE code = 'NLD'), 'Amsterdam', 'amsterdam', 52.3555, 4.9555, 'https://www.uva.nl', '🎓', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'uva');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'tue', 'Eindhoven University of Technology', 'tue', (SELECT id FROM countries WHERE code = 'NLD'), 'Eindhoven', 'eindhoven', 51.4416, 5.4697, 'https://www.tue.nl', '💡', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'tue');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'tudelft', 'Delft University of Technology', 'tudelft', (SELECT id FROM countries WHERE code = 'NLD'), 'Delft', 'delft', 51.9974, 4.3578, 'https://www.tudelft.nl', '⚙️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'tudelft');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'leiden', 'Leiden University', 'leiden', (SELECT id FROM countries WHERE code = 'NLD'), 'Leiden', 'leiden', 52.1667, 4.4667, 'https://www.universiteitleiden.nl', '📜', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'leiden');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'utwente', 'University of Twente', 'utwente', (SELECT id FROM countries WHERE code = 'NLD'), 'Enschede', 'enschede', 52.2408, 6.8517, 'https://www.utwente.nl', '🔧', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'utwente');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'rug', 'University of Groningen', 'rug', (SELECT id FROM countries WHERE code = 'NLD'), 'Groningen', 'groningen', 53.2194, 6.5665, 'https://www.rug.nl', '🌟', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'rug');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'vu', 'Vrije Universiteit Amsterdam', 'vu', (SELECT id FROM countries WHERE code = 'NLD'), 'Amsterdam', 'amsterdam', 52.3336, 4.8636, 'https://www.vu.nl', '✝️', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'vu');

INSERT INTO universities (legacy_id, name, slug, country_id, city, city_slug, latitude, longitude, website, logo_url, is_active)
SELECT 'radboud', 'Radboud University', 'radboud', (SELECT id FROM countries WHERE code = 'NLD'), 'Nijmegen', 'nijmegen', 51.8167, 5.8667, 'https://www.ru.nl', '🎓', true WHERE NOT EXISTS (SELECT 1 FROM universities WHERE legacy_id = 'radboud');
