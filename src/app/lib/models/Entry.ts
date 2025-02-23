import { Schema, model, models } from 'mongoose'

const EntrySchema = new Schema({
  date: { type: String, required: true },
  text: { type: String, required: true },
  category: { type: String, default: null },
  done: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

EntrySchema.index({ date: 1, text: 1 }, { unique: true })

const Entry = models.Entry || model('Entry', EntrySchema)
export default Entry
