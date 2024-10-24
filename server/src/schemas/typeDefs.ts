import gql from "graphql-tag";

const typeDefs = gql`
  type Book {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String  
  }

  type User {
    id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }
  
  input UserInput {
    username: String!
    email: String!
    password: String!
    savedBooks: [BookInput]
  }

  input BookInput {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }
  
  type Query{
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(input: UserInput!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;