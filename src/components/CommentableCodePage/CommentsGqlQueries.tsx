import * as React from 'react';
import * as R from 'ramda';
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

function FindCommentListByCommentId(
    data: findRepositoryByTitle | null,
    commentId: string,
    // eslint-disable-next-line @typescript-eslint/camelcase
): (findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data | null)[] | null {
    let foundCommentsList = null;
    if (
        data &&
        data.findRepositoryByTitle &&
        data.findRepositoryByTitle.documentsList &&
        data.findRepositoryByTitle.documentsList.data
    ) {
        data.findRepositoryByTitle.documentsList.data.forEach(doc => {
            doc &&
                doc.commentsList &&
                doc.commentsList.data &&
                doc.commentsList.data.forEach(commentsList => {
                    commentsList &&
                        commentsList.comments.data &&
                        commentsList.comments.data.forEach(comment => {
                            if (comment && comment._id == commentId) {
                                foundCommentsList = commentsList.comments.data;
                            }
                        });
                });
        });
    }
    return foundCommentsList;
}

// find comment by ID and remove it from the repo
function RemoveCommentById(
    data: findRepositoryByTitle | null,
    commentId: string,
    // eslint-disable-next-line @typescript-eslint/camelcase
): findRepositoryByTitle | null {
    // const commentsList =

    // const eqByCommentId = R.propEq('id', commentId);
    // R.reject(eqByCommentId, commentsList.comments.data);

    if (
        data &&
        data.findRepositoryByTitle &&
        data.findRepositoryByTitle.documentsList &&
        data.findRepositoryByTitle.documentsList.data
    ) {
        data.findRepositoryByTitle.documentsList.data.forEach(doc => {
            const eqByCommentId = R.propEq('id', commentId);

            // const document = data.findRepositoryByTitle.documentsList.data.find(x => x && x._id === documentId);
            doc &&
                doc.commentsList &&
                doc.commentsList.data &&
                doc.commentsList.data.forEach(commentsList => {
                    commentsList && commentsList.comments.data && R.reject(eqByCommentId, commentsList.comments.data);
                    // commentsList.comments.data.forEach(comment => {

                    //     R.reject(eqByCommentId, commentsList.comments.data)

                    //     if (comment && comment._id == commentId) {
                    //         return comment;
                    //     }
                    // });
                });
        });
    }
    return data;
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
                    update: (cache, { data: { deleteComment } }) => {
                        const data = cache.readQuery<FindRepoResults>({
                            query: findCommentsForRepoQuery,
                            variables: { repoTitle },
                        });

                        // todo
                        const commentList = FindCommentListByCommentId(data, deleteComment._id);

                        // const commentList = FindCommentList(data, documentId, commentListId);
                        if (commentList) {
                            commentList.splice(commentList.indexOf(deleteComment), 1);
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
            let createdCommentList = '';
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

                    createdCommentList = createDocument.commentsList.data[0]._id;
                },
            });
            if (createdCommentList) doSubmitComment(createdCommentList, commentContent);
            else console.error('failed to add comment - failed to create comment list'); // todo
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

