import 'dotenv/config'

const { env } = process

export const PRODUCTION = 'PRODUCTION'
const DEVELOPMENT = 'DEVELOPMENT'

const config = {
  environment: env.ENVIRONMENT ?? DEVELOPMENT,
  port: env.PORT ?? 5050,
  db: env.DB_CONNECT_URL,
  api: {
    food: {
      key: env.SPOON_API_KEY,
      baseUrl: 'https://api.spoonacular.com'
    }
  }
}

export default config
