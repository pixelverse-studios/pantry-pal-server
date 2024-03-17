import { model, Schema } from 'mongoose'

const userSchema = new Schema({
  id: { type: 'UUID', unique: true },
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  avatar: String,
  providerId: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  newUser: Boolean,
  tier: String,
})

export default model('User', userSchema)
