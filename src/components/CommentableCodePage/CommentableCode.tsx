import update from 'immutability-helper';
import * as React from 'react';
import { githubClient } from '../../App';
import '../../App.css';
import API, { IGithubData } from '../../api/API';
import Document, { ErrorMessage } from '../CommentableDocument/Document';
import RoastComment from '../RoastComment';
import { Collapse } from 'react-collapse';
// import schema from '../api/github.schema.json';
import IntrospectionResultData, { Blob, Repository, RepositoryConnection } from '../../generated/graphql';
import { RepositoryOwner, StargazerConnection, Language } from '../../generated/graphql'; // todo shouldnt really need
import RepoSearchContainer from '../RepoSearch/RepoSearchContainer';
import RepoContents from '../RepoContents';
import AuthStatusView from '../AuthStatusView';
import { CompletedTodos, GraphQLTodoList, SubmitTodosMutation, LoadTodosTestWithDelete } from './GraphQLTests';
import { FindCommentsForRepo, CreateCommentForRepo, LoadCommentsWithDelete } from './CommentsGraphQLtests';
import { useIdentityContext } from 'react-netlify-identity-widget';
import { FaComments, FaCommentDots, FaComment, FaCommentAlt, FaCodeBranch, FaGithub } from 'react-icons/fa';
import {
    Section,
    Title,
    Tag,
    Container,
    Input,
    Button,
    Block,
    Help,
    Control,
    Delete,
    Field,
    Panel,
    Checkbox,
    Icon,
    Progress,
} from 'rbx';
import ApolloClient, { gql, ExecutionResult } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

// todo type instead of interface? is this being used?
export interface CommentableCodeProps {
    userIsLoggedIn?: boolean;
    userName?: string;
    repo: Repository;
}

export interface CCContainerProps {
    userIsLoggedIn?: boolean;
    userName?: string;
}

export interface Comment {
    id: number;
    body: string;
    postId: number;
}

export enum SubmitCommentResponse {
    Success,
    Error,
    NotLoggedIn,
}

interface CommentableCodeState {
    comments: RoastComment[];
    defaultFilePath: string; // todo del
    defaultFileName?: string; // todo del
    file: {
        fileName: string;
        fileContents: string;
    };
    loading: boolean;
    triggerLogin: boolean;
    msg: string;
    loadFileName?: string;
    loadFilePath?: string;
}

export interface LoadGithubQueryVars {
    owner: string;
    name: string;
}
export interface LoadGithubQueryResponse {
    repository: Repository;
}

export interface LoadTodosQueryResponse {
    allTodos: {
        data: Todo[];
    };
}

