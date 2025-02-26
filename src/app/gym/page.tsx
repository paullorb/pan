"use client";
import { useRef } from "react";
import ExerciseCard from "./exerciseCard";
import { workouts } from "./workoutData";
import styles from "./page.module.css";

export default function GymPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const workout = workouts[0];
  return (
    <div className={styles.container}>
      <h1>{workout.title} Workout</h1>
      <div ref={containerRef} className={styles.scrollContainer}>
        {workout.exercises.map((exercise) => (
          <div key={exercise.id} className={styles.cardWrapper}>
            <ExerciseCard exercise={exercise} />
          </div>
        ))}
      </div>
    </div>
  );
}
