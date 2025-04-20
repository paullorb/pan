'use client'
import { useEx } from './exContext'
import { useState } from 'react'
import Modal from './modal'
import styles from './table.module.css'

export default function Table() {
  const { defs, add, update, remove } = useEx()
  const empty = { name:'', mainMuscle:'', type:'', bestPractice:'', keyMovement:'', color:'' }
  const [newEx, setNew] = useState(empty)
  const [show, setShow] = useState(false)
  if (!defs) return <div>Loading…</div>

  return (
    <>
      <button className={styles.tableButton} onClick={() => setShow(true)}>Add Exercise</button>
      <table>
        <thead>
          <tr>
            {Object.keys(empty).map(k => <th key={k}>{k}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {defs.map(e => (
            <tr key={e._id}>
              {Object.entries(e).filter(([k])=>k!=='_id').map(([k,v])=>(
                <td key={k}>
                  <input
                    value={v as string}
                    onChange={ev => update(e._id, { [k]: ev.target.value })}
                  />
                </td>
              ))}
              <td><button onClick={() => remove(e._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={show} onClose={() => setShow(false)}>
        <h2>Add Exercise</h2>
        {Object.entries(newEx).map(([k,v])=>(
          <div key={k}>
            <input
              placeholder={k}
              value={v}
              onChange={ev => setNew({ ...newEx, [k]: ev.target.value })}
            />
          </div>
        ))}
        <button onClick={() => { add(newEx); setNew(empty); setShow(false) }}>
          Save
        </button>
      </Modal>
    </>
  )
}
