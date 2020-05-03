import * as React from 'react';
import './App.css';
import { Container, Hero, Title, Section, Button, Footer, Content } from 'rbx';
import 'rbx/index.css';
import { IdentityContextProvider } from 'react-netlify-identity-widget';
import 'react-netlify-identity-widget/styles.css';
import { BrowserRouter as Router, Switch, Route, Link, RouteComponentProps } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ApolloProvider}  from 'react-apollo' 
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { createHttpLink, HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';

import { AppSyncChatView } from './components/AppSyncChatView';

// import { ApolloProvider } from '@apollo/react-hooks';
// import ApolloClient from 'apollo-boost';
// import { ApolloClient, ApolloLink, InMemoryCache, HttpLink, NormalizedCacheObject } from 'apollo-boost'
// import { ApolloClient, ApolloLink, HttpLink, NormalizedCacheObject } from 'apollo-boost'

import { InMemoryCache, IntrospectionFragmentMatcher, NormalizedCacheObject } from 'apollo-cache-inmemory';
import IntrospectionResultData, { Blob, Repository, RepositoryConnection } from './generated/graphql';
import { AuthWrapper } from './components/AuthWrapper';
import { Home } from './components/Home';
import CommentableCode from './components/CommentableCodePage/CommentableCode';
import CCNavBar from './components/Navbar';
import LatestMessages from './LatestMessages';

import AWSAppSyncClient, { AUTH_TYPE, buildSubscription } from 'aws-appsync';
import { Rehydrated, graphqlMutation } from 'aws-appsync-react';
import AppSyncConfig from './aws-exports';
import { ApolloLink } from 'apollo-link';
// import { Rehydrated } from 'aws-appsync-react'; // this needs to also be installed when working with React


// const awsClient = new AWSAppSyncClient({
//   url: AppSyncConfig.aws_appsync_graphqlEndpoint as string,
//   region: AppSyncConfig.aws_appsync_region as string,
//      auth: {
//         type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS, //Auth_typeAMAZON_COGNITO_USER_POOLS, //AppSyncConfig.aws_appsync_authenticationType,
//         jwtToken: '1234',
//      }
//      //     apiKey: "1234" // AppSyncConfig.apiKey,
// //     // jwtToken: async () => token, // Required when you use Cognito UserPools OR OpenID Connect. token object is obtained previously
// //   }
// });

// const client2 = new AWSAppSyncClient({
//     url: process.env.REACT_APP_RMC_AWS_APPSYNC_GRAPHQLENDPOINT as string,
//     region: process.env.REACT_APP_RMC_AWS_APPSYNC_REGION as string,
//     auth: {
//       type: AUTH_TYPE.API_KEY,
//       apiKey: process.env.REACT_APP_RMC_CHAT_APPSYNC
//     //   jwtToken: () => getUser().token,
//     // REACT_APP_RMC_CHAT_APPSYNC
//     },
//   });
const appsyncClient = new AWSAppSyncClient({
  url: AppSyncConfig.aws_appsync_graphqlEndpoint,
  region: AppSyncConfig.aws_project_region,
  auth: {
    type: 'API_KEY', //AppSyncConfig.aws_appsync_authenticationType,
    apiKey: AppSyncConfig.aws_appsync_apiKey,
    // jwtToken: async () => token, // Required when you use Cognito UserPools OR OpenID Connect. token object is obtained previously
  }
})

// import logo from './' './logo.svg';

// import { generateGithubSchema } from "../api/generateGithubSchema";
// todo move apollo setup to new file
// "https://48p1r2roz4.sse.codesandbox.io"/
// https://github.com/nuxt-community/apollo-module/issues/70
// introspectionQueryResultData: (schema as any)

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: IntrospectionResultData,
});
export const cache = new InMemoryCache({ fragmentMatcher });
// export const githubClient: ApolloClient<InMemoryCache> = new ApolloClient({
//     cache,
//     // link: createHttpLink({ uri: '/.netlify/functions/repo_github' }),
//     link: ApolloLink.from([ createHttpLink({ uri: '/.netlify/functions/repo_github' }) ])
// });

