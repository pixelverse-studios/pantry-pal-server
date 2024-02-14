import UserResolver from './user/index.js'
import FaqResolver from './faqs/index.js'

export const Query = {
  ...UserResolver.Queries,
  ...FaqResolver.Queries
}

export const Mutation = {
  ...UserResolver.Mutations,
  ...FaqResolver.Mutations
}
