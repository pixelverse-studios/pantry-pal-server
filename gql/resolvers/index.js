import UserResolver from './user/resolver.js'
import FaqResolver from './faqs/resolver.js'
import PatchNotesResolver from './patchNotes/resolver.js'
import CommonCategoryResolver from './categories/common/resolver.js'

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
