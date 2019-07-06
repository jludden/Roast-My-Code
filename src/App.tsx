import * as React from 'react';
import './App.css';
import CommentableCode from './components/CommentableCode';
import { Container, Hero, Title, Section, Button } from "rbx";
import "rbx/index.css";
import { IdentityContextProvider } from "react-netlify-identity-widget";
import "react-netlify-identity-widget/styles.css";
import { AuthWrapper } from "./components/AuthWrapper";
import { BrowserRouter as Router, Switch, Route, Link, RouteComponentProps  } from "react-router-dom";

// import logo from './' './logo.svg';


class App extends React.Component {
  public render() {
    return (
      <Router>
        <Hero color="primary" size="medium" gradient>
        <Hero.Body>
          <Container>
            <Title>
              Welcome to Roast My Code!
            </Title>
          </Container>
        </Hero.Body>
        </Hero>
        <Switch>

          <Route path="/" exact component={Index} />
          <Route path="/about/" component={About} />
          <Route path="/repo/" component={CommentableCodePage} />
      </Switch>

   
      </Router>
    );
  }
}

// AuthWrapper
//  Router
//    Home
//      Repo Explorer -> Link to Commentable Code
//    CommentableCode
//      Dir Explorer, Doc Header + Body
//
//

function HomePage() {
  // welcome
  // repo explorer

  // Link repo explorer => Commentable Code
}


function CommentableCodePage() {
  const url = "https://jludden-react.netlify.com/";
  return <div className="App">
      {/* <header className="App-header">
        * <img src={logo} className="App-logo" alt="logo" /> }
        <h1 className="App-title">Welcome to React</h1>
      </header> */}
     
      <IdentityContextProvider url={url}>
          <Section>
            <Container>
              <AuthWrapper >
                <CommentableCode />
              </AuthWrapper> 
            </Container>
          </Section>
      </IdentityContextProvider>
    </div>;
}

type TParams = { id: string };

function Index({ match }: RouteComponentProps<TParams>) {
  return <>
  
    <h2>This is a page for product with ID: {match.params.id} </h2>
    <Link to="/repo/">Commentable Code</Link>

  </>;
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
