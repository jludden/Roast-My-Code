import * as React from "react";
import Comment from './Comment'
import { SubmitCommentResponse } from './CommentableCode';


export interface ISubmitCommentFormProps {
    comment: Comment,
    isCurrentlySelected: boolean,
    onSubmitComment: ((details: Comment) => Promise<SubmitCommentResponse>) // handler for submitting a new comment
}

interface ISubmitCommentFormState {
    result?: SubmitCommentResponse
}

export default class SubmitCommentForm extends React.Component<ISubmitCommentFormProps, ISubmitCommentFormState> {
    public render() {
        return (
            <div hidden={!this.props.isCurrentlySelected}>
                Hello world - submit comment form
                <b>{this.getMessage()}</b>
                <button onClick={this.handleClick}>Submit</button>
            </div>
        )
    }

    private handleClick = async () => {
        const result = await this.props.onSubmitComment(this.props.comment);
        this.setState({result});
    };

    private getMessage(): string {
        if(this.state == null || this.state.result == null) { return ""; }
        if(this.state.result === SubmitCommentResponse.Success) { return "Success!"; }
        return "Error!";
    }

}
