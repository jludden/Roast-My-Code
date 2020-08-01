/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { Component } from 'react';
import { auth } from '../../services/firebase';
import { db } from '../../services/firebase';
import { Logout } from '../../pages/Login';
import ErrorBoundary from '../Common/ErrorBoundary';

class FirebaseChat extends Component {
    constructor() {
        super();
        this.state = {
            authenticated: false,
            loading: true,
        };
    }

    componentDidMount() {
        auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authenticated: true,
                    loading: false,
                });
            } else {
                this.setState({
                    authenticated: false,
                    loading: false,
                });
            }
        });
    }

    render() {
        return (
            <div>
                <h1>Chat Entry</h1>
                <Logout />

                <span>loading: {this.state.loading}</span>
                <span>authenticated: {this.state.authenticated}</span>

                <ErrorBoundary message="failed to render firebase chat">
                    <Chat />
                </ErrorBoundary>

                <h1>chat exit</h1>
            </div>
        );
    }
}

export class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth().currentUser,
            chats: [],
            content: '',
            readError: null,
            writeError: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
          content: event.target.value
        });
      }
      async handleSubmit(event) {
        event.preventDefault();
        this.setState({ writeError: null });
        try {
          await db.ref("chats").push({
            content: this.state.content,
            timestamp: Date.now(),
            uid: this.state.user.uid
          });
          this.setState({ content: '' });
        } catch (error) {
          this.setState({ writeError: error.message });
        }
      }
    async componentDidMount() {
        this.setState({ readError: null });
        try {
            db.ref('chats').on('value', (snapshot) => {
                let chats = [];
                snapshot.forEach((snap) => {
                    chats.push(snap.val());
                });
                this.setState({ chats });
            });
        } catch (error) {
            this.setState({ readError: error.message });
        }
    }
    render() {
        return (
          <div>
            <div className="chats">
              {this.state.chats.map(chat => {
                return <p key={chat.timestamp}>{chat.content}</p>
              })}
            </div>
            <form onSubmit={this.handleSubmit}>
                <input onChange={this.handleChange} value={this.state.content}></input>
                {this.state.error ? <p>{this.state.writeError}</p> : null}
                <button type="submit">Send</button>
            </form>
            <div>
                Login in as: 
                
                <strong>{
                    this.state.user && this.state.user.email
                    ? this.state.user.email
                    : "unknown"
                    }</strong>
            </div>
          </div>
        );
      }
}

export default FirebaseChat;
