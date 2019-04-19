import * as React from 'react';
import RoastComment, { ICommentList } from './RoastComment';


// todo
// tslint:disable-next-line:no-empty-interface
export interface IDocumentCommentsViewState {
}

export default class DocumentCommentsView extends React.Component<ICommentList, IDocumentCommentsViewState> {
  constructor(props: ICommentList) {
    super(props);

    this.state = {
    }
  }

  // todo - key -> comment id
  public render() {
    return (
      <ul>
        {this.props.data.map((comment) => {
            // tslint:disable-next-line:no-unused-expression
            <SingleCommentView key={comment.commentText} comment={comment} />
        })}
      </ul>
    );
  }
}


interface IRoastComment {
    comment: RoastComment
}

function SingleCommentView (props: IRoastComment) {
    return (
      <li>
          Comment text: {props.comment.commentText} 
      </li>
    );
}

