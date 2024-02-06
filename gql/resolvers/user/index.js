import UserResolver from './userResolver.js'
const resolver = new UserResolver()

const Queries = {
  async getAllUsers() {
    try {
      return await resolver.getAllUsers()
    } catch (error) {
      return resolver.catchError('fetching all users')
    }
  }
}

const Mutations = {
  async signIn(_, payload) {
    console.log(payload)
    try {
      const res = await resolver.signIn(payload)
      return res
    } catch (error) {
      return resolver.catchError('signing in the user')
    }
  },
  async deleteProfile(_, payload) {
    console.log(payload)
    // TODO: Check token before executing request. Build in a development backdoor
    try {
      const res = await resolver.deleteProfile(payload.email)
      return res
    } catch (error) {
      return resolver.catchError('deleting that profile')
    }
  }
}

export default { Queries, Mutations }
