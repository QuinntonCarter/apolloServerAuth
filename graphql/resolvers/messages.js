import Message from "../../models/Message.js";
import { ApolloError } from "apollo-server-errors";

export const messageResolvers = {
  Mutation: {
    async createMessage(parentValue, { messageInput: { text, userId } }) {
      // create new message
      const newMessage = new Message({
        text: text,
        userId: userId,
      });

      // save to db
      const res = await newMessage.save();

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
    async message(parentValue, { ID }) {
      // sometheing wrong w this query **
      // #
      // const res = Message.findById(ID);
      // console.log("message", res);
      // if (!res) {
      //   throw new ApolloError("Message not found");
      // } else {
      //   return res;
      // }
      // ##
    },
    async messages(parentValue, args) {
      const res = await Message.find();
      return res;
    },
  },
};
