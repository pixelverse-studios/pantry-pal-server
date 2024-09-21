import { gql } from 'apollo-server'

const feedbackTypes = gql`
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

  type Feedback {
    id: ID
    user: User
    request: String
    description: String
    acked: Boolean
  }

  type Feedbacks {
    Feedbacks: [Feedback]
  }

  union FeedbackItem = Feedback | Errors
  union FeedbackItems = Feedbacks | Errors

  type Query {
    getAllFeedback: FeedbackItems
    getFeedbackItem(id: ID!): FeedbackItem
  }

  input NewFeedbackPayload {
    request: String!
    description: String!
  }

  type Mutation {
    createFeedback(userId: ID!, payload: NewFeedbackPayload!): FeedbackItem
    editFeedback(id: ID!, status: Boolean!): FeedbackItems
    deleteFeedback(id: ID!): Boolean
  }
`

export default feedbackTypes
