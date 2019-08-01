import React, { useState, useEffect } from "react";
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { Repository } from '../../generated/graphql';
import RepoContents, {UseUrlQuery} from "../RepoContents";
import { useQuery } from 'react-apollo-hooks';


import {
  FaBeer,
  FaBook,
  FaSearch,
  FaCodeBranch,
  FaGithub,
  FaExclamationCircle,
  FaStar
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
  loadRepoHandler: (repo: Repository) => void, // when a repository is selected
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
    edges: Array<{ node: Repository }>;
  };
}

const RepoSearch = (props: IGithubQueryProps) => {
  const { data, error, loading, refetch } = useQuery<Data, IGithubQueryVariables>(REPO_SEARCH_QUERY, {
    variables: props.queryVariables,
    suspend: false,
  });

  useEffect(() => {
    refetch(props.queryVariables);
  }, [props.queryVariables]);

  if (loading) return <PanelWarningLine text="Loading..."/>;
  if (error || !data || !data.search) return <PanelWarningLine text="Error :(" color="danger"/>;
  if (data.search.repositoryCount < 1) return <PanelWarningLine text="No Results" color="warning"/>;

  return (
    <>
    { data && data.search.edges.map(repo => (
        <Panel.Block active key={repo.node.id} onClick={() => props.loadRepoHandler(repo.node)}>
          <Panel.Icon>
            <FaCodeBranch />
          </Panel.Icon>                        
          {repo.node.nameWithOwner}: last updated at {repo.node.updatedAt}, more
          here:<a href={repo.node.url} target="_blank" rel="noopener noreferrer">{repo.node.url}</a>
          { repo.node.primaryLanguage &&
            <Tag.Group>
              <Tag rounded> {repo.node.primaryLanguage.name} </Tag>
              <Tag rounded><Panel.Icon><FaStar /></Panel.Icon>{repo.node.stargazers.totalCount}</Tag>
            </Tag.Group>
          }
        </Panel.Block> ))
    }
    </>
  );
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


// search(query: $queryString, type: REPOSITORY, first: 10)
const REPO_SEARCH_QUERY = gql`
  query SearchMostTop10Star($queryString: String!, $first: Int) {
    search(query: $queryString, type: REPOSITORY, first: $first) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            nameWithOwner
            name
            id
            databaseId
            createdAt
            descriptionHTML
            url
            resourcePath
            updatedAt
            defaultBranchRef {
              name
            }
            owner {
              id
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
      }
    }
  }
`;

export default RepoSearch;