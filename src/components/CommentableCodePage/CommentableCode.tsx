import update from "immutability-helper";
import * as React from "react";
import "../../App.css";
import API, { IGithubData } from "../../api/API";
import Document from '../CommentableDocument/Document';
import RoastComment from "../RoastComment";
// import schema from '../api/github.schema.json';
import IntrospectionResultData, { Blob, Repository, RepositoryConnection } from '../../generated/graphql';
import {RepositoryOwner, StargazerConnection, Language} from '../../generated/graphql'; // todo shouldnt really need
import RepoSearchContainer from "../RepoSearch/RepoSearchContainer";
import RepoContents from "../RepoContents";
import AuthStatusView from "../AuthStatusView";
import { useIdentityContext } from "react-netlify-identity-widget";
import { FaComments, FaCommentDots, FaComment, FaCommentAlt, FaCodeBranch, FaGithub } from 'react-icons/fa';
import { Section, Title, Tag, Container, Input, Button, Block, Help, Control, Delete, Field, Panel, Checkbox, Icon, Progress } from "rbx";


// todo type instead of interface? is this being used?
export interface ICCProps {
  userIsLoggedIn?: boolean;
  userName?: string;
}

export interface IComment {
  id: number;
  body: string;
  postId: number;
}

export enum SubmitCommentResponse {
  Success,
  Error,
  NotLoggedIn
}

// todo new interface:
// export interface IFileDetails
// name, content, comments, etc

interface ICCState {
  comments: RoastComment[],
  repo?: Repository,
  defaultFilePath: string,
  defaultFileName?: string,
  file: {
    fileName: string,
    fileContents: string
  },
  loading: boolean,
  triggerLogin: boolean,
  msg: string,
  loadFileName?: string,
  loadFilePath?: string
}

export default class CommentableCode extends React.Component<ICCProps, ICCState> {
    public state: ICCState = {
        comments: [],
        defaultFilePath: "",
        file: {
          fileName: "Hello World",
          fileContents: ""
        },
        repo: undefined,
        loading: true,
        triggerLogin: false,
        msg: ""
    }

  // POST a new comment
  public submitCommentHandler = async (
    comment: RoastComment
  ): Promise<SubmitCommentResponse> => {

    if (!this.props.userIsLoggedIn) {
      this.setState({triggerLogin: true});
      return SubmitCommentResponse.NotLoggedIn; // todo retry 
    }



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
          // const indexOf = comments.indexOf(response);
          const indexOf = comments.indexOf(comment);
          comments.splice(indexOf, 1);
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
    const loading = false;

      // todo load repo on startup   file=MainActivity.java

      const path = window.location.pathname;
      const indexOf = path.indexOf("file");
      const loadFileName = path.substring((indexOf+5), path.length); // todo length
      const loadFilePath = "master/app/src/main/java/me/jludden/reeflifesurvey/fishcards/CardViewFragment.java";
      this.setState({ comments, loadFileName, loadFilePath, loading });
  // this.setState({ comments, repo, loading });
  }

