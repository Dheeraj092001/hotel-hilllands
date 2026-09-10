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

  console.log("✅ Seed complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
