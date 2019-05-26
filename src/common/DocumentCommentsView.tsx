import * as React from "react";
import { SubmitCommentResponse } from './CommentableCode';
import RoastComment from "./RoastComment";
// import SingleCommentView from './SingleCommentView';
import CommentContainer from './CommentContainer';
import { number } from "prop-types";

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
    const lineNumberMap = new Map<number|undefined, RoastComment[]>();

    comments.map((comment: RoastComment) => {
      var line: RoastComment[] = lineNumberMap.get(comment.data.lineNumber) || [];
      line.push(comment);
      lineNumberMap.set(comment.data.lineNumber, line);    
    });

  //   lineNumberMap.entries((item, index) => (
  //     <span className="indent" key={index}>
  //         {index}
  //     </span>
  // ));

    return (
      <ul className={`flex-item comments-pane`} >
        {Array.from(lineNumberMap, ([lineNumber, comments]) => (
          <CommentContainer 
            key={lineNumber}
            comments={comments}
            onEditComment={this.props.onEditComment}
            // topOffset={this.computeTopOffset(this.props.lineRefs[comment.data.lineNumber || 0])}
            lineRef={this.props.lineRefs[lineNumber || 0]}
          />
        ))}
      </ul>
    );
  }
}
