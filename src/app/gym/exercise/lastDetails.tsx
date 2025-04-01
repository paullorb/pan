"use client";

import styles from "./lastDetails.module.css";

type LastDetailsProps = {
  exerciseType: string;
  lastDetails: { reps?: string; weight?: string; time?: string; intensity?: string } | null;
};

export default function LastDetails({ exerciseType, lastDetails }: LastDetailsProps) {
  if (!lastDetails) return null;

  return (
    <div className={styles.container}>
      {exerciseType === "weight" ? (
        <>
          <div className={styles.value}>{lastDetails.reps} reps</div>
          <div className={styles.value}>{lastDetails.weight} kg</div>
        </>
      ) : exerciseType === "cardio" ? (
        <>
          <div className={styles.value}>{lastDetails.time} min</div>
          <div className={styles.value}>{lastDetails.intensity} speed</div>
        </>
      ) : null}
    </div>
  );
}
