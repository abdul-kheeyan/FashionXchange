/**
 * Swap Value Calculator
 * Estimates clothing item value using category, brand tier, and condition.
 */

const CATEGORY_BASE = {
  'Outerwear':   1200,
  'Footwear':    1000,
  'Dresses':      900,
  'Ethnic Wear':  800,
  'Bottoms':      600,
  'Activewear':   600,
  'Tops':         400,
  'Accessories':  350,
};

const BRAND_TIER = {
  // Luxury
  'Zara':    1.5,
  'Mango':   1.5,
  'Tommy Hilfiger': 1.8,
  'Ralph Lauren':   2.0,
  'Lacoste':        1.8,
  'Adidas':         1.6,
  'Nike':           1.6,
  'Puma':           1.4,
  "Levi's":         1.5,
  'Wrangler':       1.3,
  'Pepe Jeans':     1.3,
  // Mid-tier
  'H&M':     1.2,
  'Uniqlo':  1.3,
  'Gap':     1.2,
  'Forever 21': 1.1,
  'Vero Moda':  1.2,
  'Only':       1.2,
  'Biba':       1.3,
  'FabIndia':   1.4,
  'W':          1.2,
  // Basic
  'Westside': 1.0,
  'Pantaloons': 1.0,
  'Max Fashion': 0.9,
};

const CONDITION_MULTIPLIER = {
  'New':      1.00,
  'Like New': 0.82,
  'Good':     0.60,
  'Fair':     0.38,
};

/**
 * Calculate estimated swap value.
 * @param {string} category
 * @param {string} brand
 * @param {string} condition
 * @returns {number} estimated value in INR
 */
const calculateValue = (category, brand, condition) => {
  const base      = CATEGORY_BASE[category]   || 500;
  const brandMult = BRAND_TIER[brand]         || 1.0;
  const condMult  = CONDITION_MULTIPLIER[condition] || 0.6;
  const value     = Math.round(base * brandMult * condMult);
  return value;
};

/**
 * Get value mismatch percentage between two items.
 * Returns positive number (percentage points).
 */
const getMismatchPercent = (val1, val2) => {
  const max = Math.max(val1, val2);
  if (max === 0) return 0;
  return Math.round((Math.abs(val1 - val2) / max) * 100);
};

module.exports = { calculateValue, getMismatchPercent, CATEGORY_BASE, BRAND_TIER, CONDITION_MULTIPLIER };
