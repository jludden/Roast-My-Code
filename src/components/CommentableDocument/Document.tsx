import * as React from 'react';
import { SubmitCommentResponse } from '../CommentableCodePage/CommentableCode';
import RoastComment from '../CommentableCodePage/types/findRepositoryByTitle';
import DocumentBody from './DocumentBody';
import DocumentHeader from './DocumentHeader';
import '../../App.css';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Blob, Repository } from '../../generated/graphql';
import { Container, Message, Progress } from 'rbx';
import { githubClient } from '../../App';
import { FindRepoResults } from '../CommentableCodePage/CommentsGqlQueries';
import { findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data as RoastComment2 } from '../CommentableCodePage/types/findRepositoryByTitle';

export interface IDocumentProps {
    queryVariables: IGithubDocQueryVariables;
    documentName: string;
    repoComments: FindRepoResults;
    // commentsCount: number;
    // name: string; // github data - refactor to new interface
    // content: string;
    // comments: RoastComment[]; // todo why props and state
    // onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse>; // handler for submitting a new comment
    // onEditComment: (comment: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>;
}

const GITHUB_DOCUMENT_QUERY = gql`
    query Document($owner: String!, $name: String!, $path: String!) {
        repository(owner: $owner, name: $name) {
            object(expression: $path) {
                ... on Blob {
                    text
                }
            }
        }
    }
`;

interface IGithubDocResponse {
    repository: {
        object: {
            text: string;
        };
    };
}

/* {
  "owner": "jludden",
  "name": "ReefLifeSurvey---Species-Explorer",
  "path": "master:app/src/main/java/me/jludden/reeflifesurvey/fishcards/CardViewFragment.java"
} */
interface IGithubDocQueryVariables {
    owner: string;
    name: string;
    path: string;
}

const Document = (props: IDocumentProps) => {
    const { data, error, loading } = useQuery<IGithubDocResponse, IGithubDocQueryVariables>(GITHUB_DOCUMENT_QUERY, {
        variables: props.queryVariables,
        client: githubClient as any,
    }); // todo potentially could get repoComments from cache.readQuery instead of passing it down?!

    if (loading) {
        return <Progress color="info" />;
    }

    if (error || !data || !data.repository || !data.repository.object || !data.repository.object.text) {
        return <ErrorMessage />;
    }
    const doc = props.repoComments.findRepositoryByTitle.documentsList.data.find(
        x => x && data && x.title === props.queryVariables.path,
    );
    // x.title:"master:app/src/main/java/me/jludden/reeflifesurvey/MainActivity.java"
    // path:"master:local.properties"

    const docCommentsList = doc && doc.commentsList.data[0];
    const docCommentsInitial: (RoastComment2 | null)[] =
        (docCommentsList && docCommentsList.comments && docCommentsList.comments.data) || [];
    const docComments: RoastComment2[] = docCommentsInitial.filter(x => x != null) as RoastComment2[];
    // todo will this be updated on add new comment input?

    const comments: RoastComment[] = docComments;
    // const comments: RoastComment[] = docComments.map(
    //     x =>
    //         new RoastComment({
    //             id: Math.round(Math.random() * -1000000),
    //             data: {
    //                 lineNumber: Math.round(Math.random() * 50),
    //                 text: x.text,
    //             },
    //         }),
    // );

    return (
        <>
            {/* <TestLoadDocumentComments owner= */}
            <DocumentHeader documentName={props.documentName} commentsCount={comments.length} />
            <DocumentBody
                name={props.documentName}
                content={data.repository.object.text}
                comments={comments}
                repoComments={props.repoComments}
                repoId={props.repoComments.findRepositoryByTitle._id}
                repoTitle={props.repoComments.currentRepoTitle}
                documentId={(doc && doc._id) || ''}
                documentTitle={props.queryVariables.path}
                commentListId={(docCommentsList && docCommentsList._id) || ''}
                // onSubmitComment={props.onSubmitComment}
                // onEditComment={props.onEditComment}
            />
        </>
    );
};

export function ErrorMessage() {
    return (
        <Container>
            <Message color="danger">
                <Message.Header>Unexpected Error</Message.Header>
                <Message.Body>Failed to load document</Message.Body>
            </Message>
        </Container>
    );
}

export default Document;
