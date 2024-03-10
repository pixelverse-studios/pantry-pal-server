import BaseResolver from '../../baseResolver.js'
import User from '../../../models/User.js'
import { TIERS_MAP } from '../../../utils/user/tiers.js'

class UserController extends BaseResolver {
  constructor() {
    super()
    this.typenames = {
      single: 'User',
      multi: 'Users'
    }
  }

  catchError(action) {
    return this.catchError(action)
  }
  async getAll() {
    const allUsers = await User.find()
    if (allUsers?.length == 0) {
      this.error = this.errors.noUsersFound()
      return this.handleError()
    }
    return this.handleMultiItemSuccess(allUsers)
  }
  async getByEmail({ email }) {
    const user = await User.findOne({ email })
    if (user == null) {
      this.error = this.errors.userNotFound()
      return this.handleError()
    }
    return this.handleSingleItemSuccess(user)
  }
  async signIn({ email, fullName, avatar, providerId }) {
    if (!email) {
      this.error = this.errors.userNotFound
      return this.handleError()
    }

    const user = await User.findOne({ email })
    if (user !== null) {
      user.lastLogin = Date.now()
      user.newUser = false
      const saved = await user.save()
      return this.handleSingleItemSuccess(saved)
    } else {
      const [firstName, lastName] = fullName?.split(' ') ?? ['', '']
      const newUser = new User({
        email,
        firstName,
        lastName,
        avatar,
        providerId,
        lastLogin: Date.now(),
        newUser: true,
        tier: TIERS_MAP.get(1)
      })
      const saved = await newUser.save()
      return this.handleSingleItemSuccess(saved)
    }
  }
  async delete(email) {
    const user = await User.find({ email })
    if (!user) {
      this.error = this.errors.userNotFound
      return this.handleError()
    }
    const res = await User.findOneAndDelete({ email })
    return this.handleSingleItemSuccess(res)
  }
}

export default UserController