import { gql } from 'apollo-server'

const foodTypes = gql`
  scalar Date
  enum ErrorTypes {
    duplicate
    failure
    invalid
    notFound
    unauthorized
  }

  type Errors {
    type: ErrorTypes
    message: String
  }

  type Autocomplete {
    id: Float
    name: String
    image: String
    units: [String]
  }

  type Autocompletes {
    Autocompletes: [Autocomplete]
  }

  union AutocompleteItems = Autocompletes | Errors

  type FoodNutrients {
    name: String
    amount: Float
    unit: String
    percentOfDailyNeeds: Float
  }

  type BreakdownValues {
    percent: Float
    value: Float
  }

  type CaloricBreakdown {
    calories: BreakdownValues
    protein: BreakdownValues
    fat: BreakdownValues
    carb: BreakdownValues
  }

  type Units {
    base: String
    short: String
    long: String
  }

  type Food {
    id: Float
    name: String
    image: String
    units: Units
    possibleUnits: [String]
    nutrition: [FoodNutrients]
    estimatedCost: Float
    caloricBreakdown: CaloricBreakdown
    aisle: [String]
  }

  union FoodItem = Food | Errors

  type Query {
    getSearchResults(query: String!): AutocompleteItems
    getFood(id: Float!, amount: Float!, units: String!): FoodItem
  }
`

export default foodTypes
