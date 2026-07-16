/**
 * Client-side Swap Value Calculator
 * Mirrors the server-side logic for live previews.
 */

export const CATEGORIES = [
  'Tops', 'Bottoms', 'Dresses', 'Outerwear',
  'Footwear', 'Accessories', 'Activewear', 'Ethnic Wear',
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', '28', '30', '32', '34', '36', '38', '40', '6', '7', '8', '9', '10', '11', '12']

export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair']

export const BRANDS = [
  'Zara', 'Mango', 'Tommy Hilfiger', 'Ralph Lauren', 'Lacoste',
  'Adidas', 'Nike', 'Puma', "Levi's", 'Wrangler', 'Pepe Jeans',
  'H&M', 'Uniqlo', 'Gap', 'Forever 21', 'Vero Moda', 'Only',
  'Biba', 'FabIndia', 'W', 'Westside', 'Pantaloons', 'Max Fashion',
  'Other',
]

const CATEGORY_BASE = {
  'Outerwear':   1200,
  'Footwear':    1000,
  'Dresses':      900,
  'Ethnic Wear':  800,
  'Bottoms':      600,
  'Activewear':   600,
  'Tops':         400,
  'Accessories':  350,
}

const BRAND_TIER = {
  'Zara': 1.5, 'Mango': 1.5, 'Tommy Hilfiger': 1.8,
  'Ralph Lauren': 2.0, 'Lacoste': 1.8,
  'Adidas': 1.6, 'Nike': 1.6, 'Puma': 1.4,
  "Levi's": 1.5, 'Wrangler': 1.3, 'Pepe Jeans': 1.3,
  'H&M': 1.2, 'Uniqlo': 1.3, 'Gap': 1.2,
  'Forever 21': 1.1, 'Vero Moda': 1.2, 'Only': 1.2,
  'Biba': 1.3, 'FabIndia': 1.4, 'W': 1.2,
  'Westside': 1.0, 'Pantaloons': 1.0, 'Max Fashion': 0.9,
}

const CONDITION_MULTIPLIER = {
  'New': 1.00, 'Like New': 0.82, 'Good': 0.60, 'Fair': 0.38,
}

export const calculateValue = (category, brand, condition) => {
  const base      = CATEGORY_BASE[category]          || 500
  const brandMult = BRAND_TIER[brand]                || 1.0
  const condMult  = CONDITION_MULTIPLIER[condition]  || 0.6
  return Math.round(base * brandMult * condMult)
}

export const getMismatchPercent = (val1, val2) => {
  const max = Math.max(val1, val2)
  if (max === 0) return 0
  return Math.round((Math.abs(val1 - val2) / max) * 100)
}

export const formatValue = (val) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

export const getConditionColor = (condition) => {
  const map = { 'New': 'emerald', 'Like New': 'emerald', 'Good': 'champagne', 'Fair': 'burgundy' }
  return map[condition] || 'grey'
}
