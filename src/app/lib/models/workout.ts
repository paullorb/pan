import { Schema, model, models } from 'mongoose'

const WorkoutSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  workout: {
    cardio: { type: [String], default: [] },
    weight: { type: [String], default: [] },
    stretch: { type: [String], default: [] }
  }
})

const Workout = models.Workout || model('Workout', WorkoutSchema)
export default Workout
