import * as React from 'react';
import { githubClient } from '../../App';
import '../../App.css';
import Document, { ErrorMessage, IDocumentProps } from '../CommentableDocument/Document';
import { findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data as RoastComment } from './types/findRepositoryByTitle';
import IntrospectionResultData, { Blob, Repository, RepositoryConnection } from '../../generated/graphql';
import { RepositoryOwner, StargazerConnection, Language } from '../../generated/graphql'; // todo shouldnt really need
import RepoSearchContainer from '../RepoSearch/RepoSearchContainer';
import RepoContents from '../RepoContents';
import { CompletedTodos, GraphQLTodoList, SubmitTodosMutation, LoadTodosTestWithDelete } from './GraphQLTodos';
import { FindRepoResults } from './CommentsGqlQueries';
import { FaComments, FaCommentDots, FaComment, FaCommentAlt, FaCodeBranch, FaGithub } from 'react-icons/fa';
import { deleteCommentMutation, createCommentMutation, findCommentsForRepoQuery } from './GraphQL/CommentsGraphQL';
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
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { useWindowPath } from './hooks/useWindowPath';
import { useLocation } from './hooks/useLocation';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import { useParams } from 'react-router-dom';
import ErrorBoundary from '../Common/ErrorBoundary';

// todo type instead of interface? is this being used?
export interface CommentableCodeProps {
    userIsLoggedIn?: boolean;
    userName?: string;
    repo: Repository;
    // repoComments: FindRepoResults;
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

// https://docs.github.com/en/graphql/overview/explorer
    // "name": "ReefLifeSurvey---Species-Explorer",
    // "owner": "jludden"  
export const LOAD_REPO_QUERY = gql`
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
            defaultBranchRef {
                name
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
const CommentableCodeLoadRepoContainer = (props: CCContainerProps) => {
    // const { pathname, search } = useWindowPath();
    // React.useEffect(() => {
    //     // do something when path changes ...
    // }, []);

    // todo use hook
    const repoPath = window.location.pathname;
    const owner = repoPath.slice(repoPath.lastIndexOf('repo/') + 5, repoPath.lastIndexOf('/'));
    const name = repoPath.slice(repoPath.lastIndexOf('/') + 1);
    
    // Load Repo
    const { data, error, loading, client } = useQuery<LoadGithubQueryResponse, LoadGithubQueryVars>(LOAD_REPO_QUERY, {
        variables: { owner, name },
        client: githubClient as any,
    });

    if (loading)
        return (
            <Section>
                <Progress color="info" />
            </Section>
        );
    if (error || !data || !data.repository)
        return (
            <Section>
                <div>Error</div>
            </Section>
        );

    // write current repo to apollo cache
    // client.writeData({ data: { currentRepoTitle: `${owner}/${name}` } });

    return (
        <>
            <CommentableCodeInnerContainer
                userIsLoggedIn={props.userIsLoggedIn}
                userName={props.userName}
                repo={data.repository}
                repoTitle={`${owner}/${name}`}
            >
                {/* <CommentableCodeInner
                    userIsLoggedIn={props.userIsLoggedIn}
                    userName={props.userName}
                    repo={data.repository}
                /> */}
            </CommentableCodeInnerContainer>
        </>
    );
};

interface ContainerProps {
    repoTitle: string;
    children: JSX.Element;
}

const CommentableCodeInnerContainer = (props: ContainerProps & CommentableCodeProps) => {
    const { repoTitle, children, userIsLoggedIn, userName, repo } = props;

    useTraceUpdate(props);
    return (
        <div>
            {/* <LoadTodosTestWithDelete />
            <h3>Add Comment - COMMENTS PAGE w/ MUTATIONS</h3>
            <SubmitTodosMutation />
            <h1>More Tests</h1>
            <CompletedTodos />
            <GraphQLTodoList />
            */}
            <FindCommentsForRepo userIsLoggedIn={userIsLoggedIn} userName={userName} repo={repo}>
                {({ data }: any) => (
                    <div>
                        {/* <TraceComponentUpdate> */}
                        <CommentableCodeInner3
                            userIsLoggedIn={userIsLoggedIn}
                            userName={userName}
                            repo={repo}
                            repoComments={data}
                        />
                        {/* </TraceComponentUpdate> */}
                    </div>
                )}
            </FindCommentsForRepo>
            <div>{children}</div>
        </div>
    );
};

export const FindCommentsForRepo = ({ userIsLoggedIn, userName, repo, children }: any) => {
    // const { data, error, loading } = useQuery<FindRepoResults>(findCommentsForRepoQuery);
    // const client = useApolloClient();

    const { data, error, loading } = {
        data: [],
        error: '',
        loading: false,
    };

    if (loading) return <Progress color="info" />;
    if (error || !data) return <div>Error</div>; // ErrorMessage
    if (data) {
        console.log(data);
    }

    //todo
    const repoId = '245564447665422867';
    const commentListId = '245564447670665747';
    const documentId = '245564447668568595';

    return (
        <div>
            {children({ data })}

            {/* <CommentableCodeInner userIsLoggedIn={userIsLoggedIn} userName={userName} repo={repo} /> */}
        </div>
    );
};

function useTraceUpdate(props: any) {
    const prev = React.useRef(props);
    React.useEffect(() => {
        const changedProps: any = Object.entries(props).reduce((ps: any, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k as any] = [prev.current[k], v];
            }
            return ps;
        }, {});
        if (Object.keys(changedProps).length > 0) {
            console.log('Changed props:', changedProps);
        }
        prev.current = props;
    });
}

// function TraceComponentUpdate(props: any) {
//     useTraceUpdate(props);
//     return <div>{props.children}</div>;
// }

export const CommentableCodeInner3 = ({
    userIsLoggedIn,
    userName,
    repo,
    repoComments,
}: {
    userIsLoggedIn?: boolean;
    userName?: string;
    repo: Repository;
    repoComments: FindRepoResults;
}) => {
    const [fileParam, setFileParam] = useQueryParam('file', StringParam);
    const [filePathParam, setFilePathParam] = useQueryParam('path', StringParam);

    const params = new URLSearchParams(window.location.search);
    const branch = repo.defaultBranchRef ? repo.defaultBranchRef.name : 'master';
    const fileName = params.get('file') || `${branch}:README.md`;

    // todo 2 - include whole path before file (1 path for search dir, 1 for loaded file)

    const loadFileHandler = (name: string, path: string) => {
        //window.history.pushState({ 'file': fileName, 'path': filePath }, '', '');
        setFileParam(path + name, 'pushIn');
        if (path !== filePathParam) setFilePathParam(path, 'pushIn');
        // setFile({ filePath, fileName });
    };

    const branchSplit = fileName.split(':'); // 0 - branch 1 - directory path
    const dirSplit = branchSplit[1].split('/');

    const currentDocVars = {
        owner: repo ? repo.owner.login : '',
        name: repo ? repo.name : '',
        path: fileName,
    };

    return (
        <>
            {/* /{this.state.loading && <Progress color="info" />} */}
            <Section>
                <RepoContents repo={repo} repoComments={repoComments} loadFileHandler={loadFileHandler} />
            </Section>
            {fileName && (
                <Document
                    queryVariables={currentDocVars}
                    documentName={dirSplit[dirSplit.length - 1]}
                    repoComments={repoComments}
                    // onSubmitComment={onSubmitComment}
                    // onEditComment={onEditComment}
                />
            )}
        </>
    );
};

export const CommentableCodeInner2 = ({
    userIsLoggedIn,
    userName,
    repo,
    repoComments,
}: {
    userIsLoggedIn?: boolean;
    userName?: string;
    repo: Repository;
    repoComments: FindRepoResults;
}) => {
    // const [searchPath, setSearchPath] = React.useState(useWindowPath());

    function handleChange() {
        console.log(
            'window location changed. pathname: ' + window.location.pathname + ' search: ' + window.location.search,
        );
    }

    window.addEventListener('popstate', handleChange);
    window.addEventListener('pushstate', handleChange);

    const { search, pathname } = useLocation();

    // const { search } = useWindowPath(); // todo state
    const params = new URLSearchParams(search);

    const [{ fileName, filePath }, setSearchPath] = React.useState({
        filePath: params.get('path'),
        fileName: params.get('file'),
    });

    // React.useEffect(() => {
    //     // todo make search state yeah
    //     const params = new URLSearchParams(search);
    //     setSearchPath({
    //         filePath: params.get('path'),
    //         fileName: params.get('file'),
    //     });
    // }, [search]);

    // const [document, setDocumentPath] = React.useState({
    //     fileName: '',
    //     filePath: '',
    // });
    const currentDocVars = {
        owner: repo ? repo.owner.login : '',
        name: repo ? repo.name : '',
        path: (filePath || '') + fileName,
    };

    // const onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse> = () =>
    //     Promise.resolve(SubmitCommentResponse.Success);
    // const onEditComment: (comment: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse> = () =>
    //     Promise.resolve(SubmitCommentResponse.Success);
    // const loadFileHandler = (fileName: string, filePath: string) => {
    //     setDocumentPath({ fileName, filePath });
    // };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const loadFileHandler = (fileName: string, filePath: string) => {};

    return (
        <>
            {/* /{this.state.loading && <Progress color="info" />} */}

            <ErrorBoundary>
                <RepoContents repo={repo} repoComments={repoComments} loadFileHandler={loadFileHandler} />
            </ErrorBoundary>

            <ErrorBoundary>
                {fileName && (
                    <Document
                        queryVariables={currentDocVars}
                        documentName={fileName}
                        repoComments={repoComments}
                        // onSubmitComment={onSubmitComment}
                        // onEditComment={onEditComment}
                    />
                )}
            </ErrorBoundary>
        </>
    );
};

export default CommentableCodeLoadRepoContainer;
