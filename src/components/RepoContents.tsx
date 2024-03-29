import React, { useEffect, useState } from 'react';
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
    FaComments
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
import { FindRepoResults } from './CommentableCodePage/CommentsGqlQueries';
import { url } from 'inspector';
import { Blob, Repository } from '../generated/graphql';
import { cache, githubClient } from '../App';
import { db, auth } from '../services/firebase';

export interface RepoContentsProps {
    repo: Repository;
    repoComments: FindRepoResults;
    loadFileHandler: (fileName: string, filePath: string) => void; // when a file is selected
}

export interface RepoDetail extends Line {
    _id: string;
    decodedRepoPath: string;
    num_comments: number;
    filePath: string;
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
    object?: Blob;
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

export const parseRepo = (snap: any) => {
    try {
        const decodedRepoPath = atob(snap.key);
        const repoPathParts = decodedRepoPath.split(':');
        const fullFilePath = repoPathParts[1];
        const filePathParts = fullFilePath.split('/');
        const fileName = filePathParts[filePathParts.length - 1];

        const branchParts = decodedRepoPath.split(':')[0].split('/');
        const filePathStart = branchParts[branchParts.length - 1];

        return { decodedRepoPath, repoPathParts, fullFilePath, filePathParts, fileName, branchParts, filePathStart };
    } catch (e) {
        console.log('Error parsing repo in RepoContents: ' + e);
        return { decodedRepoPath: '' };
    }
};

export const RepoExplorer = ({ repo, repoComments, loadFileHandler }: RepoContentsProps) => {
    const branch = repo.defaultBranchRef ? repo.defaultBranchRef.name : 'master';
    const title = (repo && repo.nameWithOwner) || 'Search Github Repositories';

    const [fileParam, setFileParam] = useQueryParam('file', StringParam); // current opened file
    const [filePathParam, setFilePathParam] = useQueryParam('path', StringParam); // directory
    // React.useEffect(() => {
    //     setFilePathParam(`${branch}:`);
    // }, [branch, setFilePathParam]);

    const [vars, setVars] = React.useState({
        // path: `${branch}:`,
        repoName: repo.name,
        repoOwner: repo.owner.login,
    });

    // most commented files
    const [repoDetails, setRepoDetails] = React.useState<Record<string, RepoDetail>>({});

    const fileNameParts = !!fileParam ? fileParam.split(':') : [];
    const currentFileNamePath = fileNameParts.length > 1 ? fileNameParts[1] : undefined;
    const currentFileNamePathParts = !!currentFileNamePath ? currentFileNamePath.split('/') : [];
    const currentFileName =
        currentFileNamePathParts.length > 0 ? currentFileNamePathParts[currentFileNamePathParts.length - 1] : undefined;

    const filePath = filePathParam || `${branch}:`;

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
    const handleLineClicked = (line: RepoDetail | Line, path: string = filePath) => {
        if (line && line.name && line.object && line.object.oid) {
            loadFileHandler(line.name, path); // trigger update
        } else {
            // setVars({ ...vars, path: `${vars.path}${line.name}/` });
            setFilePathParam(`${filePath}${line.name}/`, 'pushIn');
        }
    };

    const { data, error, loading, client } = useQuery<GithubRepoContentsQueryData, GithubRepoContentsQueryVars>(
        REPO_CONTENTS_QUERY,
        {
            variables: { ...vars, path: filePath },
            client: githubClient as any,
        },
    );

    useEffect(() => {
        let repositoryCommentIndex: firebase.database.Reference | undefined = undefined;
        try {
            const repoPath64 = btoa(`${vars.repoOwner}/${vars.repoName}`);
            repositoryCommentIndex = db.ref(`repository-files/${repoPath64}/files`);
        } catch (error) {
            console.log(
                'Repo Contents -> Repo Explorer -> UseEffect: threw btoa error converting repository owner & name',
            );
        }

        // const handleChildUpdate = ({snap, text}: {snap: DataSnapshot, text?: string | null | undefined}) => {
        const handleChildUpdate = (snap: any) => {
            const snapval = snap.val();
            const snapParent = snap.ref.parent;
            // const parentkey = snap.parent().key()

            console.log(snap.key + ' has this many comments' + snapval.num_comments);
            // todo add last updated too?
            setRepoDetails((previousState) => {
                const newState = previousState;
                const {
                    decodedRepoPath,
                    repoPathParts,
                    fullFilePath,
                    filePathParts,
                    fileName,
                    branchParts,
                    filePathStart,
                } = parseRepo(snap);

                newState[snap.key] = {
                    ...snapval,
                    _id: snap.key,
                    oid: snap.key,
                    decodedRepoPath,
                    num_comments: snapval.num_comments,
                    displayName: fullFilePath,
                    name: fileName,
                    filePath: decodedRepoPath.slice(
                        decodedRepoPath.indexOf(`${filePathStart}:`),
                        decodedRepoPath.lastIndexOf(fileName || ''),
                    ),
                    object: {
                        oid: 'test',
                    },
                    // updatedAt: new Date(snapval.timestamp),
                    // decodedRepoPath: btoa(snapval.key),
                } as RepoDetail;

                return newState;
            });
        };

        try {
            if (repositoryCommentIndex !== undefined) {
                repositoryCommentIndex
                    // .child('files')
                    .orderByChild('num_comments')
                    .limitToLast(5)
                    //.on('value') -- returns one snap with subnodes
                    .on('child_added', handleChildUpdate);

                repositoryCommentIndex.on('child_changed', handleChildUpdate);
            }
        } catch (error) {
            // setLoadCommentsError(error.message);
            console.log('Error loading repository details: ' + (error as { message: string }).message);
        }
        return () => repositoryCommentIndex?.off();
    }, [vars.repoName, vars.repoOwner]);

    return (
        <>
            {/* update the URL with the current search state */}
            {/* <UseUrlQuery url={vars.path} name="path" /> */}
            {/* {fileSelected && <UseUrlQuery url={fileSelected} name="file" />} */}
            {error && (
                <div>
                    <h1>Error Loading Comments</h1>
                    {error.message && <h4>{error.message}</h4>}
                </div>
            )}
            {/* <Repo */}
            <RepoContentsPanelFrame
                title={title}
                render={(isFileTabActive) => {
                    return isFileTabActive ? (
                        <RepoFileTreePanel
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
                            currentFileName={currentFileName}
                            vars={vars}
                        />
                    ) : (
                        <RepoCommentsPanel repoDetails={repoDetails} handleLineClicked={handleLineClicked} />
                    );
                }}
            />
        </>
    );
};

export const DropdownMenu = ({ branch }: { branch: string }) => {
    return (
        <Dropdown style={{ padding: '0 15px 0 0' }}>
            <Dropdown.Trigger>
                <Button>
                    <span>{branch}</span>
                    <FaAngleDown style={{ paddingLeft: '5px' }} />
                </Button>
            </Dropdown.Trigger>
            <Dropdown.Menu>
                <Dropdown.Content>
                    <Dropdown.Item>Sorry, not implemented</Dropdown.Item>

                    {/* <Dropdown.Item>Dropdown item</Dropdown.Item>
                    <Dropdown.Item>Other dropdown item</Dropdown.Item>
                    <Dropdown.Item active>Active dropdown item</Dropdown.Item>
                    <Dropdown.Item>Other dropdown item</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>With a divider</Dropdown.Item> */}
                </Dropdown.Content>
            </Dropdown.Menu>
        </Dropdown>
    );
};

interface PanelLineProps {
    isActive: boolean;
    file: Line;
    children?: JSX.Element;
    onLineClicked: (file: Line) => void;
    onMouseOver: (event: React.SyntheticEvent<EventTarget>) => void;
}
const PanelLine: React.FunctionComponent<PanelLineProps> = (props): JSX.Element => {
    const { file } = props;

    return (
        <Panel.Block
            active={props.isActive}
            onClick={() => props.onLineClicked(file)}
            onMouseOver={props.onMouseOver}
            className="panelHover"
        >
            <Panel.Icon>
                <FileIcon file={file} /> 
            </Panel.Icon>
            {/* //has-text-grey-lighter */}
            <span className={props.isActive ? 'panel-line-active' : 'panel-line-inactive'}>{file.name}</span>
            {props.children}
        </Panel.Block>
    );
};

const FileIcon = ({ file }: { file: Line }) => {
    const fileType = file.name.substring(file.name.lastIndexOf('.'));
    if (['.jpg', '.png', '.gif', '.ico', '.mp4', '.avi', 'svg'].includes(fileType)) {
        return <FaImage />;
    }

    return file.object?.__typename === 'Tree' ? <FaFolder /> : <FaBook />;
};

interface WarningLineProps {
    text: string;
    color?: 'primary' | 'link' | 'success' | 'info' | 'warning' | 'danger' | undefined;
}
const PanelWarningLine: React.FunctionComponent<WarningLineProps> = (props) => {
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
    render,
}: {
    title: string;
    render: (filesTabActive: boolean) => JSX.Element;
}) => {
    const [filesTabActive, setfilesTabActive] = React.useState(true);
    return (
        <Panel backgroundColor="grey-dark">
            <Panel.Heading backgroundColor="black-bis">{title}</Panel.Heading>

            <Panel.Tab.Group>
                <Panel.Tab active={filesTabActive} onClick={() => setfilesTabActive(true)}>
                    files
                </Panel.Tab>
                <Panel.Tab active={!filesTabActive} onClick={() => setfilesTabActive(false)}>
                    comments
                </Panel.Tab>
            </Panel.Tab.Group>

            {render(filesTabActive)}
        </Panel>
    );
};

