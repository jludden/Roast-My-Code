import * as React from "react";
import Comment from './Comment'


export interface ISubmitCommentFormProps {
    comment: Comment,
    // onSubmitComment: (event: React.MouseEvent<HTMLButtonElement>) => void

    onSubmitComment: ((details: Comment) => void) // handler for submitting a new comment
}

export default class SubmitCommentForm extends React.Component<ISubmitCommentFormProps> {
    public render() {
        return (
            <div>
                Hello world - submit comment form
                <button onClick={this.handleClick}>Submit</button>
            </div>
        )
    }

    private handleClick = () => {
        this.props.onSubmitComment(this.props.comment);
    };
}