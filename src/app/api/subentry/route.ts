import SubEntry from "../../lib/models/SubEntry";
import dbConnect from "../../lib/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get("entryId");
  await dbConnect();
  const subEntries = await SubEntry.find({ entryId });
  return new Response(JSON.stringify({ subEntries }), { status: 200 });
}

export async function POST(request: Request) {
  await dbConnect();
  const { entryId, text } = await request.json();
  const subEntry = await SubEntry.create({ entryId, text, done: false });
  return new Response(JSON.stringify({ subEntry }), { status: 201 });
}

export async function PATCH(request: Request) {
  await dbConnect();
  const { subEntryId } = await request.json();
  const subEntry = await SubEntry.findById(subEntryId);
  if (!subEntry) return new Response("Subentry not found", { status: 404 });
  subEntry.done = !subEntry.done;
  await subEntry.save();
  return new Response(JSON.stringify({ subEntry }), { status: 200 });
}
