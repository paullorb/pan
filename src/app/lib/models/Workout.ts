import { Schema, model, models } from 'mongoose'
const WorkoutSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseId: { type: String, required: true },
  type: { type: String, enum: ['weight', 'cardio', 'stretch'], required: true },
  date: { type: Date, default: Date.now },
  details: {
    sets: [{ reps: Number, weight: Number }],
    duration: Number,
    intensity: Number,
    time: Number,
    reps: Number
  }
})
const Workout = models.Workout || model('Workout', WorkoutSchema)
export default Workout
