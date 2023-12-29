import Message from "../../models/Message.js";

export const messageResolvers = {
  Mutation: {
    async createMessage(parentValue, { messageInput: { text, username } }) {
      const newMessage = new Message({
        text: text,
        createdBy: username,
      });
      const res = await newMessage.save();
      return {
        //returns message id
        id: res.id,
        // returns rest of message document
        ...res._doc,
      };
    },
  },
  Query: {
    getMsg: (parentValue, { ID }) => Message.findById(ID),
  },
};
