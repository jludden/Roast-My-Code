import React, { useEffect } from 'react';
import '../App.css';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useQuery } from '@apollo/react-hooks';
import ApolloClient, { gql } from 'apollo-boost';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import {
    FaBeer,
    FaBook,
    FaFolder,
    FaSearch,
    FaEllipsisH,
    FaCodeBranch,
    FaGithub,
    FaExclamationCircle,
    FaAngleDown,
    FaImage,
} from 'react-icons/fa';
import {
    Section,
    Title,
    Tag,
    Dropdown,
    Breadcrumb,
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
import { RepoCommentsListDisplayWithDelete } from './CommentableCodePage/CommentsGqlQueries';
import { url } from 'inspector';
import { Blob, Repository } from '../generated/graphql';
import { cache, githubClient } from '../App';
import { FindRepoResults } from './CommentableCodePage/CommentsGqlQueries';

export interface RepoContentsProps {
    repo: Repository;
    repoComments: FindRepoResults;
    loadFileHandler: (fileName: string, filePath: string) => void; // when a file is selected
}

// to be included in the graphQL query
export interface GithubRepoContentsQueryVars {
    path: string; // path to this directory in form {branch:filePath}
    repoName: string;
    repoOwner: string;
}

// todo use types from generated graphql.tsx
export interface GithubRepoContentsQueryData {
    repository: {
        folder: {
            entries: Array<Line>;
        };
    };
}

interface Line {
    oid: string;
    name: string;
    object: Blob;
}

// todo for path - automatically go into the directory with most comments!
// todo add Tags for number of comments if > 0
//  todo - aggregate comments to folder level

// {"path": "master:app/src/main/java/me/jludden/reeflifesurvey"}
//    repository(name: "ReefLifeSurvey---Species-Explorer", owner: "jludden") {
//     repository(name: "react", owner: "facebook") {

// can also load file contents here: repo -> folder: object -> Tree -> object -> Blob -> text
export const REPO_CONTENTS_QUERY = gql`
    query RepoContents($path: String!, $repoName: String!, $repoOwner: String!) {
        repository(name: $repoName, owner: $repoOwner) {
            refs(refPrefix: "refs/heads/", first: 100) {
                nodes {
                    name
                }
            }

            folder: object(expression: $path) {
                ... on Tree {
                    entries {
                        oid
                        name

                        object {
                            ... on Blob {
                                id
                                oid
                                commitResourcePath
                                commitUrl
                                isTruncated
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const RepoExplorer = ({ repo, repoComments, loadFileHandler }: RepoContentsProps) => {
    const branch = repo.defaultBranchRef ? repo.defaultBranchRef.name : 'master';
    const title = (repo && repo.nameWithOwner) || 'Welcome to Roast My Code';

    const [fileSelected, setFileSelected] = React.useState('');
    const [filePathParam, setFilePathParam] = useQueryParam('path', StringParam);
    // React.useEffect(() => {
    //     setFilePathParam(`${branch}:`);
    // }, [branch, setFilePathParam]);
    const filePath = filePathParam || `${branch}:`;

    const [vars, setVars] = React.useState({
        // path: `${branch}:`,
        repoName: repo.name,
        repoOwner: repo.owner.login,
    });

    const parts = filePath.split(':'); // 0 - branch 1 - directory path
    const paths = parts[1].split('/');
    const inParentDirectory = () => filePath === `${branch}:`;

    // remove everything after the folder name (e.g. java+/) or just go up a directory
    const handleNavTo = (folder?: string) => {
        if (inParentDirectory()) return;
        const path = folder
            ? filePath.slice(0, filePath.lastIndexOf(folder) + folder.length + 1)
            : filePath.slice(0, filePath.lastIndexOf(paths[paths.length - 2]));
        // setVars({ ...vars, path });
        setFilePathParam(path, 'pushIn');
    };
    const handleLineClicked = (line: Line) => {
        if (line && line.name && line.object && line.object.oid) {
            loadFileHandler(line.name, filePath); // trigger update
            setFileSelected(line.name); // yes
        } else {
            // setVars({ ...vars, path: `${vars.path}${line.name}/` });
            setFilePathParam(`${filePath}${line.name}/`, 'pushIn');
        }
    };

    const { data, error, loading, client } = useQuery<GithubRepoContentsQueryData, GithubRepoContentsQueryVars>(
        REPO_CONTENTS_QUERY,
        {
            variables: { ...vars, path: filePath },
            client: githubClient,
        },
    );

    return (
        <>
            {/* update the URL with the current search state */}
            {/* <UseUrlQuery url={vars.path} name="path" /> */}
            {/* {fileSelected && <UseUrlQuery url={fileSelected} name="file" />} */}
            <RepoContentsPanelFrame title={title} repoComments={repoComments}>
                <RepoContentsPanel
                    title={title}
                    parts={parts}
                    inParentDirectory={inParentDirectory}
                    handleNavTo={handleNavTo}
                    paths={paths}
                    loading={loading}
                    error={error}
                    data={data}
                    handleLineClicked={handleLineClicked}
                    client={client}
                    filePath={filePath || ''}
                    vars={vars}
                />
            </RepoContentsPanelFrame>
        </>
    );
};

const DropdownMenu = ({ branch }: { branch: string }) => {
    return (
        <Dropdown style={{ padding: '0 15px 0 0' }}>
            <Dropdown.Trigger>
                <Button>
                    <span>{branch}</span>
                    <FaAngleDown />
                </Button>
            </Dropdown.Trigger>
            <Dropdown.Menu>
                <Dropdown.Content>
                    <Dropdown.Item>Dropdown item</Dropdown.Item>
                    <Dropdown.Item>Other dropdown item</Dropdown.Item>
                    <Dropdown.Item active>Active dropdown item</Dropdown.Item>
                    <Dropdown.Item>Other dropdown item</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>With a divider</Dropdown.Item>
                </Dropdown.Content>
            </Dropdown.Menu>
        </Dropdown>
    );
};

interface PanelLineProps {
    file: Line;
    onLineClicked: (file: Line) => void;
    onMouseOver: (event: React.SyntheticEvent<EventTarget>) => void;
}
const PanelLine: React.FunctionComponent<PanelLineProps> = props => {
    const { file } = props;
    const fileType = file.name.substring(file.name.lastIndexOf('.'));

    if (['.jpg', '.png', '.gif', '.ico', '.mp4', '.avi'].includes(fileType)) {
        return (
            <Panel.Block>
                <Panel.Icon>
                    <FaImage />
                </Panel.Icon>
                {file.name}
            </Panel.Block>
        );
    }

    return (
        <Panel.Block
            active
            onClick={() => props.onLineClicked(file)}
            onMouseOver={props.onMouseOver}
            className="panelHover"
        >
            <Panel.Icon>{file.object.__typename === 'Tree' ? <FaFolder /> : <FaBook />}</Panel.Icon>
            <a>{file.name}</a>
        </Panel.Block>
    );
};

interface WarningLineProps {
    text: string;
    color?: 'primary' | 'link' | 'success' | 'info' | 'warning' | 'danger' | undefined;
}
const PanelWarningLine: React.FunctionComponent<WarningLineProps> = props => {
    return (
        <Panel.Block backgroundColor={props.color || undefined}>
            <Panel.Icon>
                <FaExclamationCircle />
            </Panel.Icon>
            {props.text}
        </Panel.Block>
    );
};

const RepoContentsPanelFrame = ({
    title,
    repoComments,
    children,
}: {
    title: string;
    repoComments: FindRepoResults;
    children: React.ReactElement;
}) => {
    const [filesTabActive, setfilesTabActive] = React.useState(true);
    //todo
    const repoId = '245564447665422867';
    const commentListId = '245564447670665747';
    const documentId = '245564447668568595';

    return (
        <Panel>
            <Panel.Heading>{title}</Panel.Heading>

            <Panel.Tab.Group>
                <Panel.Tab active={filesTabActive} onClick={() => setfilesTabActive(true)}>
                    files
                </Panel.Tab>
                <Panel.Tab active={!filesTabActive} onClick={() => setfilesTabActive(false)}>
                    comments
                </Panel.Tab>
            </Panel.Tab.Group>

            {filesTabActive && children && React.cloneElement(children)}
            {!filesTabActive && (
                <Panel.Block>
                    <RepoCommentsListDisplayWithDelete
                        commentListId={commentListId}
                        documentId={documentId}
                        data={repoComments}
                    />
                </Panel.Block>
            )}
        </Panel>
    );
};

function RepoContentsPanel({
    title,
    parts,
    inParentDirectory,
    handleNavTo,
    paths,
    loading,
    error,
    data,
    handleLineClicked,
    client,
    filePath,
    vars,
}: {
    title: string;
    parts: string[];
    inParentDirectory: () => boolean;
    handleNavTo: (folder?: string | undefined) => void;
    paths: string[];
    loading: boolean;
    error: any;
    data: GithubRepoContentsQueryData | undefined;
    handleLineClicked: (line: Line) => void;
    client: any;
    filePath: string;
    vars: { repoName: string; repoOwner: string };
}) {
    return (
        <>
            <Panel.Block>
                <DropdownMenu branch={parts[0]} />
                <Breadcrumb align="centered">
                    <Breadcrumb.Item>
                        <Icon color={inParentDirectory() ? 'dark' : 'info'} onClick={() => handleNavTo()} align="right">
                            <FaEllipsisH />
                        </Icon>
                    </Breadcrumb.Item>
                    {paths.map(path => (
                        <Breadcrumb.Item onClick={() => handleNavTo(path)} key={path}>
                            {' '}
                            {path}{' '}
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            </Panel.Block>

            {loading && (
                <Panel.Block>
                    <Progress color="info" />
                </Panel.Block>
            )}

            {!loading &&
                (error || !data || !data.repository || !data.repository.folder || !data.repository.folder.entries) && (
                    <PanelWarningLine text="Error :(" color="danger" />
                )}

            {!loading &&
                data &&
                data.repository.folder.entries.map(file => (
                    <PanelLine
                        key={file.oid}
                        file={file}
                        onLineClicked={handleLineClicked}
                        onMouseOver={() => {
                            // prefetch folder on hover
                            if (file.object.__typename === 'Tree')
                                client.query({
                                    query: REPO_CONTENTS_QUERY,
                                    variables: { ...vars, path: `${filePath}${file.name}/` },
                                });
                        }}
                    />
                ))}
        </>
    );
}

export default RepoExplorer;
