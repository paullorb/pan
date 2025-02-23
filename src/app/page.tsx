import CalendarTable from './cal/calendarTable';
import Entry from './entry/entry';
import Nav from './nav/nav';
import Header from './header/header';
import styles from './aesthetics/page.module.css';
import './aesthetics/globals.css';

export default function NewCal() {
  return (
    <div className={styles.container}>
      <Nav />
      <Header />
      <main className={styles.main}>
        <CalendarTable />
        <Entry />
      </main>
    </div>
  );
}
