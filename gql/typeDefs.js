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
    errors: [InputFieldError]
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
  union UserResponse = User | Errors

  type MultiUsersSuccess {
    users: [User]
  }
  union MultiUserResponse = MultiUsersSuccess | Errors

  type Query {
    # Users
    getAllUsers: MultiUserResponse!
    getUser(email: String): UserResponse
  }

  type Mutation {
    # Users
    signIn(
      email: String
      fullName: String
      avatar: String
      providerId: String
    ): UserResponse
    deleteProfile(email: String): UserResponse
  }
`

export default typeDefs
