import * as React from 'react';
import { Collapse } from 'react-collapse';
import { githubClient } from '../../App';
import ApolloClient, { gql, ExecutionResult } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { findRepositoryByID } from './types/findRepositoryByID';
import {
    IComment,
    SubmitCommentResponse,
    IGithubRepoVars,
    IGithubRepoResponse,
    IRepoCommentsResponse,
    IRepoCommentsObj,
    LOAD_COMMENTS_QUERY,
} from './CommentableCode';
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

const findCommentsForRepoQuery = gql`
    query findRepositoryByID {
        findRepositoryByID(id: "245564447665422867") {
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

// interface findRepositoryByIdResp {
//     findRepositoryByID: {
//         data: any[];
//     };
// }

export const FindCommentsForRepo = () => {
    const id = '245564447665422867';

    const [expanded, setExpanded] = React.useState(false);
    const { data, error, loading, refetch } = useQuery<findRepositoryByID>(findCommentsForRepoQuery);

    if (loading) return <Progress color="info" />;
    if (error || !data) return <div>Error</div>; // ErrorMessage
    if (data) {
        console.log(data);
    }

    return (
        <div>
            <span onClick={() => setExpanded(!expanded)}>Completed Todos: (toggle)</span>
            <Collapse isOpened={expanded}>
                <ul>
                    {data &&
                        data.findRepositoryByID &&
                        data.findRepositoryByID.documentsList.data.map(document => (
                            <div>
                                {document && (
                                    <li key={document.title}>
                                        <b>
                                            title:
                                            {document.title}
                                        </b>
                                        {document.commentsList.data.map(commentList => (
                                            <div>
                                                {commentList &&
                                                    commentList.comments.data.map(comment => (
                                                        <div>
                                                            {comment && (
                                                                <div>
                                                                    <p>{comment._id}</p>
                                                                    <p>{comment.text}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                        ))}
                                    </li>
                                )}
                            </div>
                        ))}
                </ul>
            </Collapse>
        </div>
    );
};

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
