import { Schema, model } from 'mongoose'

const FeedbackSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  request: { type: String, required: true },
  acked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
})

export default model('Feedback', FeedbackSchema)
