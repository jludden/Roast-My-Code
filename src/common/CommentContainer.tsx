import * as React from 'react';
import { SubmitCommentResponse } from './CommentableCode';
import RoastComment from './RoastComment';
import SingleCommentView from './SingleCommentView';
import "rbx/index.css";
import { Container, Card, Heading, Message, Delete } from "rbx";

export interface ICommentContainerProps {
    comments: RoastComment[]; // comments belonging to this line number
    lineRef: HTMLDivElement;  // div of the (top) line of code associated with these comments
    onEditComment: ((details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>) 
  }
  
interface ICommentContainerState {
    isEditOn: boolean,
    styles: React.CSSProperties
}

export default class CommentContainer extends React.Component<ICommentContainerProps, ICommentContainerState> {
  constructor(props: ICommentContainerProps) {
    super(props);
    this.state = {
      isEditOn: false,
      styles: {
        top: 0,
        right: 0,
      }
    };
  }

  public componentWillReceiveProps(nextProps: ICommentContainerProps) {
    const styles: React.CSSProperties = {
      // backgroundColor: 'red',
      // border: '1px solid black',
      position: "absolute",
      top: this.computeTopOffset(nextProps.lineRef || this.props.lineRef),
    }
    this.setState({styles});
  }

  public render() {
    const comments = this.props.comments;
    return (
      <Card style={this.state.styles}>
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
      </Card>


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
    if (!ref) return "0px";
    return `${ref.offsetTop}px`;
  }
}