import { gql } from 'apollo-server'

const recipeTypes = gql`
  scalar Date
  enum ErrorTypes {
    duplicate
    failure
    invalid
    notFound
    unauthorized
  }

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

  type Ingredient {
    foodId: Float
    name: String
    image: String
    units: Units
    possibleUnits: [String]
    nutrition: [FoodNutrients]
    caloricBreakdown: CaloricBreakdown
    estimatedCost: Float
    aisle: [String]
  }

  type Macros {
    calories: Float
    protein: Float
    carbs: Float
    fat: Float
  }

  type Category {
    categoryId: ID
    label: String
  }

  type Author {
    name: String
    authorId: String
    rating: Float
    difficulty: Float
  }

  type User {
    id: String
    name: String
    email: String
  }

  type Rating {
    user: User
    score: Float
    createdAt: Date
  }

  type Comment {
    user: User
    text: String
    createdAt: Date
  }

  type Interaction {
    ratings: [Rating]
    comments: [Comment]
  }

  type Recipe {
    _id: ID!
    userId: String!
    title: String!
    ingredients: [Ingredient]
    macros: Macros
    totalEstimatedCost: Float
    instructions: [String]
    cookingMethod: String
    allergies: [String]
    category: Category
    rating: Float
    difficulty: Float
    tags: [String]
    author: Author
    image: String
    interactions: Interaction
    createdAt: Date
    updatedAt: Date
  }
  type Recipes {
    Recipes: [Recipe]
  }

  union RecipeItem = Recipe | Errors
  union RecipeItems = Recipes | Errors

  input FoodNutrientField {
    name: String
    amount: Float
    unit: String
    percentOfDailyNeeds: Float
  }

  input BreakdownField {
    percent: Float
    value: Float
  }

  input CaloricBreakdownField {
    calories: BreakdownField
    protein: BreakdownField
    fat: BreakdownField
    carb: BreakdownField
  }

  input UnitsField {
    base: String
    short: String
    long: String
  }

  input IngredientField {
    foodId: Float
    name: String
    image: String
    units: UnitsField
    possibleUnits: [String]
    nutrition: [FoodNutrientField]
    estimatedCost: Float
    caloricBreakdown: CaloricBreakdownField
    aisle: [String]
  }

  input FilteredPayload {
    userId: ID
    title: String
    ingredients: [String]
    cookingMethod: String
    allergies: [String]
    category: [ID]
    rating: Float
    difficulty: Float
    tags: [String]
    startDate: Date
    endDate: Date
  }

  type Query {
    getRecipes(userId: ID): RecipeItems
    getRecipe(id: ID!): RecipeItem
    getFilteredRecipes(filters: FilteredPayload): RecipeItems
  }

  input NewRecipePayload {
    title: String!
    ingredients: [IngredientField!]!
    instructions: [String!]!
    cookingMethod: String!
    allergies: [String]
    category: ID!
    rating: Float!
    difficulty: Float!
    tags: [String]
    image: String
  }

  input EditRecipePayload {
    title: String
    ingredients: [IngredientField]
    instructions: [String]
    cookingMethod: String
    allergies: [String]
    category: ID
    rating: Float
    difficulty: Float
    tags: [String]
    image: String
  }

  type Mutation {
    createRecipe(userId: ID!, payload: NewRecipePayload): RecipeItem
    editRecipe(id: ID!, userId: ID!, payload: EditRecipePayload): RecipeItem
    deleteRecipe(id: ID!): Boolean
    createCommentInteraction: RecipeItem
    createRatingInteraction: RecipeItem
  }
`

export default recipeTypes
