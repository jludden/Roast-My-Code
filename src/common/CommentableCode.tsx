import update from "immutability-helper";
import * as React from "react";
import "../App.css";
import API, { IGithubData } from "../api/API";
import DocumentBody from "./DocumentBody";
import DocumentCommentsView from "./DocumentCommentsView";
import DocumentHeader from "./DocumentHeader";
import RoastComment from "./RoastComment";

// todo type instead of interface? is this being used?
export interface ICCProps {
  document: string;
}

export interface IComment {
  id: number;
  body: string;
  postId: number;
}

export enum SubmitCommentResponse {
  Success,
  Error
}

interface ICCState {
  comments: RoastComment[];
  repo: IGithubData,
  loading: boolean,
  msg: string
}

export default class CommentableCode extends React.Component<ICCProps, ICCState> {
    public state: ICCState = {
        comments: [],
        repo: 
        {
            data: 
            {
                content: "",
                name: ""
            }      
        },
        loading: false ,
        msg: ""
    }

  // POST a new comment
  public submitCommentHandler = async (
    comment: RoastComment
  ): Promise<SubmitCommentResponse> => {
    return await API.postComment(comment)
      .then(response => {
        // use immutability-helper to easily update the state
        this.setState({
          comments: update(this.state.comments, { $push: [response] })
        });

        return SubmitCommentResponse.Success;
      })
      .catch(error => {
        return SubmitCommentResponse.Error;
      });
  };

  // PUT an update to a comment
  public editCommentHandler = async (
    comment: RoastComment,
    isDelete: boolean = false
  ): Promise<SubmitCommentResponse> => {
    if (isDelete) {
      return await(API.deleteComment(comment))
        .then(response => {
          var comments = this.state.comments;
          comments.splice(comments.indexOf(response), 1);
          this.setState({comments});
          return SubmitCommentResponse.Success;
        });
        
    }

    return await API.putComment(comment)
      .then(response => {
        // use immutability-helper to easily update the state
        this.setState({
          comments: update(this.state.comments, {
            [response.id]: {
              $set: response
            }
          })
        });

        return SubmitCommentResponse.Success;
      })
      .catch(error => {
        return SubmitCommentResponse.Error;
      });
  };

  public simpleMethod(a: number, b: number) {
    return a * b;
  }

  public async componentDidMount() {
    const [comments, repo] = await API.getRepoAndComments();

    // tslint:disable-next-line:no-console
    console.log(repo);


    
    // todo remove: just adding some fake comments until I fix the REST endpoints
    comments[0] = new RoastComment({id: 12345, data: {lineNumber: 10, selectedText: "hello world", author: "jason", comment: "capitalize words"}})
    comments[1] = new RoastComment({id: 125, data: {lineNumber: 40, selectedText: "hello world", author: "jason", comment: "capitalize words"}})
    comments[2] = new RoastComment({id: 432, data: {lineNumber: 90, selectedText: "hello world", author: "jason", comment: "capitalize words"}})
    comments[3] = new RoastComment({id: 345, data: {lineNumber: 100, selectedText: "hello world", author: "jason", comment: "capitalize words"}})

    return this.setState({ comments, repo });
  }

    public render() {
        const {document} = this.props;
        const comments = this.state.comments;
        return (
            <div>
            <h1>
               Hello welcome to the Jason's Annotateable Code Sample
            </h1>
            <p>
                lambda functions
                <button onClick={() => this.handleClick("async-dadjoke")}>{this.state.loading ? "Loading..." : "Call Async dadjoke"}</button>
                <button onClick={() => this.handleClick("fauna-crud")}>{this.state.loading ? "Loading..." : "Call fauna crud"}</button>
                <button onClick={() => this.handleClick("getRepo")}>{this.state.loading ? "Loading..." : "Call getRepo"}</button>
                <button onClick={() => this.handleClick("hello-world")}>{this.state.loading ? "Loading..." : "Call hello-world"}</button>
                <br></br>
                <span>{this.state.msg}</span>
            </p>
            <h2>
                My props: {document}
            </h2>    
            <p className="text-xs-right">
                custom class
            </p>
            <data/>
            <h3>Document Begin:</h3>
            <DocumentHeader documentName={this.state.repo.data.name} commentsCount={this.state.comments.length}/>
            <div className="flex-container">
                <DocumentBody name={this.state.repo.data.name} content={this.state.repo.data.content} onSubmitComment={this.submitCommentHandler}/> 
                <DocumentCommentsView comments={comments} onEditComment={this.editCommentHandler}/>
            </div>
            <h3>Document End</h3>
            </div>
        );
    }

    // temp todo call lambda functions from API
    private handleClick = (functionName: string) => {

        this.setState({ loading: true });
        fetch("/.netlify/functions/" + functionName)
          .then(response => response.json())
          .then(json => this.setState({ loading: false, msg: json.msg }));
    }
}
