import * as React from "react";
import '../App.css';
// import ICCProps from './CommentableCode';

export interface ICCProps {
    documentName: string,
    commentsCount: number,
}

export default class DocumentHeader extends React.Component<ICCProps, object> {
    public render() {
        return (
            <div>
            <h1>CLASS HEADER</h1>
            <h2>{this.props.documentName}</h2>
            <span>number of comments: {this.props.commentsCount}</span>
            </div>
        );
    }
}