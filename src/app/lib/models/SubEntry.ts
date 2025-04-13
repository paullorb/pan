import { Schema, model, models } from "mongoose";

const SubEntrySchema = new Schema(
  {
    entryId: { type: Schema.Types.ObjectId, ref: "Entry", required: true },
    text: { type: String, required: true },
    done: { type: Boolean, default: false }
  }
);

export default models.SubEntry || model("SubEntry", SubEntrySchema);
