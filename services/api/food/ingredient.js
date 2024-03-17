import axios from 'axios'
import config from '../../../config'

const { base, key } = config.food
const req = axios.create({
  baseURL: base,
  headers: {
    'x-api-key': key
  }
})

function IngredientService() {
  const getById = async id => {
    try {
      const result = await req.get(`/food/products/?${id}`)
      console.log('result: ', result)
    } catch (error) {
      console.log(error)
      // add log error
    }
  }

  return { getById }
}

export default IngredientService
