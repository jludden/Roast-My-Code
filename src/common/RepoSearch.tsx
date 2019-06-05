import * as React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";


export interface IGithubQueryProps {

}

export interface Data {
  search: {
    repositoryCount: number,
    edges: Array<{ node: IGithubRepo2 }>
  }
};

// interface IGithubRepoNode {
//   node: IGithubRepo2
// }

// todo combine with other github repo interface, obviously
export interface IGithubRepo2 {
  // todo ID or other key field?
  name: string,
  url: string, // "https://github.com/freeCodeCamp/freeCodeCamp"
  createdAt: string, //"2014-12-24T17:49:19Z"
  updatedAt: string,
  descriptionHTML: string,
  //forks
  
  languages: {
    nodes: Array<{ name: string }>
  },
  primaryLanguage: {
    color: string, //"#f1e05a"
    name: string
  },
  stargazers: {
    totalCount: number
  }
}


// export interface Data {
//   rates: Array<{ currency: string; rate: string }>;
// };

// "language:JavaScript stars:>10000"}
export interface Variables {
  queryString: string;
};

// const REPO_SEARCH_QUERY = gql`
// {
//   rates(currency: "USD") {
//     currency
//     rate
//   }
// }
// `;



export const RepoSearch: React.SFC<IGithubQueryProps> = props => {
  // const queryVariables : Variables = {
  //   queryString: "language:JavaScript stars:>10000"
  // };
  const queryString = "language:JavaScript stars:>10000";
  return <Query<Data, Variables> query={REPO_SEARCH_QUERY} variables={{queryString}}>
  {({ loading, error, data }) => { 
    if (loading) return <p>Loading...</p>;
    if (error || !data) return <p>Error :(</p>;

    return data.search.edges.map((repo) => (
      <div key={repo.node.name}>
        <p>{repo.node.name}: last updated at {repo.node.updatedAt}, more here:{repo.node.url}</p>
      </div>
    ));
   }}
  </Query>
}

// search(query: $queryString, type: REPOSITORY, first: 10)
const REPO_SEARCH_QUERY = gql`
query SearchMostTop10Star($queryString: String!) {
  search(query: $queryString, type: REPOSITORY, first: 10) {
    repositoryCount
    edges {
      node {
        ... on Repository {
          name
          createdAt
          url
          primaryLanguage {
            name
            color
          }
          
          languages(first:5) {
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