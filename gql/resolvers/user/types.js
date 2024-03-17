import { gql } from 'apollo-server'

const userTypes = gql`
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

  type UsersCategory {
    _id: ID
    label: String
    src: String
    createdAt: Date
    updatedAt: Date
  }
  type UsersCategories {
    UsersCategories: [UsersCategory]
  }
  union UsersCategoriesItems = UsersCategories | Errors

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

  type Query {
    getAllUsers: UserItems!
    getUser(email: String!): UserItem
  }

  type Mutation {
    signIn(
      email: String!
      fullName: String
      avatar: String
      providerId: String
    ): UserItem
    deleteProfile(email: String!): UserItem
  }
`

export default userTypes
