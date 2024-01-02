import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

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
      const res = await newUser.save();

      // return data to client
      return {
        id: res._doc._id,
        ...res._doc,
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
        await existingUser.populate("messages");
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
    async logoutUser(parentValue, { logoutInput: { id } }) {
      // find user by ID and set token to null
      const loggedOutUser = await User.findOneAndUpdate(
        { _id: id },
        {
          $unset: {
            token: null,
          },
        }
      );
      // remove password from user doc before return
      const { password, ...restOfUser } = loggedOutUser._doc;
      // error handle if no user doc returned
      if (!loggedOutUser) {
        throw new ApolloError(
          `Error logging out user ${id}, please reload and try again`
        );
      } else {
        // return user doc without password
        return restOfUser;
      }
    },
  },
  Query: {
    async user(parentValue, { id }) {
      // find user by args.id/id
      const user = await User.findOne({ _id: id }).populate("messages");
      // if no user found, throw error
      if (!user) {
        throw new ApolloError("User not found");
      } else {
        return user;
      }
    },
    async users(parentValue, args) {
      // find all users
      const users = await User.find().populate("messages");
      // return users
      return users;
    },
  },
};
