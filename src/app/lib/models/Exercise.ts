import { Schema, model, models } from 'mongoose'

const ExerciseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseId: { type: String, required: true },
  type: { type: String, enum: ['weight', 'cardio', 'stretch'], required: true },
  date: { type: Date, default: Date.now },
  sets: [{
    reps: Number,
    weight: Number,
    duration: Number,
    intensity: Number
  }]
})

const Exercise = models.Exercise || model('Exercise', ExerciseSchema)
export default Exercise
