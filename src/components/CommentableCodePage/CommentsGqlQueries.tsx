import * as React from 'react';
import { Collapse } from 'react-collapse';
import { githubClient } from '../../App';
import ApolloClient, { gql, ExecutionResult } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
    findRepositoryByTitle,
    // eslint-disable-next-line @typescript-eslint/camelcase
    findRepositoryByTitle_findRepositoryByTitle,
    // eslint-disable-next-line @typescript-eslint/camelcase
    findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data,
} from './types/findRepositoryByTitle';
import { createComment as createCommentType } from './types/createComment';
import { deleteComment as deleteCommentType } from './types/deleteComment';
import { deleteCommentMutation, createCommentMutation, findCommentsForRepoQuery } from './GraphQL/CommentsGraphQL';
import {
    Section,
    Title,
    Tag,
    Container,
    Input,
    Button,
    Block,
    Help,
    Control,
    Delete,
    Field,
    Panel,
    Checkbox,
    Icon,
    Progress,
} from 'rbx';

function FindCommentList(
    data: findRepositoryByTitle | null,
    documentId: string,
    commentListId: string,
    // eslint-disable-next-line @typescript-eslint/camelcase
): (findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data | null)[] | null {
    if (
        data &&
        data.findRepositoryByTitle &&
        data.findRepositoryByTitle.documentsList &&
        data.findRepositoryByTitle.documentsList.data &&
        data.findRepositoryByTitle.documentsList.data.find(x => x && x._id === documentId)
    ) {
        const document = data.findRepositoryByTitle.documentsList.data.find(x => x && x._id === documentId);
        if (document) {
            const commentList = document.commentsList.data.find(y => y && y._id === commentListId);
            if (commentList && commentList.comments) {
                return commentList.comments.data;
            }
        }
    }
    return null;
}

export const RepoCommentsListDisplayWithDelete = ({
    documentId,
    commentListId,
    data,
}: {
    documentId: string;
    commentListId: string;
    data: FindRepoResults;
}) => {
    const [mutate] = useMutation(deleteCommentMutation);
    const repoTitle = data.currentRepoTitle;
    return (
        <RepoCommentsListDisplay
            data={data}
            deleteComment={(comment: Comment) =>
                mutate({
                    variables: { id: comment._id },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        deleteComment: {
                            __typename: 'Comment',
                            _id: comment._id,
                        },
                    },
                    update: (cache, { data: { deletedComment } }) => {
                        const data = cache.readQuery<FindRepoResults>({
                            query: findCommentsForRepoQuery,
                            variables: { repoTitle },
                        });

                        const commentList = FindCommentList(data, documentId, commentListId);
                        if (commentList) {
                            commentList.splice(commentList.indexOf(deletedComment), 1);
                        }

                        cache.writeQuery({
                            query: findCommentsForRepoQuery,
                            data: data,
                        });
                    },
                })
            }
        />
    );
};

export const AddComment = ({
    documentId,
    commentListId,
    repoTitle,
}: {
    documentId: string;
    commentListId: string;
    repoTitle: string;
}) => {
    const [mutate] = useMutation(createCommentMutation);

    return (
        <AddCommentInput
            list={commentListId}
            submit={(finalListId: string, commentContent: string) =>
                mutate({
                    variables: { text: commentContent, listId: finalListId },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        createComment: {
                            __typename: 'Comment',
                            text: commentContent,
                            _id: '' + Math.round(Math.random() * -1000000),
                            list: {
                                _id: finalListId,
                            },
                        },
                    },
                    update: (cache, { data: { createComment } }) => {
                        // Read the data from our cache for this query.

                        const data = cache.readQuery<FindRepoResults>({
                            query: findCommentsForRepoQuery,
                            variables: { repoTitle },
                        });

                        const commentList = FindCommentList(data, documentId, commentListId);
                        if (commentList) {
                            commentList.push(createComment);
                        }
                        cache.writeQuery({
                            query: findCommentsForRepoQuery,
                            data: data,
                        });
                    },
                })
            }
        />
    );
};

export const AddCommentInput = ({
    list,
    submit,
}: {
    list: string;
    submit: (list: string, commentContent: string) => Promise<ExecutionResult<any>>;
}) => {
    let input: HTMLInputElement | null = null;

    return (
        <div>
            <span>Add Comment to Comment List</span>
            <input
                ref={node => {
                    input = node;
                }}
            />
            <Button onClick={() => submit(list, input ? input.value : 'ADD COMMENT MUTATION TEST')}>ADD TO LIST</Button>
        </div>
    );
};

