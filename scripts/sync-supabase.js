#!/usr/bin/env node
/**
 * Supabase Sync Script v2
 * Syncs programs + program_versions from data/programs.json into Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://akaquwmabalzuazewheu.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrYXF1d21hYmFsenVhemV3aGV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg4MDg4NywiZXhwIjoyMDkwNDU2ODg3fQ.x20hEk95QZQHgGkDzRXoyAXBTEjvhM8DQjbRR_gNMBM';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const jsonPath = path.join(__dirname, '../data/programs.json');
const { programs: jsonPrograms } = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

async function getMap(table, keyCol, valCol) {
  const { data, error } = await supabase.from(table).select(`${keyCol},${valCol}`);
  if (error) throw error;
  const m = {};
  data.forEach(r => { m[r[keyCol]] = r[valCol]; });
  return m;
}

async function main() {
  console.log('🔄 Supabase Sync v2\n');

  // Reference maps
  console.log('📡 Fetching reference UUIDs...');
  const [uniMap, fieldMap, degreeMap, instrMap, langMap, existing] = await Promise.all([
    getMap('universities', 'legacy_id', 'id'),
    getMap('study_fields', 'slug', 'id'),
    getMap('degree_types', 'slug', 'id'),
    getMap('instruction_types', 'slug', 'id'),
    getMap('languages', 'code', 'id'),
    getMap('programs', 'legacy_id', 'id'),
  ]);
  console.log(`  Unis: ${Object.keys(uniMap).length}, Fields: ${Object.keys(fieldMap).length}`);
  console.log(`  Existing programs: ${Object.keys(existing).length}`);

  const now = '2026-09-01';
  const academicYear = '2026/27';
  const toUpsert = [];

  for (const prog of jsonPrograms) {
    const rawId = prog.id;
    // Truncate + hash to fit VARCHAR(50), keeping uniqueness
    const legacyId = rawId.length > 50 ? rawId.substring(0, 44) + '-' + Math.abs(rawId.split('').reduce((a,c)=>a+c.charCodeAt(0),0) % 1000).toString().padStart(3,'0') : rawId;
    const { universityId, name, degree, language, ects, durationMonths, tuitionEur, description, field } = prog;

    // Skip if university not found
    const uniId = uniMap[universityId];
    if (!uniId) { console.warn(`  ⚠️ Skip ${legacyId}: no uni`); continue; }

    // Map fields
    const fieldSlug = (field || 'computer-science').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'computer-science';
    const fieldId = fieldMap[fieldSlug] || fieldMap['computer-science'];
    const degreeId = degreeMap[degree] || degreeMap['bachelor'];

    // Map instruction type and language
    let instrId = instrMap['english'];
    let langId = langMap['en'];
    if (language === 'german') { instrId = instrMap['local']; langId = langMap['de']; }
    else if (['local', 'both'].includes(language)) { instrId = instrMap['both']; langId = langMap['en']; }
    else if (language === 'polish') { instrId = instrMap['local']; langId = langMap['pl']; }
    else if (language === 'hungarian') { instrId = instrMap['local']; langId = langMap['hu']; }
    else if (language === 'slovak') { instrId = instrMap['local']; langId = langMap['sk']; }
    else if (language === 'czech') { instrId = instrMap['local']; langId = langMap['cs']; }
    else if (language === 'dutch') { instrId = instrMap['local']; langId = langMap['nl']; }

    const base = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 30);
    const slug = `${universityId}-${base}`;

    toUpsert.push({
      legacy_id: legacyId,
      university_id: uniId,
      name,
      slug,
      field_id: fieldId,
      degree_type_id: degreeId,
      instruction_type_id: instrId,
      primary_language_id: langId,
      description: description || null,
      is_active: true,
      deleted_at: null,
    });
  }

  // Deduplicate by legacy_id
  const seen = new Set();
  const uniq = toUpsert.filter(p => {
    if (seen.has(p.legacy_id)) return false;
    seen.add(p.legacy_id);
    return true;
  });

  console.log(`\n📊 Sync plan: ${uniq.length} programs to upsert`);

  // Upsert programs in batches
  const BATCH = 50;
  let done = 0;
  for (let i = 0; i < uniq.length; i += BATCH) {
    const batch = uniq.slice(i, i + BATCH);
    const { error } = await supabase.from('programs').upsert(batch, { onConflict: 'legacy_id' });
    if (error) {
      console.error(`  ❌ Batch error: ${error.message}`);
    } else {
      done += batch.length;
      console.log(`  ✅ Programs batch ${Math.floor(i/BATCH) + 1}: ${done}/${uniq.length}`);
    }
  }

  // Re-fetch program UUIDs (needed for version inserts)
  console.log('\n📡 Re-fetching program UUIDs...');
  const progMap = await getMap('programs', 'legacy_id', 'id');
  console.log(`  Total programs now: ${Object.keys(progMap).length}`);

  // Build version rows
  const versions = [];
  const skipped = [];

  for (const prog of jsonPrograms) {
    const { id: legacyId, ects, durationMonths, tuitionEur, description, entryRequirements } = prog;
    const progId = progMap[legacyId];
    if (!progId) { skipped.push(legacyId); continue; }

    versions.push({
      program_id: progId,
      academic_year: academicYear,
      effective_from: now,
      effective_to: null,
      is_current: true,
      ects: ects || 180,
      duration_months: durationMonths || 36,
      tuition_eur: tuitionEur || 0,
      tuition_note: null,
      description: description || null,
      data_source: 'scraped',
    });
  }

  if (skipped.length) console.warn(`  ⚠️ Skipped ${skipped.length} programs (no UUID found)`);

  // Deduplicate versions by program_id+academic_year
  const verSeen = new Set();
  const uniqVersions = versions.filter(v => {
    const key = v.program_id + '|' + v.academic_year;
    if (verSeen.has(key)) return false;
    verSeen.add(key);
    return true;
  });

  console.log(`\n📊 Version plan: ${uniqVersions.length} unique program_versions (was ${versions.length})`);

  // Upsert versions using uniqVersions
  let vDone = 0;
  for (let i = 0; i < uniqVersions.length; i += BATCH) {
    const batch = uniqVersions.slice(i, i + BATCH);
    const { error } = await supabase.from('program_versions').upsert(batch, { onConflict: 'program_id,academic_year' });
    if (error) {
      console.error(`  ❌ Version batch error: ${error.message}`);
    } else {
      vDone += batch.length;
      console.log(`  ✅ Versions batch ${Math.floor(i/BATCH) + 1}: ${vDone}/${uniqVersions.length}`);
    }
  }

  // Final count
  const { count: progCount } = await supabase.from('programs').select('count', { count: 'exact' });
  const { count: verCount } = await supabase.from('program_versions').select('count', { count: 'exact' });
  console.log(`\n🎉 Done! programs: ${progCount}, program_versions: ${verCount}`);
}

main().catch(console.error);
