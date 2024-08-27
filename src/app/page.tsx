// page.tsx
import style from './page.module.css';
import Hours from './components/hours'; // Import the new component

function getTomorrow(): string {
  const today = new Date();  
  const tomorrow = new Date(today);  
  tomorrow.setDate(today.getDate() + 1);  

  return tomorrow.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function Home() {
  return (
    <div className={style.container}>
        <div className={style.introduction}><h1 className={style.intro}>🍞 {getTomorrow()}</h1></div>
      <div className={style.tables}>
      <Hours from={5} until={20} />
        <div className={style.aside}>
          <div className={style.priorities}>
            <div className={style.title}>PRIORITIES</div>
            <div className={style.priority}>1</div>
            <div className={style.priority}>2</div>
            <div className={style.priority}>3</div>
          </div>
          <div className={style.open}>
            <div className={style.title}>OPEN</div>
            <div className={style.opened}>🍞 Cable barberas</div>
            <div className={style.opened}>🍞 Steuererklärung</div>
          </div>
          <div className={style.notes}>
            <div className={style.title}>NOTES</div>
            <div className={style.noted}>🍞</div>
          </div>
        </div>
      </div>
    </div>
  );
}
