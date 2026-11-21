import { Schema, model, InferSchemaType } from "mongoose";
const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    repoFullName: { type: String, required: true, unique: true, trim: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);
export type ProjectDoc = InferSchemaType<typeof projectSchema>;
export const Project = model("Project", projectSchema);
