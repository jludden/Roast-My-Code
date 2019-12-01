import * as React from 'react';
import { SubmitCommentResponse } from '../CommentableCodePage/CommentableCode';
import RoastComment from '../RoastComment';
import {
    AddComment,
    AddComment2,
    AddComment3,
    AddCommentInput,
    FindRepoResults,
    DefaultAddCommentView,
    useAddComment,
    AddComment4,
} from '../CommentableCodePage/CommentsGqlQueries';
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
    // onEditComment: (details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>;
    // onSubmitComment: (details: RoastComment) => Promise<SubmitCommentResponse>; // handler for submitting a new comment
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

    const onSubmit = useAddComment({
        repoId: props.repoId,
        repoTitle: props.repoTitle,
        documentId: props.documentId,
        documentTitle: props.documentTitle,
        commentListId: props.commentListId,
    });

    const onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse> = async (
        comment: RoastComment,
    ) => {
        // todo check logged in i guess
        try {
            if (comment.data.comment) {
                await onSubmit(comment.data.comment);
                return SubmitCommentResponse.Success;
            }
        } catch (e) {}
        return SubmitCommentResponse.Error;
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
                        lineRef={props.inProgressComment.lineRef}
                        inProgress
                        comments={[
                            new RoastComment({
                                data: {
                                    lineNumber: props.inProgressComment.lineNumber,
                                    selectedText: props.inProgressComment.selectedText,
                                    author: props.inProgressComment.author,
                                },
                            }),
                        ]}
                    />
                </>
            )}
        </ul>
    );
};

export default DocumentCommentsView;
