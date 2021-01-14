import React, {useContext} from 'react';
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
import {logo} from '../images';
import { firebaseStore } from './FirebaseChat/SigninModal';
import { LoggedInStatus } from './FirebaseChat/LoggedInStatus';

// import logo from '../static/emergency-fire-hazard.svg';
// import logo from '../static/noun_Roasting_Marshmallows.svg';

// will not be needed after react router v6
const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => <Link innerRef={ref} {...props} />);

const CCNavbar = () => {
    const { dispatch } = useContext(firebaseStore);

    return (
        <Navbar as="div" className="App-header">
            <Navbar.Brand>
                <Navbar.Item as={AdapterLink} to="/">
                    <img src={logo} alt="Roast My Code Logo" role="presentation" width="medium" height="medium" />
                    <Title style={{ color: '#209cee', marginLeft: '1rem' }}>Roast My Code</Title>
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
                            <Navbar.Item onClick={() => dispatch({type: 'showSignIn'})}>
                                Sign in Modal
                            </Navbar.Item>
                            <Navbar.Item as={AdapterLink} to="/signup">
                                Sign up
                            </Navbar.Item>
                            <Navbar.Item as={AdapterLink} to="/login">
                                Log in
                            </Navbar.Item>
                            <Navbar.Divider />
                            <Navbar.Item as={AdapterLink} to="/inquiry">Report an issue</Navbar.Item>
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
