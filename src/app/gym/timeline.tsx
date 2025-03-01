"use client";
import { WEEKDAY_NAMES_FULL } from "../cal/utils";
import styles from "./timeline.module.css";

export default function Timeline() {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineItems}>
        {days.map((day, index) => (
          <div key={day.toDateString()} className={styles.timelineItem}>
            <div className={styles.text}>
              {index === 0
                ? `${day.getDate().toString().padStart(2, "0")}/${(day.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}`
                : WEEKDAY_NAMES_FULL[day.getDay()].substring(0, 2)}
            </div>
            <div className={styles.circle} />
          </div>
        ))}
      </div>
    </div>
  );
}
