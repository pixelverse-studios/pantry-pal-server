import { model, Schema } from 'mongoose'

const faqSchema = new Schema({
  id: { type: 'UUID', unique: true },
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
})

export default model('FAQs', faqSchema)
