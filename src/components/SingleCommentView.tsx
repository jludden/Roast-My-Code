import * as React from 'react';
import { SubmitCommentResponse } from './CommentableCodePage/CommentableCode';
import RoastComment from './RoastComment';

import 'rbx/index.css';
import { Message, Box, Textarea, Button, Delete } from 'rbx';

export interface IRoastCommentProps {
    comment: RoastComment;
    // lineRef: HTMLDivElement;
    // topOffset: string;
    onEditComment: (details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>;
}

interface ISingleCommentState {
    isEditOn: boolean;
    // styles: React.CSSProperties
}

// todo - create a component for a comment
// and share it with documentbody? could even have different css to look different but behave the same

export default class SingleCommentView extends React.Component<IRoastCommentProps, ISingleCommentState> {
    constructor(props: IRoastCommentProps) {
        super(props);
        this.state = {
            isEditOn: false,
            // styles: {
            //   top: 0,
            //   right: 0
            // }
        };
    }

    // public async componentDidMount() {
    //   const styles: React.CSSProperties = {
    //     backgroundColor: 'red',
    //     border: '1px solid black',
    //     top: this.props.topOffset
    //     // top: this.computeTopWith(this.props.lineRef),
    //   //     left: this.computeTopWith(this.props.lineRef)
    //   }
    //   this.setState({styles});
    // }

    // public computeTopWith(ref: HTMLDivElement): string {
    //   if (!ref) return "0px";
    //   return `${ref.offsetTop}px`;
    // }

    // public componentWillReceiveProps(nextProps: IRoastCommentProps) {
    //   const styles: React.CSSProperties = {
    //     backgroundColor: 'red',
    //     border: '1px solid black',
    //     top: nextProps.topOffset || this.props.topOffset
    //     // top: this.computeTopWith(nextProps.lineRef || this.props.lineRef),
    //   //     left: this.computeTopWith(this.props.lineRef)
    //   }
    //   this.setState({styles});
    // }

    //          <li className="float-comment" style={this.state.styles}>

    // todo have just a border on one left side: border-width: 0 0 0 4px;
    public render() {
        const { isEditOn } = this.state;
        const text = this.props.comment.data.comment;
        return (
            // <Message>
            //   <Message.Header><Delete> </Delete></Message.Header>
            //   <Message.Body>
            <Textarea
                fixedSize
                readOnly={!this.state.isEditOn}
                placeholder={text}
                onClick={this.handleCommentClicked}
            />
            //   </Message.Body>
            // </Message>
            //   <Message as="textarea" color="danger" defaultValue={text}>

            // </Message>

            // <li className="single-comment">
            //     <Message as="textarea" color="danger">
            //       <Message.Body>

            //         HELLO
            //         </Message.Body>
            //     </Message>
            //     <span onClick={this.handleCommentClicked} hidden = {isEditOn}> Line Number: {this.props.comment.data.lineNumber} Comment text: {text}</span>
            //     <div hidden = {!isEditOn}>
            //         <span className="boxclose" id="boxclose" onClick={this.handleCommentDelete} />
            //         <textarea defaultValue={text}/>
            //         <Message>
            //           <Message.Body>
            //             {text}
            //           </Message.Body>
            //         </Message>
            //         <button onClick={this.handleCommentSubmit}>Update</button>
            //     </div>
            // </li>
        );
    }

    // todo how do we turn off edit mode when anywhere else in the app is clicked?
    private handleCommentClicked = () => this.setState({ isEditOn: !this.state.isEditOn });

    private handleCommentSubmit = () => {
        this.props.onEditComment(this.props.comment);
    };

    private handleCommentDelete = () => {
        this.props.onEditComment(this.props.comment, true);
    };
}