interface Comment {
    _id: string;
    text: string;
}

export interface FindRepoResults {
    currentRepoTitle: string;
    // eslint-disable-next-line @typescript-eslint/camelcase
    findRepositoryByTitle: findRepositoryByTitle_findRepositoryByTitle;
}

export const RepoCommentsListDisplay = ({
    data,
    deleteComment,
}: {
    data: FindRepoResults;
    deleteComment: (comment: Comment) => Promise<ExecutionResult<any>>;
}) => {
    const [expanded, setExpanded] = React.useState(false);
    return (
        <div>
            <span onClick={() => setExpanded(!expanded)}>Repo-Doc-CommentList-Comments: (toggle)</span>
            <Collapse isOpened={expanded}>
                <ul>
                    {data &&
                        data.findRepositoryByTitle &&
                        data.findRepositoryByTitle.documentsList.data.map(
                            doc =>
                                doc && (
                                    <li key={doc._id}>
                                        <b>
                                            document title:
                                            {doc.title}
                                        </b>
                                        {doc.commentsList.data.map(
                                            commentList =>
                                                commentList &&
                                                commentList.comments && (
                                                    <div key={commentList._id}>
                                                        {commentList.comments.data.map(
                                                            comment =>
                                                                comment && (
                                                                    <div key={comment._id}>
                                                                        <p>{comment._id}</p>
                                                                        <p>{comment.text}</p>
                                                                        <Button onClick={() => deleteComment(comment)}>
                                                                            Delete
                                                                        </Button>
                                                                    </div>
                                                                ),
                                                        )}
                                                    </div>
                                                ),
                                        )}
                                    </li>
                                ),
                        )}
                </ul>
            </Collapse>
        </div>
    );
};

const sampleResponseFromFindById = `
{
    "data": {
      "findRepositoryByID": {
        "_id": "245564447665422867",
        "title": "jludden/ReefLifeSurvey---Species-Explorer",
        "documentsList": {
          "data": [
            {
              "_id": "245564447668568595",
              "title": "master:app/src/main/java/me/jludden/reeflifesurvey/MainActivity.java",
              "commentsList": {
                "data": [
                  {
                    "_id": "245564447670665747",
                    "comments": {
                      "data": [
                        {
                          "_id": "245564447671714323",
                          "text": "MainActivity first comment"
                        },
                        {
                          "_id": "245564447676957203",
                          "text": "MainActivity second comment"
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "_id": "245564447683248659",
              "title": "master:app/src/main/java/me/jludden/reeflifesurvey/HomeFragment.java",
              "commentsList": {
                "data": [
                  {
                    "_id": "245564447684297235",
                    "comments": {
                      "data": [
                        {
                          "_id": "245564447684298259",
                          "text": "HomeFragment first comment"
                        },
                        {
                          "_id": "245564447691637267",
                          "text": "HomeFragment second comment"
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }`;

const initialDataGen = gql`
    mutation CreateRepoWithDocsAndComments {
        createRepository(
            data: {
                title: "jludden/ReefLifeSurvey---Species-Explorer"
                documentsList: {
                    create: [
                        {
                            title: "master:app/src/main/java/me/jludden/reeflifesurvey/MainActivity.java"
                            commentsList: {
                                create: [
                                    {
                                        comments: {
                                            create: [
                                                { text: "MainActivity first comment" }
                                                { text: "MainActivity second comment" }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                        {
                            title: "master:app/src/main/java/me/jludden/reeflifesurvey/HomeFragment.java"
                            commentsList: {
                                create: [
                                    {
                                        comments: {
                                            create: [
                                                { text: "HomeFragment first comment" }
                                                { text: "HomeFragment second comment" }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ) {
            _id
            title
            documentsList {
                data {
                    title
                    commentsList {
                        data {
                            comments {
                                data {
                                    _id
                                    text
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

const createDocumentAndCommentList = gql`
    mutation createDocument($docTitle: String!, $repoId: ID!) {
        createDocument(
            data: {
                title: $docTitle
                repository: { connect: $repoId }
                commentsList: { create: [{ comments: { create: [] } }] }
            }
        ) {
            _id
            title
            repository {
                _id
            }
            commentsList {
                data {
                    _id
                }
            }
        }
    }
