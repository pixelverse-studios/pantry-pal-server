import { gql } from 'apollo-server'

const recipeTypes = gql`
  scalar Date
  enum ErrorTypes {
    duplicate
    failure
    invalid
    notFound
    unauthorized
    customMessage
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
    _id: ID
    label: String
  }

  type Author {
    name: String
    authorId: String
    rating: Float
    difficulty: Float
  }

  type User {
    _id: ID
    firstName: String
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
    user: User!
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
    prepTime: Float
    cookTime: Float
    totalTime: Float
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

  input FilteredRange {
    min: Float
    max: Float
  }

  input FilteredMacros {
    calories: FilteredRange
    protein: FilteredRange
    carbs: FilteredRange
    fat: FilteredRange
  }

  input FilteredPayload {
    title: String
    ingredientNames: [String]
    ingredientAisles: [String]
    macros: FilteredMacros
    cookingMethod: [String]
    cost: FilteredRange
    allergies: [String]
    category: [ID]
    rating: FilteredRange
    difficulty: FilteredRange
    tags: [String]
    createdAt: FilteredRange
    users: [String]
  }

  type BulkDeletes {
    total: Float
    succeeded: [String]
    failed: [String]
  }
  union BulkDeleteItems = BulkDeletes | Errors

  type FilterIngredients {
    names: [String]
    aisles: [String]
  }
  type FilterRangeItem {
    min: Float
    max: Float
    step: Float
  }
  type FilterMacros {
    calories: FilterRangeItem
    protein: FilterRangeItem
    carbs: FilterRangeItem
    fat: FilterRangeItem
  }
  type Filter {
    titles: [String]
    ingredients: FilterIngredients
    macros: FilterMacros
    cost: FilterRangeItem
    cookingMethod: [String]
    category: [Category]
    allergies: [String]
    rating: FilterRangeItem
    difficulty: FilterRangeItem
    tags: [String]
    createdAt: FilterRangeItem
    updatedAt: FilterRangeItem
    users: [User]
  }
  union FilterItems = Filter | Errors

  type Query {
    allRecipes: RecipeItems
    userRecipes(userId: ID!): RecipeItems
    recipe(id: ID!): RecipeItem
    filteredRecipes(filters: FilteredPayload): RecipeItems
    searchResults(userId: ID, search: String!): RecipeItems
    userFilters(userId: ID!): FilterItems
    allFilters: FilterItems
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
    prepTime: Float!
    cookTime: Float!
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
    prepTime: Float
    cookTime: Float
    tags: [String]
    image: String
  }

  type Mutation {
    createRecipe(userId: ID!, payload: NewRecipePayload): RecipeItem
    editRecipe(id: ID!, userId: ID!, payload: EditRecipePayload): RecipeItem
    deleteRecipe(id: ID!): Boolean
    deleteRecipes(ids: [ID!]!): BulkDeleteItems
    createCommentInteraction: RecipeItem
    createRatingInteraction: RecipeItem
  }
`

export default recipeTypes
