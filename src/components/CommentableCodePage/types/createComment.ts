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

export interface createComment_createComment {
  __typename: "Comment";
  text: string;
  _id: string;
  list: createComment_createComment_list;
}

export interface createComment {
  createComment: createComment_createComment;
}

export interface createCommentVariables {
  text: string;
  listId: string;
}
