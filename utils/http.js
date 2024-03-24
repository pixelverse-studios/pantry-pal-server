import config from '../config.js'

export const http = {
  GET: 'GET',
  POST: 'POST'
}

const { baseUrl, key } = config.api.food

export const foodFetch = async ({ params, method }) => {
  const url = `${baseUrl}/${params}`
  const results = await fetch(url, {
    method,
    headers: { 'x-api-key': key }
  })
  return results.json()
}
