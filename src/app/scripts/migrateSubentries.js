// scripts/migrateSubentries.js
require("dotenv").config();
const mongoose = require("mongoose");

async function migrate() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_CLUSTER, MONGODB_DB } = process.env;
  if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_CLUSTER || !MONGODB_DB) {
    console.error(
      "❌ Missing one of MONGODB_USER, MONGODB_PASSWORD, MONGODB_CLUSTER, or MONGODB_DB in your environment."
    );
    process.exit(1);
  }

  const username = encodeURIComponent(MONGODB_USER);
  const pwd = encodeURIComponent(MONGODB_PASSWORD);
  const uri = `mongodb+srv://${username}:${pwd}@${MONGODB_CLUSTER}/${MONGODB_DB}?retryWrites=true&w=majority`;

  console.log("🔌 Connecting to MongoDB…");
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("✅ Connected.");

  // Inline schemas (use your real collection names here)
  const entrySchema = new mongoose.Schema({
    date: String,
    text: String,
    category: String,
    done: Boolean,
    completedAt: Date,
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Entry", default: null },
    userId: mongoose.Schema.Types.ObjectId,
  });
  const subEntrySchema = new mongoose.Schema({
    entryId: { type: mongoose.Schema.Types.ObjectId, ref: "Entry" },
    text: String,
    done: Boolean,
  });

  const Entry = mongoose.model("Entry", entrySchema, "entries");
  const SubEntry = mongoose.model("SubEntry", subEntrySchema, "subentries");

  const subs = await SubEntry.find().lean();
  console.log(`📦 Found ${subs.length} subentries.`);

  for (let i = 0; i < subs.length; i++) {
    const sub = subs[i];
    console.log(`🔄 [${i + 1}/${subs.length}] Processing subEntry ${sub._id}`);

    const parent = await Entry.findById(sub.entryId).lean();
    if (!parent) {
      console.warn(`⚠️ Parent entry ${sub.entryId} not found; skipping.`);
      continue;
    }

    // avoid duplicates
    const exists = await Entry.findOne({ text: sub.text, parentId: sub.entryId }).lean();
    if (exists) {
      console.log(`↩️ Entry already exists for "${sub.text}"; skipping.`);
      continue;
    }

    await Entry.create({
      date: parent.date,
      text: sub.text,
      done: sub.done,
      parentId: sub.entryId,
      userId: parent.userId,
      category: parent.category,
      completedAt: sub.done ? new Date() : undefined,
    });
  }

  console.log("🗑️ Deleting old SubEntry documents…");
  await SubEntry.deleteMany();
  console.log("✅ Old subentries removed.");

  console.log("🔌 Disconnecting from MongoDB…");
  await mongoose.disconnect();
  console.log("🎉 Migration complete!");
}

migrate().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
