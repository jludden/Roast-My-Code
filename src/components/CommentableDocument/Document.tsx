import React, { useState, useEffect, useMemo } from 'react';
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
import { db } from '../../services/firebase';
import { tomorrow, ghcolors, darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

const DocCommentsLoader = (props: IDocumentProps) => {
    const [comments, setComments] = useState([] as RoastComment[]);
    const [loadCommentsError, setLoadCommentsError] = useState();
    const commentsId = useMemo(() => btoa(props.queryVariables.path), [props.queryVariables]);

    const onSubmitComment = async (comment: RoastComment) => {
        await db.ref('file-comments/' + commentsId).push({
            text: comment.text,
            lineNumber: comment.lineNumber,
            timestamp: Date.now(),
            uid: 'DiKOhKk9smZC6g0IpCDUd6RJ7el2', //TODO user.uid,
        });
        return true;
    };

    useEffect(() => {
        try {
            db.ref('file-comments/' + commentsId).on('value', (snapshot) => {
                const chats: RoastComment[] = [];
                snapshot.forEach((snap) => {
                    const val = snap.val();
                    chats.push({
                        _id: snap.key,
                        updatedAt: new Date(val.timestamp),
                        ...val,
                    });
                });
                setComments(chats);
            });
        } catch (error) {
            setLoadCommentsError(error.message);
        }
    }, [commentsId]);

    if (loadCommentsError) return <ErrorMessage message="failed to load comments for doc" />;

    return <DocumentLoader comments={comments} onSubmitComment={onSubmitComment} {...props} />;
};

const DocumentLoader = (props: IDocumentProps & { comments: any; onSubmitComment: (comment: RoastComment) => Promise<boolean> }) => {
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

    // OLD STUFF TO FIND COMMENTS RELATED TO THIS DOC
    //const comments: RoastComment[] = docComments;
    // const doc = props.repoComments.findRepositoryByTitle.documentsList.data.find(
    //     x => x && data && x.title === props.queryVariables.path,
    // );
    // // x.title:"master:app/src/main/java/me/jludden/reeflifesurvey/MainActivity.java"
    // // path:"master:local.properties"

    // const docCommentsList = doc && doc.commentsList.data[0];
    // const docCommentsInitial: (RoastComment2 | null)[] =
    //     (docCommentsList && docCommentsList.comments && docCommentsList.comments.data) || [];
    // const docComments: RoastComment2[] = docCommentsInitial.filter(x => x != null) as RoastComment2[];
    // // todo will this be updated on add new comment input?
    return <DocumentView data={data} {...props} />;
};

const DocumentView = (props: IDocumentProps & { data: any; comments: any; onSubmitComment: (comment: RoastComment) => Promise<boolean> }) => {
    const availableThemes = [tomorrow, ghcolors, darcula];
    const [theme, setTheme] = React.useState(tomorrow);

    const cycleTheme = () => {
        const currentIndex = availableThemes.indexOf(theme);
        const newIndex = availableThemes.length - currentIndex > 1 ? currentIndex + 1 : 0;
        setTheme(availableThemes[newIndex]);
    };

    return (
        <>
            {/* <TestLoadDocumentComments owner= */}
            <DocumentHeader
                documentName={props.documentName}
                commentsCount={props.comments.length}
                cycleTheme={cycleTheme}
            />
            <DocumentBody
                name={props.documentName}
                content={props.data.repository.object.text}
                comments={props.comments}
                repoComments={props.repoComments}
                repoId={''}
                // repoId={props.repoComments.findRepositoryByTitle._id}
                repoTitle={props.repoComments.currentRepoTitle}
                documentId={''}
                documentTitle={props.queryVariables.path}
                commentListId={''}
                theme={theme}
                onSubmitComment={props.onSubmitComment}
                // onEditComment={props.onEditComment}
            />
        </>
    );
};

export function ErrorMessage({ message } = { message: ''}) {
    return (
        <Container>
            <Message color="danger">
                <Message.Header>Unexpected Error</Message.Header>
                {message && <Message.Body>{message}</Message.Body>}
                {!message && <Message.Body>Failed to load document</Message.Body>}
            </Message>
        </Container>
    );
}

export default DocCommentsLoader;
