import mongoose, { Document, Model } from "mongoose"

export interface IWorkout extends Document {
  userId: string
  date: string
  workout: {
    cardio: string[]
    weight: string[]
    stretch: string[]
  }
}

const WorkoutSchema = new mongoose.Schema<IWorkout>({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  workout: {
    cardio: { type: [String], default: [] },
    weight: { type: [String], default: [] },
    stretch: { type: [String], default: [] }
  }
})

export default (mongoose.models.Workout as Model<IWorkout>) ||
  mongoose.model<IWorkout>("Workout", WorkoutSchema)
