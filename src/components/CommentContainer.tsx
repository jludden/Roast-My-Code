import * as React from 'react';
import { SubmitCommentResponse } from './CommentableCodePage/CommentableCode';
import RoastComment from './RoastComment';
import SingleCommentView from './SingleCommentView';
import 'rbx/index.css';
import { Container, Card, Button, Content, Heading, Message, Icon, Delete } from 'rbx';
import { FaAngleDown, FaCommentAlt } from 'react-icons/fa';
import { Collapse } from 'react-collapse';

export interface ICommentContainerProps {
    comments: RoastComment[]; // comments belonging to this line number
    lineRef: HTMLDivElement; // div of the (top) line of code associated with these comments
    onEditComment: (details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>;
    onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse>; // handler for submitting a new comment
    inProgress: boolean; // flag for a new, unsubmitted comment
}

interface ICommentContainerState {
    expanded: boolean;
    editMode: boolean; // flag for an existing comment in editMode
    styles: React.CSSProperties;
}

export default class CommentContainer extends React.PureComponent<ICommentContainerProps, ICommentContainerState> {
    constructor(props: ICommentContainerProps) {
        super(props);
        this.state = {
            expanded: true,
            editMode: false,
            styles: {
                top: 0,
                right: 0,
            },
        };
    }

    private onMinimizeClicked = () => {
        // this.setState({expanded:false});

        this.setState({ expanded: !this.state.expanded });
    };

    public componentWillReceiveProps(nextProps: ICommentContainerProps) {
        const styles: React.CSSProperties = {
            // backgroundColor: 'red',
            // border: '1px solid black',
            position: 'absolute',
            top: this.computeTopOffset(nextProps.lineRef || this.props.lineRef),
        };
        this.setState({ styles });
    }

    public render() {
        const { comments } = this.props;
        return (
            <div style={this.state.styles}>
                <Button onClick={this.onMinimizeClicked} color="light">
                    <FaCommentAlt />
                </Button>
                <Collapse isOpened={this.state.expanded}>
                    <Card size="large">
                        <Card.Header>
                            <Card.Header.Title>
                                [{this.props.comments[0].data.lineNumber}] comments: {this.props.comments.length}
                            </Card.Header.Title>
                            <Card.Header.Icon onClick={this.onMinimizeClicked}>
                                <Icon>
                                    <FaAngleDown />
                                </Icon>
                            </Card.Header.Icon>
                        </Card.Header>
                        <Card.Content>
                            <Content>
                                <Heading>
                                    [{this.props.comments[0].data.lineNumber}] comments: {this.props.comments.length}
                                    <Delete />
                                </Heading>
                                {comments.map(comment => (
                                    <SingleCommentView
                                        key={comment.id}
                                        comment={comment}
                                        onEditComment={this.props.onEditComment}
                                    />
                                ))}
                            </Content>
                        </Card.Content>

                        <Card.Footer>
                            {this.props.inProgress && (
                                <>
                                    <Card.Footer.Item as="a">Cancel</Card.Footer.Item>
                                    <Card.Footer.Item as="a" onClick={() => this.props.onSubmitComment(comments[0])}>
                                        Submit
                                    </Card.Footer.Item>
                                </>
                            )}
                            {!this.props.inProgress && !this.state.editMode && (
                                <>
                                    <Card.Footer.Item as="a" onClick={() => this.setState({ editMode: true })}>
                                        Edit
                                    </Card.Footer.Item>
                                    <Card.Footer.Item as="a">Reply</Card.Footer.Item>
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

    // get the top offset of the associated line of code
    public computeTopOffset(ref: HTMLDivElement): string {
        if (!ref) return '0px';
        return `${ref.offsetTop}px`;
    }
}
