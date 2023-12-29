import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    text: {
      type: String,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
