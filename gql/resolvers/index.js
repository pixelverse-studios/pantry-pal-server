import UserResolver from './user/index.js'

export const Query = {
  ...UserResolver.Queries
}

export const Mutation = {
  ...UserResolver.Mutations
}
