import UserResolver from './user/index.js'
import FaqResolver from './faqs/index.js'
import PatchNotesResolver from './patchNotes/index.js'
import CommonCategoryResolver from './categories/CommonCategoryResolver.js'

export const Query = {
  ...UserResolver.Queries,
  ...FaqResolver.Queries,
  ...PatchNotesResolver.Queries,
  ...CommonCategoryResolver.Queries
}

export const Mutation = {
  ...UserResolver.Mutations,
  ...FaqResolver.Mutations,
  ...PatchNotesResolver.Mutations,
  ...CommonCategoryResolver.Mutations
}
