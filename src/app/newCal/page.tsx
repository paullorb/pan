import Calendar from "app/components/UI/cal/calendar";
import styles from "./page.module.css";
import WeekdayDisplay from "app/components/UI/cal/weekDayDisplay";
import DayNavigation from "app/components/UI/cal/dayNavigation";
import MonthNavigation from "app/components/UI/cal/monthNavigation";
import CalendarTable from "app/components/UI/cal/calendarTable";

export default function NewCal () {
  return (
    <div className={styles.container}>
      <Calendar />

    </div>
  )
}