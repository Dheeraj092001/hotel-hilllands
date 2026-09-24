import { ChatMessage, QuickPrompt } from "../types/chat";

export const INITIAL_QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: "cedar-deluxe",
    label: "Cedar Ridge Deluxe Room",
    query: "Tell me about the Cedar Ridge Deluxe Room",
  },
  {
    id: "couple-recommendation",
    label: "Best room for couples?",
    query: "Which room do you recommend for a romantic couple getaway?",
  },
  {
    id: "dining-hightea",
    label: "Dining & High Tea",
    query: "What dining options and afternoon high tea do you offer?",
  },
  {
    id: "snow-weather",
    label: "Snowfall & best season?",
    query: "When is the best time to visit Shimla for snow and mountain views?",
  },
  {
    id: "booking-help",
    label: "Check-in & Booking info",
    query: "What are your check-in timings and direct booking benefits?",
  },
];

const ROOM_DATA_LOOKUP = {
  "cedar-ridge-deluxe": {
    id: "cedar-ridge-deluxe",
    name: "Cedar Ridge Deluxe Room",
    price: 9800,
    image: "/images/luxury-suit (2).jpeg",
    size: "450 sq ft",
    view: "Ancient Deodar Grove",
    tagline: "Wrapped in ancient pine canopies with deep soaking tub and fragrant timber interiors.",
  },
  "governors-suite": {
    id: "governors-suite",
    name: "The Governor's Heritage Suite",
    price: 14500,
    image: "/images/ultra-luxury.jpeg",
    size: "680 sq ft",
    view: "Snow Peak & Valley",
    tagline: "Premier imperial suite featuring hand-carved deodar woodwork and stone fireplace.",
  },
  "himalayan-chalet-cottage": {
    id: "himalayan-chalet-cottage",
    name: "Himalayan Forest Chalet",
    price: 18500,
    image: "/images/ultra-luxury (4).jpeg",
    size: "820 sq ft",
    view: "Private Forest & Ridge",
    tagline: "Standalone cedarwood chalet secluded amidst deodars with private garden veranda.",
  },
  "pine-mist-valley-suite": {
    id: "pine-mist-valley-suite",
    name: "Pine Mist Valley Suite",
    price: 12200,
    image: "/images/premium.jpeg",
    size: "560 sq ft",
    view: "Panoramic Ridge View",
    tagline: "Elevated vantage point offering golden hour sunsets across the Shivalik range.",
  },
};

