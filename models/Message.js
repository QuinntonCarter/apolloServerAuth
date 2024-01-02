import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    text: {
      type: String,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: false,
    },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
