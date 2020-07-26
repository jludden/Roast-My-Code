import * as React from 'react';
import '../App.css';
import 'rbx/index.css';
import { Navbar, Button, Title } from 'rbx';
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
import logo from '../static/favicon.ico';

// import logo from '../static/emergency-fire-hazard.svg';
// import logo from '../static/noun_Roasting_Marshmallows.svg';

// will not be needed after react router v6
const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => <Link innerRef={ref} {...props} />);

const CCNavbar = () => {
    return (
        <Navbar>
            <Navbar.Brand>
                <Navbar.Item href="/">
                    <img
                        src={logo}
                        alt="Roast My Code Logo"
                        role="presentation"
                        width="medium"
                        height="medium"
                    />
                    <Title style={{ color: '#209cee', marginLeft: '1rem' }}>
                        Roast My Code
                    </Title>
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
                            {/* <AuthStatusView /> */}
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
