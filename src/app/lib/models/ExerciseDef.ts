import { Schema, model, models } from 'mongoose';

const DefSchema = new Schema({
  name:        { type: String, required: true },
  mainMuscle:  String,
  type:        { type: String, enum: ['weight','cardio','stretch'], required: true },
  bestPractice:String,
  keyMovement: String,
  color:       String
});

export default models.ExerciseDef || model('ExerciseDef', DefSchema);
