import { model, Schema } from 'mongoose'

const commonCatSchema = new Schema({
  id: { type: 'UUID', unique: true },
  label: { type: String, unique: true }
})

export default model('CommonCategory', commonCatSchema)
