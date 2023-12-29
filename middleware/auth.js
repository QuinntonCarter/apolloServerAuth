import { AuthenticationError } from "@apollo/server";
import jwt from "jsonwebtoken";

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer")[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env._SECRET);
        return user;
      } catch {
        throw new AuthenticationError("Invalid token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]'");
  }
  throw new Error("Authorization header must be provided");
};
