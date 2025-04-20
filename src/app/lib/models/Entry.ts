import { Schema, model, models } from 'mongoose'

const EntrySchema = new Schema({
  date: { type: String, required: true },
  text: { type: String, required: true },
  category: { type: String, default: null },
  done: { type: Boolean, default: false },
  completedAt: { type: Date },
  parentId: { type: Schema.Types.ObjectId, ref: 'Entry', default: null },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

EntrySchema.index({ date: 1, text: 1 }, { unique: true })

export default models.Entry || model('Entry', EntrySchema)
