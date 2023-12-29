import { config } from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./graphql/resolvers/index.js";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import mongoose from "mongoose";
import colors from "colors";

const typeDefs = loadSchemaSync("./graphql/typeDefs.graphql", {
  loaders: [new GraphQLFileLoader()],
});

const server = new ApolloServer({
  // typeDefs,
  typeDefs,
  // resolvers
  resolvers,
});

config();

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  });
  console.log(`MongoDB Connected ${conn.connection.host}`.cyan.underline.bold);
  const { url } = await startStandaloneServer(server, {
    //   context: async ({ req, res }) => {
    //     const token = req.headers.authorization || "";
    //     const user = await getUser(token);
    //     return { user };
    //   },
    listen: { port: 4000 },
  });
  console.log(`server is listening at port ${url}`);
};

connectDB();
