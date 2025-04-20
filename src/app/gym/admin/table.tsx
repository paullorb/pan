'use client'
import { useEx } from "./exContext"
import { useState } from 'react'

export default function Table() {
  const { defs, add, update, remove } = useEx()
  const empty = { name:'', mainMuscle:'', type:'', bestPractice:'', keyMovement:'', color:'' }
  const [newEx, setNew] = useState(empty)
  if (!defs) return <div>Loading…</div>

  return (
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
        <tr>
          {Object.entries(newEx).map(([k,v])=>(
            <td key={k}>
              <input
                placeholder={k}
                value={v}
                onChange={ev => setNew({ ...newEx, [k]: ev.target.value })}
              />
            </td>
          ))}
          <td><button onClick={() => { add(newEx); setNew(empty) }}>Add</button></td>
        </tr>
      </tbody>
    </table>
  )
}