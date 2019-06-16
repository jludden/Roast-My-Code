import * as React from "react";
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { Blob, Repository } from '../generated/graphql';

import {
  FaBeer,
  FaBook,
  FaFolder,
  FaSearch,
  FaEllipsisH,
  FaCodeBranch,
  FaGithub,
  FaExclamationCircle,
  FaAngleDown
} from "react-icons/fa";
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
  Icon
} from "rbx";

export interface IRepoContentsProps {
  repo: Repository,
  // defaultBranch: string,
  // title: string,
  // queryVariables: IGithubQueryVariables,
  loadFileHandler: (fileName: string, blob: Blob) => void // when a file is selected
}

interface IRepoContentsState {
  // filePath: string, 
  branch: string,
  queryVariables: IGithubQueryVariables
}

// to be included in the graphQL query
export interface IGithubQueryVariables {
  path: string, // path to this directory in form {branch:filePath}
  repoName: string,
  repoOwner: string
}

// todo use types from generated graphql.tsx
export interface Data {
  repository: {
    folder: {
      entries: Array<Line>;
    }
  }
}

interface Line {
  oid: string, 
  name: string, 
  object: Blob
  // object: {
  //   oid: string,
  //   text: string
  // }
}

export default class RepoExplorer extends React.Component<IRepoContentsProps, IRepoContentsState> {
  constructor(props: IRepoContentsProps) {
    super(props);
    this.state = this.initState(props);
  }
  public componentWillReceiveProps(nextProps: IRepoContentsProps) {
    if (this.props.repo.nameWithOwner !== nextProps.repo.nameWithOwner) this.setState(this.initState(nextProps));
  }

    // todo reconsider
  initState(props: IRepoContentsProps): IRepoContentsState {
    const branch = (props.repo.defaultBranchRef ? props.repo.defaultBranchRef.name : "master");
    const filePath = "";
    const queryVariables: IGithubQueryVariables = {
      path: `${branch}:${filePath}`,
      repoName: props.repo.name,
      repoOwner: props.repo.owner.login
    };    
    return {branch, queryVariables};
  }

  // searchAPI = ((text: string) => {
  //   const queryVariables = this.state.queryVariables;
  //   queryVariables.path = text;
  //   this.setState({queryVariables});
  // });
  
  // searchAPIDebounced = AwesomeDebouncePromise(this.searchAPI, 500);

  // todo handle this search box? or disable it
  // handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
  //   const query = event.currentTarget.value; 
  //   // this.searchAPIDebounced(query);
  //   // this.setState({queryVariables: {queryString: query, first: 5}});
  // }

  handleLineClicked = (line: Line) => { // todo if no selection also allow adding comment?
    // if line is a file, load file into the commentable code container
    if (line && line.name && line.object && line.object.oid) {
      this.props.loadFileHandler(line.name, line.object); 
    }
    else if (line && line.name) {  // if line is a folder, load directory
      const queryVariables = this.state.queryVariables;
      queryVariables.path = `${queryVariables.path}${line.name}/`;
      this.setState({queryVariables});
    }
  }

  inParentDirectory() {
    return this.state.queryVariables.path === (this.state.branch+':');
  }

  // props.queryVariables.path will look something like:
  //  "master:app/src/main/java/me/jludden/reeflifesurvey/"
  // pass in a folder name (e.g. "java") to go up to that level
  //  "master:app/src/main/java/"
  // or pass in nothing to just go up one level
  handleNavTo = (folder?: string) => {
    const queryVariables = this.state.queryVariables;
    var tempPath = queryVariables.path;

    if (folder) { // remove everything after the folder name (e.g. java+/)
      queryVariables.path = tempPath.slice(0, tempPath.lastIndexOf(folder) + folder.length + 1);
    } else {
      const parts = this.paths(); // last real folder (e.g. "reeflifesurvey") will be in [length - 2]
      queryVariables.path = tempPath.slice(0, tempPath.lastIndexOf(parts[parts.length - 2]));
    }
    this.setState({queryVariables});
  }

  // split the paths on both colon and forward slash
  paths(): string[] {
    // return this.state.queryVariables.path.split(":").join("/").split("/");
    const parts = this.state.queryVariables.path.split(":"); // remove branch
    return parts[1].split("/");
  }

