import { Schema, model, InferSchemaType } from "mongoose";
export const RUN_STATUSES = [
  "queued",
  "in_progress",
  "success",
  "failure",
] as const;
export type RunStatus = (typeof RUN_STATUSES)[number];
const runSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    runNumber: { type: Number, required: true },
    workflowName: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    commitSha: { type: String, required: true, minlength: 7, maxlength: 40 },
    commitMessage: { type: String, default: "" },
    actor: { type: String, default: "unknown" },
    status: {
      type: String,
      enum: RUN_STATUSES,
      required: true,
      default: "queued",
    },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date },
    durationMs: { type: Number, min: 0 },
  },
  { timestamps: true },
);
// Makes "this project's runs, newest first" fast.
runSchema.index({ project: 1, startedAt: -1 });
export type RunDoc = InferSchemaType<typeof runSchema>;
export const Run = model("Run", runSchema);
