import UserResolver from './user'

export const Query = {
  ...UserResolver.Queries
}

export const Mutation = {
  ...UserResolver.Mutations
}
