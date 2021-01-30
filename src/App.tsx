import React from 'react';
import './App.css';
import './generated/Bulma.css';
import { Container, Hero, Title, Section, Button, Footer, Content } from 'rbx';
// import 'rbx/index.css';
import { BrowserRouter as Router, Switch, Route, Link, RouteComponentProps } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
// import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import IntrospectionResultData, { Blob, Repository, RepositoryConnection } from './generated/graphql';
import { Search } from './pages/Search';
import { Home} from './pages/Home';
import About from './pages/About';
import Inquiry from './pages/Inquiry';
import CommentableCode from './components/CommentableCodePage/CommentableCode';
import CCNavBar from './components/Navbar';
import { EndpointTest } from './components/CommentableDocument/EndpointTest';
import ErrorBoundary from './components/Common/ErrorBoundary';
import { auth } from './services/firebase';
import FirebaseChat from './components/FirebaseChat/Chat';
import { FirebaseCommentsProvider } from './components/FirebaseChat/FirebaseCommentsProvider';
import { SigninModal } from './components/FirebaseChat/SigninModal';
import { UserDetailsModal } from './components/FirebaseChat/LoggedInStatus';
import Signup from './pages/Signup';


const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: IntrospectionResultData,
});
export const cache = new InMemoryCache({ fragmentMatcher });

    export const githubClient: ApolloClient<InMemoryCache> = new ApolloClient({
        cache,
        uri: '/.netlify/functions/repo_github',
});

export const App = () => {
    // // <div className="App_Background">

        const url = 'https://jludden-react.netlify.com/';

    return (

            <>
                <ApolloProvider client={githubClient as any}>
                        <Router>
                            <QueryParamProvider ReactRouterRoute={Route}>
                                <CCNavBar />

                                <SigninModal />
                                <UserDetailsModal />

                                {/* <Section color="dark"> */}
                                    <Switch>
                                        <Route path="/" exact component={Home} />
                                        <Route path="/search" component={Search} />
                                        <Route path="/about/" component={About} />
                                        <Route path="/repo/" component={CommentableCodePage} />
                                        <Route path="/chat/" component={FirebaseChat} />
                                        <Route path="/inquiry" component={Inquiry} />
                                        {/* <Route path="/signup/" component={Signup} />
                                        <Route path="/login/" component={Login} /> */}
                                        {/* //  TODO only render signup, login if authenticated not true!
                                            // render={(props) => authenticated === false
                                            //     ? <Component {...props} />
                                            //     : <Redirect to='/chat' />}
                                            // />
                                        */}
                                    </Switch>
                                {/* </Section> */}
                            </QueryParamProvider>
                        </Router>
                        <AppFooter />
                </ApolloProvider>
            </>
    );
}

export const AppContext = () => (
    <FirebaseCommentsProvider>
        <App />
    </FirebaseCommentsProvider>
)

export default AppContext;

const AppFooter = () => {
    return (
        <Footer>
            <Content textAlign="centered">
                <p>&copy; Jason Ludden 2021</p>
            </Content>
            {/* <Section>
                <FirebaseQuery />
            </Section> */}
        </Footer>
    )
}

function CommentableCodePage() {
    return (
        <div className="App">
            <Container breakpoint="desktop">
                <ErrorBoundary >
                    {/* <EndpointTest /> */}
                    <CommentableCode />
                </ErrorBoundary>
            </Container>
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
                            <Link to="/search">Search</Link>
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

