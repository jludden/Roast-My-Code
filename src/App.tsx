import * as React from 'react';
import './App.css';
import CommentableCode from './common/CommentableCode';
import AuthStatusView from './common/AuthStatusView';
import { Container, Hero, Title, Section, Button } from "rbx";
import "rbx/index.css";
import { IdentityContextProvider } from "react-netlify-identity-widget"
import "react-netlify-identity-widget/styles.css"

// import logo from './' './logo.svg';


class App extends React.Component {
  public render() {
    const url = "https://jludden-react.netlify.com/";
    return (
      <div className="App">
        {/* <header className="App-header">
          * <img src={logo} className="App-logo" alt="logo" /> }
          <h1 className="App-title">Welcome to React</h1>
        </header> */}
        <Hero color="primary" size="medium" gradient>
          <Hero.Body>
            <Container>
              <Title>
                Welcome to Roast My Code!
              </Title>
            </Container>
          </Hero.Body>
        </Hero>
        <IdentityContextProvider url={url}>
          <AuthStatusView />
          <Section>
            <Container>
              <CommentableCode document="passed in through props"/>
            </Container>
          </Section>
        </IdentityContextProvider>

      </div>
    );
  }
}


export default App;
