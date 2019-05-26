import * as React from "react";
import { SubmitCommentResponse } from './CommentableCode';
import RoastComment from "./RoastComment";
import CommentContainer from './CommentContainer';

export interface ICommentsViewProps {
    lineNumberMap: Map<number|undefined, RoastComment[]>
    lineRefs: HTMLDivElement[],
    onEditComment: ((details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>) 
}

export default class DocumentCommentsView extends React.Component<ICommentsViewProps, any> {
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
      <ul className={`flex-item comments-pane`} >
        {Array.from(this.props.lineNumberMap, ([lineNumber, comments]) => (
          <CommentContainer 
            key={lineNumber}
            comments={comments}
            onEditComment={this.props.onEditComment}
            lineRef={this.props.lineRefs[lineNumber || 0]}
          />
        ))}
      </ul>
    );
  }
}
