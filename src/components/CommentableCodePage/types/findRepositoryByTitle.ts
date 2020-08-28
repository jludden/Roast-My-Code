/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: findRepositoryByTitle
// ====================================================

export interface User {
// export interface findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data_author {
  __typename: "User";
  name: string;
  uid: number;
  avatar: number | undefined;
}

export interface findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data {
  __typename: "Comment";
  _id: string;
  text: string;
  lineNumber: number | null;
  selectedText: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  author: User | null;
  // author: findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data_author | null;
}
export default findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data;

export interface findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments {
  __typename: "CommentPage";
  data: (findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data | null)[];
}

export interface findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data {
  __typename: "CommentList";
  _id: string;
  comments: findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments;
}

export interface findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList {
  __typename: "CommentListPage";
  data: (findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data | null)[];
}

export interface findRepositoryByTitle_findRepositoryByTitle_documentsList_data {
  __typename: "Document";
  _id: string;
  title: string;
  commentsList: findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList;
}

export interface findRepositoryByTitle_findRepositoryByTitle_documentsList {
  __typename: "DocumentPage";
  data: (findRepositoryByTitle_findRepositoryByTitle_documentsList_data | null)[];
}

export interface findRepositoryByTitle_findRepositoryByTitle {
  __typename: "Repository";
  _id: string;
  title: string;
  documentsList: findRepositoryByTitle_findRepositoryByTitle_documentsList;
}

export interface findRepositoryByTitle {
  findRepositoryByTitle: findRepositoryByTitle_findRepositoryByTitle | null;
}

// export interface findRepositoryByTitleVariables {
//   repoTitle: string;
// }
