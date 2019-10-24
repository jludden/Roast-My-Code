import * as React from 'react';
import './App.css';
import { Container, Hero, Title, Section, Button, Footer, Content } from 'rbx';
import 'rbx/index.css';
import { IdentityContextProvider } from 'react-netlify-identity-widget';
import 'react-netlify-identity-widget/styles.css';
import { BrowserRouter as Router, Switch, Route, Link, RouteComponentProps } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import IntrospectionResultData, { Blob, Repository, RepositoryConnection } from './generated/graphql';
import { AuthWrapper } from './components/AuthWrapper';
import { Home } from './components/Home';
import CommentableCode from './components/CommentableCodePage/CommentableCode';
import CCNavBar from './components/Navbar';
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
export const faunaDbClient = new ApolloClient({
    cache,
    uri: '/.netlify/functions/repo_comments',
    clientState: { defaults: {}, resolvers: {} },
});

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
                <ApolloProvider client={faunaDbClient}>
                    <IdentityContextProvider url={url}>
                        <Router>
                            <QueryParamProvider ReactRouterRoute={Route}>
                                <CCNavBar />

                                {/* 
              <Hero color="primary" size="medium" gradient>
              <Hero.Body>
                <Container>
                  <Title>
                    Welcome to Roast My Code!
                  </Title>
                </Container>
              </Hero.Body>
              </Hero> */}
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
