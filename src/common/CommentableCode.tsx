import * as React from "react";
import '../App.css';
import axiosGithub from './axios-github';
import Comment from './Comment';
import DocumentBody from './DocumentBody';
import DocumentHeader from './DocumentHeader';



// import { AxiosPromise } from 'axios';

// todo type instead of interface?
export interface ICCProps {
    document: string
}

// export interface ICCState {
//     data: string
// }

// export interface IGithubData {
//     data: IGithubRepo[]
// }

export interface IComment {
    id: number,
    body: string,
    postId: number
}

export interface IGithubRepo {
    name: string,
    content: string
}

export interface IGithubData {
    data: IGithubRepo
}

export enum SubmitCommentResponse {
    Success, Error
}


export default class CommentableCode extends React.Component<ICCProps, IGithubData> {
    // public state: IGithubRepo = {
    //     data: [
    //         {
    //             body: "",
    //             id: 0,
    //             postId: 0
    //         }
    //     ]
    // }
    public state: IGithubData = {
        data: 
            {
                content: "",
                name: ""
            }        
    }


    public async getCode(): Promise<IGithubData> {
        return await axiosGithub.get("http://localhost:3001/comments/");
    }

    public async GetGithub(): Promise<IGithubData> {
        return await axiosGithub.get("https://api.github.com/repos/jludden/ReefLifeSurvey---Species-Explorer/contents/app/src/main/java/me/jludden/reeflifesurvey/detailed/DetailsActivity.kt")
    }

    public submitCommentHandler = async (comment: Comment): Promise<SubmitCommentResponse> => {
        return await axiosGithub
        .post("/comments", comment)
        .then((response) => {
            return SubmitCommentResponse.Success;
        }).catch((error) => {
            return SubmitCommentResponse.Error;
        });
    }


    public simpleMethod(a:number, b:number) {
        return a*b;
    }

    public async componentDidMount() {
       // axiosGithub.get("http://localhost:3001/comments")
    //    this.getCode().then(resp => this.setState({ data: "my returned data" })); // todo async await
        // .then(resp => this.setState({data: resp[0].body}));

        // this.runCodePrettify();
        const result = await this.GetGithub();
        // await this.getCode();
        return this.setState(result);
        // return this.getCode().then(resp => this.setState(result)); // todo async await
    }

    public render() {
        const {document} = this.props;
        return (
            <div>
            <h1>
               Hello welcome to the Annotateable Code Sample
            </h1>
            <h2>
                My props: {document}
            </h2>    
            <p className="text-xs-right">
                custom class
            </p>
            <data/>
            <h3>Document Begin:</h3>
            <DocumentHeader document={this.state.data.name}/>
            <DocumentBody name={this.state.data.name} content={this.state.data.content} onSubmitComment={this.submitCommentHandler}/> 
            <h3>Document End</h3>
            </div>
        );
    }
}