// export const githubClient: ApolloClient<InMemoryCache> = new ApolloClient({
//     cache,
//     link: '/.netlify/functions/repo_github',
// });

const httpLinkGH = new HttpLink({ uri: '/.netlify/functions/repo_github' });

export const githubClient = new ApolloClient<NormalizedCacheObject>({
    ssrMode: typeof window === 'undefined',
    link: httpLinkGH,
    cache: new InMemoryCache(),
});

export const faunaDbClient = appsyncClient;
// export const faunaDbClient = new ApolloClient({
//     cache,
//     uri: '/.netlify/functions/repo_comments',
//     clientState: { defaults: {}, resolvers: {} },
// });

const url = AppSyncConfig.aws_appsync_graphqlEndpoint;
const httpLink = createHttpLink({ uri: url });

const link = ApolloLink.from([
  createSubscriptionHandshakeLink(url, httpLink)
]);
  const appsyncCache = new InMemoryCache({ addTypename: false }); //apollo-client/issues/1564

// if this doesn't work can try https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/450#issuecomment-589693150
const appsync2client = new ApolloClient({
//   ssrMode: typeof window === 'undefined',
  link,
  cache: appsyncCache
})

//  Router && QueryParamProvider
// AuthWrapper && ApolloProvider?
//    Home
//      Repo Explorer -> Link to Commentable Code
//    CommentableCode
//      Dir Explorer, Doc Header + Body

// Home - search q?repo="reeflife"

// Code - /repo/jludden/ReefLifeSurvey---Species-Explorer

class App extends React.Component {
    // // <div className="App_Background">

    public render() {
        const url = 'https://jludden-react.netlify.com/';

        return (
            <>
                <ApolloProvider client={appsync2client}> 
                    <IdentityContextProvider url={url}>
                        <Router>
                            <QueryParamProvider ReactRouterRoute={Route}>
                                <CCNavBar />
                                <Section color="dark">
                                    <Switch>
                                        <Route path="/" exact component={Home} />
                                        <Route path="/about/" component={About} />
                                        <Route path="/repo/" component={CommentableCodePage} />
                                    </Switch>
                                </Section>
                            </QueryParamProvider>
                        </Router>
                        <Footer>
                            <Content textAlign="centered">
                                <p>
                                    <strong>Roast My Code</strong> by
                                    <a href="https://github.com/jludden"> Jason Ludden</a>
                                    <span> github link subreddit link twitter/slack/discord </span>
                                </p>
                            </Content>
                        </Footer>
                    </IdentityContextProvider>
                </ApolloProvider>
            </>
        );
    }
}

//
//

function HomePage() {
    // welcome
    // repo explorer
    // Link repo explorer => Commentable Code
}

function CommentableCodePage() {
    return (
        <div className="App">
            {/* <header className="App-header">
        * <img src={logo} className="App-logo" alt="logo" /> }
        <h1 className="App-title">Welcome to React</h1>
      </header> */}

            <Section>
                <Container>
                    <AuthWrapper>
                        <AppSyncChatView />
                        <CommentableCode />
                    </AuthWrapper>
                </Container>
            </Section>
        </div>
    );
}

type TParams = { id: string };

function Index({ match }: RouteComponentProps<TParams>) {
    return (
        <>
            <h2>
                This is a page for product with ID:
                {match.params.id}{' '}
            </h2>
            <Link to="/repo/">Commentable Code</Link>
        </>
    );
}

// function Index() {
//   return
//   <Link to="/users/">Users</Link>
//     ;
// }

function About() {
    return <h2>About</h2>;
}

function Users() {
    return <h2>Users</h2>;
}

function AppRouter() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about/">About</Link>
                        </li>
                        <li>
                            <Link to="/users/">Users</Link>
                        </li>
                    </ul>
                </nav>

                <Route path="/" exact component={Index} />
                <Route path="/about/" component={About} />
                <Route path="/users/" component={Users} />
            </div>
        </Router>
    );
}

export default App;
