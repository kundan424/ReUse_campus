const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reuse_campus';

async function seed() {
  console.log('Connecting to MongoDB for seeding...');
  await mongoose.connect(MONGODB_URI);

  // Define schemas inline for reliable standalone script execution
  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: String, email: String, password: String, role: String, departmentName: String, collegeId: String, phone: String, isActive: Boolean
  }, { timestamps: true }));

  const Resource = mongoose.models.Resource || mongoose.model('Resource', new mongoose.Schema({
    title: String, description: String, category: String, subCategory: String, quantity: Number, availableQuantity: Number, condition: String, location: String, pickupInstructions: String, imageUrl: String, owner: mongoose.Schema.Types.ObjectId, ownerRole: String, status: String
  }, { timestamps: true }));

  const ResourceRequest = mongoose.models.ResourceRequest || mongoose.model('ResourceRequest', new mongoose.Schema({
    resource: mongoose.Schema.Types.ObjectId, requester: mongoose.Schema.Types.ObjectId, requestedQuantity: Number, purpose: String, status: String, decisionBy: mongoose.Schema.Types.ObjectId, decisionNote: String, decisionAt: Date, pickupScheduledAt: Date, pickupNotes: String
  }, { timestamps: true }));

  const Transfer = mongoose.models.Transfer || mongoose.model('Transfer', new mongoose.Schema({
    resource: mongoose.Schema.Types.ObjectId, request: mongoose.Schema.Types.ObjectId, giver: mongoose.Schema.Types.ObjectId, receiver: mongoose.Schema.Types.ObjectId, quantityTransferred: Number, giverConfirmedAt: Date, receiverConfirmedAt: Date, completedAt: Date, status: String, impact: Object, impactMethodVersion: String
  }, { timestamps: true }));

  console.log('Clearing existing records...');
  await Promise.all([
    User.deleteMany({}),
    Resource.deleteMany({}),
    ResourceRequest.deleteMany({}),
    Transfer.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash('Campus@123', 10);

  // 1. Create Users
  console.log('Creating users...');
  const admin = await User.create({
    name: 'Dr. Evelyn Vance',
    email: 'admin@campus.edu',
    password: passwordHash,
    role: 'admin',
    departmentName: 'Campus Sustainability & Facility Management',
    isActive: true,
  });

  const cseDept = await User.create({
    name: 'Prof. Alok Sharma (Dept Rep)',
    email: 'cse.lab@campus.edu',
    password: passwordHash,
    role: 'user',
    departmentName: 'Computer Science & Engineering',
    phone: '+91 98765 43210',
    isActive: true,
  });

  const physicsLab = await User.create({
    name: 'Dr. Sunita Rao (Lab Incharge)',
    email: 'physics.lab@campus.edu',
    password: passwordHash,
    role: 'user',
    departmentName: 'Physics & Applied Sciences',
    phone: '+91 98765 43211',
    isActive: true,
  });

  const clubsCoord = await User.create({
    name: 'Student Activity Center',
    email: 'sac@campus.edu',
    password: passwordHash,
    role: 'user',
    departmentName: 'Campus Cultural & Clubs Council',
    phone: '+91 98765 43212',
    isActive: true,
  });

  const studentAarav = await User.create({
    name: 'Aarav Patel',
    email: 'aarav.student@campus.edu',
    password: passwordHash,
    role: 'user',
    collegeId: '2023CSE045',
    phone: '+91 91234 56789',
    isActive: true,
  });

  const studentPriya = await User.create({
    name: 'Priya Sundaram',
    email: 'priya.student@campus.edu',
    password: passwordHash,
    role: 'user',
    collegeId: '2024ECE012',
    phone: '+91 91234 56788',
    isActive: true,
  });

  const studentRohan = await User.create({
    name: 'Rohan Mehta',
    email: 'rohan.student@campus.edu',
    password: passwordHash,
    role: 'user',
    collegeId: '2022MECH088',
    phone: '+91 91234 56787',
    isActive: true,
  });

  // 2. Create Items across all 6 Categories
  console.log('Listing resources across the 6 campus categories...');

  const items = [
    // 1. Books & study materials
    {
      title: 'Introduction to Algorithms (CLRS 3rd Edition)',
      description: 'Standard textbook in very good condition with minimal highlighting. Clean binding, includes all chapters on graph algorithms and dynamic programming.',
      category: 'books',
      subCategory: 'Engineering and programming textbooks',
      quantity: 2,
      availableQuantity: 1, // 1 already transferred
      condition: 'good',
      location: 'CSE Department Library, 2nd Floor, Room 204',
      pickupInstructions: 'Available during working hours 10 AM - 4 PM. Ask for Lab Assistant Suresh.',
      imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
      owner: cseDept._id,
      ownerRole: 'user',
      status: 'available',
    },
    {
      title: 'GATE Computer Science 15-Year Solved Question Papers',
      description: 'Comprehensive MadeEasy GATE CSE previous year solved papers. Extremely helpful for 3rd and 4th-year entrance aspirants.',
      category: 'books',
      subCategory: 'Entrance exam preparation books (GATE/GRE/CAT)',
      quantity: 1,
      availableQuantity: 1,
      condition: 'good',
      location: 'Hostel Block 3, Room 218',
      pickupInstructions: 'Evenings after 6 PM or weekend mornings.',
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      owner: studentRohan._id,
      ownerRole: 'user',
      status: 'available',
    },

    // 2. Electronics & computer accessories
    {
      title: 'Dell UltraSharp 24" IPS Desktop Monitors (Working)',
      description: 'Surplus monitors from Department Computer Lab upgrade. Fully functional with HDMI & DisplayPort inputs, includes power cords and stands.',
      category: 'electronics',
      subCategory: 'Working monitors and computer peripherals',
      quantity: 4,
      availableQuantity: 3, // 1 transferred to Priya
      condition: 'good',
      location: 'CSE Systems Lab 2, Hardware Storage Bay',
      pickupInstructions: 'Collect between 2 PM and 5 PM on weekdays. Bring your campus ID card.',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      owner: cseDept._id,
      ownerRole: 'user',
      status: 'available',
    },
    {
      title: 'Arduino Uno Rev3 Starter Kit with Sensor Pack',
      description: 'Complete kit containing original Arduino Uno board, ultrasonic sensor, DHT11, servo motor, and 40 jumper wires. Ideal for IoT or robotics mini-projects.',
      category: 'electronics',
      subCategory: 'Arduino boards, sensors, and jumper wires',
      quantity: 2,
      availableQuantity: 2,
      condition: 'new',
      location: 'Robotics Club Workshop, Ground Floor SAC',
      pickupInstructions: 'Weekdays 4:30 PM - 7 PM.',
      imageUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      owner: studentAarav._id,
      ownerRole: 'user',
      status: 'available',
    },

    // 3. Lab & project materials
    {
      title: 'Full-Size Solderless Breadboards & Electronic IC Component Kit',
      description: 'Two 830-point solderless breadboards, 7400-series logic ICs, resistors assortment, and LEDs. Surplus from semester hardware project.',
      category: 'lab_supplies',
      subCategory: 'Breadboards and assorted electronic ICs/components',
      quantity: 3,
      availableQuantity: 3,
      condition: 'good',
      location: 'Electronics Lab 1, Science Block',
      pickupInstructions: 'Available during lab schedule (Mon-Fri 11 AM - 3 PM).',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      owner: physicsLab._id,
      ownerRole: 'user',
      status: 'available',
    },
    {
      title: 'Aluminium Project Enclosures & Fastener Hardware',
      description: 'Anodized aluminium boxes suited for housing circuit boards and power units. Pre-drilled side ventilation slots with M3 screws included.',
      category: 'lab_supplies',
      subCategory: 'Reusable project enclosures and casings',
      quantity: 5,
      availableQuantity: 5,
      condition: 'new',
      location: 'Central Mechanical Workshop, Tool Crib B',
      pickupInstructions: 'Collect from Workshop Foreman Mr. Rathore.',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      owner: cseDept._id,
      ownerRole: 'user',
      status: 'available',
    },

    // 4. Furniture & classroom supplies
    {
      title: 'Solid Timber Ergonomic Study Chairs',
      description: 'Sturdy, handcrafted wooden study chairs with ergonomic lumbar contour. In excellent condition, suitable for hostel rooms or seminar reading nooks.',
      category: 'furniture',
      subCategory: 'Chairs and ergonomic study tables',
      quantity: 6,
      availableQuantity: 4, // 2 transferred
      condition: 'good',
      location: 'Hostel Block 1 Furniture Depot',
      pickupInstructions: 'Contact Hostel Caretaker between 9 AM and 1 PM.',
      imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3a82145d875?auto=format&fit=crop&w=800&q=80',
      owner: cseDept._id,
      ownerRole: 'user',
      status: 'available',
    },
    {
      title: 'Magnetic Dry-Erase Whiteboard with Frame (120 x 90 cm)',
      description: 'Large wall-mountable whiteboard with smooth porcelain magnetic surface. Includes marker tray and hanging brackets. Perfect for club brainstorms or group study.',
      category: 'furniture',
      subCategory: 'Whiteboards, magnetic boards, and notice boards',
      quantity: 1,
      availableQuantity: 1,
      condition: 'good',
      location: 'Seminar Hall 3, Annex Building',
      pickupInstructions: 'Can be picked up Mon-Sat 9 AM - 5 PM.',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      owner: physicsLab._id,
      ownerRole: 'user',
      status: 'available',
    },

    // 5. Event & club supplies
    {
      title: 'Heavy Duty 6-Socket Power Extension Strips with Surge Protector',
      description: 'Long 5-meter heavy duty cables with universal sockets and fuse breaker. Tested and working, purchased for the Annual Tech Fest.',
      category: 'event_supplies',
      subCategory: 'Extension boards, surge protectors, and power strips',
      quantity: 5,
      availableQuantity: 4,
      condition: 'good',
      location: 'Student Activity Center, Event Equipment Room 102',
      pickupInstructions: 'Available upon club advisor signoff.',
      imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
      owner: clubsCoord._id,
      ownerRole: 'user',
      status: 'available',
    },
    {
      title: 'Adjustable Aluminum Poster Display Easels',
      description: 'Collapsible lightweight presentation easels for scientific posters, art exhibits, and project demonstrations. Carries up to A1-sized foam boards.',
      category: 'event_supplies',
      subCategory: 'Poster boards, easels, and presentation panels',
      quantity: 8,
      availableQuantity: 8,
      condition: 'good',
      location: 'Main Auditorium Storage, Backstage Left',
      pickupInstructions: 'Coordinate with SAC Secretary.',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      owner: clubsCoord._id,
      ownerRole: 'user',
      status: 'available',
    },

    // 6. Everyday reusable supplies
    {
      title: 'Heavy-Duty Transparent Storage Crates (45-Litre Stackable)',
      description: 'Durable polypropylene storage containers with secure snap-on lids. Clean, odorless, and ideal for organizing project kits or hostel packing.',
      category: 'everyday_reusable',
      subCategory: 'Clean storage boxes and utility crates',
      quantity: 10,
      availableQuantity: 8, // 2 transferred
      condition: 'good',
      location: 'Central Storehouse, Dock 4',
      pickupInstructions: 'Collect weekdays 10 AM - 12 PM.',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      owner: cseDept._id,
      ownerRole: 'user',
      status: 'available',
    },
    {
      title: 'Lever-Arch Document Binders & Presentation Folders (Pack of 6)',
      description: 'Clean binders with strong steel rings. Suitable for archiving semester lab records, reports, and administrative forms.',
      category: 'everyday_reusable',
      subCategory: 'File folders, binders, and archive sleeves',
      quantity: 4,
      availableQuantity: 4,
      condition: 'new',
      location: 'Department Office, Counter 1',
      pickupInstructions: 'Office hours 9 AM - 4 PM.',
      imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
      owner: physicsLab._id,
      ownerRole: 'user',
      status: 'available',
    },
  ];

  const createdResources = await Resource.insertMany(items);
  console.log(`Created ${createdResources.length} campus resources.`);

  // 3. Create Sample Completed Transfers (Giver confirmed + Receiver confirmed)
  console.log('Seeding completed verified transfers for impact metrics...');

  // Transfer 1: 1 Monitor to Priya
  const monitorResource = createdResources.find(r => r.title.includes('Dell UltraSharp'));
  const req1 = await ResourceRequest.create({
    resource: monitorResource._id,
    requester: studentPriya._id,
    requestedQuantity: 1,
    purpose: 'Required for our Smart Campus IoT final year capstone project dashboard.',
    status: 'completed',
    decisionBy: cseDept._id,
    decisionNote: 'Approved. Monitor allocated for capstone project.',
    decisionAt: new Date(Date.now() - 3 * 86400000),
    pickupScheduledAt: new Date(Date.now() - 2 * 86400000),
  });

  await Transfer.create({
    resource: monitorResource._id,
    request: req1._id,
    giver: cseDept._id,
    receiver: studentPriya._id,
    quantityTransferred: 1,
    giverConfirmedAt: new Date(Date.now() - 2 * 86400000),
    receiverConfirmedAt: new Date(Date.now() - 2 * 86400000),
    completedAt: new Date(Date.now() - 2 * 86400000),
    status: 'completed',
    impact: {
      estimatedSavingsINR: 2200,
      estimatedCarbonSavedKg: 18.0,
      wasteDivertedKg: 1.5,
    },
    impactMethodVersion: 'v1.0-benchmark',
  });

  // Transfer 2: 1 CLRS Book to Aarav
  const clrsResource = createdResources.find(r => r.title.includes('CLRS'));
  const req2 = await ResourceRequest.create({
    resource: clrsResource._id,
    requester: studentAarav._id,
    requestedQuantity: 1,
    purpose: 'Studying for upcoming Competitive Programming selections & Data Structures coursework.',
    status: 'completed',
    decisionBy: cseDept._id,
    decisionNote: 'Enjoy your studies!',
    decisionAt: new Date(Date.now() - 5 * 86400000),
    pickupScheduledAt: new Date(Date.now() - 4 * 86400000),
  });

  await Transfer.create({
    resource: clrsResource._id,
    request: req2._id,
    giver: cseDept._id,
    receiver: studentAarav._id,
    quantityTransferred: 1,
    giverConfirmedAt: new Date(Date.now() - 4 * 86400000),
    receiverConfirmedAt: new Date(Date.now() - 4 * 86400000),
    completedAt: new Date(Date.now() - 4 * 86400000),
    status: 'completed',
    impact: {
      estimatedSavingsINR: 650,
      estimatedCarbonSavedKg: 2.5,
      wasteDivertedKg: 0.8,
    },
    impactMethodVersion: 'v1.0-benchmark',
  });

  // Transfer 3: 2 Solid Wood Chairs to Rohan
  const chairsResource = createdResources.find(r => r.title.includes('Study Chairs'));
  const req3 = await ResourceRequest.create({
    resource: chairsResource._id,
    requester: studentRohan._id,
    requestedQuantity: 2,
    purpose: 'Setting up study desk corner in Hostel 3 common reading wing.',
    status: 'completed',
    decisionBy: cseDept._id,
    decisionNote: 'Authorized for Hostel 3 student study nook.',
    decisionAt: new Date(Date.now() - 7 * 86400000),
    pickupScheduledAt: new Date(Date.now() - 6 * 86400000),
  });

  await Transfer.create({
    resource: chairsResource._id,
    request: req3._id,
    giver: cseDept._id,
    receiver: studentRohan._id,
    quantityTransferred: 2,
    giverConfirmedAt: new Date(Date.now() - 6 * 86400000),
    receiverConfirmedAt: new Date(Date.now() - 6 * 86400000),
    completedAt: new Date(Date.now() - 6 * 86400000),
    status: 'completed',
    impact: {
      estimatedSavingsINR: 7000,
      estimatedCarbonSavedKg: 70.0,
      wasteDivertedKg: 17.0,
    },
    impactMethodVersion: 'v1.0-benchmark',
  });

  // Transfer 4: 2 Storage Crates to Priya
  const cratesResource = createdResources.find(r => r.title.includes('Storage Crates'));
  const req4 = await ResourceRequest.create({
    resource: cratesResource._id,
    requester: studentPriya._id,
    requestedQuantity: 2,
    purpose: 'Organizing robotics team spare motors and sensors in SAC room.',
    status: 'completed',
    decisionBy: cseDept._id,
    decisionNote: 'Granted.',
    decisionAt: new Date(Date.now() - 1 * 86400000),
    pickupScheduledAt: new Date(Date.now() - 1 * 86400000),
  });

  await Transfer.create({
    resource: cratesResource._id,
    request: req4._id,
    giver: cseDept._id,
    receiver: studentPriya._id,
    quantityTransferred: 2,
    giverConfirmedAt: new Date(Date.now() - 1 * 86400000),
    receiverConfirmedAt: new Date(Date.now() - 1 * 86400000),
    completedAt: new Date(Date.now() - 1 * 86400000),
    status: 'completed',
    impact: {
      estimatedSavingsINR: 900,
      estimatedCarbonSavedKg: 6.0,
      wasteDivertedKg: 2.4,
    },
    impactMethodVersion: 'v1.0-benchmark',
  });

  // 4. Create an active Approved request awaiting pickup confirmation
  const powerStrip = createdResources.find(r => r.title.includes('Power Extension'));
  const req5 = await ResourceRequest.create({
    resource: powerStrip._id,
    requester: studentAarav._id,
    requestedQuantity: 1,
    purpose: 'Needed for upcoming 36-hour Hackathon team table.',
    status: 'approved',
    decisionBy: clubsCoord._id,
    decisionNote: 'Approved. Pick up before Friday 5 PM.',
    decisionAt: new Date(),
    pickupScheduledAt: new Date(Date.now() + 86400000),
    pickupNotes: 'Bring SAC entry badge.',
  });

  await Transfer.create({
    resource: powerStrip._id,
    request: req5._id,
    giver: clubsCoord._id,
    receiver: studentAarav._id,
    quantityTransferred: 1,
    status: 'in_progress',
  });

  // 5. Create a Pending request for review
  const gateBook = createdResources.find(r => r.title.includes('GATE'));
  await ResourceRequest.create({
    resource: gateBook._id,
    requester: studentAarav._id,
    requestedQuantity: 1,
    purpose: 'Need for 3rd-year GATE mock exam practice.',
    status: 'pending',
  });

  console.log('\n========================================');
  console.log(' SEEDING COMPLETED SUCCESSFULLY!');
  console.log('========================================');
  console.log('Demo Accounts created (Password for all: Campus@123):');
  console.log('1. Admin:         admin@campus.edu');
  console.log('2. CSE Dept:      cse.lab@campus.edu');
  console.log('3. Physics Lab:   physics.lab@campus.edu');
  console.log('4. Clubs Rep:     sac@campus.edu');
  console.log('5. Student Aarav: aarav.student@campus.edu');
  console.log('6. Student Priya: priya.student@campus.edu');
  console.log('7. Student Rohan: rohan.student@campus.edu');
  console.log('========================================\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
