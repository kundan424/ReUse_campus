# ReUse Campus

> Enterprise-grade full-stack platform for inter-departmental and peer-to-peer campus resource exchange, inventory lifecycle management, atomic custody reservations, and audited environmental impact analytics.

---

## Overview

ReUse Campus is a centralized circular resource stewardship platform for higher education institutions. It connects academic departments, laboratories, student clubs, and students to transfer surplus or idle physical equipment—including computing peripherals, textbooks, lab apparatus, and institutional furniture—eliminating uncoordinated procurement and premature disposal.

The system enforces an explicit environmental accounting principle: **a resource listing represents an opportunity for reuse, not verified impact**. Impact metrics are computed and persisted only when mutual physical custody is confirmed by both the donor and recipient.

---

## Key Features

* **📦 Institutional Resource Catalogue:** Standardized taxonomies across 6 primary campus resource sectors with preset specifications and custom item fallback.
* **🔒 Concurrency-Safe Atomic Reservations:** Optimistic condition checking and atomic MongoDB decrements prevent race conditions and inventory double-allocations.
* **🤝 Two-Party Transfer Verification:** Strict custody protocol requiring mutual, independent digital confirmation from both donor and recipient before a transfer is finalized.
* **🌱 Empirical Impact Engine:** Differentiates directly measured activity from modeled environmental metrics (avoided procurement costs, diverted landfill mass, and prevented $CO_2e$ emissions via LCA benchmarks).
* **📊 Automated Department CSV / Excel Bulk Importer:** 1-click batch ingestion of lab surplus inventories with downloadable standardized template, live client-side validation, error reporting, and atomic batch database registration.
* **🛡️ Role-Based Access Control (RBAC):** Tiered authorization for Students, Department Representatives, and Institutional Administrators. Administrator provisioning is restricted to secure CLI automation.
* **🎨 Studio Almond / Woodwrights Design System:** Editorial aesthetic built on warm neutral tones, Cormorant Garamond serif headers, Plus Jakarta Sans grotesque typography, and architectural hairline dividers (zero playful/childish icons).

---

## Monorepo & Directory Structure

