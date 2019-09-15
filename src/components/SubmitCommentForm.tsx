import * as React from "react";
import { SubmitCommentResponse } from './CommentableCodePage/CommentableCode';
import RoastComment from './RoastComment'

// TODO UNUSED? DELETE?

export interface ISubmitCommentFormProps {
    comment: RoastComment,
    isCurrentlySelected: boolean,
    selectedText: string,
    onSubmitComment: ((details: RoastComment) => Promise<SubmitCommentResponse>) // handler for submitting a new comment
}

interface ISubmitCommentFormState {
    result?: SubmitCommentResponse,
    buttonText: string,
    resultMessage: string,
    active: boolean
}
/*
    todo maybe this should just be a comment
    with submit and cancel buttons
    a single (add) button creates (or at least unhides) the textbox, submit/cancel buttons, etc
*/
// todo - create a component for showing an error / retry for submitting and editing comments
export default class SubmitCommentForm extends React.Component<ISubmitCommentFormProps, ISubmitCommentFormState> {
    public state: ISubmitCommentFormState = {
        active: false,
        buttonText: "submit",
        result: undefined,
        resultMessage: ""
    }

    public render() {
        return (
          <div>
            <div hidden={this.state.active || !this.props.isCurrentlySelected}>
              <button onClick={this.handleAdd}>Add</button>
              {/* <p>{this.getCommentText}</p> */}
              {/* <h1>{(this.props.comment && this.props.comment.data && this.props.comment.data.selectedText) || "Select text to quote"}</h1> */}
              <h1>{this.props.selectedText || "Select text to quote"}</h1>
            </div>
            <div hidden={!this.state.active}>
                    Hello world - submit comment form
              <b>{this.state.resultMessage}</b>
              <button onClick={this.handleSubmit} hidden={this.state.result === SubmitCommentResponse.Success}>{this.state.buttonText}</button>
              {/* todo text box */}
              {/* todo cancel */}
            </div>
          </div>
        )
    }

    private handleAdd = () => {
        this.setState({active: true});
    }

    private handleSubmit = async () => {
        const result = await this.props.onSubmitComment(this.props.comment);
        let resultMessage;
        let {buttonText} = this.state;
        if (result === SubmitCommentResponse.Success) { 
            resultMessage="Success!"; 
        }
        else {
            resultMessage = "Error!";
            buttonText = "Retry";
        } 
        this.setState({result, resultMessage, buttonText});
    };



    // private getCommentText = () => {
    //     if (this.props.comment) {
    //         return this.props.comment.selectedText;
    //     }
        
    //     return "";
    // }
}
