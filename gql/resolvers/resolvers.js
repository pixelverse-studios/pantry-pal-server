import UserResolver from './user/resolver.js'
import FaqResolver from './faqs/resolver.js'
import PatchNotesResolver from './patchNotes/resolver.js'
import CommonCategoryResolver from './categories/common/resolver.js'
import CustomCategoryResolver from './categories/custom/resolver.js'
import FoodResolver from './food/resolver.js'
import RecipeResolver from './recipe/resolver.js'
import FeedbackResolver from './feedback/resolver.js'

export const Query = {
  ...UserResolver.Queries,
  ...FaqResolver.Queries,
  ...PatchNotesResolver.Queries,
  ...CommonCategoryResolver.Queries,
  ...CustomCategoryResolver.Queries,
  ...FoodResolver.Queries,
  ...FeedbackResolver.Queries,
  ...RecipeResolver.Queries
}

export const Mutation = {
  ...UserResolver.Mutations,
  ...FaqResolver.Mutations,
  ...PatchNotesResolver.Mutations,
  ...CommonCategoryResolver.Mutations,
  ...CustomCategoryResolver.Mutations,
  ...RecipeResolver.Mutations,
  ...FeedbackResolver.Mutations
}
