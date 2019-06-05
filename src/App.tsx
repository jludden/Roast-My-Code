import * as React from 'react';
import './App.css';
import CommentableCode from './common/CommentableCode';
import { Container, Hero, Title, Section } from "rbx";
import "rbx/index.css";
// import logo from './' './logo.svg';


class App extends React.Component {
  public render() {
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
        <Section>
          <Container>
            <CommentableCode document="passed in through props"/>
          </Container>
        </Section>

      </div>
    );
  }
}


export default App;
