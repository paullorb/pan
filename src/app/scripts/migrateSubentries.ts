import connectDB from "../lib/mongodb"
import Entry from "../lib/models/Entry"
import SubEntry from "../lib/models/SubEntry"

async function migrate() {
  await connectDB()
  const subs = await SubEntry.find()
  for (const sub of subs) {
    const parent = await Entry.findById(sub.entryId)
    if (!parent) continue
    const exists = await Entry.findOne({ text: sub.text, parentId: sub.entryId })
    if (exists) continue
    const e = new Entry({
      date: parent.date,
      text: sub.text,
      done: sub.done,
      parentId: sub.entryId,
      userId: parent.userId,
      category: parent.category,
      completedAt: sub.done ? new Date() : undefined
    })
    await e.save()
  }
  await SubEntry.deleteMany()
  console.log("Migration complete")
  process.exit(0)
}

migrate().catch(err => {
  console.error(err)
  process.exit(1)
})
