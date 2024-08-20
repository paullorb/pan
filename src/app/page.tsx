import style from './page.module.css'

export default function Home() {
  return (
    <div className={style.container}>
      <div className={style.title}>
        <h1 className={style.intro}>🍞 de 17.08.2024</h1>
        <div className={style.tables}>
        <div className={style.hourly}>
          <div className={style.frame}>
            <div className={style.hour}>0:00</div>
            <div className={style.events}>
              <div className={style.event}>🍞</div>
              <div className={style.event}>🍞</div>
            </div>
          </div>
          <div className={style.frame}>
            <div className={style.hour}>1:00</div>
            <div className={style.events}>
              <div className={style.event}>🍞</div>
              <div className={style.event}>🍞</div>
            </div>
          </div>
          <div className={style.frame}>
            <div className={style.hour}>2:00</div>
            <div className={style.events}>
              <div className={style.event}>🍞</div>
              <div className={style.event}>🍞</div>
            </div>
          </div>
          <div className={style.frame}>
            <div className={style.hour}>3:00</div>
            <div className={style.events}>
              <div className={style.event}>🍞</div>
              <div className={style.event}>🍞</div>
            </div>
          </div>
          <div className={style.frame}>
            <div className={style.hour}>4:00</div>
            <div className={style.events}>
              <div className={style.event}>🍞</div>
              <div className={style.event}>🍞</div>
            </div>
          </div>
          <div className={style.frame}>
            <div className={style.hour}>5:00</div>
            <div className={style.events}>
              <div className={style.event}>🍞</div>
              <div className={style.event}>🍞</div>
            </div>
          </div>
          <div className={style.frame}>
            <div className={style.hour}>6:00</div>
            <div className={style.events}>
              <div className={style.event}>🍞</div>
              <div className={style.event}>🍞</div>
            </div>
          </div>
          <div className={style.frame}>
            <div className={style.hour}>7:00</div>
            <div className={style.events}>
              <div className={style.event}>🍞</div>
              <div className={style.event}>🍞</div>
            </div>
          </div>
          <div className={style.frame}>
            <div className={style.hour}>8:00</div>
            <div className={style.events}>
              <div className={style.event}>🍞</div>
              <div className={style.event}>🍞</div>
            </div>
          </div>
        </div>
        <div className={style.aside}>
          <div className={style.priorities}>
            <div className={style.prio}>PRIORITIES</div>
            <div className={style.priority}>1</div>
            <div className={style.priority}>2</div>
            <div className={style.priority}>3</div>
            </div>
            <div className={style.open}>
              <div className={style.opening}>OPEN</div>
              <div className={style.opened}>🍞</div>
            </div>
            <div className={style.notes}>
              <div className={style.noting}>NOTES</div>
              <div className={style.noted}>🍞</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
