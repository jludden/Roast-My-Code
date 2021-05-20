import React, { useContext } from 'react';
import '../App.css';
// import 'rbx/index.css';
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
import { logo, logoAlt } from '../images';
import { firebaseStore } from './FirebaseChat/FirebaseCommentsProvider';
import { LoggedInStatus } from './FirebaseChat/LoggedInStatus';

// import logo from '../static/emergency-fire-hazard.svg';
// import logo from '../static/noun_Roasting_Marshmallows.svg';

// will not be needed after react router v6
const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => <Link innerRef={ref} {...props} />);

const CCNavbar = () => {
    const { dispatch } = useContext(firebaseStore);

    return (
        <Navbar as="div" className="App-header">
            {/* <img src={logo} alt="Roast My Code Logo" role="presentation" width="medium" height="medium" /> */}

            <Navbar.Brand className="App-brand">
                <Navbar.Item as={AdapterLink} to="/">
                    <div className="logo" style={{ position: 'relative', height: '100%' }}>
                        <img
                            src={logo}
                            alt={logoAlt}
                            role="presentation"
                            width="medium"
                            height="medium"
                            style={{
                                maxHeight: '8.75rem',
                                position: 'absolute',
                            }}
                        />
                    </div>
                    <Title color="primary">&nbsp;&nbsp;Roast-My-Code</Title>
                </Navbar.Item>
                <Navbar.Burger />
            </Navbar.Brand>
            <Navbar.Menu>
                <Navbar.Segment align="start">
                    {/* https://github.com/dfee/rbx/issues/52 -> goto rbx@next */}
                    {/* NavLink - allows activeclassname attribute when matches current URL! */}
                    {/* exact activeClassName="is-active" */}
                    <Navbar.Item as={AdapterLink} to="/">
                        Home
                    </Navbar.Item>
                    <Navbar.Item as={AdapterLink} to="/search">
                        Search
                    </Navbar.Item>

                    {/* <Navbar.Item as={AdapterLink} to="/chat">
                        Chat
                    </Navbar.Item> */}

                    <Navbar.Item dropdown>
                        <Navbar.Link>More</Navbar.Link>
                        <Navbar.Dropdown>
                            {/* <Link to="/about"><Navbar.Item>About</Navbar.Item></Link> */}
                            <Navbar.Item as={AdapterLink} to="/about">
                                About
                            </Navbar.Item>
                            <Navbar.Divider />
                            <Navbar.Item as={AdapterLink} to="/inquiry">
                                Report an issue
                            </Navbar.Item>
                        </Navbar.Dropdown>
                    </Navbar.Item>
                </Navbar.Segment>

                <Navbar.Segment align="end">
                    <Navbar.Item as="div">
                        <LoggedInStatus />
                        {/* <Button.Group> */}
                        {/* <Button color="primary">
                <strong>Sign up</strong>
              </Button>
              <Button color="light">Log in</Button> */}
                        {/* </Button.Group> */}
                    </Navbar.Item>
                </Navbar.Segment>
            </Navbar.Menu>
        </Navbar>
    );
};

export default CCNavbar;
