import React from 'react'
import { ExProvider } from './exContext'
import Table from './table'

export default function AdminPage() {
  return (
    <ExProvider>
      <h1>Exercises List</h1>
      <Table />
    </ExProvider>
  )
}
