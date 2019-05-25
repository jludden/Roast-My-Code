import * as React from "react";
import { SubmitCommentResponse } from './CommentableCode';
import RoastComment from "./RoastComment";
import SingleCommentView from './SingleCommentView';

export interface ICommentsViewProps {
    comments: RoastComment[],
    lineRefs: HTMLDivElement[],
    onEditComment: ((details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>) 
}

export default class DocumentCommentsView extends React.Component<ICommentsViewProps, any> {
  constructor(props: ICommentsViewProps) {
    super(props);

  }

  public render() {
    const comments = this.props.comments;
    return (
      <ul className={`flex-item comments-pane`} >
        {comments.map(comment => (
          <SingleCommentView 
            key={comment.id}
            comment={comment}
            onEditComment={this.props.onEditComment}
            lineRef={this.props.lineRefs[comment.data.lineNumber || 0]}
          />
        ))}
      </ul>
    );
  }

}
