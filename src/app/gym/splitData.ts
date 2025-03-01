export interface Split {
  name: string;
  autoSelectMuscleGroups: boolean;
  enabledDays: number[]; 
  weightTypes: string[]; 
}

export const splits: Split[] = [
  {
    name: "Push & Pull",
    autoSelectMuscleGroups: true,
    enabledDays: [1, 2, 3, 4, 5, 6, 7],
    weightTypes: ["Free", "Machines"],
  },
  {
    name: "Arnold Split",
    autoSelectMuscleGroups: true,
    enabledDays: [6],
    weightTypes: ["Free", "Machines"],
  },
  {
    name: "Full Body",
    autoSelectMuscleGroups: true,
    enabledDays: [1, 2, 3, 4, 5, 6, 7],
    weightTypes: ["Free", "Machines"],
  },
];

export const muscleGroups = ["Chest", "Back", "Arms", "Abdominals", "Legs", "Shoulders"];
