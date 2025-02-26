export interface Exercise {
  id: number;
  title: string;
  image: string;
  series: string;
  repetitions: string;
  notes?: string;
  majorMuscle?: string;
  minorMuscle?: string;
  equipment?: string;
  type?: string;
  level?: string;
}

export interface Workout {
  id: number;
  title: string;
  exercises: Exercise[];
}

export const workouts: Workout[] = [
  {
    id: 1,
    title: "Legs",
    exercises: [
      {
        id: 1,
        title: "Deadlift",
        image: "/deadlift.png",
        series: "4 series",
        repetitions: "6 reps",
        majorMuscle: "Back",
        minorMuscle: "Legs"
      },
      {
        id: 2,
        title: "Leg Extension",
        image: "/leg_extension.png",
        series: "5 series",
        repetitions: "10 reps",
        majorMuscle: "Quadriceps",
        minorMuscle: "Legs"
      },
      {
        id: 3,
        title: "Inclined Leg Press",
        image: "/inclined_leg_press.png",
        series: "4 series",
        repetitions: "8 reps",
        majorMuscle: "Quadriceps",
        minorMuscle: "Legs"
      },
      {
        id: 4,
        title: "Leg Press",
        image: "/leg_press.png",
        series: "5 series",
        repetitions: "10 reps",
        majorMuscle: "Quadriceps",
        minorMuscle: "Legs"
      },
      {
        id: 5,
        title: "Seated Calf Raise",
        image: "/seated_calf_raise.png",
        series: "3 series",
        repetitions: "15 reps",
        majorMuscle: "Calves",
        minorMuscle: "Legs"
      }
    ]
  }
];
