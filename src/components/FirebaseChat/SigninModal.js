import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import Signup from '../../pages/Signup';
import Login, { Logout, FirebaseLogin } from '../../pages/Login';
import { db, auth } from '../../services/firebase';
import RoastComment from '../CommentableCodePage/types/findRepositoryByTitle';

import { Modal, Container, Hero, Title, Section, Button, Footer, Content } from 'rbx';

const initialState = {
    authenticated: false,
    showSignIn: false,
    showUserDetails: false,
    user: null,
    docCommentsId: 12345,
    firebaseError: '',
};
export const firebaseStore = createContext({
    state: initialState,
    dispatch: () => {},
    submitComment: () => {},
});

export const FirebaseCommentsProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'showSignIn':
                return { ...state, showSignIn: true };

            case 'hideSignIn':
                return { ...state, showSignIn: false };

            case 'showUserDetails':
                return { ...state, showUserDetails: true };

            case 'hideUserDetails':
                return { ...state, showUserDetails: false };

            case 'authenticate':
                const newState = {
                    ...state,
                    showSignIn: false,
                    authenticated: true,
                    user: auth().currentUser,
                };
                return newState;

            case 'error':
                console.log(action.payload);
                return { ...state, error: action.payload };

            case 'signOut':
                return {
                    ...state,
                    authenticated: false,
                    user: null,
                };
            default:
                throw new Error();
        }
    }, initialState);

    const submitComment = async (comment, commentsId) => {
        if (!state.authenticated) {
            dispatch({ type: 'error', payload: 'cannot add comment - not authenticated' });
            return false;
        }

        const user = state.user;
        if (!user) {
            dispatch({ type: 'error', payload: "can't add comment - not logged in" });
            return false;
        }

        await db.ref('file-comments/' + state.docCommentsId).push({
            text: comment.text,
            lineNumber: comment.lineNumber,
            timestamp: Date.now(),
            uid: user.uid,
        });
        return true;
    };

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                dispatch({ type: 'authenticate' });
            } else {
                dispatch({ type: 'signOut' });
            }
        });
        return () => unsubscribe();
    }, []);

    return <firebaseStore.Provider value={{ state, submitComment, dispatch }}>{children}</firebaseStore.Provider>;
};

export const SigninModal = () => {
    const {
        dispatch,
        state: { showSignIn },
    } = useContext(firebaseStore);

    return (
        <Modal active={showSignIn} onClose={() => dispatch({ type: 'hideSignIn' })} closeOnBlur={true}>
            <Modal.Background />
            <Modal.Close />
            <Modal.Card>
                <Modal.Card.Head>
                    <Modal.Card.Title>Sign in</Modal.Card.Title>
                </Modal.Card.Head>
                <Modal.Card.Body>
                    <FirebaseLogin />
                </Modal.Card.Body>
            </Modal.Card>
        </Modal>
    );
};

export const UserDetailsModal = () => {
    const {
        dispatch,
        state: { showUserDetails, user },
    } = useContext(firebaseStore);

    return (
        <Modal active={showUserDetails} onClose={() => dispatch({ type: 'hideUserDetails' })} closeOnBlur={true}>
            <Modal.Background />
            <Modal.Close />
            <Modal.Card>
                <Modal.Card.Head>
                    <Modal.Card.Title>User Details</Modal.Card.Title>
                </Modal.Card.Head>
                <Modal.Card.Body>
                    More coming soon!
                    <br />
                    <br />
                    <span>
                        {user &&
                            `display: ${user.displayName} \n email: ${user.email} \n photoURL: ${user.photoURL} \n uid: ${user.uid}`}
                    </span>
                </Modal.Card.Body>
                <Modal.Card.Foot>
                    <Button color="success">Save changes</Button>
                    <Button onClick={() => dispatch({ type: 'hideUserDetails' })}>Cancel</Button>
                </Modal.Card.Foot>
            </Modal.Card>
        </Modal>
    );
};
