import React, { useEffect, useState } from 'react';
import { SubmitCommentResponse } from '../CommentableCodePage/CommentableCode';
import RoastComment, { User } from '../CommentableCodePage/types/findRepositoryByTitle';
import SingleCommentView from '../SingleCommentView';
import 'rbx/index.css';
import { Container, Card, Button, Content, Heading, Message, Icon, Delete, Textarea } from 'rbx';
import { FaAngleDown, FaAngleUp, FaCommentAlt } from 'react-icons/fa';
import { Collapse } from 'react-collapse';
import '../../App.css';
import { UserAvatar,UserAvatarBadge, UserHeader } from '../Avatar';

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

// export const CommentContainer = (props: ICommentContainerProps) => {
//     const [inProgressSubmitted, submitInProgress] = React.useState();

//     React.useEffect(() => {
//         setUser(props.user);
//     }, [props.inProgress])

// }

// const CommentContainer2 = (props: ICommentContainerProps) => {
//     const {comments} = props;

//     return (
//         <div>{message}</div>
//     )
// }

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
            // backgroundColor: 'red',
            // border: '1px solid black',
            position: 'absolute',
            top: computeTopOffset(nextProps.lineRef),
        };
        return {
            ...prevState,
            styles,
        };
    }

    // public componentWillReceiveProps(nextProps: ICommentContainerProps) {
    //     const styles: React.CSSProperties = {
    //         // backgroundColor: 'red',
    //         // border: '1px solid black',
    //         position: 'absolute',
    //         top: this.computeTopOffset(nextProps.lineRef || this.props.lineRef),
    //     };
    //     this.setState({ styles });
    // }

    public render() {
        const { comments } = this.props;

        return (
            <div className="comment-container" style={this.state.styles}>

                <UserAvatarBadge 
                    avatar={comments[0].author?.avatar || 0}
                    badge={comments.length}
                    onClickHandler={this.onMinimizeClicked}
                    tooltip={comments[0].text}
                    />
{/* containerStyle={{ marginLeft: '-35px', position: 'absolute' }} */}
{/* // iconStyle={{fill: 'tomato', backgroundColor: 'white', borderRadius: '100%'}} */}
{/* 
<Button badge={commentsCount} badgeColor="primary" badgeOutlined color="primary" outlinedstyle={mgRight}>
                        <FaCommentAlt />
                    </Button>

                <UserAvatar 
                    avatar={0}
                    onClickHandler={this.onMinimizeClicked}
                    containerStyle={{ marginLeft: '-35px', position: 'absolute' }}
                    iconStyle={{fill: 'tomato', backgroundColor: 'white', borderRadius: '100%'}}
                      /> */}

                {/* <Button onClick={this.onMinimizeClicked} color="light">
                    <FaCommentAlt />
                </Button> */}
                                    <Collapse isOpened={this.state.expanded}>

                <Card size="medium">
                    <Card.Header>
                        <Card.Header.Title>
                            <CardHeader comment={this.props.comments[0]} />
                        </Card.Header.Title>
                        <Card.Header.Icon onClick={this.onMinimizeClicked}>
                            <Icon>
                                {!this.state.expanded && <FaAngleDown />}
                                {this.state.expanded && <FaAngleUp />}
                            </Icon>
                        </Card.Header.Icon>
                    </Card.Header>
                        <Card.Content>
                            <Content>
                                {/* {comments.map(comment => (
                                    <SingleCommentView
                                        key={comment.id}
                                        comment={comment}
                                        onEditComment={this.props.onEditComment}
                                        inProgress={this.props.inProgress}
                                    />
                                ))} */}

                                {/* {!this.props.inProgress && */}
                                {comments.map((comment) => (
                                    <SingleCommentView key={comment._id} comment={comment} />
                                ))}

                                {this.props.inProgress && (
                                    <Textarea
                                        fixedSize
                                        readOnly={false}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            this.setState({ inputText: e.target.value })
                                        }
                                    />
                                )}

                                {this.props.children}
                            </Content>
                        </Card.Content>

                        <Card.Footer>
                            {this.props.inProgress && (
                                <>
                                    <Card.Footer.Item as="a" onClick={() => this.props.onCancelComment()}>
                                        <Button color="light">Cancel</Button>
                                    </Card.Footer.Item>
                                    <Card.Footer.Item
                                        as="a"
                                        onClick={() => {
                                            comments[0].text = this.state.inputText;
                                            this.props.onSubmitComment(comments[0]);
                                        }}
                                    >
                                        <Button color="info" type="submit">
                                            Submit
                                        </Button>
                                    </Card.Footer.Item>
                                </>
                            )}
                            {!this.props.inProgress && !this.state.editMode && (
                                <>
                                    <Card.Footer.Item as="a" onClick={() => this.setState({ editMode: true })}>
                                        Edit
                                    </Card.Footer.Item>
                                    <Card.Footer.Item as="a" onClick={() => this.props.onReplyComment()}>
                                        Reply
                                    </Card.Footer.Item>
                                </>
                            )}
                            {!this.props.inProgress && this.state.editMode && (
                                <>
                                    <Card.Footer.Item
                                        as="a"
                                        onClick={() => this.props.onEditComment(comments[0], true)}
                                    >
                                        Delete All
                                    </Card.Footer.Item>
                                    <Card.Footer.Item as="a">Reply</Card.Footer.Item>
                                    <Card.Footer.Item as="a">Cancel</Card.Footer.Item>
                                    <Card.Footer.Item
                                        as="a"
                                        onClick={() => this.props.onEditComment(comments[0], false)}
                                    >
                                        Save
                                    </Card.Footer.Item>
                                </>
                            )}
                        </Card.Footer>
                </Card>
                </Collapse>

            </div>

            // <li className="float-comment-pane" style={this.state.styles}>
            //   <p>[{this.props.comments[0].data.lineNumber}] comments: {this.props.comments.length}</p>
            //   <ul>
            //     {comments.map(comment => (
            //       <SingleCommentView
            //         key={comment.id}
            //         comment={comment}
            //         onEditComment={this.props.onEditComment}
            //       />
            //     ))}
            //   </ul>
            // </li>
        );
    }

    /*
        <Message style={this.state.styles}>
          <Message.Header>
            [{this.props.comments[0].data.lineNumber}] comments: {this.props.comments.length}
            <Delete />
          </Message.Header>
          <Message.Body>
          {comments.map(comment => (
            <SingleCommentView 
              key={comment.id}
              comment={comment}
              onEditComment={this.props.onEditComment}
            />
          ))}
        </Message.Body>
      </Message>
*/
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
