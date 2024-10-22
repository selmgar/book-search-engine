import User from "../models/User.js";
import { AuthenticationError, signToken } from "../services/auth.js";

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: Book[];
  bookCount: number;
}

interface Book {
  authors: string[];
  description: string;
  bookId: string;
  image: string;
  link: string;
  title: string;
}

interface Context {
  user?: User;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      console.log('test', context.user);
      if (context.user) {
        const user = await User.findOne({ _id: context.user.id });
        return user;
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; user: User }> => {
      const user = await User.findOne({ email });
      console.log('Found user', user);
      if (!user) {
        throw AuthenticationError;
      }
      // TODO ASK LIEF ABOUT THIS - THE BELOW CODE IS NOT WORKING AS EXPECTED
      // const correctPw = await user.isCorrectPassword(password);
      // console.log('Password is correct', correctPw);
      // if (!correctPw) {
      //   throw AuthenticationError;
      // }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }): Promise<{ token: string; user: User }> => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    }
  },

};

export default resolvers;
