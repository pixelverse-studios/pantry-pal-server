import BaseResolver from '../../baseResolver'
import User from '../../../models/User'
import { CatchErrorType } from '../../../utils/resolverTypes'

class UserResolver extends BaseResolver {
  constructor() {
    super()
    this.addedErrors = {
      noUsersFound: {
        type: 'noUsersFound',
        message: () => 'No users found'
      },
      userNotFound: {
        type: 'userNotFound',
        message: () => 'User not found'
      }
    }
    this.errors = { ...this.errors, ...this.addedErrors }
    this.typenames = {
      single: 'User',
      multi: 'MultiUsersSuccess'
    }
  }

  catchError(action: string): CatchErrorType {
    return this.catchError(action)
  }

//   async signIn({ email, fullName, avatar, providerId }) {
//     if (!email) {
//       this.error = this.errors.userNotFound
//       return this.handleError()
//     }
//     const user = await User.findOne({ email })
//     if (user !== null) {
//       user.lastLogin = new Date()
//       const saved = await user.save()
//       this.typename = this.singleTypename
//       return this.handleSingleItemSuccess(saved)
//     } else {
//       const [firstName, lastName] = fullName?.split(' ') ?? ['', '']
//       const newUser = new User({
//         email,
//         firstName,
//         lastName,
//         avatar,
//         providerId,
//         lastLogin: new Date()
//       })
//       const saved = await newUser.save()
//       this.typename = this.singleTypename
//       return this.handleSingleItemSuccess(saved)
//     }
//   }
}

export default UserResolver
