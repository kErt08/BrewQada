/**
 * BrewQada shared knowledge base for search and AI assistant.
 */
const BrewQadaData = {
  pricing: {
    base: 39,
    mediumAdd: 20,
    largeAdd: 30,
    promoAdd: 30,
    small: 39,
    medium: 59,
    large: 69,
    promoSmall: 69,
    promoMedium: 89,
    promoLarge: 99,
    summary:
      "Small ₱39 · Medium ₱59 (+₱20) · Large ₱69 (+₱30). Promo: add ₱30 to your chosen size for 2 drinks (S ₱69 · M ₱89 · L ₱99)."
  },

  bestSellers: [
    { name: "Brown Sugar Milk Tea", reason: "Signature roasted brown sugar with chewy pearls — our top seller." },
    { name: "Wintermelon Milk Tea", reason: "Creamy, refreshing, and a crowd favorite for repeat orders." },
    { name: "Matcha Milk Tea", reason: "Balanced earthy matcha — popular with students and groups." }
  ],

  recommendations: [
    { for: "First-time visitors", drink: "Brown Sugar or Bubble Tea (M size, 25% sugar, less ice)" },
    { for: "Coffee lovers", drink: "Spanish Latte or Caramel Macchiato" },
    { for: "Hot weather", drink: "Fruit Tea — Mango or Honey Peach" },
    { for: "Sharing with friends", drink: "Promo: pick a size, add ₱30 — get 2 drinks (e.g. 2 Medium Brown Sugar for ₱89)" }
  ],

  business: {
    name: "BrewQada",
    location: "35 Gen. B. G. Molina, Marikina, Metro Manila",
    established: "First week of March 2026",
    mission: "Delicious, affordable beverages with quality ingredients and excellent service.",
    vision: "Favorite budget-friendly milk tea shop bringing people together.",
    owners: ["Jayson D. Quintanar", "Anna Janella H. Pacis"],
    earnings: "Approximately 11,238 PHP average from all product categories"
  },

  system: {
    current: "Manual record-keeping process",
    tools: ["Paper-based logs for order taking", "Microsoft Excel for basic transaction tracking"],
    volume: 70,
    problem: "During peak rush, orders come faster than usual and are not recorded immediately.",
    beneficiaries: {
      management: "Owners benefit from streamlined pay-first system — less manual entry and logbook reconciliation.",
      customers: "More efficient service and reduced waiting times."
    }
  }
};