```
campusChange/
├── app/
│   ├── (auth)/
│   │   ├── login/page.jsx              # Session authentication with role quick-select
│   │   └── register/page.jsx           # Student & Department onboarding
│   ├── admin/
│   │   └── page.jsx                    # Institutional governance & user moderation
│   ├── api/
│   │   ├── admin/users/route.js        # User registry & status moderation API
│   │   ├── analytics/impact/route.js   # Aggregated environmental metrics API
│   │   ├── auth/
│   │   │   ├── login/route.js          # Credential verification & JWT issuance
│   │   │   ├── logout/route.js         # HTTP-only cookie clearing
│   │   │   ├── me/route.js             # Current session profile resolver
│   │   │   └── register/route.js       # User provisioning (admin signup blocked)
│   │   ├── requests/
│   │   │   ├── route.js                # Request creation with ownership validation
│   │   │   ├── incoming/route.js       # Custodian request review API
│   │   │   ├── my-requests/route.js    # Requester tracking API
│   │   │   └── [id]/
│   │   │       ├── cancel/route.js     # Request cancellation with inventory rollback
│   │   │       └── status/route.js     # Approval/rejection with atomic inventory locking
│   │   ├── resources/
│   │   │   ├── route.js                # Catalogue querying & resource creation
│   │   │   ├── my-listings/route.js    # Custodian inventory retrieval
│   │   │   └── [id]/route.js           # Resource detail, update & soft deletion
│   │   └── transfers/
│   │       ├── route.js                # Historical transfer ledger query API
│   │       ├── confirm-giver/route.js  # Donor physical handover confirmation
│   │       └── confirm-receiver/route.js# Recipient receipt confirmation
│   ├── impact/
│   │   └── page.jsx                    # Verified sustainability ledger & metrics
│   ├── requests/
│   │   ├── incoming/page.jsx           # Donor decision & handover portal
│   │   └── my-requests/page.jsx        # Recipient status & confirmation portal
│   ├── resources/
│   │   ├── [id]/page.jsx               # Specification sheet & request modal
│   │   ├── my-listings/page.jsx        # Custodian inventory management
│   │   └── new/page.jsx                # Item listing form with presets
│   ├── globals.css                     # Design tokens & typography definitions
│   ├── layout.jsx                      # Root layout with AuthProvider & navigation
│   └── page.jsx                        # Resource discovery catalogue
├── components/
│   ├── Footer.jsx                      # Editorial footer
│   ├── Navbar.jsx                      # Responsive navigation with role indicators
│   ├── ResourceCard.jsx                # Architectural product card component
│   └── StatusBadge.jsx                 # Lifecycle state badge
├── context/
│   └── AuthContext.jsx                 # Client auth state provider
├── lib/
│   ├── auth.js                         # JWT signing/verification & bcrypt helpers
│   ├── categories.js                   # 6-category taxonomy & LCA coefficients
│   ├── db.js                           # Singleton Mongoose connection pool
│   ├── impactCalculator.js             # Algorithmic financial & environmental scoring
│   └── models/
│       ├── Resource.js                 # Inventory collection schema & text indexes
│       ├── ResourceRequest.js          # Allocation request state machine schema
│       ├── Transfer.js                 # Immutable audit & transfer ledger schema
│       └── User.js                     # Identity & institutional affiliation schema
├── scripts/
│   ├── createAdmin.js                  # CLI tool for institutional admin provisioning
│   └── seedCampusData.js               # Comprehensive 6-category dataset seeder
├── tailwind.config.js                  # Custom Woodwrights color palette & typography
├── next.config.js                      # Next.js runtime configuration
├── package.json                        # Dependency specifications & scripts
└── .env.local                          # Environment variables
```

---

## Tech Stack

| Layer | Technology | Specification / Purpose |
| :--- | :--- | :--- |
| **Full-Stack Framework** | Next.js 14 (App Router) | Unified server route handlers and client React components |
| **Frontend Runtime** | React 18 | Dynamic client interactivity and state hydration |
| **Database & ODM** | MongoDB 8.0 + Mongoose 8.7 | Persistent document storage, compound text indexes, atomic mutations |
| **Authentication** | JWT + bcryptjs | Stateless authorization tokens and salted credential hashing |
| **Styling & Design** | Tailwind CSS v3 | Design system tokens based on Studio Almond / Woodwrights aesthetic |
| **Typography** | Cormorant Garamond & Plus Jakarta Sans | Editorial serif display paired with grotesque data typography |
| **Tooling & Language** | JavaScript (ESNext) / Node.js 22 | Modern ECMAScript standard |

---

## Quick Start

### Prerequisites
* **Node.js**: `v20.x` or `v22.x` (`v22.12.0` verified)
* **npm**: `v10.x`
* **MongoDB**: Local daemon running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd campusChange
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the project root:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/reuse_campus
JWT_SECRET=super_secret_reuse_campus_jwt_key_2026_secure
NEXT_PUBLIC_APP_NAME="ReUse Campus"
NEXT_PUBLIC_APP_TAGLINE="A Circular Campus Exchange for Sustainable Resource Stewardship"
```

### 3. Seed Realistic Campus Dataset
Populates test entities across all 6 resource categories, realistic pending/approved requests, and verified transfers:
```bash
npm run seed
```

### 4. Provision a Custom Administrator (CLI Only)
Administrative accounts cannot be registered through the web client. Use the automated CLI provisioning utility:
```bash
node scripts/createAdmin.js "Dr. Alan Grant" "admin2@campus.edu" "SecurePassword123"
```

### 5. Launch the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

---

## Available Scripts

| Command | Target / Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on `http://localhost:3000` |
| `npm run build` | Compiles optimized static and dynamic production bundles |
| `npm run start` | Boots the compiled Next.js production server |
| `npm run seed` | Executes `scripts/seedCampusData.js` to reset and seed the database |
| `npm run create-admin` | Executes `scripts/createAdmin.js` to provision administrative credentials |

