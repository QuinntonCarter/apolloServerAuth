import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      default: null,
      unique: true,
    },
    email: {
      type: String,
      default: null,
      unique: true,
    },
    password: { type: String },
    messages: {
      type: [Schema.Types.ObjectId],
      ref: "Message",
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
