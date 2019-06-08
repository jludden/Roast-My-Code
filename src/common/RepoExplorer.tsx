import * as React from "react";
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import {
  FaBeer,
  FaBook,
  FaFolder,
  FaSearch,
  FaEllipsisH,
  FaCodeBranch,
  FaGithub,
  FaExclamationCircle
} from "react-icons/fa";
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
  Icon
} from "rbx";

export interface IGithubQueryProps {
  queryVariables: IGithubQueryVariables,
  loadFile: (itemId: string) => void // when a file is selected
}

interface IRepoSearchState {
  queryVariables: IGithubQueryVariables
}

// to be included in the graphQL query
export interface IGithubQueryVariables {
  path: string; // path to this directory
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
  object: {
    oid: string,
    text: string
  }
}

export default class RepoExplorer extends React.Component<IGithubQueryProps, IRepoSearchState> {
  public state: IRepoSearchState = {
    queryVariables: this.props.queryVariables
  };

  searchAPI = ((text: string) => {
    this.setState({queryVariables: {path: text}});
  });
  
  searchAPIDebounced = AwesomeDebouncePromise(this.searchAPI, 500);

  handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value; // todo debounce and instantly search?
    this.searchAPIDebounced(query);
    // this.setState({queryVariables: {queryString: query, first: 5}});
  }

  handleLineClicked = (line: Line) => { // todo if no selection also allow adding comment?

    console.log(`RepoExplorer line clicked ${line.name}`);

    // if line is a file, load file into the commentable code container
    if (line && line.object && line.object.oid) {
      // loadFile()
    }
    else if (line && line.name) {  // if line is a folder, load directory
      const queryVariables = this.state.queryVariables;
      queryVariables.path = `${queryVariables.path}/${line.name}`;
      this.setState({queryVariables});
    }
  }

  inParentDirectory() {
    return this.state.queryVariables.path == "master:app";
  }

  handleNavUp = () => {
    const queryVariables = this.state.queryVariables;
    var tempPath = queryVariables.path;
    queryVariables.path = tempPath.slice(0, tempPath.lastIndexOf("/"));
    this.setState({queryVariables});
  }


  public render() {
    return (
          <Panel>
            <Panel.Heading>Repository Contents</Panel.Heading>
            <Panel.Block>
              <Control iconLeft>
                <Input size="small" type="text" placeholder="search" onChange={this.handleQueryChange} />
                <Icon size="small" align="left">
                  <FaSearch />
                </Icon>
              </Control>
            </Panel.Block>
            <Panel.Tab.Group>
              <Panel.Tab active>files</Panel.Tab>
              <Panel.Tab>commits</Panel.Tab>
              <Panel.Tab>private</Panel.Tab>
              <Panel.Tab>sources</Panel.Tab>
              <Panel.Tab>forks</Panel.Tab>
            </Panel.Tab.Group>

            {/* show a ... button to navigate upwards if we're not in the top directory */}
            { !this.inParentDirectory() &&
              <Panel.Block onClick={this.handleNavUp}>
              <Panel.Icon>
                <FaEllipsisH />
              </Panel.Icon>
            </Panel.Block>
            }

            <Query<Data, IGithubQueryVariables> query={REPO_EXPLORER_QUERY} variables={this.state.queryVariables}>
              {({ loading, error, data }) => {
                if (loading) return <PanelWarningLine text="Loading..."/>;
                if (error || !data || !data.repository) return <PanelWarningLine text="Error :(" color="danger"/>;
                // if (data.search.repositoryCount < 1) return <PanelWarningLine text="No Results" color="warning"/>;

                return (
                    data.repository.folder.entries.map(file => (
                      <Panel.Block active key={file.oid} onClick={() => this.handleLineClicked(file)}>
                        { file.object.text &&
                          <Panel.Icon>
                          <FaBook />
                        </Panel.Icon> 
                        }
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

const REPO_EXPLORER_QUERY = gql`
  query($path: String!) {
    repository(name: "ReefLifeSurvey---Species-Explorer", owner: "jludden") {
    folder: object(expression: $path) {
      ... on Tree {
        entries {
          oid
          object {
            ... on Blob {
              id 
              oid 
              commitUrl 
              isTruncated
              text
            }
          }
          name
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

