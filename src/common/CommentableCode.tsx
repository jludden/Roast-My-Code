import * as React from "react";
import '../App.css';
import ClassHeader from "./ClassHeader";

export interface ICCProps {
    document: string
}

export default class CommentableCode extends React.Component<ICCProps, object> {
    public simpleMethod(a:number, b:number) {
        return a*b;
    }

    public render() {
        const {document} = this.props;

        return (
            <div>
            <h1>
               Hello welcome to the Annotateable Code Sample
            </h1>
            <ClassHeader document="hello"/>
            <h2>
                {document}
            </h2>            
            <p className="text-xs-right">
                custom class
            </p>
            </div>
        );
    }
}