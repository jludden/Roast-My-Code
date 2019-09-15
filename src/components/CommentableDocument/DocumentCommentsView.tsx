import * as React from "react";
import { SubmitCommentResponse } from '../CommentableCodePage/CommentableCode';
import RoastComment from "../RoastComment";
import CommentContainer from '../CommentContainer';

export interface ICommentsViewProps {
  lineNumberMap: Map<number|undefined, RoastComment[]>
  lineRefs: HTMLDivElement[],
  inProgressComment?: IUnsubmittedComment,
  onEditComment: ((details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>),
  onSubmitComment: ((details: RoastComment) => Promise<SubmitCommentResponse>) // handler for submitting a new comment
 
}

export interface IUnsubmittedComment {
  lineRef: HTMLDivElement,
  lineNumber: number,
  selectedText: string,
  author: string,
}

interface ICommentsViewState {

}

export default class DocumentCommentsView extends React.Component<ICommentsViewProps, ICommentsViewState> {
  constructor(props: ICommentsViewProps) {
    super(props);
  }

  public render() {

    // Group comments into Comment Containers based their associated line number TODO this could be state or something
    // const lineNumberMap = new Map<number|undefined, RoastComment[]>();
    // this.props.comments.map((comment: RoastComment) => {
    //   var line: RoastComment[] = lineNumberMap.get(comment.data.lineNumber) || [];
    //   line.push(comment);
    //   lineNumberMap.set(comment.data.lineNumber, line);    
    // });


    return (
      <ul className="flex-item comments-pane">
        {/* display all the saved comments */}
        {Array.from(this.props.lineNumberMap, ([lineNumber, comments]) => (
          <CommentContainer 
            key={lineNumber}
            comments={comments}
            onEditComment={this.props.onEditComment}
            onSubmitComment={this.props.onSubmitComment}
            lineRef={this.props.lineRefs[lineNumber || 0]}
            inProgress={false}
          />
        ))}
        {/* also display the comment in progress if any */}
        {this.props.inProgressComment && (
        <CommentContainer 
          key={`unsubmitted ${this.props.inProgressComment.lineRef}`}
          onEditComment={this.props.onEditComment}
          onSubmitComment={this.props.onSubmitComment}
          lineRef={this.props.inProgressComment.lineRef}
          inProgress
          comments={[new RoastComment({
                data: {
                    lineNumber: this.props.inProgressComment.lineNumber,
                    selectedText: this.props.inProgressComment.selectedText,
                    author:  this.props.inProgressComment.author,
                }
              })]}
        />
)}
      </ul>
    );
  }
}
