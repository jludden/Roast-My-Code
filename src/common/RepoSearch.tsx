import * as React from "react";
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import {
  FaBeer,
  FaBook,
  FaSearch,
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
  queryVariables: IGithubQueryVariables
  // onEditComment: ((details: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>) 
}

interface IRepoSearchState {
  queryVariables: IGithubQueryVariables
}

// to be included in the graphQL query
export interface IGithubQueryVariables {
  queryString: string; // filters
  first: number; // first X results
}

export interface Data {
  search: {
    repositoryCount: number;
    edges: Array<{ node: IGithubRepo2 }>;
  };
}

// interface IGithubRepoNode {
//   node: IGithubRepo2
// }

// todo combine with other github repo interface, obviously
export interface IGithubRepo2 {
  // todo ID or other key field?
  name: string;
  databaseId: number;
  url: string; // "https://github.com/freeCodeCamp/freeCodeCamp"
  createdAt: string; //"2014-12-24T17:49:19Z"
  updatedAt: string;
  descriptionHTML: string;
  //forks

  languages: {
    nodes: Array<{ name: string }>;
  };
  primaryLanguage: {
    color: string; //"#f1e05a"
    name: string;
  };
  stargazers: {
    totalCount: number;
  };
}

// const searchAPI = ((text: string) => <RepoSearchResults queryVariables={{
//   queryString: text,
//   first:5
//   }}/>);

// const searchAPI = ((text:string) => {
//   setState
// };

// const searchAPIDebounced = AwesomeDebouncePromise(searchAPI, 500);


export default class RepoSearch extends React.Component<IGithubQueryProps, IRepoSearchState> {
  public state: IRepoSearchState = {
    queryVariables: this.props.queryVariables
  };

  searchAPI = ((text: string) => {
    this.setState({queryVariables: {queryString: text, first: 5}});
  });
  
  searchAPIDebounced = AwesomeDebouncePromise(this.searchAPI, 500);

  handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value; // todo debounce and instantly search?
    this.searchAPIDebounced(query);
    // this.setState({queryVariables: {queryString: query, first: 5}});
  }


public render() {
  return (
          <Panel>
            <Panel.Heading>Search Repositories</Panel.Heading>
            <Panel.Block>
              <Control iconLeft>
                <Input size="small" type="text" placeholder="search" onChange={this.handleQueryChange} />
                <Icon size="small" align="left">
                  <FaSearch />
                </Icon>
              </Control>
            </Panel.Block>
            <Panel.Tab.Group>
              <Panel.Tab active>all</Panel.Tab>
              <Panel.Tab>recommended</Panel.Tab>
              <Panel.Tab>most commented</Panel.Tab>
              <Panel.Tab>starred</Panel.Tab>
              <Panel.Tab>personal</Panel.Tab>
            </Panel.Tab.Group>
            <Query<Data, IGithubQueryVariables> query={REPO_SEARCH_QUERY} variables={this.state.queryVariables}>
              {({ loading, error, data }) => {
                if (loading) return <PanelWarningLine text="Loading..."/>;
                if (error || !data || !data.search) return <PanelWarningLine text="Error :(" color="danger"/>;
                if (data.search.repositoryCount < 1) return <PanelWarningLine text="No Results" color="warning"/>;

                return (
                    data.search.edges.map(repo => (
                      <Panel.Block active key={repo.node.databaseId}>
                        <Panel.Icon>
                          <FaCodeBranch />
                        </Panel.Icon>                        
                        {repo.node.name}: last updated at {repo.node.updatedAt}, more
                        here:<a href={repo.node.url} target="_blank">{repo.node.url}</a>
                        { repo.node.primaryLanguage &&
                          <Tag.Group>
                            <Tag rounded> {repo.node.primaryLanguage.name} </Tag>
                          </Tag.Group>
                        }
                        
                      </Panel.Block>
                    ))
                )}} 
             </Query>
            {/* <Panel.Block as="a" active>
              <Panel.Icon>
                <FaBook />
              </Panel.Icon>
              bulma
            </Panel.Block>
            <Panel.Block>
              <Panel.Icon>
                <FaBook />
              </Panel.Icon>
              marksheet
            </Panel.Block>
            <Panel.Block>
              <Panel.Icon>
                <FaBook />
              </Panel.Icon>
              minireset.css
            </Panel.Block>
            <Panel.Block>
              <Panel.Icon>
                <FaBook />
              </Panel.Icon>
              jgthms.github.io
            </Panel.Block>
            <Panel.Block>
              <Panel.Icon>
                <FaCodeBranch />
              </Panel.Icon>
              daniellowtw/infboard
            </Panel.Block>
            <Panel.Block>
              <Panel.Icon>
                <FaCodeBranch />
              </Panel.Icon>
              mojs
            </Panel.Block>
            <Panel.Block as="label">
              <Checkbox />
              remember me
            </Panel.Block>
            <Panel.Block>
              <Button fullwidth color="link" outlined>
                reset all filters
              </Button>
            </Panel.Block> */}
          </Panel>
        );
      }
}

// export const RepoSearchResults: React.SFC<IGithubQueryProps> = props => {
//   return <Query<Data, IGithubQueryVariables> query={REPO_SEARCH_QUERY} variables={props.queryVariables}>
//               {({ loading, error, data }) => {
//                 if (loading) return <p>Loading...</p>;
//                 if (error || !data) return <p>Error :(</p>;
//                 return (
//                     data.search.edges.map(repo => (
//                       <Panel.Block as="a" active key={repo.node.databaseId}>
//                         <Panel.Icon>
//                           <FaBook />
//                         </Panel.Icon>
//                         {repo.node.name}: last updated at {repo.node.updatedAt}, more
//                         here:{repo.node.url}
//                       </Panel.Block>
//                     ))
//                 )}} 
//              </Query>
// }

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



// search(query: $queryString, type: REPOSITORY, first: 10)
const REPO_SEARCH_QUERY = gql`
  query SearchMostTop10Star($queryString: String!, $first: Int) {
    search(query: $queryString, type: REPOSITORY, first: $first) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            name
            databaseId
            createdAt
            url
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
            updatedAt
          }
        }
      }
    }
  }
`;

