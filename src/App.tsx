import * as React from 'react';
import './App.css';
import { Container, Hero, Title, Section, Button, Footer, Content } from 'rbx';
import 'rbx/index.css';
import { BrowserRouter as Router, Switch, Route, Link, RouteComponentProps } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
// import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import IntrospectionResultData, { Blob, Repository, RepositoryConnection } from './generated/graphql';
import { Home } from './components/Home';
import CommentableCode from './components/CommentableCodePage/CommentableCode';
import CCNavBar from './components/Navbar';
import { EndpointTest } from './components/CommentableDocument/EndpointTest';
import ErrorBoundary from './components/Common/ErrorBoundary';
import About from './pages/About';
import { auth } from './services/firebase';
import FirebaseChat from './components/FirebaseChat/Chat';
import Signup from './pages/Signup';
import Login from './pages/Login';

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
export const githubClient: ApolloClient<InMemoryCache> = new ApolloClient({
    cache,
    uri: '/.netlify/functions/repo_github',
});
// export const faunaDbClient = new ApolloClient({
//     cache,
//     uri: '/.netlify/functions/repo_comments',
//     clientState: { defaults: {}, resolvers: {} },
// });

//  Router && QueryParamProvider
// AuthWrapper && ApolloProvider?
//    Home
//      Repo Explorer -> Link to Commentable Code
//    CommentableCode
//      Dir Explorer, Doc Header + Body

// Home - search q?repo="reeflife"

// Code - /repo/jludden/ReefLifeSurvey---Species-Explorer

export const App = () => {
    // // <div className="App_Background">

        const url = 'https://jludden-react.netlify.com/';
    return (

            <>
                {/* <ApolloProvider client={githubClient     as any}> */}
                        <Router>
                            <QueryParamProvider ReactRouterRoute={Route}>
                                <CCNavBar />
                                <Section color="dark">
                                    <Switch>
                                        <Route path="/" exact component={Home} />
                                        <Route path="/about/" component={About} />
                                        <Route path="/repo/" component={CommentableCodePage} />
                                        <Route path="/chat/" component={FirebaseChat} />
                                        <Route path="/signup/" component={Signup} />
                                        <Route path="/login/" component={Login} />
                                        {/* //  TODO only render signup, login if authenticated not true!
                                            // render={(props) => authenticated === false
                                            //     ? <Component {...props} />
                                            //     : <Redirect to='/chat' />}
                                            // />
                                        */}
                                    </Switch>
                                </Section>
                            </QueryParamProvider>
                        </Router>
                        <AppFooter />
                {/* </ApolloProvider> */}
            </>
    );
    
}

const AppFooter = () => {
    return (
        <Footer>
            <Content textAlign="centered">
                    <a href="http://jasonludden.dev/">&copy; Jason Ludden 2020</a>
                    {/* <span> github link subreddit link twitter/slack/discord </span> */}

                        <a
                          title="Github"
                          href="https://github.com/jludden/">
                            <svg className="h-5 w-5 fill-current" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' width="24" height="24">
                                <path d='M256,32C132.3,32,32,134.9,32,261.7c0,101.5,64.2,187.5,153.2,217.9a17.56,17.56,0,0,0,3.8.4c8.3,0,11.5-6.1,11.5-11.4,0-5.5-.2-19.9-.3-39.1a102.4,102.4,0,0,1-22.6,2.7c-43.1,0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1,1.4-14.1h.1c22.5,2,34.3,23.8,34.3,23.8,11.2,19.6,26.2,25.1,39.6,25.1a63,63,0,0,0,25.6-6c2-14.8,7.8-24.9,14.2-30.7-49.7-5.8-102-25.5-102-113.5,0-25.1,8.7-45.6,23-61.6-2.3-5.8-10-29.2,2.2-60.8a18.64,18.64,0,0,1,5-.5c8.1,0,26.4,3.1,56.6,24.1a208.21,208.21,0,0,1,112.2,0c30.2-21,48.5-24.1,56.6-24.1a18.64,18.64,0,0,1,5,.5c12.2,31.6,4.5,55,2.2,60.8,14.3,16.1,23,36.6,23,61.6,0,88.2-52.4,107.6-102.3,113.3,8,7.1,15.2,21.1,15.2,42.5,0,30.7-.3,55.5-.3,63,0,5.4,3.1,11.5,11.4,11.5a19.35,19.35,0,0,0,4-.4C415.9,449.2,480,363.1,480,261.7,480,134.9,379.7,32,256,32Z'/>
                            </svg>
                        </a>
            </Content>

            
            {/* <ChatApp /> */}
            <FirebaseChat />
        </Footer>
        )
}

//
//

// function HomePage() {
    // welcome
    // repo explorer
    // Link repo explorer => Commentable Code
// }

function CommentableCodePage() {
    return (
        <div className="App">
            <Section>
                <Container>
                    <ErrorBoundary >
                        {/* <EndpointTest /> */}
                        <CommentableCode />
                    </ErrorBoundary>
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
