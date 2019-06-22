import update from "immutability-helper";
import * as React from "react";
import "../App.css";
import API, { IGithubData } from "../api/API";
import DocumentBody from "./DocumentBody";
import DocumentHeader from "./DocumentHeader";
import RoastComment from "./RoastComment";
import { ClipLoader } from 'react-spinners'; // todo try bulma progress bar
import { ApolloProvider, QueryResult } from "react-apollo";
import ApolloClient from "apollo-boost";
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
// import schema from '../api/github.schema.json';
import IntrospectionResultData, { Blob, Repository, RepositoryConnection } from '../generated/graphql';
import {RepositoryOwner, StargazerConnection, Language} from '../generated/graphql'; // todo shouldnt really need
import RepoSearchContainer from "./RepoSearch/RepoSearchContainer";
import RepoContents from "./RepoContents";


// import { generateGithubSchema } from "../api/generateGithubSchema";
// todo move apollo setup to new file
//"https://48p1r2roz4.sse.codesandbox.io"/
// https://github.com/nuxt-community/apollo-module/issues/70
// introspectionQueryResultData: (schema as any)

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: IntrospectionResultData
})
const cache = new InMemoryCache({ fragmentMatcher });
const client = new ApolloClient({
  cache,
  uri:  "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PAT}`,
  } 
});


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
  msg: string
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
    const loading = false;

    // todo remove: just adding some fake comments until I fix the REST endpoints
   /* comments[0] = new RoastComment({id: 12398897945, data: {lineNumber: 10, selectedText: "hello world", author: "jason", comment: "capitalize words"}})
    comments[1] = new RoastComment({id: 129879875, data: {lineNumber: 40, selectedText: "hello world", author: "jason", comment: "capitalize words"}})
    comments[2] = new RoastComment({id: 4387862, data: {lineNumber: 90, selectedText: "hello world", author: "jason", comment: "capitalize words"}})
    comments[3] = new RoastComment({id: 9879876, data: {lineNumber: 100, selectedText: "hello world", author: "jason", comment: "capitalize words"}})
*/

    // todo load repo on startup
    this.setState({ comments, loading });
  // this.setState({ comments, repo, loading });
  }

    public render() {
        const {document} = this.props;
        const comments = this.state.comments;
        return (
          <ApolloProvider client={client}>
            <div>
            <h1>
               Hello welcome to the Jason's Annotateable Code Sample
            </h1>

            {/* todo consider removing this for a bulma loading... */}
            <ClipLoader loading={this.state.loading}/> 
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

            {/* Repo Search */}
            <RepoSearchContainer
              loadRepoHandler={this.LoadRepo}
              loadRecommendedRepo={this.loadRecommendedRepo}/>

            {/* todo extract below to own component - nothing here unless repo is non null */}    
            { this.state.repo && 
            <RepoContents 
              repo={this.state.repo}
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
            <DocumentHeader 
              documentName={this.state.file.fileName} 
              commentsCount={this.state.comments.length}/>
            <DocumentBody 
              name={this.state.file.fileName}
              content={this.state.file.fileContents}
              comments={this.state.comments}
              onSubmitComment={this.submitCommentHandler}
              onEditComment={this.editCommentHandler}/> 
            
            <h3>Document End</h3>
            </div>
            </ApolloProvider>
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
    private LoadFileBlob = (fileName: string, blob: Blob) => {
      // todo load item into commentable code
      var file = this.state.file;
      if (blob.text) {
        file.fileContents = blob.text;
        file.fileName = fileName;
        this.setState({file});
      } 
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