  public render() {
    const title= (this.props.repo && this.props.repo.nameWithOwner) || "Welcome to Roast My Code";

    return (
          <Panel>            
            <Panel.Heading>
              {title}           
            </Panel.Heading>

            {/* <Panel.Block>
              <Control iconLeft>
                <Input size="small" type="text" placeholder="search" onChange={this.handleQueryChange} />
                <Icon size="small" align="left">
                  <FaSearch />
                </Icon>
              </Control>
            </Panel.Block> */}
            {/* <Panel.Tab.Group>
              <Panel.Tab active>files</Panel.Tab>
              <Panel.Tab>commits</Panel.Tab>
              <Panel.Tab>private</Panel.Tab>
              <Panel.Tab>sources</Panel.Tab>
              <Panel.Tab>forks</Panel.Tab>
            </Panel.Tab.Group> */}

            {/* top line will be for navigating up the file path todo - can disable/enable based on inParentDir?*/}
            <Panel.Block>
              { !this.inParentDirectory() &&
              <Panel.Icon onClick={() => this.handleNavTo()}>
                <FaEllipsisH color={'blue'}/>
              </Panel.Icon>
              }
              <Dropdown style={{padding: '0 15px 0 0'}}>
                <Dropdown.Trigger>
                  <Button>
                    <span>{this.state.branch}</span>
                    <FaAngleDown/>
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
              <Breadcrumb align="centered">
                { this.paths().map( path => (
                  <Breadcrumb.Item onClick={() => this.handleNavTo(path)} key={path}> {path} </Breadcrumb.Item>
                ))}     
              </Breadcrumb>
            </Panel.Block>
            

            <Query<Data, IGithubQueryVariables> query={REPO_EXPLORER_QUERY} variables={this.state.queryVariables}>
              {({ loading, error, data }) => {
                if (loading) return <PanelWarningLine text="Loading..."/>;
                if (error || !data || !data.repository || !data.repository.folder
                  || !data.repository.folder.entries) return <PanelWarningLine text="Error :(" color="danger"/>;
                // if (data.search.repositoryCount < 1) return <PanelWarningLine text="No Results" color="warning"/>;

                // todo for path - automatically go into the directory with most comments!
                // todo add Tags for number of comments if > 0
                //  todo - aggregate comments to folder level
                return (
                    data.repository.folder.entries.map(file => (
                      <Panel.Block active key={file.oid} onClick={() => this.handleLineClicked(file)}>
                        { file.object.text &&
                          <Panel.Icon>
                          <FaBook />
                        </Panel.Icon> 
                        }
                        {/* todo this will cause .png to appear as folder */}
                        { !file.object.text &&
                        <Panel.Icon>
                          <FaFolder />
                        </Panel.Icon>
                        }
                       {file.name} 
                      </Panel.Block>
                    ))
                )}} 
             </Query>
          </Panel>
        );
      }
}


interface IWarningText { 
  text: string, 
  color?: "primary" | "link" | "success" | "info" | "warning" | "danger" | undefined,
}
export const PanelWarningLine: React.SFC<IWarningText> = props => {
  return (
  <Panel.Block backgroundColor={props.color||undefined}>
    <Panel.Icon>
      <FaExclamationCircle />
    </Panel.Icon>
    {props.text}
  </Panel.Block>
  )};



// {"path": "master:app/src/main/java/me/jludden/reeflifesurvey"}
//    repository(name: "ReefLifeSurvey---Species-Explorer", owner: "jludden") {
//     repository(name: "react", owner: "facebook") {



const REPO_EXPLORER_QUERY = gql`
  query($path: String!, $repoName: String!, $repoOwner: String!) {
    repository(name: $repoName, owner: $repoOwner) {

      refs(refPrefix:"refs/heads/", first: 100) {
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
              text
            }
          }          
        }
      }
    }
  }
}
`;

// const REPO_EXPLORER_QUERY = gql`
//   query($path: String!) {
//     repository(name: "ReefLifeSurvey---Species-Explorer", owner: "jludden") {
//     folder: object(expression: $path) {
//       ... on Tree {
//         entries {
//           oid
//           name
//         }
//       }
//     }
//   }
// }
// `;

