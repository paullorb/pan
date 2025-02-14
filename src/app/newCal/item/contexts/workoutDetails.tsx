"use client";
import React, { useState, useEffect } from "react";
import { useItems } from "../itemContext";

interface WorkoutDetailsProps {
  date: string;
  index: number;
  initialIntensity: string;
  initialReps: string;
}

const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({ date, index, initialIntensity, initialReps }) => {
  const { updateItemWorkoutDetails } = useItems();
  const [intensityOrWeight, setIntensityOrWeight] = useState(initialIntensity);
  const [repsAndSeries, setRepsAndSeries] = useState(initialReps);

  useEffect(() => {
    updateItemWorkoutDetails(date, index, { intensityOrWeight, repsAndSeries });
  }, [intensityOrWeight, repsAndSeries, date, index, updateItemWorkoutDetails]);

  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
      <input
        type="text"
        value={intensityOrWeight}
        onChange={(e) => setIntensityOrWeight(e.target.value)}
        placeholder="Intensity/Weight"
      />
      <input
        type="text"
        value={repsAndSeries}
        onChange={(e) => setRepsAndSeries(e.target.value)}
        placeholder="Reps/Series"
      />
    </div>
  );
};

export default WorkoutDetails;
