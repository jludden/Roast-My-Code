import React, { useState } from 'react';
import { SubmitCommentResponse } from './CommentableCodePage/CommentableCode';
import RoastComment from './CommentableCodePage/types/findRepositoryByTitle';

import 'rbx/index.css';
import { CardHeader } from './CommentableDocument/CommentContainer';
import { Message, Box, Textarea, Button, Card, Content, Icon, Delete } from 'rbx';
import { FaAngleDown, FaAngleUp, FaCommentAlt, FaReply, FaTrash, FaWrench } from 'react-icons/fa';

export interface IRoastCommentProps {
    comment: RoastComment;
    onEditComment: (details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>;
    onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse>; // handler for submitting a new comment
    onCancelComment: () => void;
}

const SingleCommentView = ({ comment, onEditComment, onCancelComment, onSubmitComment }: IRoastCommentProps) => {
    const inProgress = +comment._id < 0;
    let style = {};
    if (inProgress) {
        style = { border: 'dashed red' };
    }

    const [editMode, setEditMode] = useState(false);
    const [inputText, setInputText] = useState(comment.text);

    const updateCommentText = async () => {
       await onEditComment({ ...comment, text: inputText }, false);
       setEditMode(false);
    }

    return (
        <Card size="small" className="card-rounded" style={style}>
            <Card.Header>
                <Card.Header.Title>
                    <CardHeader comment={comment} />
                </Card.Header.Title>
                <Card.Header.Icon onClick={() => {}}>
                    <Icon>
                        <FaAngleDown />
                        {/* {this.state.expanded && <FaAngleUp />} */}
                    </Icon>
                </Card.Header.Icon>
            </Card.Header>
            <Card.Content>
                <Content>
                    {!inProgress && !editMode && (
                        <>
                            <p style={style}>{comment.text}</p>
                            <div className="float-button-pane button-group-end">
                                <Button
                                    color="warning"
                                    size="small"
                                    rounded
                                    onClick={() => onEditComment(comment, true)}
                                    tooltip={'Delete'}
                                >
                                    <FaTrash />
                                </Button>
                                <Button
                                    color="primary"
                                    size="small"
                                    rounded
                                    onClick={() => {
                                        onCancelComment();
                                        setEditMode(true);
                                    }}
                                    tooltip={'Edit'}
                                >
                                    <FaWrench />
                                </Button>
                            </div>
                        </>
                    )}

                    {!inProgress && editMode && (
                        <>
                            <Textarea
                                fixedSize
                                readOnly={false}
                                value={inputText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                            />
                            <Button.Group size="small" className="button-group-end">
                                <Button color="warning" rounded onClick={() => setEditMode(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    rounded
                                    onClick={() => updateCommentText()}
                                >
                                    Save
                                </Button>
                            </Button.Group>
                        </>
                    )}

                    {inProgress && (
                        <>
                            <Textarea
                                fixedSize
                                readOnly={false}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                            />
                            <Button.Group size="small" className="button-group-end">
                                <Button color="warning" rounded onClick={() => onCancelComment()}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    rounded
                                    onClick={() => onSubmitComment({ ...comment, text: inputText })}
                                >
                                    Save
                                </Button>
                            </Button.Group>
                        </>
                    )}
                </Content>
            </Card.Content>
        </Card>
    );
};

export default SingleCommentView;
