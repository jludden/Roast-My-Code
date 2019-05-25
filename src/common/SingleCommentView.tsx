import * as React from 'react';
import { SubmitCommentResponse } from './CommentableCode';
import RoastComment from './RoastComment';

export interface IRoastComment {
    comment: RoastComment;
    lineRef: HTMLDivElement;
    onEditComment: ((details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>) 
  }
  
interface ISingleCommentState {
    isEditOn: boolean,
    styles: React.CSSProperties
}

// todo - create a component for a comment
    // and share it with documentbody? could even have different css to look different but behave the same

export default class SingleCommentView extends React.Component<IRoastComment, ISingleCommentState> {
  constructor(props: IRoastComment) {
    super(props);
    this.state = {
      isEditOn: false,
      styles: {
        top: 0,
        right: 0
      }
    };
  }

  public async componentDidMount() {
    // this.setState({
    //   styles: {
    //     top: this.computeTopWith(this.props.lineRef),
    //     left: this.computeTopWith(this.props.lineRef)
    //   }
    // })

    const styles: React.CSSProperties = {
      backgroundColor: 'red',
      border: '1px solid black',
      top: this.computeTopWith(this.props.lineRef),
    //     left: this.computeTopWith(this.props.lineRef)
    }
    this.setState({styles});
  }

  public computeTopWith(ref: HTMLDivElement): string {
    if (!ref) return "0px";
    return `${ref.offsetTop}px`;
  }

  public componentWillReceiveProps(nextProps: IRoastComment) {
    const styles: React.CSSProperties = {
      backgroundColor: 'red',
      border: '1px solid black',
      top: this.computeTopWith(nextProps.lineRef || this.props.lineRef),
    //     left: this.computeTopWith(this.props.lineRef)
    }
    this.setState({styles});
  }

  public render() {
      const isEditOn = this.state.isEditOn;
      const text = this.props.comment.data.selectedText;
      return (
          <li className="float-comment" style={this.state.styles}>                
              <span onClick={this.handleCommentClicked} hidden = {isEditOn}> Line Number: {this.props.comment.data.lineNumber} Comment text: {text}</span>
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
