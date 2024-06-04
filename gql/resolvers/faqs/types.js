import { gql } from 'apollo-server'

const faqTypes = gql`
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

  type Query {
    getFaqs: FaqItems
    getFaqById(id: ID!): FaqItem
  }

  type Mutation {
    createFaq(question: String!, answer: String!): FaqItems
    editFaq(id: ID!, question: String, answer: String): FaqItems
    deleteFaq(id: ID!): FaqItems
  }
`

export default faqTypes
