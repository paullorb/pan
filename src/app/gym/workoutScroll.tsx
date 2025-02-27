"use client";
import { useRef } from "react";
import ExerciseCard from "./exerciseCard";
import { Exercise } from "./workoutData";
import styles from "./page.module.css";

interface WorkoutScrollProps {
  exercises: Exercise[];
}

export default function WorkoutScroll({ exercises }: WorkoutScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={styles.scrollContainer}>
      {exercises.map((exercise) => (
        <div key={exercise.id} className={styles.cardWrapper}>
          <ExerciseCard exercise={exercise} />
        </div>
      ))}
    </div>
  );
}
