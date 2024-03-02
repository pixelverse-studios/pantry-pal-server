import { gql } from 'apollo-server'

const typeDefs = gql`
  scalar Date

  enum ErrorTypes {
    # FORM
    badInput
    someFieldsRequired
    allFieldsRequired

    # General usage
    notFound
    failedToMutate
    failure
    duplicateItem

    # USER
    userNotFound
    noUsersFound
    failedToDelete

    # GENERAL
    fetched
  }

  type InputFieldError {
    field: String!
    message: String!
  }

  type Errors {
    type: ErrorTypes
    message: String
    # errors: [InputFieldError]
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

  type User {
    _id: ID!
    email: String
    firstName: String
    lastName: String
    providerId: String
    avatar: String
    createdAt: Date
    lastLogin: Date
    newUser: Boolean
    tier: String
  }
  union UserItem = User | Errors

  type Users {
    Users: [User]
  }
  union UserItems = Users | Errors

  type Faq {
    _id: ID!
    question: String!
    answer: String!
    createdAt: Date
    updatedAt: Date
  }

  union FaqItem = Faq | Errors
  type Faqs {
    Faqs: [Faq]
  }
  union FaqItems = Faqs | Errors

  type PatchNote {
    _id: ID!
    title: String!
    description: String!
    datePublished: Date
    display: Boolean
    targetDate: Date
    targetVersion: Float
    graphic: String
    createdAt: Date
    updatedAt: Date
  }
  union PatchNoteItem = PatchNote | Errors
  type PatchNotes {
    PatchNotes: [PatchNote]
  }
  union PatchNoteItems = PatchNotes | Errors

  type Query {
    # Users
    getAllUsers: UserItems!
    getUser(email: String!): UserItem

    # Common Categories
    getAllCommonCategories: RecipeCategoryItems
    getCommonCategoryById(id: ID!): RecipeCategoryItem
    getCommonCategoryByLabel(label: String!): RecipeCategoryItem

    # Custom Categories (USER RELATED)
    getAllCustomCategories: RecipeCategoryItems
    getCustomCategoryById(userId: ID!, id: ID!): RecipeCategoryItem
    getCustomCategoryByLabel(userId: ID!, label: String!): RecipeCategoryItem

    # FAQs
    getFaqs: FaqItems
    getFaqById(id: ID!): FaqItem

    # PatchNotes
    getAllPatchNotes: PatchNoteItems
  }

  type Mutation {
    # Users
    signIn(
      email: String!
      fullName: String
      avatar: String
      providerId: String
    ): UserItem
    deleteProfile(email: String!): UserItem

    # Common Categories
    createCommonCategory(label: String!): RecipeCategoryItems
    addBulkCommonCategories(labels: [String!]!): BulkRecipeCategoryItems
    editCommonCategoryById(id: ID!, newLabel: String!): RecipeCategoryItems
    deleteCommonCategoryById(id: ID!): RecipeCategoryItems
    deleteBulkCommonCategoriesById(ids: [ID!]!): BulkRecipeCategoryItems
    deleteBulkCommonCategoriesByLabel(
      labels: [String!]!
    ): BulkRecipeCategoryItems

    # Custom Categories (USER RELATED)
    createCustomCategory(userId: ID!, label: String!): RecipeCategoryItems
    addBulkCustomCategories(
      userId: ID!
      labels: [String!]!
    ): RecipeCategoryItems
    editCustomCategoryById(
      userId: ID!
      id: String!
      newLabel: String!
    ): RecipeCategoryItems
    deleteCustomCategoryById(userId: ID!, id: String!): RecipeCategoryItems
    deleteBulkCustomCategories(
      userId: ID!
      ids: [String!]!
    ): RecipeCategoryItems

    # createRecipe(
    #   userId: ID!
    #   ingredients: [String!]!
    #   instructions: [String!]!
    #   cookingMethod: String!
    #   allergies: [String]
    #   category: RecipeCategory
    #   author: String
    # ): RecipeCategoryItems

    # FAQs
    createFaq(question: String!, answer: String!): FaqItems
    editFaq(id: ID!, question: String, answer: String): FaqItems
    deleteFaq(id: ID!): FaqItems
    # PatchNotes
    createPatchNote(
      title: String!
      description: String!
      datePublished: Date
      display: Boolean
      targetDate: Date
      targetVersion: Float
      graphic: String
    ): PatchNoteItems
    editPatchNote(
      id: ID!
      title: String
      description: String
      datePublished: Date
      display: Boolean
      targetDate: Date
      targetVersion: Float
      graphic: String
    ): PatchNoteItems
    deletePatchNote(id: ID!): PatchNoteItems
    publishPatchNote(
      id: ID!
      datePublished: Date!
      display: Boolean!
      targetDate: Date
      targetVersion: Float
    ): PatchNoteItems
  }
`

export default typeDefs
