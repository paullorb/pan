import style from './opens.module.css';

const openTasks = [
  { id: 1, text: '🍞 Cable barberass' },
  { id: 2, text: '🍞 Staubsaugen' },
  { id: 3, text: '🍞 Fahrrad in die Werkstatt' },
  { id: 4, text: '🍞 Pasaporte holen' },
  { id: 5, text: '🍞 Notizen übertragen' },
  { id: 6, text: '🍞 Linkedin Post' },
  { id: 7, text: '🍞 Mieterverein' },
  { id: 8, text: '🍞 Fenster putzen' },
  { id: 9, text: '🍞 Wände streichen' }
];

export default function Opens() {
  return (
    <div className={style.opens}>
      <div className={style.title}>OPEN</div>
      {openTasks.map(task => (
        <div key={task.id} className={style.open}>
          {task.text}
        </div>
      ))}
    </div>
  );
}