export interface Todo {
    title: string;
    completed: boolean;
    _id: string;
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

// "owner": "jludden",
// "name": "ReefLifeSurvey---Species-Explorer"
const CommentableCode = (props: CCContainerProps) => {
    const repoPath = window.location.pathname;
    const owner = repoPath.slice(repoPath.lastIndexOf('repo/') + 5, repoPath.lastIndexOf('/'));
    const name = repoPath.slice(repoPath.lastIndexOf('/') + 1);

    // Load Repo
    const { data, error, loading, refetch } = useQuery<LoadGithubQueryResponse, LoadGithubQueryVars>(LOAD_REPO_QUERY, {
        variables: { owner, name },
        client: githubClient,
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
};

const LoadCommentsTestContainer = () => {
    const [active, setActive] = React.useState(false);

    if (!active) return <Button onClick={() => setActive(true)} />;

    const repoId = '245564447665422867';
    const commentListId = '245564447670665747';
    const documentId = '245564447668568595';

    return (
        <div>
            {/* <LoadTodosTestWithDelete />
            <h3>Add Comment - COMMENTS PAGE w/ MUTATIONS</h3>
            <SubmitTodosMutation />
            <br />
            <br />
            <h1>More Tests</h1>
            <CompletedTodos />
            <br></br>
            <GraphQLTodoList />
            <br />
            <br /> */}
            <h1>COMMENTS FOR REPO</h1>
            <LoadCommentsWithDelete commentListId={commentListId} documentId={documentId} repoId={repoId} />
            <br />
            <br />
            <CreateCommentForRepo commentListId={commentListId} documentId={documentId} repoId={repoId} />
            <br />
            <br />
        </div>
    );
};

class CommentableCodeInner extends React.Component<CommentableCodeProps, CommentableCodeState> {
    public state: CommentableCodeState = {
        comments: [],
        defaultFilePath: '',
        file: {
            fileName: 'Hello World',
            fileContents: '',
        },
        loading: true,
        triggerLogin: false,
        msg: '',
    };

    // POST a new comment
    public submitCommentHandler = async (comment: RoastComment): Promise<SubmitCommentResponse> => {
        if (!this.props.userIsLoggedIn) {
            this.setState({ triggerLogin: true });
            return SubmitCommentResponse.NotLoggedIn; // todo retry
        }

        return await API.postComment(comment)
            .then(response => {
                // use immutability-helper to easily update the state
                this.setState({
                    comments: update(this.state.comments, { $push: [response] }),
                });

                return SubmitCommentResponse.Success;
            })
            .catch(error => {
                return SubmitCommentResponse.Error;
            });
    };

    // PUT an update to a comment
    public editCommentHandler = async (comment: RoastComment, isDelete = false): Promise<SubmitCommentResponse> => {
        if (isDelete) {
            return await API.deleteComment(comment).then(response => {
                const { comments } = this.state;
                // const indexOf = comments.indexOf(response);
                const indexOf = comments.indexOf(comment);
                comments.splice(indexOf, 1);
                this.setState({ comments });
                return SubmitCommentResponse.Success;
            });
        }

        return await API.putComment(comment)
            .then(response => {
                // use immutability-helper to easily update the state
                this.setState({
                    comments: update(this.state.comments, {
                        [response.id]: {
                            $set: response,
                        },
                    }),
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
            owner: this.props.repo ? this.props.repo.owner.login : '',
            name: this.props.repo ? this.props.repo.name : '',
            path: (this.state.loadFilePath || '') + this.state.loadFileName,
        };

        return (
            <>
                <h1>Hello welcome to the Jason's Annotateable Code Sample</h1>
                <AuthStatusView showImmediately={this.state.triggerLogin} />
                <p>
                    Commentable code props. user name:
                    {this.props.userName || ''} logged in:
                    {this.props.userIsLoggedIn || false}
                </p>
                <p>
                    {' '}
                    Repo
                    {this.props.repo && this.props.repo.resourcePath} total comments:
                    {this.state.comments && this.state.comments.length}{' '}
                </p>
                <Button
                    badge={this.state.comments && this.state.comments.length}
                    badgeColor="danger"
                    badgeOutlined
                    color="danger"
                    outlined
                >
                    <FaCommentAlt />
                </Button>
                {this.state.loading && <Progress color="info" />}

                <p>
                    lambda functions
                    <button onClick={() => this.handleClick('async-dadjoke')}>
                        {this.state.loading ? 'Loading...' : 'Call Async dadjoke'}
                    </button>
                    <button onClick={() => this.handleClick('fauna-crud')}>
                        {this.state.loading ? 'Loading...' : 'Call fauna crud'}
                    </button>
                    <button onClick={() => this.handleClick('getRepo')}>
                        {this.state.loading ? 'Loading...' : 'Call getRepo'}
                    </button>
                    <button onClick={() => this.handleClick('hello-world')}>
                        {this.state.loading ? 'Loading...' : 'Call hello-world'}
                    </button>
                    <br />
                    <span>{this.state.msg}</span>
                </p>
                <p className="text-xs-right">custom class</p>
                <data />
                <h3>Document Begin:</h3>

                <RepoContents
                    repo={this.props.repo}
                    repoPath={window.location.pathname}
                    loadFileHandler={this.LoadFileBlob}
                />

                <Document
                    queryVariables={currentDocVars}
                    documentName={this.state.file.fileName}
                    commentsCount={this.state.comments.length}
                    name={this.state.file.fileName}
                    content={this.state.file.fileContents}
                    comments={this.state.comments}
                    onSubmitComment={this.submitCommentHandler}
                    onEditComment={this.editCommentHandler}
                />

                <h3>Document End</h3>
            </>
        );
    }

    // temp todo call lambda functions from API
    private handleClick = (functionName: string) => {
        this.setState({ loading: true });
        fetch(`/.netlify/functions/${functionName}`)
            .then(response => response.json())
            .then(json => this.setState({ loading: false, msg: json.msg }));
    };

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

        this.setState({ loadFileName: fileName, loadFilePath: blob });
    };

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

export default CommentableCode;
