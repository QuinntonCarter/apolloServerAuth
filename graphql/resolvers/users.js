import User from "../../models/User.js";
import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userResolvers = {
  Mutation: {
    async registerUser(
      parentValue,
      { registerInput: { username, email, password } }
    ) {
      // see if an old user exists with email attempting to registerInput
      const existingUser = await User.findOne({ email });
      // throw error if that user exists
      if (existingUser) {
        throw new ApolloError(
          `USER_ALREADY_EXISTS`,
          `Email ${email} already in use`
        );
      }
      // encrypt password
      var encryptedPassword = await bcrypt.hash(password, 10);

      // build out mongoose model
      const newUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      // create JWT
      const token = jwt.sign(
        { user_id: newUser._id, email },
        process.env._SECRET,
        {
          expiresIn: "2h",
        }
      );
      // and attach to User model
      newUser.token = token;

      // save newUser to MongoDB
      const { _doc } = await newUser.save();

      // return data to client
      return {
        id: _doc._id,
        ..._doc,
      };
    },
    async loginUser(parentValue, { loginInput: { email, password } }) {
      // see if user exists with email
      const existingUser = await User.findOne({ email });
      // Check if entered password === encrypted password on User model
      if (
        existingUser &&
        (await bcrypt.compare(password, existingUser.password))
      ) {
        // Create new JWT token
        const token = jwt.sign(
          { user_id: existingUser._id, email },
          process.env._SECRET,
          {
            expiresIn: "2h",
          }
        );

        // Attach token to user model
        existingUser.token = token;
        return {
          id: existingUser._doc._id,
          ...existingUser._doc,
        };
      } else {
        // if user doesn't exist, return error
        throw new ApolloError("Incorrect password", "INCORRECT_PASSWORD");
      }
    },
  },
  Query: {
    async user(parentValue, { id }) {
      const user = await User.findById(id);
      if (!user) {
        throw new ApolloError("User not found");
      } else {
        return user;
      }
    },
    async users(parentValue, args) {
      const users = await User.find();
      return users;
    },
  },
};
