
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
      if (context.user) {
        const user = await User.findOne({ _id: context.user.id }).populate('savedBooks'); 
        return user;
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; user: User }> => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }): Promise<{ token: string; user: User }> => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: any, { input }: { input: Book }, context: Context): Promise<User | null> => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user.id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        
        return updatedUser;
      }
      return null;
    },
    deleteBook: async (_parent: any, { bookId }: { bookId: string }, context: Context): Promise<User | null> => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user.id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      return null;
    }
  }
};

export default resolvers;
