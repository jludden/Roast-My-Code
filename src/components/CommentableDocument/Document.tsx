import React, { useState, useEffect, useMemo, useContext } from 'react';
import { SubmitCommentResponse } from '../CommentableCodePage/CommentableCode';
import RoastComment from '../CommentableCodePage/types/findRepositoryByTitle';
import DocumentBody from './DocumentBody';
import DocumentHeader from './DocumentHeader';
import '../../App.css';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Blob, Repository } from '../../generated/graphql';
import { Container, Message, Progress, Section, Box, Title } from 'rbx';
import { githubClient } from '../../App';
import { FindRepoResults } from '../CommentableCodePage/CommentsGqlQueries';
import { findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data as RoastComment2 } from '../CommentableCodePage/types/findRepositoryByTitle';
import { db, auth } from '../../services/firebase';
import { tomorrow, ghcolors, darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { firebaseStore } from '../FirebaseChat/FirebaseCommentsProvider';

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

const updateComment = async (
    user: any,
    comment: RoastComment,
    filePath: string,
    repoPath: string,
    isDelete?: boolean,
) => {
    const refs = [
        db.ref(`user-comments/${user.uid || 1}/${comment._id}`),
        db.ref('file-comments/' + filePath + '/' + comment._id),
        db.ref('comments/' + comment._id),
    ];

    if (isDelete) {
        // todo d
        await Promise.all(refs.map((r) => r.remove()));
    } else {
        await Promise.all(
            refs.map((r) =>
                r.update({
                    timestamp: Date.now(),
                    text: comment.text,
                }),
            ),
        );
    }

    return true;
};

const DocCommentsLoader = (props: IDocumentProps) => {
    const filePath = useMemo(() => {
        const { owner, name, path } = props.queryVariables;
        return btoa(`${owner}/${name}/${path}`);
    }, [props.queryVariables]);

    const repoPath = useMemo(() => {
        const { owner, name, path } = props.queryVariables;
        return btoa(`${owner}/${name}`);
    }, [props.queryVariables]);

    const {
        dispatch,
        submitComment,
        state: { showUserDetails, user, authenticated, firebaseError },
    } = useContext(firebaseStore);

    const [loadCommentsError, setLoadCommentsError] = useState();
    const [comments, setComments] = useState([] as RoastComment[]);

    useEffect(() => {
        const dbRef = db.ref('file-comments/' + filePath);
        try {
            dbRef.on('value', (snapshot) => {
                const comments: RoastComment[] = [];
                snapshot.forEach((snap) => {
                    const val = snap.val();
                    comments.push({
                        _id: snap.key,
                        updatedAt: new Date(val.timestamp),
                        ...val,
                    });
                });
                setComments(comments);
            });
        } catch (error) {
            setLoadCommentsError(error.message);
        }
        return () => dbRef.off();
    }, [filePath]);

    if (firebaseError || loadCommentsError) return <ErrorMessage message="failed to load comments for doc" />;

    return (
        <DocumentLoader
            comments={comments}
            authenticated={authenticated}
            user={user}
            onSubmitComment={(comment) => submitComment(comment, filePath, repoPath, props.queryVariables)}
            onEditComment={(comment, isDelete) => updateComment(user, comment, filePath, repoPath, isDelete ?? false)}
            {...props}
        />
    );
};

export interface IDocumentCommentProps {
    comments: RoastComment[];
    onSubmitComment: (comment: RoastComment) => Promise<boolean>;
    onEditComment: (comment: RoastComment, isDelete?: boolean) => Promise<boolean>;
    authenticated: boolean;
    user: any;
}

const DocumentLoader = (props: IDocumentProps & IDocumentCommentProps) => {
    console.log(
        `fetching document with query: ${GITHUB_DOCUMENT_QUERY} \n parameters== name: ${props.queryVariables.name} path:${props.queryVariables.path} owner:${props.queryVariables.owner}`,
    );
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

const DocumentView = (props: IDocumentProps & IDocumentCommentProps & { data: any }) => {
    const availableThemes = [tomorrow, ghcolors, darcula];
    const [theme, setTheme] = React.useState(tomorrow);
    const [wrapLongLines, setWrapLongLines] = React.useState(true);

    const cycleTheme = () => {
        const currentIndex = availableThemes.indexOf(theme);
        const newIndex = availableThemes.length - currentIndex > 1 ? currentIndex + 1 : 0;
        setTheme(availableThemes[newIndex]);
    };

    const changeSetting = (key: string, value: boolean) => {
        setWrapLongLines(!wrapLongLines);
    };

    return (
        <>
            <DocumentHeader
                documentName={props.documentName}
                commentsCount={props.comments.length}
                cycleTheme={cycleTheme}
                changeSetting={changeSetting}
            />

            {!!props.data.repository.object.text && props.data.repository.object.text.length > 200000 && (
                <Container>
                    <Box>
                        <Title> File too large to render ¯\_(ツ)_/¯</Title>
                    </Box>
                </Container>
            )}
            {!!props.data.repository.object.text && props.data.repository.object.text.length < 200000 && (
                <DocumentBody
                    {...props}
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
                    wrapLongLines={wrapLongLines}
                    onSubmitComment={props.onSubmitComment}
                    onEditComment={props.onEditComment}
                />
            )}
        </>
    );
};

export function ErrorMessage({ message }: { message?: string }) {
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
