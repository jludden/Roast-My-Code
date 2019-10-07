/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateRepoWithDocsAndComments
// ====================================================

export interface CreateRepoWithDocsAndComments_createRepository_documentsList_data_commentsList_data_comments_data {
  __typename: "Comment";
  _id: string;
  text: string;
}

export interface CreateRepoWithDocsAndComments_createRepository_documentsList_data_commentsList_data_comments {
  __typename: "CommentPage";
  data: (CreateRepoWithDocsAndComments_createRepository_documentsList_data_commentsList_data_comments_data | null)[];
}

export interface CreateRepoWithDocsAndComments_createRepository_documentsList_data_commentsList_data {
  __typename: "CommentList";
  comments: CreateRepoWithDocsAndComments_createRepository_documentsList_data_commentsList_data_comments;
}

export interface CreateRepoWithDocsAndComments_createRepository_documentsList_data_commentsList {
  __typename: "CommentListPage";
  data: (CreateRepoWithDocsAndComments_createRepository_documentsList_data_commentsList_data | null)[];
}

export interface CreateRepoWithDocsAndComments_createRepository_documentsList_data {
  __typename: "Document";
  title: string;
  commentsList: CreateRepoWithDocsAndComments_createRepository_documentsList_data_commentsList;
}

export interface CreateRepoWithDocsAndComments_createRepository_documentsList {
  __typename: "DocumentPage";
  data: (CreateRepoWithDocsAndComments_createRepository_documentsList_data | null)[];
}

export interface CreateRepoWithDocsAndComments_createRepository {
  __typename: "Repository";
  _id: string;
  title: string;
  documentsList: CreateRepoWithDocsAndComments_createRepository_documentsList;
}

export interface CreateRepoWithDocsAndComments {
  createRepository: CreateRepoWithDocsAndComments_createRepository;
}
