import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Logout } from './Login';
import { signup, signin, signInWithGoogle, signInWithGitHub } from '../components/FirebaseChat/helpers/auth';

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          email: '',
          password: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.logIn = this.logIn.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.githubSignIn = this.githubSignIn.bind(this);
        this.googleSignIn = this.googleSignIn.bind(this);

    }

    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
      }

      async logIn(){
        this.setState({ error: '' });
        try {
          await signin(this.state.email, this.state.password);
        } catch (error) {
          this.setState({ error: error.message });
        }
      }

      async handleSubmit(event) {
        event.preventDefault();
        this.setState({ error: '' });
        try {
          await signup(this.state.email, this.state.password);
        } catch (error) {
          this.setState({ error: error.message });
        }
      }

      async githubSignIn() {
        this.setState({ error: '' });
        try {
          await signInWithGitHub();
        } catch (error) {
          this.setState({ error: error.message });
        }
      }

      async googleSignIn() {
        this.setState({ error: '' });
        try {
          await signInWithGoogle();
        } catch (error) {
          this.setState({ error: error.message });
        }
      }

  render() {

    // if () return (
    //   <div>
    //     <Logout />
    //   </div>
    // )

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {/* <h1>
            Sign Up to
          <Link to="/">Roast My Code</Link>
          </h1>

          <p>Or</p> */}
          {/* <button onClick={this.googleSignIn} type="button">
            Sign up with Google
          </button> */}

          {/* <p>Fill in the form below to create an account.</p> */}

          {this.state.error ? <p>{this.state.error}</p> : null}
          <div>
            <input placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
          </div>
          <div>
            <input placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
          </div>
          <div>
            <button type="button" onClick={this.logIn}>
              Log in
            </button>
          </div>

          <div>
            <button type="submit">Register</button>
          </div>
          <hr></hr>
          {/* <p>Already have an account? <Link to="/login">Login</Link></p> */}
          <button type="button" onClick={this.githubSignIn}>
            Log in with GitHub
          </button>
        </form>
      </div>
    )
  }
}