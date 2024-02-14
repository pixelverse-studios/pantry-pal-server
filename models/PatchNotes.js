import { model, Schema } from 'mongoose'

const patchNotes = new Schema({
  id: { type: 'UUID', unique: true },
  title: String,
  description: String,
  datePublished: Date,
  display: Boolean,
  targetDate: Date,
  targetVersion: Number,
  graphic: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
})

export default model('FAQs', patchNotes)