const createDocumentAndFirstComment = gql`
    mutation createDocumentAndFirstComment($text: String!, $docTitle: String!, $repoId: ID!) {
        createComment(
            data: {
                text: $text
                list: { create: { document: { create: { title: $docTitle, repository: { connect: $repoId } } } } }
            }
        ) {
            text
            _id
            list {
                _id
                document {
                    title
                    _id
                    repository {
                        title
                        _id
                    }
                }
            }
        }
    }
`;
// To add a comment, you need either a commentListId, or a repoId + document title
// if commentlistid is passed in, we can simply create a comment linked to it
// however a document without any comments on it yet will not have a comment list,
// so in this case we will add a new document to the repo, and a new comment list to the doc,
// and then the new comment to the new comment list
export const AddComment3 = ({
    repoId,
    repoTitle,
    documentId,
    documentTitle,
    commentListId,
    // }: // children,
    children,
}: {
    repoId: string;
    repoTitle: string;
    documentId: string;
    documentTitle: string;
    commentListId: string;
    children: (onSubmit: (input: string) => void) => React.ReactNode;
    // children: JSX.Element;
    // { onSubmit: (input: string) => void }
}) => {
    // Mutation to add a comment to an existing comment list
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

    // mutation to create a document and commentlist and first comment
    const [firstCommentMutation] = useMutation(createDocumentAndFirstComment);

    // keep track of
    const [submitted, setSubmitted] = React.useState(false);
    const trySubmitComment = async (commentContent: string) => {
        if (submitted) return;

        if (commentListId) doSubmitComment(commentListId, commentContent);
        else {
            firstCommentMutation({
                variables: { repoId: repoId, docTitle: documentTitle, text: commentContent },
                optimisticResponse: {
                    __typename: 'Mutation',
                    createComment: {
                        __typename: 'Comment',
                        text: commentContent,
                        _id: '' + Math.round(Math.random() * -1000000),
                        list: {
                            _id: '' + Math.round(Math.random() * -1000000),
                            document: {
                                title: documentTitle,
                                _id: '' + Math.round(Math.random() * -1000000),
                                repository: {
                                    _id: repoId,
                                    title: repoTitle,
                                },
                            },
                        },
                    },
                },
                update: (cache, { data: { createComment } }) => {
                    const data = cache.readQuery<FindRepoResults>({
                        query: findCommentsForRepoQuery,
                        variables: { repoTitle },
                    });

                    // add the newly create comment to the cached version of the repo
                    if (
                        data &&
                        data.findRepositoryByTitle &&
                        data.findRepositoryByTitle.documentsList &&
                        data.findRepositoryByTitle.documentsList.data
                    ) {
                        data.findRepositoryByTitle.documentsList.data.push({
                            __typename: 'Document',
                            _id: createComment.list.document._id,
                            title: createComment.list.document.title,
                            commentsList: {
                                __typename: 'CommentListPage',
                                data: [
                                    {
                                        __typename: 'CommentList',
                                        _id: createComment.list._id,
                                        comments: {
                                            __typename: 'CommentPage',
                                            data: [
                                                {
                                                    __typename: 'Comment',
                                                    _id: createComment._id,
                                                    text: createComment.text,
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        });
                    }

                    cache.writeQuery({
                        query: findCommentsForRepoQuery,
                        data: data,
                    });
                },
            });
        }
        setSubmitted(true);
    };

    return children(trySubmitComment);

    // return React.cloneElement(children, {
    //     onSubmit: trySubmitComment,
    // });

    // let input: HTMLInputElement | null = null;

    // return (
    //     <div>
    //         <span>Add Comment to Comment List</span>
    //         <input
    //             ref={node => {
    //                 input = node;
    //             }}
    //         />
    //         <Button onClick={() => trySubmitComment(input ? input.value : 'ADD COMMENT MUTATION TEST')}>
    //             ADD TO LIST
    //         </Button>
    //     </div>
    // );
};

type AddCommentHook = ({
    repoId,
    repoTitle,
    documentId,
    documentTitle,
    commentListId,
}: {
    repoId: string;
    repoTitle: string;
    documentId: string;
    documentTitle: string;
    commentListId: string;
}) => (input: string) => void;

export const useAddComment: AddCommentHook = ({
    repoId,
    repoTitle,
    documentId,
    documentTitle,
    commentListId,
}: {
    repoId: string;
    repoTitle: string;
    documentId: string;
    documentTitle: string;
    commentListId: string;
}) => {
    // Mutation to add a comment to an existing comment list
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

    // mutation to create a document and commentlist and first comment
    const [firstCommentMutation] = useMutation(createDocumentAndFirstComment);

    // keep track of
    const [submitted, setSubmitted] = React.useState(false);
    const trySubmitComment = async (commentContent: string) => {
        if (submitted) return;

        if (commentListId) doSubmitComment(commentListId, commentContent);
        else {
            firstCommentMutation({
                variables: { repoId: repoId, docTitle: documentTitle, text: commentContent },
                optimisticResponse: {
                    __typename: 'Mutation',
                    createComment: {
                        __typename: 'Comment',
                        text: commentContent,
                        _id: '' + Math.round(Math.random() * -1000000),
                        list: {
                            _id: '' + Math.round(Math.random() * -1000000),
                            document: {
                                title: documentTitle,
                                _id: '' + Math.round(Math.random() * -1000000),
                                repository: {
                                    _id: repoId,
                                    title: repoTitle,
                                },
                            },
                        },
                    },
                },
                update: (cache, { data: { createComment } }) => {
                    const data = cache.readQuery<FindRepoResults>({
                        query: findCommentsForRepoQuery,
                        variables: { repoTitle },
                    });

                    // add the newly create comment to the cached version of the repo
                    if (
                        data &&
                        data.findRepositoryByTitle &&
                        data.findRepositoryByTitle.documentsList &&
                        data.findRepositoryByTitle.documentsList.data
                    ) {
                        data.findRepositoryByTitle.documentsList.data.push({
                            __typename: 'Document',
                            _id: createComment.list.document._id,
                            title: createComment.list.document.title,
                            commentsList: {
                                __typename: 'CommentListPage',
                                data: [
                                    {
                                        __typename: 'CommentList',
                                        _id: createComment.list._id,
                                        comments: {
                                            __typename: 'CommentPage',
                                            data: [
                                                {
                                                    __typename: 'Comment',
                                                    _id: createComment._id,
                                                    text: createComment.text,
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        });
                    }

                    cache.writeQuery({
                        query: findCommentsForRepoQuery,
                        data: data,
                    });
                },
            });
        }
        setSubmitted(true);
    };

    return trySubmitComment;
};

export const DefaultAddCommentView = ({ onSubmit }: { onSubmit: (input: string) => void }) => {
    let input: HTMLInputElement | null = null;

    return (
        <div>
            <span>Add Comment to Comment List</span>
            <input
                ref={node => {
                    input = node;
                }}
            />
            <Button onClick={() => onSubmit(input ? input.value : 'ADD COMMENT MUTATION TEST')}>ADD TO LIST</Button>
        </div>
    );
};

export const AddComment4 = ({
    repoId,
    repoTitle,
    documentId,
    documentTitle,
    commentListId,
}: {
    repoId: string;
    repoTitle: string;
    documentId: string;
    documentTitle: string;
    commentListId: string;
}) => {
    const onSubmit = useAddComment({ repoId, repoTitle, documentId, documentTitle, commentListId });

    let input: HTMLInputElement | null = null;

    return (
        <div>
            <span>Add Comment to Comment List</span>
            <input
                ref={node => {
                    input = node;
                }}
            />
            <Button onClick={() => onSubmit(input ? input.value : 'ADD COMMENT MUTATION TEST')}>ADD TO LIST</Button>
        </div>
    );
};
