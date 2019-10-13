import { gql } from 'apollo-boost';

export const deleteCommentMutation = gql`
    mutation deleteComment($id: ID!) {
        deleteComment(id: $id) {
            _id
        }
    }
`;

export const createCommentMutation = gql`
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

export const findCommentsForRepoQuery = gql`
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
