import { Decimal } from "decimal.js"

export type BaseUnit = "GRAM" | "MILLILITER" | "ITEM"
export type DisplayUnit = "G" | "KG" | "ML" | "L" | "UNIT"

export const unitLabels: Record<DisplayUnit, string> = {
  G: "Grams (g)",
  KG: "Kilograms (kg)",
  ML: "Milliliters (mL)",
  L: "Liters (L)",
  UNIT: "Items (count)",
}

export const getDisplayUnitsForBase = (base: BaseUnit): DisplayUnit[] => {
  switch (base) {
    case "GRAM":
      return ["G", "KG"]
    case "MILLILITER":
      return ["ML", "L"]
    case "ITEM":
      return ["UNIT"]
  }
}

// Converts a user-inputted quantity (e.g. 5 KG) into base quantity (e.g. 5000 G)
export const toBaseQty = (qty: string | number, unit: DisplayUnit): Decimal => {
  const dQty = new Decimal(qty)
  switch (unit) {
    case "KG":
    case "L":
      return dQty.mul(1000)
    case "G":
    case "ML":
    case "UNIT":
      return dQty
  }
}

// Converts base price (per base unit) to display price (per display unit)
export const getPricePerDisplayUnit = (pricePerBase: string | number, unit: DisplayUnit): Decimal => {
  const dPrice = new Decimal(pricePerBase)
  switch (unit) {
    case "KG":
    case "L":
      return dPrice.mul(1000)
    case "G":
    case "ML":
    case "UNIT":
      return dPrice
  }
}
