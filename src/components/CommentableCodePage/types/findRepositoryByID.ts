/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: findRepositoryByID
// ====================================================

export interface findRepositoryByID_findRepositoryByID_documentsList_data_commentsList_data_comments_data {
  __typename: "Comment";
  _id: string;
  text: string;
}

export interface findRepositoryByID_findRepositoryByID_documentsList_data_commentsList_data_comments {
  __typename: "CommentPage";
  data: (findRepositoryByID_findRepositoryByID_documentsList_data_commentsList_data_comments_data | null)[];
}

export interface findRepositoryByID_findRepositoryByID_documentsList_data_commentsList_data {
  __typename: "CommentList";
  _id: string;
  comments: findRepositoryByID_findRepositoryByID_documentsList_data_commentsList_data_comments;
}

export interface findRepositoryByID_findRepositoryByID_documentsList_data_commentsList {
  __typename: "CommentListPage";
  data: (findRepositoryByID_findRepositoryByID_documentsList_data_commentsList_data | null)[];
}

export interface findRepositoryByID_findRepositoryByID_documentsList_data {
  __typename: "Document";
  _id: string;
  title: string;
  commentsList: findRepositoryByID_findRepositoryByID_documentsList_data_commentsList;
}

export interface findRepositoryByID_findRepositoryByID_documentsList {
  __typename: "DocumentPage";
  data: (findRepositoryByID_findRepositoryByID_documentsList_data | null)[];
}

export interface findRepositoryByID_findRepositoryByID {
  __typename: "Repository";
  _id: string;
  title: string;
  documentsList: findRepositoryByID_findRepositoryByID_documentsList;
}

export interface findRepositoryByID {
  findRepositoryByID: findRepositoryByID_findRepositoryByID | null;
}
