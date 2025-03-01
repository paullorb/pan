"use client";
import { FormEvent, useState, useEffect } from "react";
import styles from "./page.module.css";
import Timeline from "./timeline";
import { splits, muscleGroups, Split } from "./splitData";

export default function WorkoutSelection() {
  const [selectedSplit, setSelectedSplit] = useState<Split | null>(null);
  const [showSplits, setShowSplits] = useState(false);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    if (selectedSplit && selectedSplit.autoSelectMuscleGroups) {
      setSelectedMuscleGroups(muscleGroups);
    } else {
      setSelectedMuscleGroups([]);
    }
  }, [selectedSplit]);

  const toggleSplit = (split: Split) => {
    if (selectedSplit?.name === split.name) {
      setSelectedSplit(null);
    } else {
      setSelectedSplit(split);
      setShowSplits(false);
    }
  };

  const toggleMuscleGroup = (group: string) => {
    if (selectedSplit && selectedSplit.autoSelectMuscleGroups) return;
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const toggleWeight = (option: string) => {
    setSelectedWeight(selectedWeight === option ? "" : option);
  };

  const toggleDay = (num: number, enabled: boolean) => {
    if (!enabled) return;
    setDays(days === num ? null : num);
  };

  const enabledDays = selectedSplit ? selectedSplit.enabledDays : [1, 2, 3, 4, 5, 6, 7];
  const weightOptions = ["Free", "Machines", "Own"];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      split: selectedSplit?.name,
      muscleGroups: selectedMuscleGroups,
      weight: selectedWeight,
      day: days,
    });
  };

  return (
    <>
      <Timeline />
      <form className={styles.selectionContainer} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <div className={styles.headerRow}>
            <div className={styles.headingWithToggle}>
              <h2>Splits</h2>
              {selectedSplit && (
                <span
                  className={styles.selectedOption}
                  onClick={() => setSelectedSplit(null)}
                >
                  {selectedSplit.name}
                </span>
              )}
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowSplits((prev) => !prev)}
              >
                {showSplits ? "<" : ">"}
              </button>
            </div>
          </div>
          {showSplits && (
            <div className={styles.buttonGroup}>
              {splits.map((split) => (
                <button
                  type="button"
                  key={split.name}
                  className={styles.button}
                  onClick={() => toggleSplit(split)}
                >
                  {split.name}
                </button>
              ))}
            </div>
          )}
        </section>
        <section className={styles.section}>
          <div className={styles.headerRow}>
            <div className={styles.headingWithToggle}>
              <h2>Muscle Groups</h2>
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
                  className={
                    selectedSplit && selectedSplit.autoSelectMuscleGroups
                      ? styles.selectedButton
                      : styles.button
                  }
                  onClick={() => toggleMuscleGroup(group)}
                  disabled={!!(selectedSplit && selectedSplit.autoSelectMuscleGroups)}
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
              <h2>Weights</h2>
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
          <div className={styles.headerRow}>
            <div className={styles.headingWithToggle}>
              <h2>Days</h2>
              {days && (
                <span
                  className={styles.selectedOption}
                  onClick={() => setDays(null)}
                >
                  {days}
                </span>
              )}
            </div>
          </div>
          {days === null && (
            <div className={styles.buttonGroup}>
              {Array.from({ length: 7 }, (_, i) => i + 1).map((num) => {
                const enabled = enabledDays.includes(num);
                return (
                  <button
                    type="button"
                    key={num}
                    className={styles.button}
                    onClick={() => toggleDay(num, enabled)}
                    disabled={!enabled}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          )}
        </section>
        <section className={styles.section}>
          <button type="submit" className={styles.startButton}>
            Start Workout
          </button>
        </section>
      </form>
    </>
  );
}
