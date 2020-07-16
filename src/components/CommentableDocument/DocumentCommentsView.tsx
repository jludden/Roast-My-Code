import * as React from 'react';
import { SubmitCommentResponse } from '../CommentableCodePage/CommentableCode';
import RoastComment from '../CommentableCodePage/types/findRepositoryByTitle';
import { useAddComment } from '../CommentableCodePage/CommentsGqlQueries';
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
// import { findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data as RoastComment } from '../CommentableCodePage/types/findRepositoryByTitle';

import CommentContainer from '../CommentContainer';

export interface CommentsViewProps {
    lineNumberMap: Map<number | undefined, RoastComment[]>;
    lineRefs: HTMLDivElement[];
    inProgressComment?: UnsubmittedComment;
    onSubmitCommentFinish: () => void; // either submit or cancel, close in progress comment
    repoId: string;
    repoTitle: string;
    documentId: string;
    documentTitle: string;
    commentListId: string;
}

export interface UnsubmittedComment {
    lineRef: HTMLDivElement;
    lineNumber: number;
    selectedText: string;
    author: string;
}

const DocumentCommentsView = (props: CommentsViewProps) => {
    // Group comments into Comment Containers based their associated line number TODO this could be state or something
    // const lineNumberMap = new Map<number|undefined, RoastComment[]>();
    // this.props.comments.map((comment: RoastComment) => {
    //   var line: RoastComment[] = lineNumberMap.get(comment.data.lineNumber) || [];
    //   line.push(comment);
    //   lineNumberMap.set(comment.data.lineNumber, line);
    // });

    const onSubmit = (comment: any) => ''; 
    // const onSubmit = useAddComment({
    //     repoId: props.repoId,
    //     repoTitle: props.repoTitle,
    //     documentId: props.documentId,
    //     documentTitle: props.documentTitle,
    //     commentListId: props.commentListId,
    // });

    const onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse> = async (
        comment: RoastComment,
    ) => {
        // todo check logged in
        try {
            if (comment.text) {
                await onSubmit(comment);
                props.onSubmitCommentFinish(); // notify parent
                return SubmitCommentResponse.Success;
            }
        } catch (e) {}
        return SubmitCommentResponse.Error;
    };

    const onCancelComment = () => {
        props.onSubmitCommentFinish();
    };

    const onEditComment: (comment: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse> = () =>
        Promise.resolve(SubmitCommentResponse.Success);

    return (
        <ul className="flex-item comments-pane">
            {/* display all the saved comments */}
            {Array.from(props.lineNumberMap, ([lineNumber, comments]) => (
                <CommentContainer
                    key={lineNumber}
                    comments={comments}
                    onEditComment={onEditComment}
                    onSubmitComment={onSubmitComment}
                    onCancelComment={onCancelComment}
                    lineRef={props.lineRefs[lineNumber || 0]}
                    inProgress={false}
                />
            ))}
            {/* also display the comment in progress if any */}
            {props.inProgressComment && (
                <>
                    <CommentContainer
                        key={`unsubmitted ${props.inProgressComment.lineRef}`}
                        onEditComment={onEditComment}
                        onSubmitComment={onSubmitComment}
                        onCancelComment={onCancelComment}
                        lineRef={props.inProgressComment.lineRef}
                        inProgress
                        comments={[
                            {
                                __typename: 'Comment',
                                _id: '-1',
                                text: props.inProgressComment.selectedText || '',
                                lineNumber: props.inProgressComment.lineNumber,
                                selectedText: props.inProgressComment.selectedText,
                                createdAt: null,
                                updatedAt: null,
                                author: null, // todo inProgress.author
                            },
                        ]}
                    />
                </>
            )}
        </ul>
    );
};

export default DocumentCommentsView;
