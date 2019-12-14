/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createComment
// ====================================================

export interface createComment_createComment_list {
  __typename: "CommentList";
  _id: string;
}

export interface createComment_createComment_author {
  __typename: "User";
  name: string;
  avatarUrl: string | null;
  githubId: string | null;
}

export interface createComment_createComment {
  __typename: "Comment";
  text: string;
  _id: string;
  list: createComment_createComment_list;
  lineNumber: number | null;
  selectedText: string | null;
  author: createComment_createComment_author | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface createComment {
  createComment: createComment_createComment;
}

export interface createCommentVariables {
  text: string;
  listId: string;
  lineNumber?: number | null;
  selectedText?: string | null;
}
