import gql from 'graphql-tag';

export const deleteCommentMutation = gql`
    mutation deleteComment($id: ID!) {
        deleteComment(id: $id) {
            _id
        }
    }
`;

export const createCommentMutationExistingAuthor = gql`
    # Write your query or mutation here
    mutation createComment(
        $text: String!
        $listId: ID!
        $lineNumber: Int = null
        $selectedText: String = null
        $authorId: ID = null
    ) {
        createComment(
            data: {
                text: $text
                list: { connect: $listId }
                lineNumber: $lineNumber
                selectedText: $selectedText
                author: { connect: $authorId }
            }
        ) {
            text
            _id
            list {
                _id
            }
            lineNumber
            selectedText
            author {
                name
                avatarUrl
                githubId
            }
            createdAt
            updatedAt
        }
    }
`;
export const createCommentMutation = gql`
    # Write your query or mutation here
    mutation createComment($text: String!, $listId: ID!, $lineNumber: Int = null, $selectedText: String = null) {
        createComment(
            data: { text: $text, list: { connect: $listId }, lineNumber: $lineNumber, selectedText: $selectedText }
        ) {
            text
            _id
            list {
                _id
            }
            lineNumber
            selectedText
            author {
                name
                avatarUrl
                githubId
            }
            createdAt
            updatedAt
        }
    }
`;

export const createCommentMutationV1 = gql`
    mutation createComment($text: String!, $listId: ID!) {
        createComment(data: { text: $text, list: { connect: $listId } }) {
            text
            _id
            list {
                _id
            }
        }
    }
`;

// repo title - indexed w/ @unique and cached locally w/ @client @export
export const findCommentsForRepoQuery = gql`
    query findRepositoryByTitle($repoTitle: String!) {
        currentRepoTitle @client @export(as: "repoTitle")
        findRepositoryByTitle(title: $repoTitle) {
            _id
            title
            documentsList {
                data {
                    _id
                    title
                    commentsList {
                        data {
                            _id
                            comments {
                                data {
                                    _id
                                    text
                                    lineNumber
                                    selectedText
                                    createdAt
                                    updatedAt
                                    author {
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const findCommentsForRepoByIDQuery = gql`
    query findRepositoryByID($repoId: ID!) {
        findRepositoryByID(id: $repoId) {
            _id
            title
            documentsList {
                data {
                    _id
                    title
                    commentsList {
                        data {
                            _id
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
