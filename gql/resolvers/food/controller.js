import BaseResolver from '../../baseResolver.js'
import { logError } from '../../../utils/logger.js'
import { getByName, getById } from '../../../services/api/food/ingredient.js'

// TODO: Come back and ensure there is a valid token provided before making any API calls
class FoodController extends BaseResolver {
  constructor() {
    super()
    this.typenames = {
      singleAutocomplete: 'Autocomplete',
      multiAutoComplete: 'Autocompletes',
      singleFood: 'Food'
    }
  }

  catchError(action, { topic, operation }, error) {
    logError(topic, operation, error)
    this.catchError(action)
  }
  handleSingleItemSuccess(values, __typename) {
    return {
      __typename,
      ...values
    }
  }
  handleMultiItemSuccess(values, __typename) {
    return {
      __typename,
      [__typename]: values
    }
  }

  async getSearchResults({ query }) {
    const searchResults = await getByName(query)
    const reshaped = searchResults.results.map(result => ({
      id: result.id,
      name: result.name,
      image: result.image,
      units: result.possibleUnits
    }))
    return this.handleMultiItemSuccess(
      reshaped,
      this.typenames.multiAutoComplete
    )
  }
  async getFood({ id, amount, units }) {
    const food = await getById(id, amount, units)
    return this.handleSingleItemSuccess(food, this.typenames.singleFood)
  }
}

export default FoodController
