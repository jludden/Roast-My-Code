import RepoSearch, { REPO_SEARCH_QUERY, PanelWarningLine, IGithubQueryVariables, IGithubQueryResponse } from "./RepoSearch";
import { Repository } from '../../generated/graphql';
import { GraphQLError } from "graphql";

// const mockRepo: Repository = {
const mockRepo = {
    nameWithOwner: "facebook/react",
    name: "react",
    id: "MDEwOlJlcG9zaXRvcnkxMDI3MDI1MA==",
    databaseId: 10270250,
    createdAt: "2013-05-24T16:15:54Z",
    descriptionHTML:
      "<div>A declarative, efficient, and flexible JavaScript library for building user interfaces.</div>",
    url: "https://github.com/facebook/react",
    resourcePath: "/facebook/react",
    updatedAt: "2019-08-11T04:51:43Z",
    defaultBranchRef: {
      name: "master"
    },
    owner: {
      id: "MDEyOk9yZ2FuaXphdGlvbjY5NjMx",
      login: "facebook"
    },
    primaryLanguage: {
      name: "JavaScript",
      color: "#f1e05a"
    },
    languages: {
      nodes: [
        {
          name: "JavaScript"
        },
        {
          name: "Shell"
        },
        {
          name: "CoffeeScript"
        },
        {
          name: "TypeScript"
        },
        {
          name: "Python"
        }
      ]
    },
    stargazers: {
      totalCount: 134174
    },
    forks: {
      totalCount: 24049
    }
  };
  
  const queryVars: IGithubQueryVariables = {
    queryString: "react",
    first: 1
  };
  //   const resp: IGithubQueryResponse = {
  const resp = {
    search: {
      repositoryCount: 1,
      edges: [{ node: mockRepo }]
    }
  };

  const resultMock = [
    {
      request: {
        query: REPO_SEARCH_QUERY,
        variables: queryVars
      },
      result: {
        data: resp
      }
    }
  ];

  const errorMock = [{
    request: {
      query: REPO_SEARCH_QUERY,
      variables: {
          queryString: "reeflifesurvey",
          first: 5
      }
    },
    error: new Error('aw shucks'),
}];

  const graphQLErrorMock = [{
    request: {
      query: REPO_SEARCH_QUERY,
      variables: {
          queryString: "reeflifesurvey",
          first: 5
      }
    },
    result: {
      errors: [new GraphQLError('Error!')],
    },
  }];

  export { queryVars, resultMock, errorMock, graphQLErrorMock }