import { model, Schema } from 'mongoose'

const customCatSchema = new Schema({
  id: { type: 'UUID', unique: true },
  label: { type: String, unique: true }
})

export default model('CustomCategory', customCatSchema)
