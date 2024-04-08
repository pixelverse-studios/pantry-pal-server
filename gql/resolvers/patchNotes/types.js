import { gql } from 'apollo-server'

const patchNoteTypes = gql`
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
    getAllPatchNotes: PatchNoteItems
  }

  type Mutation {
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

export default patchNoteTypes
