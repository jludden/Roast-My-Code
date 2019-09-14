import update from "immutability-helper";
import * as React from "react";
import { github_client } from '../../App';
import "../../App.css";
import API, { IGithubData } from "../../api/API";
import Document, { ErrorMessage } from '../CommentableDocument/Document';
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
import { gql, ExecutionResult } from "apollo-boost";
import { useQuery, useMutation } from '@apollo/react-hooks';
import ApolloClient from "apollo-boost";


// todo type instead of interface? is this being used?
export interface ICCProps {
  userIsLoggedIn?: boolean;
  userName?: string;
  repo: Repository,
}

export interface CCContainerProps {
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

interface ICCState {
  comments: RoastComment[],
  defaultFilePath: string, // todo del
  defaultFileName?: string, // todo del
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

export interface IGithubRepoVars {
  owner: string; 
  name: string;
}
export interface IGithubRepoResponse {
  repository: Repository
}

export interface IRepoCommentsResponse {
  allTodos: {
    data: [
      {
        title: string,
        completed: boolean
      }
    ]
  }
}


  // "owner": "jludden",
  // "name": "ReefLifeSurvey---Species-Explorer"
const CommentableCode = (props: CCContainerProps) => {
  const repoPath = window.location.pathname;
  const owner = repoPath.slice(repoPath.lastIndexOf('repo/') + 5, repoPath.lastIndexOf('/'));
  const name = repoPath.slice(repoPath.lastIndexOf('/') + 1);

  // Load Repo
  const { data, error, loading, refetch } = useQuery<IGithubRepoResponse, IGithubRepoVars>(LOAD_REPO_QUERY, {
    variables: { owner, name },
    client: github_client
  });

  if (loading) return <Progress color="info" />;
  if (error || !data || !data.repository) return <div>Error</div>; // ErrorMessage


  return (
    <>
    <LoadCommentsTestContainer />
    <CommentableCodeInner 
      userIsLoggedIn={props.userIsLoggedIn}
      userName={props.userName}
      repo={data.repository}
    />
    </>
  );
}

const LoadCommentsTestContainer = () => {
  const [active, setActive] = React.useState(false);

  if (!active) {
    return (
      <Button onClick={() => {setActive(true)}} />
    );
  }

  return (
    <LoadCommentsTest />
  );
}

const LOAD_COMMENTS_QUERY = gql`
query getcomments {
  allTodos {
    data {
      title
      completed
    }
  }
}
`;


const SUBMIT_COMMENT_MUTATION = gql`
mutation CreateATodo($title: String!) {
  createTodo(data: { title: $title, completed: false }) {
    title
    completed
  }
}
`;

const LoadCommentsTest = () => {

  const { data, error, loading, refetch } = useQuery<IRepoCommentsResponse>(LOAD_COMMENTS_QUERY, {
  //  client: faunaDbClient
  });
  

  if (loading) return <Progress color="info" />;
  if (error || !data ) return <div>Error</div>; // ErrorMessage
  if (data) {
    console.log(data);
  }
  return (
    <div><span>Hello it worked</span>
    <ul>
      {data.allTodos.data.map(todo => (
        <li key={todo.title}>
          <b>title: {todo.title}</b><p>completed: {todo.completed ? "true" : "false"}</p> 
        </li>
      ))}
    </ul>  
    <h3>Add comment: </h3>  
    <AddComment />
    <h3>COMMENTS PAGE w/ MUTATIONS</h3>
    <CommentsPageWithMutations />
    <br/><br/>
    </div>
  )
}


/*
update(cache, { data: { addTodo } }) {
        const { todos } : any = cache.readQuery({ query: LOAD_COMMENTS_QUERY   }) || { todos: [] };
        cache.writeQuery({
          query: LOAD_COMMENTS_QUERY,
          data: { todos: todos.concat([addTodo]) },
        });
      },
*/

function AddComment() {
  let input: HTMLInputElement|null;
  // const [addTodo, { data }] = useMutation(ADD_COMMENT);
  const [addTodo] = useMutation( //todo set client: faunaDbClient 
    SUBMIT_COMMENT_MUTATION,    
    {
  //    variables: { "title": input ? input.value : 'oops empty title'},
      update(cache, { data: { addTodo } }) {
        const { todos } : any = cache.readQuery({ query: LOAD_COMMENTS_QUERY   }) || { todos: [] };
        cache.writeQuery({
          query: LOAD_COMMENTS_QUERY,
          data: { todos: todos.concat([addTodo]) },
        });
      }
    }
  );

  return (
    <div>
      <form
        onSubmit={e => {
          const val = input ? input.value : '';
          console.log("comment submission attempted. value: "+val)
          e.preventDefault();
          addTodo({ variables: { title: val } });
          if(input) input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}
 // export interface IRepoCommentsResponse {
//   allTodos: {
//     data: [
//       {
//         title: string,
//         completed: boolean
//       }
//     ]
//   }
// }

function CommentsPageWithMutations() {
  const [mutate] = useMutation(SUBMIT_COMMENT_MUTATION);
  return (
    <CommentsPage
      submit={(commentContent: string) =>
        mutate({
          variables: { title: commentContent },
          optimisticResponse: {
            __typename: "Mutation",
            submitComment: {
              __typename: "Todo",
              title: commentContent,
              completed: false
            }
          },
          update: (cache, { data: { submitComment } }) => {
            // Read the data from our cache for this query.
            const data = cache.readQuery<IRepoCommentsResponse>({ query: LOAD_COMMENTS_QUERY })
              || {allTodos: { data: []}};
            // Write our data back to the cache with the new comment in it
            // cache.writeQuery({ query: LOAD_COMMENTS_QUERY, data: {
            //   ...data,
            //   allTodos: [...data, submitComment]
            // } as any});
            // data.allTodos.data
            cache.writeQuery({
              query: LOAD_COMMENTS_QUERY,
              data: {
                allTodos:{
                  data: (data.allTodos.data).concat(submitComment)
                }
              }
            });
          }
        })
      }
    />
  );
}

function CommentsPage({submit}: {submit: (commentContent: string) => Promise<ExecutionResult<any>>}) {
  return (
    <div>
      <span>Hello world COMMENTS PAGE</span>
      <button onClick={() => submit("COMMENTS PAGE MUTATION TEST")} />
    </div>
  );
}

/*
mutate({
          variables: { repoFullName, commentContent },
          update: (store, { data: { submitComment } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: CommentAppQuery });
            // Add our comment from the mutation to the end.
            data.comments.push(submitComment);
            // Write our data back to the cache.
            store.writeQuery({ query: CommentAppQuery, data });
          }
        })

*/

class CommentableCodeInner extends React.Component<ICCProps, ICCState> {
    public state: ICCState = {
        comments: [],
        defaultFilePath: "",
        file: {
          fileName: "Hello World",
          fileContents: ""
        },
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
    const repoPath = window.location.pathname;
    const comments = await API.getComments(repoPath);
    // const [comments, repo] = await API.getRepoAndComments(repoPath);

    this.setState({ comments, loading: false });

    console.log(repoPath);
    console.log(comments);
  }

    public render() {

      const currentDocVars = {
        owner: this.props.repo ? this.props.repo.owner.login : "",
        name: this.props.repo ? this.props.repo.name : "",  
        path: (this.state.loadFilePath||"") + this.state.loadFileName
      };

      return (
        <>
          <h1>
              Hello welcome to the Jason's Annotateable Code Sample
          </h1>
          <AuthStatusView showImmediately={this.state.triggerLogin}/>
          <p>Commentable code props. user name: {this.props.userName || ""} logged in: {this.props.userIsLoggedIn || false}</p>
          <p> Repo {this.props.repo && this.props.repo.resourcePath} total comments: {this.state.comments && this.state.comments.length} </p>
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

         
          <RepoContents 
            repo={this.props.repo}
            repoPath={window.location.pathname}
            loadFileHandler={this.LoadFileBlob}/>

          <Document
            queryVariables={currentDocVars}
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


    

    // need a default path to get the initial files in the repository
    // this is based on default branch plus a colon
    // todo 
    // private getDefaultPath(): string {
    //   if (this.state.repo && this.state.repo.defaultBranchRef) {
    //     return this.state.repo.defaultBranchRef.name;
    //     // return `${this.state.repo.defaultBranchRef.name}:`;
    //   } 
    //   return "master";
    // }



}


const LOAD_REPO_QUERY = gql`
query LoadRepo($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name
    createdAt
    url
    resourcePath
    updatedAt
    nameWithOwner
    owner {
      login
    }
    primaryLanguage {
      name
      color
    }
    languages(first: 5) {
      nodes {
        name
      }
    }
    descriptionHTML
    stargazers {
      totalCount
    }
    forks {
      totalCount
    }
  }
}
`;

export default CommentableCode;