import * as React from 'react';
import '../App.css';
import 'rbx/index.css';
import { Navbar, Button } from 'rbx';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    LinkProps,
    NavLink,
    RouteComponentProps,
} from 'react-router-dom';
import AuthStatusView from './AuthStatusView';

// will not be needed after react router v6
const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => <Link innerRef={ref} {...props} />);

const CCNavbar = () => {
    return (
        <Navbar>
            <Navbar.Brand>
                <Navbar.Item href="/">
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
                    {/* https://github.com/dfee/rbx/issues/52 -> goto rbx@next */}
                    {/* NavLink - allows activeclassname attribute when matches current URL! */}
                    {/* exact activeClassName="is-active" */}
                    <Navbar.Item as={AdapterLink} to="/">
                        Search
                    </Navbar.Item>

                    <Navbar.Item>
                        {' '}
                        Documentation
                        {/* <Link to="/repo/">Repo</Link> */}
                    </Navbar.Item>

                    <Navbar.Item dropdown>
                        <Navbar.Link>More</Navbar.Link>
                        <Navbar.Dropdown>
                            {/* <Link to="/about"><Navbar.Item>About</Navbar.Item></Link> */}
                            <Navbar.Item as={AdapterLink} to="/about">
                                About
                            </Navbar.Item>
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
                            {/* <Button color="primary">
                <strong>Sign up</strong>
              </Button>
              <Button color="light">Log in</Button> */}
                        </Button.Group>
                    </Navbar.Item>
                </Navbar.Segment>
            </Navbar.Menu>
        </Navbar>
    );
};

export default CCNavbar;
