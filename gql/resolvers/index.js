import UserResolver from './user/index.js'
import FaqResolver from './faqs/index.js'
import PatchNotesResolver from './patchNotes/index.js'

export const Query = {
  ...UserResolver.Queries,
  ...FaqResolver.Queries,
  ...PatchNotesResolver.Queries
}

export const Mutation = {
  ...UserResolver.Mutations,
  ...FaqResolver.Mutations,
  ...PatchNotesResolver.Mutations
}
