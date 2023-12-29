import { messageResolvers } from "./messages.js";
import { userResolvers } from "./users.js";

const resolvers = {
  Query: {
    ...messageResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...messageResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};

export default resolvers;
