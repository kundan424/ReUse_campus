import { CAMPUS_CATEGORIES, CONDITIONS } from './categories';

export const CSV_HEADERS = [
  'Title',
  'Category',
  'SubCategory',
  'Quantity',
  'Condition',
  'Location',
  'PickupInstructions',
  'Description',
];

export const VALID_CATEGORIES = [
  'books',
  'electronics',
  'lab_supplies',
  'furniture',
  'event_supplies',
  'everyday_reusable',
  'other',
];

export const VALID_CONDITIONS = ['new', 'good', 'fair', 'needs_repair'];

/**
 * Normalizes loose category inputs from CSV into valid category IDs.
 */
export function normalizeCategory(val) {
  if (!val) return 'other';
  const clean = String(val).toLowerCase().trim().replace(/[\s&/_-]+/g, ' ');

  if (clean.includes('book') || clean.includes('study') || clean.includes('textbook') || clean.includes('manual')) {
    return 'books';
  }
  if (clean.includes('electronic') || clean.includes('computer') || clean.includes('monitor') || clean.includes('keyboard') || clean.includes('cable')) {
    return 'electronics';
  }
  if (clean.includes('lab') || clean.includes('apparatus') || clean.includes('breadboard') || clean.includes('tool')) {
    return 'lab_supplies';
  }
  if (clean.includes('furnitur') || clean.includes('chair') || clean.includes('table') || clean.includes('desk') || clean.includes('whiteboard') || clean.includes('shelf')) {
    return 'furniture';
  }
  if (clean.includes('event') || clean.includes('club') || clean.includes('banner') || clean.includes('extension') || clean.includes('easel')) {
    return 'event_supplies';
  }
  if (clean.includes('everyday') || clean.includes('reusable') || clean.includes('crate') || clean.includes('box') || clean.includes('binder') || clean.includes('folder')) {
    return 'everyday_reusable';
  }
  return 'other';
}

/**
 * Normalizes condition text into valid condition enum.
 */
export function normalizeCondition(val) {
  if (!val) return 'good';
  const clean = String(val).toLowerCase().trim();

  if (clean.includes('new') || clean.includes('mint') || clean.includes('unopened')) {
    return 'new';
  }
  if (clean.includes('fair') || clean.includes('worn') || clean.includes('average')) {
    return 'fair';
  }
  if (clean.includes('repair') || clean.includes('fix') || clean.includes('damaged') || clean.includes('restoration')) {
    return 'needs_repair';
  }
  return 'good';
}

/**
 * Robust CSV string parser handling escaped quotes and commas inside cells.
 */
export function parseCsvRows(csvText) {
  const lines = [];
  let row = [''];
  let inQuotes = false;
  let cursor = 0;

  while (cursor < csvText.length) {
    const char = csvText[cursor];
    const next = csvText[cursor + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        // Escaped double quote
        row[row.length - 1] += '"';
        cursor++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push('');
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        cursor++;
      }
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += char;
    }
    cursor++;
  }

  if (row.length > 1 || (row.length === 1 && row[0].trim() !== '')) {
    lines.push(row);
  }

  return lines;
}

/**
 * Parses and validates raw CSV content into structured resource payload.
 */
