import * as React from "react";
import RoastComment, { ICommentList } from "./RoastComment";

// todo
// tslint:disable-next-line:no-empty-interface
export interface IDocumentCommentsViewState {}

export default class DocumentCommentsView extends React.Component<
  ICommentList,
  IDocumentCommentsViewState
> {
  constructor(props: ICommentList) {
    super(props);

    this.state = {};
  }

  // todo - key -> comment id
  // key={comment.commentText}
  public render() {
    const comments = this.props.data;
    return (
      <ul className=".flex-item">
        {comments.map(comment => (
          <SingleCommentView key={comment.commentText} comment={comment} />
        ))}
      </ul>
    );
  }
}

interface IRoastComment {
  comment: RoastComment;
}

function SingleCommentView(props: IRoastComment) {
  return <li>Comment text: {props.comment.selectedText}</li>;
}
