import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signin, signInWithGoogle, signInWithGitHub, logout } from '../components/FirebaseChat/helpers/auth';

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
