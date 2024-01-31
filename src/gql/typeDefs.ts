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
    _id: String!
    email: String
    firstName: String
    lastName: String
    providerId: String
    avatar: String
    createdAt: Date
    lastLogin: Date
    newUser: Boolean
  }
  union UserResponse = User | Errors

  type MultiUsersSuccess {
    users: [User]
  }
  union MultiUserResponse = MultiUsersSuccess | Errors

  type Query {
    # Users
    getAllUsers: MultiUserResponse!
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
