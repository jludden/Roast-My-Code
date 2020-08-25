import React, { useEffect, useState } from 'react';
import { SubmitCommentResponse } from '../CommentableCodePage/CommentableCode';
import RoastComment, { User } from '../CommentableCodePage/types/findRepositoryByTitle';
import SingleCommentView from '../SingleCommentView';
import 'rbx/index.css';
import { Container, Card, Button, Content, Heading, Message, Icon, Delete, Textarea } from 'rbx';
import { FaAngleDown, FaAngleUp, FaCommentAlt, FaReply } from 'react-icons/fa';
import { Collapse } from 'react-collapse';
import '../../App.css';
import { UserAvatar, UserAvatarBadge, UserHeader } from '../Avatar';

export interface ICommentContainerProps {
    comments: RoastComment[]; // comments belonging to this line number
    lineRef: HTMLDivElement; // div of the (top) line of code associated with these comments
    onEditComment: (details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>;
    onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse>; // handler for submitting a new comment
    onCancelComment: () => void;
    onReplyComment: () => void;
    inProgress: boolean; // flag for a new, unsubmitted comment
    startMinimized: boolean;
}

interface ICommentContainerState {
    inputText: string;
    expanded: boolean;
    editMode: boolean; // flag for an existing comment in editMode
    styles: React.CSSProperties;
}

// get the top offset of the associated line of code
function computeTopOffset(ref: HTMLDivElement): string {
    if (!ref) return '0px';
    return `${ref.offsetTop}px`;
}

export default class CommentContainer extends React.PureComponent<ICommentContainerProps, ICommentContainerState> {
    constructor(props: ICommentContainerProps) {
        super(props);
        this.state = {
            inputText: '',
            expanded: !props.startMinimized,
            editMode: false,
            styles: {
                top: 0,
                right: 0,
            },
        };
    }

    private onMinimizeClicked = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    static getDerivedStateFromProps(nextProps: ICommentContainerProps, prevState: ICommentContainerState) {
        const styles: React.CSSProperties = {
            position: 'absolute',
            top: computeTopOffset(nextProps.lineRef),
        };
        return {
            ...prevState,
            styles,
        };
    }
    public render() {
        const { comments } = this.props;

        return (
            <div className="comment-container" style={this.state.styles}>
                <UserAvatarBadge
                    avatar={comments[0].author?.avatar || 0}
                    badge={comments.length}
                    onClickHandler={this.onMinimizeClicked}
                    tooltip={comments[0].text}
                    hideTooltip={this.state.expanded}
                />
                <Collapse isOpened={this.state.expanded}>
                    {comments.map((comment) => (
                        <SingleCommentView
                            key={comment._id}
                            comment={comment}
                            onSubmitComment={this.props.onSubmitComment}
                            onEditComment={this.props.onEditComment}
                            onCancelComment={this.props.onCancelComment}
                        />
                    ))}
                    {this.props.children}
                    {!this.props.inProgress && (
                        <Button.Group className="button-group-end">
                            <Button
                                color="warning"
                                rounded
                                onClick={() => this.props.onReplyComment()}
                                tooltip={'Reply'}
                            >
                                <FaReply />
                            </Button>
                        </Button.Group>
                    )}
                </Collapse>
            </div>
        );
    }
}

export const CardHeader = ({ comment }: { comment: RoastComment }) => {
    return (
        <div className="commentHeader">
            <UserHeader user={comment.author} />
            <div style={{ fontWeight: 'lighter', fontSize: '12px' }}>
                {comment.updatedAt ? comment.updatedAt.toLocaleString() : 'Just now'}
            </div>
            {/* 7:45 AM Nov 28 */}
        </div>
    );
};
