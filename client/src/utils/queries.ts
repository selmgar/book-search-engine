import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Query {
    me {
      username
      email
      id
      savedBooks {
        description
        bookId
        title
        authors
        image
        link
      }
      bookCount
    }
  }
`;