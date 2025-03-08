import { Schema, model, models } from "mongoose";

const WorkoutSchema = new Schema({
  date: { type: String, required: true },
  exercise: { type: String, required: true },
  sets: [
    {
      reps: { type: String, required: true },
      weight: { type: String, required: true }
    }
  ],
  done: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

WorkoutSchema.index({ date: 1, exercise: 1 }, { unique: true });

const Workout = models.Workout || model("Workout", WorkoutSchema);
export default Workout;
