export const extractNutrients = (nutrients: any, log: boolean) => {
  const getNutrientValue = (nutrientNumber: number) => {
    const nutrient = nutrients.find((n: any) => n.nutrientId === nutrientNumber)
    return nutrient ? nutrient.value : 0
  }

  return {
    calories: getNutrientValue(2047),
    carbohydrates: getNutrientValue(1005),
    cholesterol: getNutrientValue(1253),
    fat: getNutrientValue(1004),
    fiber: getNutrientValue(1079),
    protein: getNutrientValue(1003),
    sodium: getNutrientValue(1093),
    sugar: getNutrientValue(2000),
    vitamin_a: getNutrientValue(1104),
    vitamin_c: getNutrientValue(1162),
    vitamin_d: getNutrientValue(1114)
  }
}

function getMilliliterConversion() {
  return 1
}
function getLiterConversion() {
  return getMilliliterConversion() * 1000
}
function getTeaspoonConversion() {
  return getMilliliterConversion() * 5
}

function getTablespoonConversion() {
  return getTeaspoonConversion() * 3
}

function getCupConversion() {
  return getTablespoonConversion() * 16
}

function getFluidOunceConversion() {
  return getMilliliterConversion() * 29.57
}

export const measurementOptions = [
  { unit: 'g', label: 'grams', conversion: 1 },
  { unit: 'oz', label: 'ounces', conversion: 28.35 },
  { unit: 'lb', label: 'pounds', conversion: 453.6 },
  { unit: 'ml', label: 'milliliters', conversion: 1 },
  {
    unit: 'L',
    label: 'liters',
    conversionFactor: getLiterConversion
  },
  {
    unit: 'tsp',
    label: 'teaspoons',
    conversionFactor: getTeaspoonConversion
  },
  {
    unit: 'tbsp',
    label: 'tablespoons',
    conversionFactor: getTablespoonConversion
  },
  {
    unit: 'c',
    label: 'cups',
    conversionFactor: getCupConversion
  },
  {
    unit: 'fl oz',
    label: 'fluid ounces',
    conversionFactor: getFluidOunceConversion
  }
]
