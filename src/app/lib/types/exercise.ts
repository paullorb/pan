export type ExerciseType = 'weight' | 'cardio' | 'stretch';

export interface ExerciseSet {
  reps?: string;
  weight?: string;
  duration?: string;
  intensity?: string;
  completed: boolean;
}

export interface Set extends ExerciseSet {
  id?: string;  // If you need to track individual sets
  timestamp?: Date;  // Useful for tracking when the set was performed
}

export interface ExerciseDefaults {
  reps?: string;
  weight?: string;
  duration?: string;
  intensity?: string;
}

export interface ExerciseDetails {
  exerciseType: ExerciseType;
  sets: ExerciseSet[];
  exerciseCompleted: boolean;
}
