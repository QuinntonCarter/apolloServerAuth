import User from "../../models/User.js";
import { ApolloError } from "apollo-server-errors";
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
      const res = await newUser.save();

      // return data to client
      return {
        //returns users's id
        id: res.id,
        // returns rest of user document
        ...res._doc,
      };
    },
    async loginUser(parentValue, { loginInput: { email, password } }) {
      // see if user exists with email
      const existingUser = User.findOne({ email });
      // Check if entered password === encrypted password on User model
      if (
        existingUser &&
        (await bcrypt.compare(password, existingUser.model))
      ) {
        // Create new JWT token
        const token = jwt.sign(
          { user_id: newUser._id, email },
          process.env._SECRET,
          {
            expiresIn: "2h",
          }
        );
        // Attach token to user model
        existingUser.token = token;
        return {
          id: existingUser.id,
          ...existingUser._doc,
        };
      } else {
        // if user doesn't exist, return error
        throw new ApolloError("Incorrect password", "INCORRECT_PASSWORD");
      }
    },
  },
  Query: {
    user: (parentValue, { ID }) => {
      return User.findById(ID);
    },
    users: (parentValue, args) => {
      return User.find();
    },
  },
};
