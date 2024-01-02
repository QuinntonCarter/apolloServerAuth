import { ApolloError } from "apollo-server-errors";
import Message from "../../models/Message.js";
import User from "../../models/User.js";

export const messageResolvers = {
  Mutation: {
    async createMessage(parentValue, { messageInput: { text, user } }) {
      // create new message
      const newMessage = new Message({
        text: text,
        user: user,
      });

      // save to db
      const res = await newMessage.save();

      // add message to submitting user's message array
      await User.findOneAndUpdate(
        { _id: user },
        {
          $push: {
            messages: res,
          },
        },
        {
          new: true,
        }
      );

      // populate user field via ref id for return
      await res.populate("user");

      // return applicable data
      return {
        //returns message id
        id: res._doc._id,
        // returns rest of message document
        ...res._doc,
      };
    },
  },
  Query: {
    async message(parentValue, { id }) {
      // find doc by ID and populate user field
      const res = Message.findById(id).populate("user");

      if (!res) {
        throw new ApolloError("Message not found");
      } else {
        return res;
      }
    },
    async messages(parentValue, args) {
      // find doc and populate user field
      const res = await Message.find().populate("user");

      return res;
    },
  },
};
