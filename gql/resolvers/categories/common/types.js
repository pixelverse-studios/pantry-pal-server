import { gql } from 'apollo-server'

const commonCategoryTypes = gql`
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

  type RecipeCategory {
    _id: ID!
    label: String
    createdAt: Date
    updatedAt: Date
  }
  union RecipeCategoryItem = RecipeCategory | Errors

  type RecipeCategories {
    RecipeCategories: [RecipeCategory]
  }
  union RecipeCategoryItems = RecipeCategories | Errors

  type BulkRecipeCategories {
    all: [RecipeCategory]
    failed: [String]
    succeeded: [String]
  }
  union BulkRecipeCategoryItems = BulkRecipeCategories | Errors

  type Query {
    getAllCommonCategories: RecipeCategoryItems
    getCommonCategoryById(id: ID!): RecipeCategoryItem
    getCommonCategoryByLabel(label: String!): RecipeCategoryItem
  }

  type Mutation {
    createCommonCategory(label: String!): RecipeCategoryItems
    addBulkCommonCategories(labels: [String!]!): BulkRecipeCategoryItems
    editCommonCategoryById(id: ID!, newLabel: String!): RecipeCategoryItems
    deleteCommonCategoryById(id: ID!): RecipeCategoryItems
    deleteCommonCategoryByLabel(label: String!): RecipeCategoryItems
    deleteBulkCommonCategoriesById(ids: [ID!]!): BulkRecipeCategoryItems
    deleteBulkCommonCategoriesByLabel(
      labels: [String!]!
    ): BulkRecipeCategoryItems
  }
`

export default commonCategoryTypes
