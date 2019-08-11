import * as React from "react";
import "../App.css";
import "rbx/index.css";
import { Navbar, Button } from "rbx";
import { BrowserRouter as Router, Switch, Route, Link, RouteComponentProps  } from "react-router-dom";
import AuthStatusView from "./AuthStatusView";

export interface INavbarProps { }

const CCNavbar = (props: INavbarProps) => {
  return (
    <Navbar>
      <Navbar.Brand>
        <Navbar.Item href="#">
          <img
            src="https://bulma.io/images/bulma-logo.png"
            alt=""
            role="presentation"
            width="112"
            height="28"
          />
        </Navbar.Item>
        <Navbar.Burger />
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Segment align="start">
          <Navbar.Item>              
            <Link to="/">Search</Link>
          </Navbar.Item>
          <Navbar.Item> Documentation
            {/* <Link to="/repo/">Repo</Link> */}
          </Navbar.Item>

          <Navbar.Item dropdown>
            <Navbar.Link>More</Navbar.Link>
            <Navbar.Dropdown>
              <Navbar.Item>About</Navbar.Item>
              <Navbar.Item>Jobs</Navbar.Item>
              <Navbar.Item>Contact</Navbar.Item>
              <Navbar.Divider />
              <Navbar.Item>Report an issue</Navbar.Item>
            </Navbar.Dropdown>
          </Navbar.Item>
        </Navbar.Segment>

        <Navbar.Segment align="end">
          <Navbar.Item>
            <Button.Group>
              <AuthStatusView />

              <Button color="primary">
                <strong>Sign up</strong>
              </Button>
              <Button color="light">Log in</Button>
            </Button.Group>
          </Navbar.Item>
        </Navbar.Segment>
      </Navbar.Menu>
    </Navbar>
  );
}

export default CCNavbar;