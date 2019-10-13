import * as React from 'react';
import { Collapse } from 'react-collapse';
import { githubClient } from '../../App';
import ApolloClient, { gql, ExecutionResult } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
    findRepositoryByID,
    // eslint-disable-next-line @typescript-eslint/camelcase
    findRepositoryByID_findRepositoryByID_documentsList_data_commentsList_data_comments_data,
} from './types/findRepositoryByID';
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
    data: findRepositoryByID | null,
    documentId: string,
    commentListId: string,
    // eslint-disable-next-line @typescript-eslint/camelcase
): (findRepositoryByID_findRepositoryByID_documentsList_data_commentsList_data_comments_data | null)[] | null {
    if (
        data &&
        data.findRepositoryByID &&
        data.findRepositoryByID.documentsList &&
        data.findRepositoryByID.documentsList.data &&
        data.findRepositoryByID.documentsList.data.find(x => x && x._id === documentId)
    ) {
        const document = data.findRepositoryByID.documentsList.data.find(x => x && x._id === documentId);
        if (document) {
            const commentList = document.commentsList.data.find(y => y && y._id === commentListId);
            if (commentList) {
                return commentList.comments.data;
            }
        }
    }
    return null;
}

export const LoadCommentsWithDelete = ({
    documentId,
    commentListId,
    repoId,
}: {
    documentId: string;
    commentListId: string;
    repoId: string;
}) => {
    const [mutate] = useMutation(deleteCommentMutation);
    return (
        <FindCommentsForRepo
            repoId={repoId}
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
                        const data: findRepositoryByID | null = cache.readQuery<findRepositoryByID>({
                            query: findCommentsForRepoQuery,
                            variables: { repoId },
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

export const CreateCommentForRepo = ({
    documentId,
    commentListId,
    repoId,
}: {
    documentId: string;
    commentListId: string;
    repoId: string;
}) => {
    const [mutate] = useMutation(createCommentMutation);

    return (
        <AddComment
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
                        const data = cache.readQuery<findRepositoryByID>({
                            query: findCommentsForRepoQuery,
                            variables: { repoId },
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

function AddComment({
    list,
    submit,
}: {
    list: string;
    submit: (list: string, commentContent: string) => Promise<ExecutionResult<any>>;
}) {
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
}

interface Comment {
    _id: string;
    text: string;
}

export const FindCommentsForRepo = ({
    repoId,
    deleteComment,
}: {
    repoId: string;
    deleteComment: (comment: Comment) => Promise<ExecutionResult<any>>;
}) => {
    const [expanded, setExpanded] = React.useState(false);
    const { data, error, loading, refetch } = useQuery<findRepositoryByID>(findCommentsForRepoQuery, {
        variables: { repoId },
    });

    if (loading) return <Progress color="info" />;
    if (error || !data) return <div>Error</div>; // ErrorMessage
    if (data) {
        console.log(data);
    }

    return (
        <div>
            <span onClick={() => setExpanded(!expanded)}>Repo-Doc-CommentList-Comments: (toggle)</span>
            <Collapse isOpened={expanded}>
                <ul>
                    {data &&
                        data.findRepositoryByID &&
                        data.findRepositoryByID.documentsList.data.map(
                            document =>
                                document && (
                                    <li key={document._id}>
                                        <b>
                                            title:
                                            {document.title}
                                        </b>
                                        {document.commentsList.data.map(
                                            commentList =>
                                                commentList && (
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
