"use client";
import { FormEvent, useState } from "react";
import styles from "./page.module.css";
import { muscleGroups } from "./splitData";

export default function WorkoutSelection() {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedWeight, setSelectedWeight] = useState("");

  const toggleMuscleGroup = (group: string) =>
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );

  const toggleWeight = (option: string) =>
    setSelectedWeight(selectedWeight === option ? "" : option);

  const weightOptions = ["Free", "Machines", "Own"];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      muscleGroups: selectedMuscleGroups,
      weight: selectedWeight,
    });
  };

  return (
    <form className={styles.selectionContainer} onSubmit={handleSubmit}>
      <section className={styles.section}>
        <div className={styles.headerRow}>
          <div className={styles.headingWithToggle}>
            <label
              className={styles.clickableHeading}
              onClick={() => setSelectedMuscleGroups([])}
            >
              Muscle Groups
            </label>
            {selectedMuscleGroups.length > 0 && (
              <span
                className={styles.selectedOption}
                onClick={() => setSelectedMuscleGroups([])}
              >
                {selectedMuscleGroups.join(", ")}
              </span>
            )}
          </div>
        </div>
        {selectedMuscleGroups.length === 0 && (
          <div className={styles.buttonGroup}>
            {muscleGroups.map((group) => (
              <button
                type="button"
                key={group}
                className={styles.button}
                onClick={() => toggleMuscleGroup(group)}
              >
                {group}
              </button>
            ))}
          </div>
        )}
      </section>
      <section className={styles.section}>
        <div className={styles.headerRow}>
          <div className={styles.headingWithToggle}>
            <label
              className={styles.clickableHeading}
              onClick={() => setSelectedWeight("")}
            >
              Weights
            </label>
            {selectedWeight && (
              <span
                className={styles.selectedOption}
                onClick={() => setSelectedWeight("")}
              >
                {selectedWeight}
              </span>
            )}
          </div>
        </div>
        {!selectedWeight && (
          <div className={styles.buttonGroup}>
            {weightOptions.map((option) => (
              <button
                type="button"
                key={option}
                className={styles.button}
                onClick={() => toggleWeight(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </section>
      <section className={styles.section}>
        <button type="submit" className={styles.startButton}>
          Start Workout
        </button>
      </section>
    </form>
  );
}
