import { PrismaClient } from "@prisma/client";
import { PERMISSIONS, ROLE_PERMISSIONS } from "../../packages/shared/src/index";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding Hotel Newlands Shimla database...");

  // 1. Create Permissions
  console.log("  Creating permissions...");
  const permissionOps = Object.values(PERMISSIONS).map((name) =>
    prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name, description: name },
    })
  );
  await Promise.all(permissionOps);

  // 2. Create Roles with Permissions
  console.log("  Creating roles...");
  const roles = Object.keys(ROLE_PERMISSIONS);

  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, description: `${roleName} role` },
    });

    const perms = ROLE_PERMISSIONS[roleName] || [];
    for (const permName of perms) {
      const perm = await prisma.permission.findUnique({ where: { name: permName } });
      if (perm) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
          update: {},
          create: { roleId: role.id, permissionId: perm.id },
        });
      }
    }
  }

  // Also ensure GUEST role exists
  await prisma.role.upsert({
    where: { name: "GUEST" },
    update: {},
    create: { name: "GUEST", description: "Guest user role" },
  });

  // 3. Create Room Types
  console.log("  Creating room types...");
  const roomTypes = [
    { name: "Deluxe Mountain View", slug: "deluxe-mountain-view" },
    { name: "Premium Suite", slug: "premium-suite" },
    { name: "Royal Suite", slug: "royal-suite" },
    { name: "Family Room", slug: "family-room" },
    { name: "Standard Room", slug: "standard-room" },
    { name: "Honeymoon Suite", slug: "honeymoon-suite" },
  ];
  for (const rt of roomTypes) {
    await prisma.roomType.upsert({ where: { slug: rt.slug }, update: {}, create: rt });
  }

  // 4. Create Amenities
  console.log("  Creating amenities...");
  const amenities = [
    { name: "Free WiFi", icon: "wifi", category: "connectivity" },
    { name: "Mountain View", icon: "mountain", category: "views" },
    { name: "Air Conditioning", icon: "snowflake", category: "comfort" },
    { name: "Flat Screen TV", icon: "tv", category: "entertainment" },
    { name: "Mini Bar", icon: "glass-water", category: "food" },
    { name: "In-Room Safe", icon: "shield", category: "security" },
    { name: "Room Service 24/7", icon: "bell", category: "service" },
    { name: "Private Balcony", icon: "sun", category: "outdoor" },
    { name: "Bathtub", icon: "bath", category: "bathroom" },
    { name: "Shower", icon: "shower-head", category: "bathroom" },
    { name: "Coffee Maker", icon: "coffee", category: "food" },
    { name: "King Bed", icon: "bed", category: "sleep" },
    { name: "Queen Bed", icon: "bed", category: "sleep" },
    { name: "Twin Beds", icon: "bed", category: "sleep" },
    { name: "Heating", icon: "flame", category: "comfort" },
    { name: "Laundry Service", icon: "shirt", category: "service" },
  ];
  for (const a of amenities) {
    await prisma.amenity.upsert({ where: { name: a.name }, update: {}, create: a });
  }

  // 5. Create Food Categories
  console.log("  Creating food categories...");
  const foodCats = [
    { name: "Breakfast", slug: "breakfast", sortOrder: 1 },
    { name: "Starters", slug: "starters", sortOrder: 2 },
    { name: "Main Course", slug: "main-course", sortOrder: 3 },
    { name: "Indian Specialties", slug: "indian-specialties", sortOrder: 4 },
    { name: "Desserts", slug: "desserts", sortOrder: 5 },
    { name: "Beverages", slug: "beverages", sortOrder: 6 },
    { name: "Snacks", slug: "snacks", sortOrder: 7 },
  ];
  for (const cat of foodCats) {
    await prisma.foodCategory.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  // 6. Create Tax Rules
  console.log("  Creating tax rules...");
  const taxRules = [
    { name: "GST on Rooms (<₹2500)", taxType: "GST", percentage: 0, applicableTo: "ROOM_BELOW_2500", effectiveFrom: new Date("2024-01-01") },
    { name: "GST on Rooms (₹2500-₹7500)", taxType: "GST", percentage: 12, applicableTo: "ROOM_2500_7500", effectiveFrom: new Date("2024-01-01") },
    { name: "GST on Rooms (>₹7500)", taxType: "GST", percentage: 18, applicableTo: "ROOM_ABOVE_7500", effectiveFrom: new Date("2024-01-01") },
    { name: "GST on Food", taxType: "GST", percentage: 5, applicableTo: "FOOD", effectiveFrom: new Date("2024-01-01") },
  ];
  for (const rule of taxRules) {
    await prisma.taxRule.create({ data: rule }).catch(() => {});
  }

  // 7. Create CMS Pages
  console.log("  Creating CMS pages...");
  const pages = ["home", "about", "dining", "experiences", "gallery", "offers", "contact", "privacy", "terms", "cancellation-policy"];
  for (const slug of pages) {
    await prisma.page.upsert({
      where: { slug },
      update: {},
      create: { slug, title: slug.charAt(0).toUpperCase() + slug.slice(1), status: "PUBLISHED" },
    });
  }

  // 8. System Settings
  console.log("  Creating system settings...");
  const settings = [
    { key: "hotel_name", value: JSON.stringify("Hotel Newlands Shimla"), description: "Hotel display name" },
    { key: "check_in_time", value: JSON.stringify("14:00"), description: "Standard check-in time" },
    { key: "check_out_time", value: JSON.stringify("12:00"), description: "Standard check-out time" },
    { key: "currency", value: JSON.stringify("INR"), description: "Default currency" },
    { key: "invoice_prefix", value: JSON.stringify("NLS"), description: "Invoice number prefix" },
    { key: "gst_number", value: JSON.stringify(""), description: "Hotel GST registration number" },
  ];
  for (const setting of settings) {
    await prisma.systemSetting.upsert({ where: { key: setting.key }, update: {}, create: setting });
  }

  console.log("✅ Core hotel seed complete!");

  // ═══════════════════════════════════════════════════════════════
  // TOUR & TRAVEL SEED DATA
  // ═══════════════════════════════════════════════════════════════
  console.log("🏔️  Seeding Tour & Travel data...");

  // ── Destinations ─────────────────────────────────────────────
  const destinationData = [
    {
      slug: "spiti-valley",
      name: "Spiti Valley",
      region: "Himachal Pradesh",
      description: "The cold desert mountain valley of Himachal Pradesh sits at an average altitude of 4,270m above sea level. Ancient monasteries, dramatic landscapes, and star-filled skies define this remote frontier.",
      highlights: JSON.stringify(["Key Monastery", "Chandratal Lake", "Pin Valley", "Kibber Wildlife Sanctuary"]),
      isPublished: true,
      sortOrder: 1,
    },
    {
      slug: "kinnaur",
      name: "Kinnaur",
      region: "Himachal Pradesh",
      description: "Known for its apple orchards, silver-roofed villages, and the confluence of Sutlej, Spiti, and Baspa rivers. The Kinnaur Kailash trek is one of the most revered pilgrimage circuits in the Himalayas.",
      highlights: JSON.stringify(["Kinnaur Kailash", "Sangla Valley", "Chitkul", "Kalpa Orchards"]),
      isPublished: true,
      sortOrder: 2,
    },
    {
      slug: "manali-rohtang",
      name: "Manali & Rohtang",
      region: "Himachal Pradesh",
      description: "Gateway to the high Himalayas, Manali combines adventure sports, lush Kullu valley, and the dramatic Rohtang Pass. A year-round destination for trekkers, bikers, and families.",
      highlights: JSON.stringify(["Rohtang Pass", "Solang Valley", "Hadimba Temple", "Old Manali"]),
      isPublished: true,
      sortOrder: 3,
    },
    {
      slug: "shimla-surroundings",
      name: "Shimla & Surroundings",
      region: "Himachal Pradesh",
      description: "The Queen of Hills and capital of Himachal Pradesh. Colonial architecture, toy train rides, Jakhu temple, and proximity to Chail and Kufri make it a classic Himalayan getaway.",
      highlights: JSON.stringify(["The Ridge", "Christ Church", "Jakhu Hill", "Toy Train"]),
      isPublished: true,
      sortOrder: 4,
    },
    {
      slug: "lahaul",
      name: "Lahaul",
      region: "Himachal Pradesh",
      description: "The land beyond Rohtang, Lahaul is home to the famous Sissu waterfall, Triloknath temple, and the scenic Chandra river valley. Accessible via the Atal Tunnel year-round.",
      highlights: JSON.stringify(["Sissu Waterfall", "Triloknath Temple", "Chandra Tal", "Atal Tunnel"]),
      isPublished: true,
      sortOrder: 5,
    },
    {
      slug: "dharamshala-mcleodganj",
      name: "Dharamshala & McLeod Ganj",
      region: "Himachal Pradesh",
      description: "The seat of the Tibetan government-in-exile and home to the Dalai Lama. A blend of Tibetan Buddhism and Himalayan scenery, with the Triund trek as a highlight.",
      highlights: JSON.stringify(["Triund Trek", "Namgyal Monastery", "Bhagsu Waterfall", "Tibetan Culture"]),
      isPublished: true,
      sortOrder: 6,
    },
  ];

  const destinations: Record<string, { id: string }> = {};
  for (const d of destinationData) {
    const dest = await prisma.destination.upsert({
      where: { slug: d.slug },
      update: { isPublished: d.isPublished },
      create: d,
    });
    destinations[d.slug] = dest;
  }
  console.log(`  ✓ ${destinationData.length} destinations seeded`);

  // ── Tours ────────────────────────────────────────────────────
  const spitiId = destinations["spiti-valley"].id;
  const kinnaurId = destinations["kinnaur"].id;
  const manaliId = destinations["manali-rohtang"].id;
  const shimlaId = destinations["shimla-surroundings"].id;

  const toursData = [
    {
      destinationId: spitiId,
      slug: "spiti-valley-complete-circuit",
      title: "Spiti Valley Complete Circuit",
      travelStyle: "Adventure",
      durationDays: 10,
      minGroup: 2,
      maxGroup: 12,
      basePriceInr: "28500",
      summary: "The ultimate Spiti Valley circuit — from Shimla over Kinnaur, through the dramatic Pin Valley, up to Key Monastery, across Kunzum Pass to Manali. This 10-day journey covers the best of the cold desert Himalayas.",
      highlights: JSON.stringify(["Key Monastery at 4,166m", "Chandratal Lake camping", "Pin Valley crossing", "Kunzum Pass (4,590m)", "Kibber Wildlife Sanctuary", "Authentic homestays"]),
      inclusions: JSON.stringify(["All surface transfers", "9 nights accommodation (hotels + homestays)", "All meals (breakfast + dinner)", "Expert local guide", "Inner line permits", "First aid kit"]),
      exclusions: JSON.stringify(["Flights to/from Shimla", "Personal insurance", "Alcoholic beverages", "Tips"]),
      isPublished: true,
      isFeatured: true,
      sortOrder: 1,
    },
    {
      destinationId: spitiId,
      slug: "chandratal-lake-trek",
      title: "Chandratal Lake Trek",
      travelStyle: "Trekking",
      durationDays: 6,
      minGroup: 2,
      maxGroup: 10,
      basePriceInr: "18000",
      summary: "Trek to the magical crescent-shaped Chandratal Lake at 4,300m. Camp under a canopy of stars in one of India's most remote high-altitude landscapes.",
      highlights: JSON.stringify(["Chandratal camping", "High-altitude meadows", "Star gazing", "Hampta Pass option"]),
      inclusions: JSON.stringify(["All transfers", "5 nights (3 hotels + 2 camping)", "All meals", "Tents and sleeping bags", "Local guide and cook"]),
      exclusions: JSON.stringify(["Personal trekking gear", "Travel insurance", "Flights"]),
      isPublished: true,
      isFeatured: true,
      sortOrder: 2,
    },
    {
      destinationId: kinnaurId,
      slug: "kinnaur-apple-orchard-trail",
      title: "Kinnaur Apple Orchard Trail",
      travelStyle: "Cultural",
      durationDays: 7,
      minGroup: 2,
      maxGroup: 14,
      basePriceInr: "22000",
      summary: "Walk through Kinnaur's legendary apple orchards during harvest season. Visit Kalpa, Sangla Valley, and Chitkul — the last inhabited village before the Indo-China border.",
      highlights: JSON.stringify(["Chitkul border village", "Sangla Valley homestay", "Kinnaur Kailash views", "Apple orchard walks", "Traditional Kinnauri culture"]),
      inclusions: JSON.stringify(["All transfers", "6 nights hotels/homestays", "Daily breakfast", "Local guide", "All permits"]),
      exclusions: JSON.stringify(["Lunch and dinner (except where noted)", "Personal expenses"]),
      isPublished: true,
      isFeatured: false,
      sortOrder: 3,
    },
    {
      destinationId: manaliId,
      slug: "manali-adventure-week",
      title: "Manali Adventure Week",
      travelStyle: "Adventure",
      durationDays: 7,
      minGroup: 4,
      maxGroup: 16,
      basePriceInr: "19500",
      summary: "Seven days of pure adventure in and around Manali — paragliding, river rafting on the Beas, ATV rides in Solang Valley, and a day trip to Rohtang Pass.",
      highlights: JSON.stringify(["Paragliding in Solang", "Beas river rafting", "Rohtang Pass snowpoint", "Hadimba Forest trek", "ATV off-roading"]),
      inclusions: JSON.stringify(["All activities and gear", "6 nights boutique hotel", "Breakfast daily", "All transfers", "Adventure guide"]),
      exclusions: JSON.stringify(["Flights", "Personal insurance", "Optional activities"]),
      isPublished: true,
      isFeatured: true,
      sortOrder: 4,
    },
    {
      destinationId: shimlaId,
      slug: "shimla-heritage-family-tour",
      title: "Shimla Heritage Family Tour",
      travelStyle: "Family",
      durationDays: 4,
      minGroup: 2,
      maxGroup: 20,
      basePriceInr: "12000",
      summary: "A relaxed 4-day family getaway to Shimla and nearby Kufri. Perfect for first-time visitors with children — toy train ride, Jakhu temple, Chail Palace, and optional horse riding.",
      highlights: JSON.stringify(["Heritage toy train ride", "Jakhu Temple", "Kufri snow point", "Chail Palace", "Mall Road evening walk"]),
      inclusions: JSON.stringify(["All transfers", "3 nights hotel", "Breakfast and dinner", "Toy train ticket", "Local guide"]),
      exclusions: JSON.stringify(["Flights", "Lunch", "Personal shopping"]),
      isPublished: true,
      isFeatured: false,
      sortOrder: 5,
    },
    {
      destinationId: spitiId,
      slug: "spiti-photography-expedition",
      title: "Spiti Photography Expedition",
      travelStyle: "Cultural",
      durationDays: 12,
      minGroup: 2,
      maxGroup: 8,
      basePriceInr: "35000",
      summary: "Curated for photographers — golden hour at Dhankar Monastery, night sky sessions at Chandratal, dawn shots at Key, and intimate access to Kibber village life. Led by a professional travel photographer.",
      highlights: JSON.stringify(["Golden hour Dhankar", "Night sky Chandratal", "Key Monastery dawn", "Portrait sessions with locals", "Post-processing workshop"]),
      inclusions: JSON.stringify(["Photography guide (professional)", "All transfers", "11 nights premium stays", "All meals", "All permits", "Tripod hire"]),
      exclusions: JSON.stringify(["Camera equipment", "Flights", "Post-trip editing services"]),
      isPublished: true,
      isFeatured: true,
      sortOrder: 6,
    },
  ];

  const seededTours: Record<string, string> = {};
  for (const t of toursData) {
    const tour = await prisma.tour.upsert({
      where: { slug: t.slug },
      update: { isPublished: t.isPublished, isFeatured: t.isFeatured },
      create: { ...t, basePriceInr: t.basePriceInr },
    });
    seededTours[t.slug] = tour.id;
  }
  console.log(`  ✓ ${toursData.length} tours seeded`);

  // ── Itinerary days for flagship tour ─────────────────────────
  const spitiCircuitId = seededTours["spiti-valley-complete-circuit"];
  const spitiItinerary = [
    { dayNumber: 1, title: "Shimla → Narkanda → Rampur", location: "Rampur", description: "Begin the journey from Shimla, driving through the picturesque apple orchards of Narkanda before descending into the Sutlej valley at Rampur. Check in and acclimatize.", meals: "Dinner" },
    { dayNumber: 2, title: "Rampur → Rekong Peo → Kalpa", location: "Kalpa", description: "Enter the Kinnaur district, passing through traditional villages with their distinctive architecture. Reach Kalpa for breathtaking sunset views of Kinnaur Kailash.", meals: "Breakfast, Dinner" },
    { dayNumber: 3, title: "Kalpa → Chitkul → Sangla", location: "Sangla", description: "Visit Chitkul, the last inhabited village on the Indo-China border at 3,450m. Walk through apple orchards before returning to base at Sangla Valley.", meals: "Breakfast, Dinner" },
    { dayNumber: 4, title: "Sangla → Karcham → Nako", location: "Nako", description: "Cross from Kinnaur into Spiti at Sumdo. Ascend to Nako village with its ancient monasteries and sacred lake. Your first taste of the cold desert terrain.", meals: "Breakfast, Dinner" },
    { dayNumber: 5, title: "Nako → Dhankar → Pin Valley → Kaza", location: "Kaza", description: "Visit the cliff-perched Dhankar Monastery and its emerald lake. Drive through the barren Pin Valley before reaching Kaza, the district headquarters of Spiti.", meals: "Breakfast, Dinner" },
    { dayNumber: 6, title: "Kaza Local — Kibber & Komic", location: "Kaza", description: "Explore Kibber (4,270m), one of the world's highest motorable villages. Visit Komic, home to one of the highest monasteries in the world. Spot bar-headed geese at Kibber Wildlife Sanctuary.", meals: "Breakfast, Dinner" },
    { dayNumber: 7, title: "Kaza → Key Monastery → Langza", location: "Kaza", description: "Sunrise at Key Monastery (4,166m) — the largest monastery in Spiti. Drive to Langza with its giant Buddha statue overlooking the valley and fossil hunting.", meals: "Breakfast, Dinner" },
    { dayNumber: 8, title: "Kaza → Chandratal Lake (Trek)", location: "Chandratal", description: "Drive to Batal and trek 5km to the crescent moon lake of Chandratal at 4,300m. Camp under a sea of stars in one of the most remote campsites in India.", meals: "All meals" },
    { dayNumber: 9, title: "Chandratal → Kunzum Pass → Manali", location: "Manali", description: "Cross the mighty Kunzum Pass at 4,590m. Descend through the Lahaul valley with stops at Sissu waterfall. Arrive in Manali — civilization, hot showers, and celebration.", meals: "Breakfast, Dinner" },
    { dayNumber: 10, title: "Manali Departure", location: "Manali", description: "Breakfast and final group photo before farewells. Transfers to Manali bus stand or airport as per individual schedules.", meals: "Breakfast" },
  ];

  await prisma.itineraryDay.deleteMany({ where: { tourId: spitiCircuitId } });
  await prisma.itineraryDay.createMany({ data: spitiItinerary.map((d) => ({ ...d, tourId: spitiCircuitId })) });
  console.log("  ✓ Spiti Circuit itinerary seeded (10 days)");

  // ── Departures ────────────────────────────────────────────────
  const now = new Date();
  const nextMonth = (n: number) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() + n);
    d.setDate(1);
    return d;
  };

  for (let i = 1; i <= 4; i++) {
    const start = nextMonth(i);
    const end = new Date(start);
    end.setDate(end.getDate() + 9);
    await prisma.departure.upsert({
      where: { id: `spiti-dep-${i}` },
      update: {},
      create: {
        id: `spiti-dep-${i}`,
        tourId: spitiCircuitId,
        startDate: start,
        endDate: end,
        seatsTotal: 12,
        seatsBooked: Math.floor(Math.random() * 6),
        status: "OPEN",
      },
    });
  }
  console.log("  ✓ Departures seeded");

  // ── FAQs ──────────────────────────────────────────────────────
  const faqs = [
    { question: "What fitness level is required?", answer: "Moderate fitness required. You should be able to walk 4-6 hours a day on uneven terrain. No prior trekking experience is needed for the circuit, but the Chandratal camp day requires a 5km hike.", sortOrder: 1 },
    { question: "What is the best time to do this tour?", answer: "June to September is ideal when all mountain passes are open. July-August has the risk of rain on the Kinnaur stretch. September offers clear skies and autumn colours.", sortOrder: 2 },
    { question: "Is the tour suitable for families with children?", answer: "We recommend this tour for children aged 12 and above due to the altitude and duration. For younger children, consider our Shimla Family Tour instead.", sortOrder: 3 },
    { question: "How is the accommodation?", answer: "Mix of comfortable guesthouses, eco-lodges, and one camping night at Chandratal. All accommodations are clean with attached bathrooms where available at altitude.", sortOrder: 4 },
    { question: "Do I need altitude sickness medication?", answer: "We strongly recommend consulting your doctor before the trip. We maintain a first aid kit with basic altitude medication. Proper acclimatization is built into the itinerary.", sortOrder: 5 },
  ];

  await prisma.tourFaq.deleteMany({ where: { tourId: spitiCircuitId } });
  await prisma.tourFaq.createMany({ data: faqs.map((f) => ({ ...f, tourId: spitiCircuitId })) });
  console.log("  ✓ Tour FAQs seeded");

  console.log("✅ All seed data complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
