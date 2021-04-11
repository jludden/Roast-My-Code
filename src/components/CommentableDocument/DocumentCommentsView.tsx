import React, { useState, useEffect, useContext, createContext } from 'react';
import { SubmitCommentResponse } from '../CommentableCodePage/CommentableCode';
import RoastComment, { User } from '../CommentableCodePage/types/findRepositoryByTitle';
import { ICommentGrouping } from './DocumentBody';
import { Notification } from 'rbx';
// import { findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data as RoastComment } from '../CommentableCodePage/types/findRepositoryByTitle';
import { db } from '../../services/firebase';
import { firebaseStore } from '../FirebaseChat/FirebaseCommentsProvider';
import CommentContainer from './CommentContainer';
import '../../App.css';

export interface CommentsViewProps {
    lineNumberMap: Map<number | undefined, ICommentGrouping>;
    lineRefs: React.RefObject<HTMLElement>[];
    inProgressComment?: UnsubmittedComment;
    onEditComment: (comment: RoastComment, isDelete?: boolean) => Promise<boolean>;
    onSubmitComment: (comment: RoastComment) => Promise<boolean>;
    onSubmitCommentFinish: () => void; // either submit or cancel, close in progress comment
    handleCommentAdd: (lineNumber: number) => void;
    repoId: string;
    repoTitle: string;
    documentId: string;
    documentTitle: string;
    commentListId: string;
    authenticated: boolean;
    user: User;
}

export interface UnsubmittedComment {
    lineRef: React.RefObject<HTMLElement>;
    lineNumber: number;
    selectedText: string;
    author: User;
}

interface INotificationStore {
    state: {
        writeCommentError: string | undefined;
    };
    showErrorMessage: (message: string | undefined) => void;
    showSuccessMessage: (message: string) => void;
}

export const notificationStore = createContext<INotificationStore>({
    state: {
        writeCommentError: undefined, //todo rename
    },
    showErrorMessage: (message: string | undefined) => undefined,
    showSuccessMessage: Function,
});

const DocumentCommentsView = (props: CommentsViewProps) => {
    const {
        state: { writeCommentError },
        showErrorMessage,
    } = useContext(notificationStore);

    const {
        state: { user },
    } = useContext(firebaseStore);

    // TODO RECONSIDER NOSHIP react forgive me but i need to force a re-render to see if the refs are updated
    useEffect(() => {
        setTimeout(() => {
            showErrorMessage('ty');
            showErrorMessage(undefined);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isCommentAuthor: (comment: RoastComment) => boolean = (comment: RoastComment) => {
        if (user === null) return false;
        const u1 = user as any;
        return u1.uid === comment.author?.uid;
    };

    const onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse> = async (
        comment: RoastComment,
    ) => {
        try {
            if (comment.text) {
                const success = await props.onSubmitComment(comment);
                props.onSubmitCommentFinish(); // notify parent

                if (!success) showErrorMessage('Please sign in to comment');
                return success ? SubmitCommentResponse.Success : SubmitCommentResponse.Error;
            }
        } catch (e) {
            showErrorMessage(e.message);
            console.log(e.message);
        }
        return SubmitCommentResponse.Error;
    };

    const onCancelComment = () => {
        props.onSubmitCommentFinish();
    };

    const onEditComment: (comment: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse> = async (
        comment: RoastComment,
        isDelete?: boolean,
    ) => {
        try {
            if (!isCommentAuthor(comment)) {
                showErrorMessage('Not the comment author');
            } else if (comment.text) {
                const success = await props.onEditComment(comment, isDelete);
                if (!success) showErrorMessage('Sorry - unexpected failure');
                return success ? SubmitCommentResponse.Success : SubmitCommentResponse.Error;
            }
        } catch (e) {
            showErrorMessage(e.message);
            console.log(e.message);
        }
        return SubmitCommentResponse.Error;
    };

    return (
        <ul className="flex-item comments-pane">
            {/* display all the saved comments */}
            {Array.from(props.lineNumberMap, ([lineNumber, grouping]) => (
                <CommentContainer
                    key={lineNumber}
                    comments={grouping.comments}
                    startMinimized={grouping.startMinized}
                    onEditComment={onEditComment}
                    onSubmitComment={onSubmitComment}
                    onCancelComment={onCancelComment}
                    onReplyComment={() => props.handleCommentAdd(lineNumber || 0)}
                    lineRef={props.lineRefs[lineNumber || 0]}
                    inProgress={grouping.inProgress}
                />
            ))}
            {/* also display the comment in progress if any */}
            {props.inProgressComment && (
                <>
                    {writeCommentError && (
                        <div>
                            {writeCommentError}
                            <span>authenticated: {props.authenticated}</span>
                            {props.user && (
                                <span>
                                    user: {props.user.uid}
                                    name: {props.user.displayName}
                                </span>
                            )}
                        </div>
                    )}
                </>
            )}
            {/* display any error messages */}
            {writeCommentError && (
                <aside
                    style={{
                        bottom: '.5rem',
                        position: 'fixed',
                    }}
                    className="hide-after-notify"
                >
                    <Notification color="warning">{writeCommentError}</Notification>
                </aside>
            )}
        </ul>
    );
};

const DocumentCommentsWithNotificationProvider = (props: CommentsViewProps) => {
    const [writeCommentError, setWriteCommentError] = useState<string | undefined>();
    const [timespan, setTimespan] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let timer: any;
        if (isActive) {
            timer = setTimeout(() => {
                setWriteCommentError(undefined);
            }, timespan);
        }

        return () => clearTimeout(timer);
    }, [isActive, timespan, writeCommentError]);

    const showErrorMessage = (message: string | undefined) => {
        setWriteCommentError(message);
        setTimespan(2000);
        setIsActive(true);
    };

    const showSuccessMessage = (message: string) => {
        setWriteCommentError(message);
        setTimespan(3000);
        setIsActive(true);
    };

    return (
        <notificationStore.Provider value={{ state: { writeCommentError }, showErrorMessage, showSuccessMessage }}>
            <DocumentCommentsView {...props} />
        </notificationStore.Provider>
    );
};

export default DocumentCommentsWithNotificationProvider;