    public render() {
      return (
        <>
          <h1>
              Hello welcome to the Jason's Annotateable Code Sample
          </h1>
          <AuthStatusView showImmediately={this.state.triggerLogin}/>
          <p>Commentable code props. user name: {this.props.userName || ""} logged in: {this.props.userIsLoggedIn || false}</p>
          <p> Repo {this.state.repo && this.state.repo.resourcePath} total comments: {this.state.comments && this.state.comments.length} </p>
          <Button badge={this.state.comments && this.state.comments.length} badgeColor="danger" badgeOutlined color="danger" outlined><FaCommentAlt /></Button>
          {this.state.loading && <Progress color="info"/>}
          
          <p>
              lambda functions
              <button onClick={() => this.handleClick("async-dadjoke")}>{this.state.loading ? "Loading..." : "Call Async dadjoke"}</button>
              <button onClick={() => this.handleClick("fauna-crud")}>{this.state.loading ? "Loading..." : "Call fauna crud"}</button>
              <button onClick={() => this.handleClick("getRepo")}>{this.state.loading ? "Loading..." : "Call getRepo"}</button>
              <button onClick={() => this.handleClick("hello-world")}>{this.state.loading ? "Loading..." : "Call hello-world"}</button>
              <br></br>
              <span>{this.state.msg}</span>
          </p>      
          <p className="text-xs-right">
              custom class
          </p>
          <data/>
          <h3>Document Begin:</h3>

          {/* Repo Search todo remove - add repo load from url to enable repo contents below*/}
          <RepoSearchContainer
            loadRepoHandler={this.LoadRepo}
            loadRecommendedRepo={this.loadRecommendedRepo}/>

          {/* todo extract below to own component - nothing here unless repo is non null */}    
          { this.state.repo && 
          <RepoContents 
            repo={this.state.repo}
            initialFile={this.state.loadFileName || ""}
            defaultFilePath={this.state.defaultFilePath || ""}
            defaultFileName={this.state.defaultFileName}

            // defaultBranch={this.getDefaultPath()}
            // title={(this.state.repo && this.state.repo.nameWithOwner) || "Welcome to Roast My Code"}
            // path: "master:app"
            // queryVariables={{
            //   path: "", 
            //   repoName: this.state.repo.name, 
            //   repoOwner: this.state.repo.owner.login
            // }}
            // queryVariables={{path: "master:app/src/main/java/me/jludden/reeflifesurvey"}}
            loadFileHandler={this.LoadFileBlob}/>
          }

          <Document
            documentName={this.state.file.fileName} 
            commentsCount={this.state.comments.length}
            name={this.state.file.fileName}
            content={this.state.file.fileContents}
            comments={this.state.comments}
            onSubmitComment={this.submitCommentHandler}
            onEditComment={this.editCommentHandler}/> 
          
          <h3>Document End</h3>
          </>
      );
    }

    // temp todo call lambda functions from API
    private handleClick = (functionName: string) => {

        this.setState({ loading: true });
        fetch("/.netlify/functions/" + functionName)
          .then(response => response.json())
          .then(json => this.setState({ loading: false, msg: json.msg }));
    }

    // when a file is selected in the repository contents explorer, load it into view
    private LoadFileBlob = (fileName: string, blob: string) => {
      // todo load item into commentable code
      // todo don't update file from here - just note URL updated

      // var file = this.state.file;
      // if (blob.text) {
      //   file.fileContents = blob.text;
      //   file.fileName = fileName;
      //   this.setState({file});
      // } 

      

      this.setState({loadFileName: fileName, loadFilePath: blob})
    }

    // when a repository is selected from the repository searcher
    private LoadRepo = (repo: Repository) => {
      this.setState({repo, defaultFilePath: ""});
    }

    

    // need a default path to get the initial files in the repository
    // this is based on default branch plus a colon
    // todo 
    private getDefaultPath(): string {
      if (this.state.repo && this.state.repo.defaultBranchRef) {
        return this.state.repo.defaultBranchRef.name;
        // return `${this.state.repo.defaultBranchRef.name}:`;
      } 
      return "master";
    }



    // **********************
    // DANGER silly stuff below
    // **********************

    loadRecommendedRepo = () => {
      this.setState({
        defaultFilePath: "app/src/main/java/me/jludden/reeflifesurvey/",
        defaultFileName: "MainActivity.java",
        repo: {
          createdAt: "2017-12-29T12:52:31Z",
          databaseId: 115722259,
          defaultBranchRef: null,
          descriptionHTML: "<div>Android application for browsing fish species and survey site locations based on data from ReefLifeSurvey.com</div>",
          forks: {
            totalCount: 1
          } as RepositoryConnection,
          id: "MDEwOlJlcG9zaXRvcnkxMTU3MjIyNTk=",
          languages: null,
          name: "ReefLifeSurvey---Species-Explorer",
          nameWithOwner: "jludden/ReefLifeSurvey---Species-Explorer",
          owner: {
            id: "MDQ6VXNlcjQ5NTk2MDA=",
            login: "jludden"
          } as RepositoryOwner,
          primaryLanguage: {
            color: "#b07219",
            name: "Java"
          } as Language,
          resourcePath: "/jludden/ReefLifeSurvey---Species-Explorer",
          stargazers: {
            totalCount: 1
          } as StargazerConnection,
          updateAt: "2018-05-23T02:57:18Z",
          url: "https://github.com/jludden/ReefLifeSurvey---Species-Explorer"
        } as unknown as Repository      
      });
    }

}
