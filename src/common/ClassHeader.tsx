import * as React from "react";
import '../App.css';
// import ICCProps from './CommentableCode';

export interface ICCProps {
    document: string
}

export default class ClassHeader  extends React.Component<ICCProps, object> {
    public render() {
        return (
            <h1>CLASS HEADER</h1>
        );
    }
}