`;
// repoId: string, docTitle: string export const SetupDocumentComments = ({ repoId, docTitle, children }: { repoId: string, docTitle: string,     children: JSX.Element

export const SetupDocumentComments = ({ children }: { repoId: string; docTitle: string; children: JSX.Element }) => {
    const [mutate] = useMutation(createDocumentAndCommentList);

    return React.cloneElement(children, {
        setupDocument: (repoId: string, docTitle: string) =>
            mutate({
                variables: { repoId: repoId, docTitle: docTitle },
            }),
    });
};

const createDocumentAndCommentListVars = { docTitle: 'master:app/ReefLifeSurvey.iml', repoId: '245564447665422867' };
const createDocumentAndCommentListRESPONSE = `{
    "data": {
      "createDocument": {
        "_id": "247297367166943762",
        "title": "master:app/ReefLifeSurvey.iml",
        "repository": {
          "_id": "245564447665422867"
        },
        "commentsList": {
          "data": [
            {
              "_id": "247297367171138066"
            }
          ]
        }
      }
    }
  }`;

// todo consider render prop pattern https://dev.to/busypeoples/notes-on-typescript-render-props-1f3p
export const AddComment2 = ({
    repoId,
    repoTitle,
    documentId,
    documentTitle,
    commentListId,
}: // children,
{
    repoId: string;
    repoTitle: string;
    documentId: string;
    documentTitle: string;
    commentListId: string;
    // children: JSX.Element;
}) => {
    // Mutation to add a comment to a comment list
    const [submitCommentMutation] = useMutation(createCommentMutation);
    const doSubmitComment = (commentListId: string, commentContent: string) => {
        submitCommentMutation({
            variables: { text: commentContent, listId: commentListId },
            optimisticResponse: {
                __typename: 'Mutation',
                createComment: {
                    __typename: 'Comment',
                    text: commentContent,
                    _id: '' + Math.round(Math.random() * -1000000),
                    list: {
                        _id: commentListId,
                    },
                },
            },
            update: (cache, { data: { createComment } }) => {
                const data = cache.readQuery<FindRepoResults>({
                    query: findCommentsForRepoQuery,
                    variables: { repoTitle },
                });

                const commentList = FindCommentList(data, documentId, commentListId);
                if (commentList) {
                    commentList.push(createComment);
                }
                cache.writeQuery({
                    query: findCommentsForRepoQuery,
                    data: data,
                });
            },
        });
    };

    // mutation to create a document and commentlist within the repository
    const [setupDocumentMutation] = useMutation(createDocumentAndCommentList);

    // keep track of
    const [submitted, setSubmitted] = React.useState(false);
    const trySubmitComment = async (commentContent: string) => {
        if (submitted) return;

        if (commentListId) doSubmitComment(commentListId, commentContent);
        else {
            await setupDocumentMutation({
                variables: { repoId: repoId, docTitle: documentTitle },
                update: (cache, { data: { createDocument } }) => {
                    const data = cache.readQuery<FindRepoResults>({
                        query: findCommentsForRepoQuery,
                        variables: { repoTitle },
                    });

                    const repoData =
                        data &&
                        data.findRepositoryByTitle &&
                        data.findRepositoryByTitle.documentsList &&
                        data.findRepositoryByTitle.documentsList.data;
                    repoData && repoData.push(createDocument);

                    cache.writeQuery({
                        query: findCommentsForRepoQuery,
                        data: data,
                    });

                    const createdCommentList = createDocument.commentsList.data[0]._id;
                    if (createdCommentList) doSubmitComment(createdCommentList, commentContent);
                    else console.error('failed to add comment - failed to create comment list'); // todo
                },
            });
        }
        setSubmitted(true);
    };

    // return React.cloneElement(children, {
    //     onSubmit: trySubmitComment,
    // });

    let input: HTMLInputElement | null = null;

    return (
        <div>
            <span>Add Comment to Comment List</span>
            <input
                ref={node => {
                    input = node;
                }}
            />
            <Button onClick={() => trySubmitComment(input ? input.value : 'ADD COMMENT MUTATION TEST')}>
                ADD TO LIST
            </Button>
        </div>
    );
};