export function validateCsvPayload(csvText) {
  const rows = parseCsvRows(csvText);
  if (!rows || rows.length < 2) {
    return {
      validRows: [],
      errors: ['The CSV file is empty or missing data rows.'],
      totalRows: 0,
    };
  }

  // Header detection
  const rawHeaders = rows[0].map((h) => h.trim().toLowerCase());
  const headerMap = {};
  rawHeaders.forEach((h, idx) => {
    if (h.includes('title') || h.includes('item') || h.includes('name')) headerMap.title = idx;
    else if (h.includes('cat') || h.includes('sector')) headerMap.category = idx;
    else if (h.includes('sub')) headerMap.subCategory = idx;
    else if (h.includes('qty') || h.includes('quant') || h.includes('count') || h.includes('units')) headerMap.quantity = idx;
    else if (h.includes('cond') || h.includes('state')) headerMap.condition = idx;
    else if (h.includes('loc') || h.includes('room') || h.includes('block') || h.includes('place')) headerMap.location = idx;
    else if (h.includes('pickup') || h.includes('hour') || h.includes('instruct')) headerMap.pickupInstructions = idx;
    else if (h.includes('desc') || h.includes('spec') || h.includes('note') || h.includes('detail')) headerMap.description = idx;
  });

  // Fallback defaults by index if headers weren't named
  if (headerMap.title === undefined) headerMap.title = 0;
  if (headerMap.category === undefined) headerMap.category = 1;
  if (headerMap.subCategory === undefined) headerMap.subCategory = 2;
  if (headerMap.quantity === undefined) headerMap.quantity = 3;
  if (headerMap.condition === undefined) headerMap.condition = 4;
  if (headerMap.location === undefined) headerMap.location = 5;
  if (headerMap.pickupInstructions === undefined) headerMap.pickupInstructions = 6;
  if (headerMap.description === undefined) headerMap.description = 7;

  const validRows = [];
  const errors = [];

  for (let i = 1; i < rows.length; i++) {
    const rawRow = rows[i];
    // Skip empty lines
    if (!rawRow || rawRow.every((c) => !c || c.trim() === '')) continue;

    const rowNumber = i + 1;
    const title = (rawRow[headerMap.title] || '').trim();
    const rawCat = (rawRow[headerMap.category] || '').trim();
    const subCategory = (rawRow[headerMap.subCategory] || '').trim();
    const rawQty = (rawRow[headerMap.quantity] || '').trim();
    const rawCond = (rawRow[headerMap.condition] || '').trim();
    const location = (rawRow[headerMap.location] || '').trim();
    const pickupInstructions = (rawRow[headerMap.pickupInstructions] || '').trim();
    let description = (rawRow[headerMap.description] || '').trim();

    if (!title) {
      errors.push(`Row ${rowNumber}: Resource title is required.`);
      continue;
    }

    const qty = parseInt(rawQty, 10);
    if (isNaN(qty) || qty < 1) {
      errors.push(`Row ${rowNumber} ("${title}"): Quantity must be a positive integer.`);
      continue;
    }

    if (!location) {
      errors.push(`Row ${rowNumber} ("${title}"): Campus pickup location/room is required.`);
      continue;
    }

    const category = normalizeCategory(rawCat);
    const condition = normalizeCondition(rawCond);

    if (!description) {
      description = `${title} available for campus reallocation. Condition: ${condition.replace('_', ' ')}.`;
    }

    validRows.push({
      rowNumber,
      title,
      category,
      subCategory: subCategory || title,
      quantity: qty,
      condition,
      location,
      pickupInstructions: pickupInstructions || 'Coordinate directly upon request approval.',
      description,
    });
  }

  return {
    validRows,
    errors,
    totalRows: validRows.length + errors.length,
  };
}

/**
 * Returns standard CSV template text ready for download.
 */
export function generateSampleCsv() {
  const header = CSV_HEADERS.join(',');
  const sampleRows = [
    `"Dell UltraSharp 24-inch Monitors","electronics","Working monitors and peripherals",4,"good","CSE Lab 2, Room 304","Weekdays 2 PM - 5 PM","Fully functional desktop monitors with HDMI cables and power cords."`,
    `"CLRS Introduction to Algorithms (3rd Edition)","books","Engineering and programming textbooks",3,"good","Department Library, Counter B","10 AM - 4 PM","Core computer science textbooks with minimal markings."`,
    `"Solid Timber Adjustable Study Chairs","furniture","Chairs and study tables",8,"good","Hostel Block 1 Furniture Depot","9 AM - 1 PM","Sturdy wooden study chairs in solid structural condition."`,
    `"Solderless Breadboards with Logic ICs","lab_supplies","Breadboards and electronic components",12,"new","Physics & Electronics Lab A","Mon-Fri 11 AM - 3 PM","Unopened 830-point breadboards with assorted jumper components."`,
    `"Heavy Duty 6-Socket Power Extension Strips","event_supplies","Extension boards and power strips",5,"good","Student Activity Center, Room 102","Coordinate with club coordinator","5-meter long cords with surge protection breakers."`,
    `"Stackable Storage Crates (45L Polypropylene)","everyday_reusable","Clean storage boxes and crates",10,"good","Central Storehouse, Dock 4","Weekdays 10 AM - 12 PM","Clean storage containers with snap-on lids."`,
  ];
  return [header, ...sampleRows].join('\r\n');
}
