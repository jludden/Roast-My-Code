import * as React from "react";
import '../App.css';
import API, { IGithubData } from './API';
import DocumentBody from './DocumentBody';
import DocumentCommentsView from './DocumentCommentsView';
import DocumentHeader from './DocumentHeader';
import RoastComment, { ICommentList } from './RoastComment';


// todo type instead of interface? is this being used?
export interface ICCProps {
    document: string
}

export interface IComment {
    id: number,
    body: string,
    postId: number
}

export enum SubmitCommentResponse {
    Success, Error
}

interface ICCState {
    comments: ICommentList
    repo: IGithubData,
}

export default class CommentableCode extends React.Component<ICCProps, ICCState> {
    public state: ICCState = {
        comments: 
        {
            data: []
        },
        repo: 
        {
            data: 
            {
                content: "",
                name: ""
            }      
        } 
    }

    public submitCommentHandler = async (comment: RoastComment): Promise<SubmitCommentResponse> => { 
        return await API.postComment(comment)
        .then((response) => {
            const comments = this.state.comments;
            comments.data.push(response);
            this.setState({comments});
            return SubmitCommentResponse.Success;
        }).catch((error) => {
            return SubmitCommentResponse.Error;
        });
    }


    public simpleMethod(a:number, b:number) {
        return a*b;
    }

    public async componentDidMount() {
        const [comments, repo] = await API.getRepoAndComments();
        return this.setState({ comments, repo });
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
            <DocumentHeader documentName={this.state.repo.data.name} commentsCount={this.state.comments.data.length}/>
            <div className="flex-container">
                <DocumentBody name={this.state.repo.data.name} content={this.state.repo.data.content} onSubmitComment={this.submitCommentHandler}/> 
                <DocumentCommentsView data={this.state.comments.data}/>
            </div>
            <h3>Document End</h3>
            </div>
        );
    }
}