---

## Architecture & Engineering Notes

### 1. Concurrency Control & Atomic Stock Decrementing
To prevent race conditions where multiple students request the remaining stock of an item simultaneously, the server enforces atomic inventory operations during request approval:

```javascript
const updatedResource = await Resource.findOneAndUpdate(
  {
    _id: resourceId,
    availableQuantity: { $gte: requestedQuantity },
  },
  {
    $inc: { availableQuantity: -requestedQuantity },
  },
  { new: true }
);

if (!updatedResource) {
  return NextResponse.json(
    { error: "Insufficient inventory or concurrent reservation collision." },
    { status: 409 }
  );
}
```
If a request is rejected or cancelled post-approval, an atomic `$inc: { availableQuantity: requestedQuantity }` replenishes the inventory pool.

### 2. State Machine: Mutual Confirmation Protocol
Transfers require an immutable ledger update driven by a two-sided verification protocol:

```
[Listing Created] 
       │
       ▼
[Request Submitted] (status: 'pending')
       │
       ▼ (Owner approves: atomic availableQuantity decrement)
[Request Approved] (status: 'approved', Transfer record created: 'in_progress')
       │
       ├── Donor clicks 'Confirm Physical Handover'  ──► giverConfirmedAt = Date
       │
       └── Recipient clicks 'Confirm Receipt'         ──► receiverConfirmedAt = Date
       │
       ▼ (Triggered once both flags are non-null)
[Transfer Completed] (status: 'completed', impact computed via LCA metrics)
```

### 3. Environmental Impact Methodology
Impact reporting distinguishes between **directly measured activities** and **modeled environmental indicators**. Coefficients are indexed by category in `lib/categories.js`:

$$\text{Avoided Cost (₹)} = \text{Units Reused} \times \text{Average Category Procurement Cost}$$

$$\text{Avoided } CO_2e\text{ (kg)} = \text{Units Reused} \times \text{LCA Carbon Coefficient}$$

$$\text{Diverted Landfill (kg)} = \text{Units Reused} \times \text{Average Unit Mass}$$

Unfulfilled or rejected requests contribute $0$ to the metrics ledger.

---

## Supported Resource Taxonomy

The platform natively classifies inventory across 6 primary sectors with standard item presets:

| Category ID | Sector Name | Standard Item Presets |
| :--- | :--- | :--- |
| `books` | **Books & Study Materials** | Engineering/programming textbooks, entrance exam preparation manuals (GATE/CAT), reference books, lab manuals, unused stationery, previous-year question sets |
| `electronics` | **Electronics & Computer Accessories** | USB keyboards, mice, webcams, HDMI/Ethernet cables, ergonomic laptop stands, USB hubs, desktop monitors, Arduino kits, sensors, jumper wires |
| `lab_supplies` | **Lab & Project Materials** | Solderless breadboards, analog/digital ICs, aluminium enclosures, mechanical tools, hardware fasteners, approved lab apparatus, model supplies |
| `furniture` | **Furniture & Classroom Supplies** | Solid timber chairs, ergonomic study tables, porcelain whiteboards, notice boards, steel storage shelving, desk reading lamps, projector screens |
| `event_supplies` | **Event & Club Supplies** | Reusable banners, podiums, poster display easels, stage decorations, surge-protected power strips, sports gear, club board games |
| `everyday_reusable`| **Everyday Reusable Supplies** | Polypropylene storage crates, lever-arch document binders, filing folders, organizing containers, drafting kits, protective packaging |
| `other` | **Custom / Unlisted Item** | Arbitrary academic resources with user-specified titles and specifications |

---

## Data Models & Schema Design

