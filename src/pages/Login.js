import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signin, signInWithGoogle, signInWithGitHub, logout } from '../components/FirebaseChat/helpers/auth';
// import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/auth';        
import * as firebaseui from 'firebaseui';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


var uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false,
        // signInFailure: handleSignInFailure

    },
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    // tosUrl: '/terms',
    // // Privacy policy url/callback.
    // privacyPolicyUrl: '/privacy'
    credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    // autoUpgradeAnonymousUsers: true,
};

// const handleSignInFailure = () => {

// }

// export const FirebaseUILogin = () => {
//     const onClick = () => {
//         // Initialize the FirebaseUI Widget using Firebase.
//         var ui = new firebaseui.auth.AuthUI(firebase.auth());
//         // The start method will wait until the DOM is loaded.
//         ui.start('#firebaseui-auth-container', uiConfig);
//     }

//     return (
//         <div onClick={() => onClick()} id='firebaseui-auth-container'>LoginToggle</div>
//     )
// }

export const FirebaseLogin = () => {
    return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;
};
// todo consider https://github.com/firebase/firebaseui-web-react#using-firebaseauth-with-local-state
export const Login = () => {
    const [state, setState] = useState({});

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setState({ ...state, error: '' });
        try {
            await signin(state.email, state.password);
        } catch (error) {
            setState({ ...state, error: error.message });
        }
    };

    return (
        <div className="container">
            <form className="mt-5 py-5 px-5" autoComplete="off" onSubmit={handleSubmit}>
                <h1>
                    Login to
                    <Link className="title ml-2" to="/">
                        Roast My Code
                    </Link>
                </h1>
                <p className="lead">Fill in the form below to login to your account.</p>
                <div className="form-group">
                    <input
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                        value={state.email}
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={state.password}
                        type="password"
                    />
                </div>
                <div className="form-group">
                    {state.error ? <p className="text-danger">{state.error}</p> : null}
                    <button className="btn btn-primary px-5" type="submit">
                        Login
                    </button>
                </div>
                <p>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </form>
        </div>
    );
};

export const Logout = () => {
    const [error, setError] = useState(null);
    const handleLogout = () => {
        try {
            setError(null);
            logout();
        } catch (error) {
            setError('Failed to logout: ' + error);
        }
    };
    return (
        <>
            <button type="button" onClick={handleLogout}>
                Logout
            </button>
            {error && <p>{error}</p>}
        </>
    );
};

export default Login;
