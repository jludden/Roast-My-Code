import React, { useState, useRef } from 'react';
import { SubmitCommentResponse } from '../CommentableCodePage/CommentableCode';
import RoastComment from '../CommentableCodePage/types/findRepositoryByTitle';

import 'rbx/index.css';
import { CardHeader } from './CommentContainer';
import { Message, Box, Textarea, Button, Card, Content, Icon, Delete, Dropdown } from 'rbx';
import { FaAngleDown,FaShareAlt, FaAngleUp, FaCommentAlt, FaReply, FaTrash, FaWrench } from 'react-icons/fa';
import { DropdownMenu } from '../RepoContents';

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

    const id = `comment~${comment._id}`;

    const updateCommentText = async () => {
        await onEditComment({ ...comment, text: inputText }, false);
        setEditMode(false);
    };

    return (
        <Card size="small" className="card-rounded" id={id} style={style}>
            <Card.Header>
                <Dropdown style={{ width: '100%' }}>
                    <Card.Header.Title>
                        <CardHeader comment={comment} />
                    </Card.Header.Title>
                    <Card.Header.Icon>
                        <Dropdown.Trigger>
                            <Icon>
                                <FaAngleDown />
                            </Icon>
                        </Dropdown.Trigger>
                    </Card.Header.Icon>
                    <Dropdown.Menu>
                        <Dropdown.Content>
                            <Dropdown.Item as="div">
                                <CopyLinkDropdownItem text={id} />
                            </Dropdown.Item>
                            <Dropdown.Item as="div">
                            <Button
                                size="small"
                                rounded
                                // todo onClick
                                // onClick={() => props.handleShare()}
                                tooltip="Share to Social Media"
                                color="warning"
                            >
                                <FaShareAlt />
                            </Button>
                            </Dropdown.Item>
                        </Dropdown.Content>
                    </Dropdown.Menu>
                </Dropdown>
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
                                <Button color="primary" rounded onClick={() => updateCommentText()}>
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

export const CopyLinkDropdownItem = ({ text: id }: { text: string }) => {
    const [copySuccess, setCopySuccess] = useState('Copy URL');
    const windowLocation = window.location.href.replace(window.location.hash, '');

    const textRef = useRef<HTMLTextAreaElement>(null);

    async function copyToClipboard(e: any) {
        (textRef as any).current.select();

        await navigator.clipboard.writeText(`${windowLocation}#${id}`);

        // document.execCommand('copy');
        // This is just personal preference.
        // I prefer to not show the whole text area selected.
        // e.target.focus();
        setCopySuccess('Copied!');
    }

    return (
        <div style={{ padding: '10px' }}>
            {/* <label htmlFor="comment-url-text">Permalink</label> */}
            <textarea id="comment-url-text" ref={textRef} value={`${windowLocation}#${id}`} readOnly 
            style={{height: '15px'}} hidden/>
            <Button color="primary" onClick={copyToClipboard}>{copySuccess}</Button>            
        </div>
    );
};

// export const SingleCommentInteractive

const CommentCard = ({
    comment,
    id,
    cardStyle,
    children,
}: {
    comment: RoastComment;
    id: string;
    cardStyle: any;
    children: any;
}) => (
    <Card size="small" className="card-rounded" id={id} style={cardStyle}>
        <Card.Header>
            <Dropdown style={{ width: '100%' }}>
                <Card.Header.Title>
                    <CardHeader comment={comment} />
                </Card.Header.Title>
                <Card.Header.Icon>
                    <Dropdown.Trigger>
                        <Icon>
                            <FaAngleDown />
                        </Icon>
                    </Dropdown.Trigger>
                </Card.Header.Icon>
                <Dropdown.Menu>
                    <Dropdown.Content>
                        <Dropdown.Item as="div">
                            <CopyLinkDropdownItem text={id} />
                        </Dropdown.Item>
                    </Dropdown.Content>
                </Dropdown.Menu>
            </Dropdown>
        </Card.Header>

        <Card.Content>
            <Content>{children}</Content>
        </Card.Content>
    </Card>
);

export const SingleCommentUI = ({ comment, ...props }: any) => (
    <CommentCard comment={comment} {...props}>
        <p>{comment.text}</p>
    </CommentCard>
);

export default SingleCommentView;
