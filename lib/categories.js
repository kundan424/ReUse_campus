export const CAMPUS_CATEGORIES = [
  {
    id: 'books',
    name: 'Books & Study Materials',
    description: 'Engineering textbooks, exam guides, lab manuals, notes, and question paper sets',
    avgCostInr: 650,
    co2KgPerUnit: 2.5,
    wasteKgPerUnit: 0.8,
    presets: [
      'Engineering and programming textbooks',
      'Entrance exam preparation books (GATE/GRE/CAT)',
      'Reference books and laboratory manuals',
      'Unused notebooks, binders, folders, and stationery',
      'Previous-year question paper (PYQ) collections',
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics & Computer Accessories',
    description: 'Keyboards, cables, monitors, hubs, and embedded microcontroller kits',
    avgCostInr: 2200,
    co2KgPerUnit: 18.0,
    wasteKgPerUnit: 1.5,
    presets: [
      'Keyboards, mice, and webcams',
      'HDMI and Ethernet cables & adapters',
      'Laptop ergonomic stands and USB hubs',
      'Working monitors and computer peripherals',
      'Arduino boards, sensors, and jumper wires',
    ],
  },
  {
    id: 'lab_supplies',
    name: 'Lab & Project Materials',
    description: 'Breadboards, electronic components, enclosures, tools, and lab apparatus',
    avgCostInr: 1800,
    co2KgPerUnit: 12.0,
    wasteKgPerUnit: 2.2,
    presets: [
      'Breadboards and assorted electronic ICs/components',
      'Reusable project enclosures and casings',
      'Mechanical tools, fasteners, and spare parts',
      'Working lab equipment approved for reuse',
      'Leftover craft and 3D/model-making supplies',
    ],
  },
  {
    id: 'furniture',
    name: 'Furniture & Classroom Supplies',
    description: 'Tables, chairs, whiteboards, shelves, notice boards, and desk lamps',
    avgCostInr: 3500,
    co2KgPerUnit: 35.0,
    wasteKgPerUnit: 8.5,
    presets: [
      'Chairs and ergonomic study tables',
      'Whiteboards, magnetic boards, and notice boards',
      'Storage shelves, filing racks, and organizers',
      'Desk reading lamps and lighting units',
      'Working projector screens and tripods',
    ],
  },
  {
    id: 'event_supplies',
    name: 'Event & Club Supplies',
    description: 'Display stands, banners, easels, fest decorations, power strips, and sports gear',
    avgCostInr: 1500,
    co2KgPerUnit: 8.0,
    wasteKgPerUnit: 3.0,
    presets: [
      'Reusable banners, podiums, and display stands',
      'Poster boards, easels, and presentation panels',
      'Event decorations and stage backdrops',
      'Extension boards, surge protectors, and power strips',
      'Sports equipment and club board games',
    ],
  },
  {
    id: 'everyday_reusable',
    name: 'Everyday Reusable Supplies',
    description: 'Storage boxes, binders, containers, packaging, and general campus utilities',
    avgCostInr: 450,
    co2KgPerUnit: 3.0,
    wasteKgPerUnit: 1.2,
    presets: [
      'Clean storage boxes and utility crates',
      'File folders, binders, and archive sleeves',
      'Reusable storage containers and organizers',
      'Art and craft materials & drafting kits',
      'Unopened stationery and protective packaging',
    ],
  },
  {
    id: 'other',
    name: 'Other Campus Resources',
    description: 'Any other reusable resource across campus not listed above',
    avgCostInr: 800,
    co2KgPerUnit: 5.0,
    wasteKgPerUnit: 1.5,
    presets: [
      'Custom or Unlisted Campus Item',
    ],
  },
];

export const CONDITIONS = [
  { value: 'new', label: 'New / Unopened', badge: 'Mint' },
  { value: 'good', label: 'Good — Fully functional with minor wear', badge: 'Good' },
  { value: 'fair', label: 'Fair — Functional with visible signs of use', badge: 'Fair' },
  { value: 'needs_repair', label: 'Needs Minor Repair / Restoration', badge: 'Restoration Needed' },
];

export function getCategoryById(id) {
  return CAMPUS_CATEGORIES.find((cat) => cat.id === id) || CAMPUS_CATEGORIES[CAMPUS_CATEGORIES.length - 1];
}
