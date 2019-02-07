import * as React from "react";
import '../App.css';
import axiosGithub from './axios-github';
import ClassHeader from "./ClassHeader";

// todo type instead of interface?
export interface ICCProps {
    document: string
}

export interface ICCState {
    data: string
}

export default class CommentableCode extends React.Component<ICCProps, ICCState> {
    public state: ICCState = {
        data: 'intial state'
    }


    public simpleMethod(a:number, b:number) {
        return a*b;
    }

    public componentDidMount() {
        axiosGithub.get("http://localhost:3001/comments")
        .then(resp => this.setState({ data: "updated state" })); // todo async await
    }


    public render() {
        const {document} = this.props;

        const data = (props: { document: React.ReactNode; }) => {
            return (
                <div>
                    <h1> AXIOS testing</h1>
                    <h2> {props.document} </h2>
                </div>
            )
        }

        return (
            <div>
            <h1>
               Hello welcome to the Annotateable Code Sample {this.state.data}
            </h1>
            <p>{data}</p>
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