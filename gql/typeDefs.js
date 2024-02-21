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
    users: [User]
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
