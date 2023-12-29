import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    text: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