### `User` Collection (`lib/models/User.js`)
* `name` (String, required)
* `email` (String, required, unique, normalized lowercase)
* `password` (String, required, bcrypt hash, excluded from default queries)
* `role` (Enum: `'student'`, `'department'`, `'admin'`)
* `departmentName` (String, required for department representatives)
* `collegeId` (String, enrollment roll number for students)
* `phone` (String, contact identifier for pickup coordination)
* `isActive` (Boolean, default: `true`, administrative moderation flag)

### `Resource` Collection (`lib/models/Resource.js`)
* `title` (String, max 140 chars)
* `description` (String, max 2500 chars)
* `category` (Enum: `books`, `electronics`, `lab_supplies`, `furniture`, `event_supplies`, `everyday_reusable`, `other`)
* `subCategory` (String, preset identifier or custom descriptor)
* `quantity` (Number, initial total quantity, integer $\ge 1$)
* `availableQuantity` (Number, unreserved inventory, integer $\ge 0$)
* `condition` (Enum: `'new'`, `'good'`, `'fair'`, `'needs_repair'`)
* `location` (String, physical campus building/room)
* `pickupInstructions` (String, hours and access requirements)
* `imageUrl` (String, photo asset URL or category default)
* `owner` (ObjectId $\rightarrow$ `User`, server-enforced identity)
* `status` (Enum: `'available'`, `'reserved'`, `'transferred'`, `'archived'`, `'under_repair'`)
* **Index**: Compound full-text index on `{ title: 'text', description: 'text', location: 'text', subCategory: 'text' }`

### `ResourceRequest` Collection (`lib/models/ResourceRequest.js`)
* `resource` (ObjectId $\rightarrow$ `Resource`)
* `requester` (ObjectId $\rightarrow$ `User`)
* `requestedQuantity` (Number, integer $\ge 1$)
* `purpose` (String, academic reuse justification)
* `status` (Enum: `'pending'`, `'approved'`, `'rejected'`, `'cancelled'`, `'ready_for_pickup'`, `'completed'`)
* `decisionBy` (ObjectId $\rightarrow$ `User`, decision maker)
* `decisionNote` (String, donor justification note)
* `pickupScheduledAt` (Date, agreed transfer timestamp)

### `Transfer` Collection (`lib/models/Transfer.js`)
* `resource` (ObjectId $\rightarrow$ `Resource`)
* `request` (ObjectId $\rightarrow$ `ResourceRequest`, unique constraint)
* `giver` (ObjectId $\rightarrow$ `User`)
* `receiver` (ObjectId $\rightarrow$ `User`)
* `quantityTransferred` (Number, integer $\ge 1$)
* `giverConfirmedAt` (Date, null until donor validates physical handover)
* `receiverConfirmedAt` (Date, null until recipient validates receipt)
* `completedAt` (Date, timestamp of dual confirmation)
* `impact` (Object: `{ estimatedSavingsINR, estimatedCarbonSavedKg, wasteDivertedKg }`)
* `impactMethodVersion` (String, e.g. `"v1.0-benchmark"`)

---

## Pre-Configured Evaluation Credentials

All pre-seeded demo accounts share password: `Campus@123`

| Role | Name | Email | Evaluation Scope |
| :--- | :--- | :--- | :--- |
| **Student** | Priya Sundaram | `priya.student@campus.edu` | Submit item requests, review status, confirm item receipt |
| **Student** | Aarav Patel | `aarav.student@campus.edu` | Peer listings (Arduino kits), request academic textbooks |
| **Department** | CSE Systems Lab | `cse.lab@campus.edu` | Surplus inventory (IPS monitors, chairs, CLRS books), request adjudication |
| **Department** | Student Activity Center | `sac@campus.edu` | Equipment inventory (easels, power distribution boards), handover tracking |
| **Admin** | Dr. Evelyn Vance | `admin@campus.edu` | Governance portal, user account suspension, platform transfer audit |

*(The web interface features an **Evaluator Quick-Select** panel on `/login` to authenticate any role with one click).*

---

## License

Private academic release. All rights reserved.
Current Version: `1.0.0`
