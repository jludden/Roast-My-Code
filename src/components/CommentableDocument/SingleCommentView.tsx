import React, { useState, useRef, useContext } from 'react';
import { SubmitCommentResponse } from '../CommentableCodePage/CommentableCode';
import RoastComment from '../CommentableCodePage/types/findRepositoryByTitle';
import { CardHeader } from './CommentContainer';
import { Emoji, Picker, EmojiData } from 'emoji-mart';
import data from 'emoji-mart/data/twitter.json';
import { Message, Box, Textarea, Button, Card, Content, Icon, Delete, Dropdown } from 'rbx';
import {
    FaAngleDown,
    FaShareAlt,
    FaAngleUp,
    FaCommentAlt,
    FaReply,
    FaTrash,
    FaWrench,
    FaLink,
    FaMinusSquare,
    FaEllipsisV,
} from 'react-icons/fa';
import { DropdownMenu } from '../RepoContents';
import { notificationStore } from './DocumentCommentsView';
import { Collapse } from 'react-collapse';
import { firebaseStore } from '../FirebaseChat/FirebaseCommentsProvider';
import { SocialToolbar } from '../Common/SocialMediaShare';
import { Prompt } from 'react-router-dom';

export interface IRoastCommentProps {
    comment: RoastComment;
    onEditComment: (details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>;
    onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse>; // handler for submitting a new comment
    onCancelComment: () => void;
    index: number;
    onMinimizeClicked?: () => void;
}

// permanent link to the comment based on author/repository/filepath + comment id (hash)
export const GetCommentPermalink = (id: string): string => {
    const windowLocation = window.location.href.replace(window.location.hash, '');
    return `${windowLocation}#${id}`;
};

const SingleCommentView = (props: IRoastCommentProps & { setIsBlocking: any }) => {
    const { comment, onEditComment, onCancelComment, onSubmitComment, index, onMinimizeClicked, setIsBlocking } = props;
    const inProgress = +comment._id < 0;
    let style = {};
    if (inProgress) {
        style = { border: 'dashed red' };
    }

    const [editMode, setEditMode] = useState(false);
    const [inputText, setInputText] = useState(comment.text);
    const { showSuccessMessage } = useContext(notificationStore);
    const {
        state: { user },
    } = useContext(firebaseStore);

    const id = `comment~${comment._id}`;
    const permalink = GetCommentPermalink(id);
    const userIsCommentAuthor = user && (user as any).uid === comment.author?.uid;

    const updateCommentText = async () => {
        await onEditComment({ ...comment, text: inputText }, false);
        setEditMode(false);
    };

    const [pickedEmoji, setPickedEmoji] = useState<EmojiData|string>(':santa::skin-tone-3:');
    const handleEmojiPicked = (emoji: EmojiData, event: any) => {
        setPickedEmoji(emoji);
    };

    return (
        <Card size="small" className="card-rounded" id={id} style={style}>
            <Card.Header>
                <Dropdown style={{ width: '100%' }}>
                    <Card.Header.Title>
                        <CardHeader comment={comment} />
                    </Card.Header.Title>
                    <Card.Header.Icon>
                        {index === 0 && (
                            <Icon onClick={onMinimizeClicked}>
                                <FaMinusSquare />
                            </Icon>
                        )}
                        <Dropdown.Trigger>
                            <Icon>
                                {/* <FaAngleDown /> */}
                                <FaEllipsisV />
                            </Icon>
                        </Dropdown.Trigger>
                    </Card.Header.Icon>
                    <Dropdown.Menu style={{ width: '100%' }}>
                        <Dropdown.Content>
                            <Dropdown.Item as="div">
                                <CopyLinkDropdownItem permalink={permalink} showSuccessMessage={showSuccessMessage} />
                                <SocialToolbar url={permalink} shareText={comment.text} comment={comment} />
                            </Dropdown.Item>
                        </Dropdown.Content>
                    </Dropdown.Menu>
                </Dropdown>
            </Card.Header>

            <Card.Content>
                <Content>
                    {!inProgress && !editMode && (
                        <>
                            {/* {comment.selectedText && <QuotedText text={comment.selectedText} />} */}
                            <p style={style}>{comment.text}</p>
                            {!userIsCommentAuthor && (
                                <>
                                <div className="float-emoji-pane">
                                    {  (typeof pickedEmoji === "string") ? pickedEmoji : `${pickedEmoji.id}: ${pickedEmoji.name}` }
                                    <Emoji emoji={pickedEmoji} size={16} />
                                </div>
                                <div className="float-emoji-pane">    
                                    {comment.reactions && Object.entries(comment.reactions).map(
                                        ([emojiKey, numReactions]) => (
                                            <div>
                                            <Emoji emoji={emojiKey}  size={32}/>
                                            <span>{numReactions}</span>
                                            </div>
                                        )
                                    )}
                                    

                                    {/* <NimblePicker set='twitter' data={data} /> */}
                                    <Picker 
                                    set='twitter'
                                    onClick={handleEmojiPicked}
                                    recent={['+1', 'joy', 'heart_eyes', 'nauseated_face']}
                                    showPreview={false}
                                    emojiTooltip={true}
                                    exclude={['places']}
                                    />
                                </div>
                                </>
                            )}
                            {userIsCommentAuthor && (
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
                            )}
                        </>
                    )}

                    {!inProgress && editMode && (
                        <>
                            {/* {comment.selectedText && (
                                <Textarea
                                    disabled
                                    fixedSize
                                    size="small"
                                    value={comment.selectedText.replace(/(\r\n|\n|\r)/gm, '')}
                                />
                            )} */}
                            <Textarea
                                fixedSize
                                readOnly={false}
                                value={inputText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setInputText(e.target.value);
                                    setIsBlocking(e.target.value.length > 0);
                                }}
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
                            {' '}
                            {/* {comment.selectedText && (
                                <Textarea
                                    disabled
                                    fixedSize
                                    size="small"
                                    value={comment.selectedText.replace(/(\r\n|\n|\r)/gm, '')}
                                />
                            )} */}
                            <Textarea
                                autoFocus
                                fixedSize
                                readOnly={false}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setInputText(e.target.value);
                                    setIsBlocking(e.target.value.length > 0);
                                }}
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

export const CopyLinkDropdownItem = ({
    permalink,
    showSuccessMessage,
}: {
    permalink: string;
    showSuccessMessage: (message: string) => void;
}) => {
    const [copySuccess, setCopySuccess] = useState('Copy URL');
    const textRef = useRef<HTMLTextAreaElement>(null);

    async function copyToClipboard(e: any) {
        (textRef as any).current.select();

        try {
            showSuccessMessage('Copied link to clipboard');
            await navigator.clipboard.writeText(permalink);
            setCopySuccess('Copied!');
        } catch (error) {
            console.warn('error occured writing to clipboard');
        }
    }

    return (
        <>
            {/* <div style={{ padding: '10px' }}> */}
            {/* <label htmlFor="comment-url-text">Permalink</label> */}
            <textarea
                id="comment-url-text"
                ref={textRef}
                value={permalink}
                readOnly
                style={{ height: '15px' }}
                hidden
            />
            <Button color="primary" onClick={copyToClipboard}>
                {/* {copySuccess} */}
                <FaLink />
            </Button>
            {/* </div> */}
        </>
    );
};

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
}) => {
    const { showSuccessMessage } = useContext(notificationStore);
    const permalink = GetCommentPermalink(id);

    return (
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
                    <Dropdown.Menu style={{ width: '100%' }}>
                        <Dropdown.Content>
                            <Dropdown.Item as="div">
                                <CopyLinkDropdownItem permalink={permalink} showSuccessMessage={showSuccessMessage} />
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
};

const QuotedText = ({ text }: { text: string }) => {
    const [expanded, setExpanded] = useState(false);

    if (!expanded)
        return (
            <Button color="info" onClick={() => setExpanded(!expanded)} outlined inverted rounded>
                Show Quoted
            </Button>
        );

    return (
        <Collapse isOpened={expanded} onClick={() => setExpanded(!expanded)}>
            <Textarea
                style={{ marginBottom: '10px' }}
                disabled
                fixedSize
                size="small"
                value={text.replace(/(\r\n|\n|\r)/gm, '')}
            />
        </Collapse>
    );
};

export const SingleCommentUI = ({ comment, ...props }: any) => (
    <CommentCard comment={comment} {...props}>
        <p>{comment.text}</p>
    </CommentCard>
);

export const PromptWrapper = ({ render }: { render: (setIsBlocking: any) => JSX.Element }) => {
    const [isBlocked, setIsBlocked] = useState(false);
    return (
        <>
            <Prompt when={isBlocked} message={'Are you sure you want to abandon your comment?'} />
            {render(setIsBlocked)}
        </>
    );
};

const PromptWrappedSingleCommentView = (props: IRoastCommentProps) => {
    return (
        <PromptWrapper
            render={(setIsBlocking: any) => {
                return <SingleCommentView {...props} setIsBlocking={setIsBlocking} />;
            }}
        />
    );
};

export default PromptWrappedSingleCommentView;
