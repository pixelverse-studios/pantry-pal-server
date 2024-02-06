import BaseResolver from '../../baseResolver.js'
import User from '../../../models/User.js'

class UserResolver extends BaseResolver {
  constructor() {
    super()
    this.addedErrors = {
      noUsersFound: () => ({
        type: 'noUsersFound',
        message: () => 'No users found'
      }),
      userNotFound: () => ({
        type: 'userNotFound',
        message: () => 'User not found'
      })
    }
    this.errors = { ...this.errors, ...this.addedErrors }
    this.typenames = {
      single: 'User',
      multi: 'MultiUsersSuccess'
    }
  }

  catchError(action) {
    return this.catchError(action)
  }
  async getAllUsers() {
    const allUsers = await User.find()
    if (allUsers?.length == 0) {
      this.error = this.errors.noUsersFound()
      return this.handleError()
    }
    return this.handleMultiItemSuccess('users', allUsers)
  }
  async signIn({ email, fullName, avatar, providerId }) {
    if (!email) {
      this.error = this.errors.userNotFound
      return this.handleError()
    }
    const user = await User.findOne({ email })
    if (user !== null) {
      user.lastLogin = new Date()
      const saved = await user.save()
      this.typename = this.typenames.single
      return this.handleSingleItemSuccess(saved)
    } else {
      const [firstName, lastName] = fullName?.split(' ') ?? ['', '']
      const newUser = new User({
        email,
        firstName,
        lastName,
        avatar,
        providerId,
        lastLogin: new Date()
      })
      const saved = await newUser.save()
      this.typename = this.typenames.single
      return this.handleSingleItemSuccess(saved)
    }
  }
  async deleteProfile(email) {
    const user = await User.find({ email })
    if (!user) {
      this.error = this.errors.userNotFound
      return this.handleError()
    }
    const res = await User.findOneAndDelete({ email })
    this.typename = this.typenames.single
    return this.handleSingleItemSuccess(res)
  }
}

export default UserResolver
