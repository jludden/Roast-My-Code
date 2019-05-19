import * as React from 'react';
import { SubmitCommentResponse } from './CommentableCode';
import RoastComment from './RoastComment';

export interface IRoastComment {
    comment: RoastComment;
    onEditComment: ((details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>) 
  }
  
interface ISingleCommentState {
    isEditOn: boolean
}

// todo - create a component for a comment
    // and share it with documentbody? could even have different css to look different but behave the same

export default class SingleCommentView extends React.Component<IRoastComment, ISingleCommentState> {
  constructor(props: IRoastComment) {
    super(props);
    this.state = {isEditOn: false};
  }

    public render() {
        const isEditOn = this.state.isEditOn;
        const text = this.props.comment.data.selectedText;
        return (
            <li>                
                <span onClick={this.handleCommentClicked} hidden = {isEditOn}> Comment text: {text}</span>
                <div hidden = {!isEditOn}>
                    <span className="boxclose" id="boxclose" onClick={this.handleCommentDelete}>x</span>
                    <textarea defaultValue={text}/>
                    <button onClick={this.handleCommentSubmit}>Update</button>
                </div>
            </li>
        );
    }
  

  
  // todo how do we turn off edit mode when anywhere else in the app is clicked?
  private handleCommentClicked = () => this.setState({isEditOn: !this.state.isEditOn})

  private handleCommentSubmit = () => {
    this.props.onEditComment(this.props.comment);
  }

  private handleCommentDelete = () => {
    this.props.onEditComment(this.props.comment, true)
  }
}