function RepoCommentsPanel({
    repoDetails,
    handleLineClicked,
}: {
    repoDetails: Record<string, RepoDetail>;
    handleLineClicked: (line: Line, path?: string) => void;
}) {
    return (
        <React.Fragment>
            {repoDetails &&
                Object.keys(repoDetails).length > 0 &&
                Object.entries(repoDetails).map(([key, file]) => (
                        <PanelLine
                            isActive={false}
                            key={file._id}
                            file={file}
                            onLineClicked={(line) => handleLineClicked(line, file.filePath)}
                            onMouseOver={() => {
                                // prefetch folder on hover
                                console.log(`mouseover prefetch? from comments`);
                            }}
                        >
                            <Tag rounded style={{ marginLeft: '1rem' }}>
                                <Panel.Icon>
                                    <FaComments />
                                </Panel.Icon>
                                {file.num_comments}
                            </Tag>
                        </PanelLine>
                ))}
        </React.Fragment>
    );
}

function RepoFileTreePanel({
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
    currentFileName,
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
    currentFileName: string | null | undefined;
    vars: { repoName: string; repoOwner: string };
}) {
    // const hasError = error || !data || !data.repository || !data.repository.folder || !data?.repository?.folder?.entries;
    const loadSuccess1: boolean = (data && data.repository && !!data.repository.folder) || false;
    const loadSuccess = loadSuccess1 && data && data.repository.folder.entries;
    return (
        <>
            <Panel.Block style={{ padding: '0.3rem' }}>
                <DropdownMenu branch={parts[0]} />
                <Breadcrumb align="centered">
                    <Breadcrumb.Item>
                        <Icon color={inParentDirectory() ? 'dark' : 'info'} onClick={() => handleNavTo()} align="right">
                            <FaEllipsisH />
                        </Icon>
                    </Breadcrumb.Item>
                    {paths.map((path) => (
                        //  color='info' as="div"
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

            {!loading && !loadSuccess && <PanelWarningLine text="Error :(" color="danger" />}

            
            {!loading &&
                loadSuccess &&
                data && data.repository.folder.entries
                    .sort((a, b) => {
                        if (a.object)
                        {
                            if ( b.object)
                            {
                                const a1: string = a.object?.__typename || '';
                                const b1 = b.object.__typename || '';
                                return -1 * a1.localeCompare(b1);
                            }
                        }
                        if (!a.object)
                        {
                            return 1;
                        }
                        return 0;})
                    .map((file) => (
                    <PanelLine
                        key={file.oid}
                        file={file}
                        onLineClicked={handleLineClicked}
                        isActive={!!currentFileName && file.name.includes(currentFileName)}
                        onMouseOver={() => {
                            // prefetch folder on hover
                            if (file.object?.__typename === 'Tree')
                                console.log(`mouseover prefetch path (DISABLED): ${filePath}${file.name}/`);
                            // client.query({
                            //     query: REPO_CONTENTS_QUERY,
                            //     variables: { ...vars, path: `${filePath}${file.name}/` },
                            // });
                        }}
                    />
                ))}
        </>
    );
}

export default RepoExplorer;
