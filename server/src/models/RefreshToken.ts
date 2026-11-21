import { Schema, model } from "mongoose";
const refreshTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    userAgent: { type: String, maxlength: 200 },
  },
  { timestamps: true },
);
// A TTL index: MongoDB automatically deletes each document once expiresAthas passed.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RefreshToken = model("RefreshToken", refreshTokenSchema);