export function processConciergeQuery(query: string): ChatMessage {
  const normalized = query.toLowerCase().trim();
  const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 1. Specific Query: Cedar Ridge Deluxe Room
  if (
    normalized.includes("cedar ridge") ||
    normalized.includes("deluxe room") ||
    normalized.includes("cedar-ridge")
  ) {
    const room = ROOM_DATA_LOOKUP["cedar-ridge-deluxe"];
    return {
      id,
      sender: "concierge",
      timestamp,
      text: "The **Cedar Ridge Deluxe Room** (₹9,800/night) is one of our most beloved sanctuaries. Nestled amidst ancient deodars at an altitude of 2,205m, it features fragrant Himalayan timber-paneled walls, a plush king feather bed, private forest-view reading alcove, artisan cedarwood bath salts, and a heated bathroom with walk-in rain shower.",
      roomCard: room,
      actionButtons: [
        { label: "View Suite Details", url: "/rooms/cedar-ridge-deluxe", actionType: "navigate" },
        { label: "Book Cedar Ridge Deluxe", url: "/book?room=cedar-ridge-deluxe", actionType: "book" },
      ],
      suggestions: [
        "Compare with Governor's Suite",
        "What dining options are included?",
        "How do I reach Hotel Newlands?",
      ],
    };
  }

  // 2. Room Recommendations for Couples / Romance
  if (
    normalized.includes("couple") ||
    normalized.includes("romantic") ||
    normalized.includes("honeymoon") ||
    normalized.includes("anniversary")
  ) {
    const room = ROOM_DATA_LOOKUP["governors-suite"];
    return {
      id,
      sender: "concierge",
      timestamp,
      text: "For a romantic escape, our premier **Governor's Heritage Suite** (₹14,500/night) or the intimate **Cedar Ridge Deluxe Room** (₹9,800/night) are idyllic choices. The Governor's Suite offers a hand-carved stone fireplace, antique clawfoot soaking tub overlooking snow-capped peaks, and dedicated butler evening turndown with warm mulled wine.",
      roomCard: room,
      actionButtons: [
        { label: "Explore Governor's Suite", url: "/rooms/governors-suite", actionType: "navigate" },
        { label: "Explore Cedar Ridge Deluxe", url: "/rooms/cedar-ridge-deluxe", actionType: "navigate" },
      ],
      suggestions: [
        "Tell me about Cedar Ridge Deluxe Room",
        "What special offers are available?",
        "Do you provide fireplace service?",
      ],
    };
  }

  // 3. Standalone Chalet / Family / Groups
  if (
    normalized.includes("chalet") ||
    normalized.includes("family") ||
    normalized.includes("group") ||
    normalized.includes("cottage")
  ) {
    const room = ROOM_DATA_LOOKUP["himalayan-chalet-cottage"];
    return {
      id,
      sender: "concierge",
      timestamp,
      text: "For families or guests seeking utmost privacy, our standalone **Himalayan Forest Chalet** (₹18,500/night, 820 sq ft) and **The Viceregal Family Sanctuary** (₹22,000/night, 950 sq ft) offer multiple en-suite bedrooms, private garden verandas, dual cast-iron fireplaces, and private dining setups.",
      roomCard: room,
      actionButtons: [
        { label: "View Forest Chalet", url: "/rooms/himalayan-chalet-cottage", actionType: "navigate" },
        { label: "View All Suites", url: "/rooms", actionType: "navigate" },
      ],
      suggestions: [
        "Are extra beds available?",
        "What are the check-in policies?",
      ],
    };
  }

  // 4. Dining & High Tea
  if (
    normalized.includes("dining") ||
    normalized.includes("food") ||
    normalized.includes("restaurant") ||
    normalized.includes("high tea") ||
    normalized.includes("breakfast") ||
    normalized.includes("bar") ||
    normalized.includes("menu")
  ) {
    return {
      id,
      sender: "concierge",
      timestamp,
      text: "At Hotel Newlands Shimla, culinary traditions are steeped in British Raj elegance and Himachali mountain flavors:\n\n• **The Cedar Hearth Dining Room**: Serving organic farm-to-table breakfast (7:30 AM – 10:30 AM), artisanal lunches, and candlelit dinners featuring Himalayan pan-seared river trout and traditional Siddu.\n• **Pine & Hearth Lounge**: Enjoy complimentary afternoon tea (4:00 PM – 6:00 PM) featuring freshly baked scones, clotted cream, and single-estate Kangra teas beside roaring cedar log fires.",
      actionButtons: [
        { label: "View Culinary Experiences", url: "/dining", actionType: "navigate" },
        { label: "Reserve a Table", url: "/contact", actionType: "navigate" },
      ],
      suggestions: [
        "Is breakfast complimentary?",
        "What cocktails are served at the Lounge?",
        "Tell me about Cedar Ridge Deluxe Room",
      ],
    };
  }

  // 5. Weather, Snow & Best Seasons
  if (
    normalized.includes("weather") ||
    normalized.includes("snow") ||
    normalized.includes("season") ||
    normalized.includes("winter") ||
    normalized.includes("summer") ||
    normalized.includes("rain") ||
    normalized.includes("best time")
  ) {
    return {
      id,
      sender: "concierge",
      timestamp,
      text: "Shimla offers distinctive magic across four seasons:\n\n❄️ **Winter Snow (Late Dec – Feb)**: Temperature between -2°C to 12°C. Snow blankets our cedar forests, and indoor fireplaces are continuously stoked.\n🌸 **Spring & Summer (March – June)**: Pleasant 15°C to 24°C, ideal for heritage trail walks and terrace high tea.\n🌿 **Monsoon Mist (July – August)**: Romantic rain-washed pine aromas and dramatic cloud valleys.\n🍂 **Golden Autumn (Sept – Nov)**: Crisp sunny days, crystal-clear Himalayan views of the Pir Panjal range.",
      actionButtons: [
        { label: "View Seasonal Offers", url: "/offers", actionType: "navigate" },
        { label: "Check Room Availability", url: "/rooms", actionType: "navigate" },
      ],
      suggestions: [
        "Tell me about Cedar Ridge Deluxe Room",
        "What excursions can we take?",
      ],
    };
  }

  // 6. Location, Transfers, Mall Road & Sightseeing
  if (
    normalized.includes("location") ||
    normalized.includes("reach") ||
    normalized.includes("how to get") ||
    normalized.includes("train") ||
    normalized.includes("distance") ||
    normalized.includes("mall road") ||
    normalized.includes("jakhoo") ||
    normalized.includes("viceregal") ||
    normalized.includes("airport")
  ) {
    return {
      id,
      sender: "concierge",
      timestamp,
      text: "Hotel Newlands is situated on Heritage Heights, Upper Mall in Shimla (altitude 2,205m):\n\n• **The Ridge & Mall Road**: An effortless 10-minute pine-shaded walk.\n• **Viceregal Lodge**: 3.5 km scenic drive.\n• **Jakhu Temple & Cable Car**: 2.5 km.\n• **Kalka-Shimla Toy Train**: Shimla Railway Station is 2.8 km away (private chauffeured Mercedes & Innova pickups available on request).\n• **Jubarhatti Airport**: 22 km.",
      actionButtons: [
        { label: "Explore Location Map", url: "/location", actionType: "navigate" },
        { label: "Local Excursions", url: "/experiences", actionType: "navigate" },
      ],
      suggestions: [
        "Can you arrange train station pickup?",
        "Is vehicle parking available on site?",
      ],
    };
  }

  // 7. Amenities, Fireplace, Parking & Wi-Fi
  if (
    normalized.includes("amenities") ||
    normalized.includes("parking") ||
    normalized.includes("wifi") ||
    normalized.includes("fireplace") ||
    normalized.includes("pet") ||
    normalized.includes("pool")
  ) {
    return {
      id,
      sender: "concierge",
      timestamp,
      text: "Our colonial mountain estate is equipped with thoughtful luxury amenities:\n\n✓ Authentic firewood hearths with complimentary timber logs\n✓ Radiant heated oak flooring & heated bathroom towel rails\n✓ High-speed optical fiber Wi-Fi throughout all suites and gardens\n✓ Private secure valet parking with EV charging station\n✓ Dedicated 24/7 personal butler service on request\n✓ Heritage library and board game parlor overlooking the valley",
      actionButtons: [
        { label: "Explore Rooms & Amenities", url: "/rooms", actionType: "navigate" },
      ],
      suggestions: [
        "Show me Cedar Ridge Deluxe Room",
        "Book a room now",
      ],
    };
  }

  // 8. Booking, Check-in, Policies & Cancellation
  if (
    normalized.includes("book") ||
    normalized.includes("check in") ||
    normalized.includes("check-in") ||
    normalized.includes("checkout") ||
    normalized.includes("cancellation") ||
    normalized.includes("policy") ||
    normalized.includes("price") ||
    normalized.includes("rate")
  ) {
    return {
      id,
      sender: "concierge",
      timestamp,
      text: "Here are our key reservation policies:\n\n• **Check-in**: 2:00 PM (early check-in accommodated upon room readiness)\n• **Check-out**: 11:00 AM\n• **Direct Booking Privileges**: Guaranteed best rate, complimentary morning gourmet breakfast, welcome Himalayan hot toddy, and flexible cancellation up to 48 hours prior to arrival.\n• **Payment**: Major credit/debit cards, UPI, Net Banking, Razorpay accepted.",
      actionButtons: [
        { label: "Book Direct with Perks", url: "/book", actionType: "book" },
        { label: "View Special Packages", url: "/offers", actionType: "navigate" },
      ],
      suggestions: [
        "Tell me about Cedar Ridge Deluxe Room",
        "Are taxes included in the room price?",
      ],
    };
  }

  // Fallback / General Hospitality Greeting
  return {
    id,
    sender: "concierge",
    timestamp,
    text: "Warm greetings from Hotel Newlands Shimla. As your Himalayan Concierge, I would be delighted to assist you with room reservations, dining at The Cedar Hearth, travel tips for Shimla, or curating your bespoke heritage retreat. How may I assist your stay today?",
    actionButtons: [
      { label: "View All Suites", url: "/rooms", actionType: "navigate" },
      { label: "Cedar Ridge Deluxe", url: "/rooms/cedar-ridge-deluxe", actionType: "navigate" },
      { label: "Special Offers", url: "/offers", actionType: "navigate" },
    ],
    suggestions: [
      "Tell me about Cedar Ridge Deluxe Room",
      "Which room is best for a romantic stay?",
      "What are the dining & high tea hours?",
      "When does it snow in Shimla?",
    ],
  };
}
