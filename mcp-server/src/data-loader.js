/**
 * Data Loader — Parses the tool's data/*.js files into structured JSON
 * Uses Node.js vm module to safely evaluate the const declarations
 */

import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import vm from 'vm';

const DATA_DIR = resolve(import.meta.dirname, '../../data');
const JS_DIR = resolve(import.meta.dirname, '../../js');

/**
 * Safely evaluate a JS data file and extract its exported constants
 */
function evalDataFile(filePath) {
  try {
    const code = readFileSync(filePath, 'utf-8');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: filePath, timeout: 5000 });
    return sandbox;
  } catch (e) {
    console.error(`[DataLoader] Failed to parse ${filePath}: ${e.message}`);
    return {};
  }
}

/**
 * Load all control families (Rev 2 and Rev 3)
 */
function loadFamilies() {
  const rev2Files = [
    'families-ac-at-au.js',
    'families-cm-ia.js',
    'families-ir-ma-mp-ps-pe.js',
    'families-ra-ca-sc-si.js'
  ];
  const rev3Files = [
    'families-r3-ac-at-au.js',
    'families-r3-cm-ia.js',
    'families-r3-ir-ma-mp-ps-pe.js',
    'families-r3-ra-ca-sc-si.js',
    'families-r3-sr-pl.js'
  ];

  const rev2Families = [];
  for (const f of rev2Files) {
    const data = evalDataFile(join(DATA_DIR, f));
    for (const val of Object.values(data)) {
      if (Array.isArray(val)) rev2Families.push(...val);
    }
  }

  const rev3Families = [];
  for (const f of rev3Files) {
    const data = evalDataFile(join(DATA_DIR, f));
    for (const val of Object.values(data)) {
      if (Array.isArray(val)) rev3Families.push(...val);
    }
  }

  return { rev2: rev2Families, rev3: rev3Families };
}

/**
 * Build a flat control index: { controlId → { family, control, objectives } }
 */
function buildControlIndex(families) {
  const index = {};
  for (const fam of families) {
    if (!fam.controls) continue;
    for (const ctrl of fam.controls) {
      index[ctrl.id] = {
        familyId: fam.id,
        familyName: fam.name,
        controlId: ctrl.id,
        controlName: ctrl.name,
        description: ctrl.description,
        objectives: ctrl.objectives || []
      };
    }
  }
  return index;
}

/**
 * Load Rev2→Rev3 crosswalk data
 */
function loadCrosswalk() {
  const data = evalDataFile(join(JS_DIR, 'rev3-crosswalk.js'));
  const crosswalk = data.Rev3Crosswalk;
  if (!crosswalk) return { mapping: [], odps: {}, newControls: [], famFull: {} };
  return {
    mapping: crosswalk.CONTROL_MAPPING || [],
    odps: crosswalk.DOD_ODPS || {},
    newControls: crosswalk.NEW_CONTROLS_REV3 || [],
    famFull: crosswalk.FAM_FULL || {}
  };
}

/**
 * Load 800-53 to 171 mapping
 */
function load80053Mapping() {
  const data = evalDataFile(join(DATA_DIR, 'nist-800-53-to-171-mapping.js'));
  return data.NIST_800_53_TO_171_MAPPING || {};
}

/**
 * Load Rev2→Rev3 migration data
 */
function loadMigrationData() {
  const data = evalDataFile(join(DATA_DIR, 'nist-800-171a-r3.js'));
  return {
    migration: data.REV2_TO_REV3_MIGRATION || {},
    odps: data.REV3_ODPS || {},
    newControls: data.REV3_NEW_CONTROLS || {},
    mergedControls: data.REV3_MERGED_CONTROLS || {}
  };
}

/**
 * Load control cross-reference (objective → external ID)
 */
function loadCtrlXref() {
  const data = evalDataFile(join(DATA_DIR, 'ctrl-xref.js'));
  return data.CTRL_XREF || {};
}

/**
 * Load comprehensive implementation guidance
 */
function loadGuidance() {
  const files = [
    'comprehensive-implementation-guidance.js',
    'comprehensive-guidance-expansion-part2.js',
    'comprehensive-guidance-expansion-part3.js',
    'comprehensive-guidance-expansion-part4.js',
    'comprehensive-guidance-expansion-part5.js'
  ];
  
  let guidance = {};
  for (const f of files) {
    const data = evalDataFile(join(DATA_DIR, f));
    // Merge guidance objects
    for (const val of Object.values(data)) {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        if (val.controls) {
          guidance = { ...guidance, ...val.controls };
        } else if (val.objectives || val.guidance) {
          // Some files have different structures
          Object.assign(guidance, val);
        }
      }
    }
  }
  return guidance;
}

/**
 * Load FedRAMP 20x KSI data
 */
function loadFedRAMPKSI() {
  const data = evalDataFile(join(DATA_DIR, 'fedramp-20x-ksi.js'));
  return data.FEDRAMP_20X_KSI || data.FEDRAMP_KSI_DATA || {};
}

/**
 * Master loader — loads all data at startup
 */
export function loadAllData() {
  console.error('[DataLoader] Loading data from', DATA_DIR);
  
  const families = loadFamilies();
  const rev2Index = buildControlIndex(families.rev2);
  const rev3Index = buildControlIndex(families.rev3);
  const crosswalk = loadCrosswalk();
  const mapping80053 = load80053Mapping();
  const migration = loadMigrationData();
  const ctrlXref = loadCtrlXref();
  const guidance = loadGuidance();
  const fedRAMP = loadFedRAMPKSI();

  const stats = {
    rev2Controls: Object.keys(rev2Index).length,
    rev3Controls: Object.keys(rev3Index).length,
    rev2Objectives: families.rev2.reduce((n, f) => n + (f.controls || []).reduce((m, c) => m + (c.objectives || []).length, 0), 0),
    rev3Objectives: families.rev3.reduce((n, f) => n + (f.controls || []).reduce((m, c) => m + (c.objectives || []).length, 0), 0),
    crosswalkMappings: crosswalk.mapping.length,
    newRev3Controls: crosswalk.newControls.length,
    odpControls: Object.keys(crosswalk.odps).length,
    guidanceEntries: Object.keys(guidance).length,
    mapping80053Entries: Object.keys(mapping80053).length
  };

  console.error('[DataLoader] Loaded:', JSON.stringify(stats));

  return {
    families,
    rev2Index,
    rev3Index,
    crosswalk,
    mapping80053,
    migration,
    ctrlXref,
    guidance,
    fedRAMP,
    stats
  };
}
