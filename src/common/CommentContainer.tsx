import * as React from 'react';
import { SubmitCommentResponse } from './CommentableCode';
import RoastComment from './RoastComment';
import SingleCommentView from './SingleCommentView';


export interface ICommentContainerProps {
    comments: RoastComment[];
    lineRef: HTMLDivElement;
    onEditComment: ((details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>) 
  }
  
interface ICommentContainerState {
    isEditOn: boolean,
    styles: React.CSSProperties
}

// todo - create a component for a comment
    // and share it with documentbody? could even have different css to look different but behave the same

export default class CommentContainer extends React.Component<ICommentContainerProps, ICommentContainerState> {
  constructor(props: ICommentContainerProps) {
    super(props);
    this.state = {
      isEditOn: false,
      styles: {
        top: 0,
        right: 0
      }
    };
  }

  public componentWillReceiveProps(nextProps: ICommentContainerProps) {
    const styles: React.CSSProperties = {
      backgroundColor: 'red',
      border: '1px solid black',
      // top: nextProps.topOffset || this.props.topOffset
      top: this.computeTopOffset(nextProps.lineRef || this.props.lineRef),
    //     left: this.computeTopWith(this.props.lineRef)
    }
    this.setState({styles});
  }

  public render() {
    const comments = this.props.comments;
    return (
      <li style={this.state.styles}>        
        <p>[{this.props.comments[0].data.lineNumber}] comments: {this.props.comments.length}</p>        
        <ul>
          {comments.map(comment => (
            <SingleCommentView 
              key={comment.id}
              comment={comment}
              onEditComment={this.props.onEditComment}
              // topOffset={this.computeTopOffset(this.props.lineRef)}
              // lineRef={this.props.lineRefs[comment.data.lineNumber || 0]}
            />
          ))}
        </ul>
      </li>
    );
  }

  public computeTopOffset(ref: HTMLDivElement): string {
    if (!ref) return "0px";
    return `${ref.offsetTop}px`;
  }
}