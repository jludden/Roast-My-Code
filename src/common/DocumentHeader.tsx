import * as React from "react";
import '../App.css';
// import ICCProps from './CommentableCode';

export interface ICCProps {
    document: string
}

export default class DocumentHeader extends React.Component<ICCProps, object> {
    public render() {
        return (
            <div>
            <h1>CLASS HEADER</h1>
            <h2>{this.props.document}</h2>
            </div>
        );
    }
}