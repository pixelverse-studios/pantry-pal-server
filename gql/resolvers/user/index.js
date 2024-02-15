import UserController from './userController.js'
const controller = new UserController()

const Queries = {
  async getAllUsers() {
    try {
      return await controller.getAllUsers()
    } catch (error) {
      return controller.catchError('fetching all users')
    }
  },
  async getUser(_, payload) {
    try {
      return await controller.getUser(payload)
    } catch (error) {
      return controller.catchError('fetching user')
    }
  }
}

const Mutations = {
  async signIn(_, payload) {
    try {
      const res = await controller.signIn(payload)
      return res
    } catch (error) {
      return controller.catchError('signing in the user')
    }
  },
  async deleteProfile(_, payload) {
    // TODO: Check token before executing request. Build in a development backdoor
    try {
      const res = await controller.deleteProfile(payload.email)
      return res
    } catch (error) {
      return controller.catchError('deleting that profile')
    }
  }
}

export default { Queries, Mutations }
