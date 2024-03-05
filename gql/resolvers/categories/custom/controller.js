import BaseResolver from '../../../baseResolver.js'

class CustomCategoryController extends BaseResolver {
  constructor() {
    super()
    this.typenames = {
      single: 'RecipeCategory',
      multi: 'RecipeCategories'
    }
  }

  catchError(action) {
    return this.catchError(action)
  }
}

export default CustomCategoryController
