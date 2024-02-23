import { model, Schema } from 'mongoose'

const commonCatSchema = new Schema({
  id: { type: 'UUID', unique: true },
  label: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
})

export default model('CommonCategory', commonCatSchema)
