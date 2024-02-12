import UserResolver from './userResolver.js'
const resolver = new UserResolver()

const Queries = {
  async getAllUsers() {
    try {
      return await resolver.getAllUsers()
    } catch (error) {
      return resolver.catchError('fetching all users')
    }
  },
  async getUser(_, payload) {
    try {
      return await resolver.getUser(payload)
    } catch (error) {
      return resolver.catchError('fetching user')
    }
  }
}

const Mutations = {
  async signIn(_, payload) {
    try {
      const res = await resolver.signIn(payload)
      return res
    } catch (error) {
      return resolver.catchError('signing in the user')
    }
  },
  async deleteProfile(_, payload) {
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
