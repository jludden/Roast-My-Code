import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import Signup from '../../pages/Signup';
import Login, { Logout, FirebaseLogin } from '../../pages/Login';
import { db, auth } from '../../services/firebase';
import { firebaseUserToRoastUserName } from './LoggedInStatus';
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
    dispatch: (action) => {},
    submitComment: (comment, commentsId) => {},
});

// function getLoggedInUser(user) {
//     return {
//         name: string;
//         uid: number;
//         avatar: number | undefined;
//     }
// }

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
                    // roastUser: getLoggedInUser(user)
                };
                return newState;

            case 'updateUserDetails':
                return { ...state, user: action.payload };

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

        await db.ref('file-comments/' + commentsId).push({
            text: comment.text,
            lineNumber: comment.lineNumber,
            timestamp: Date.now(),
            uid: user.uid,
            author: {
                name: firebaseUserToRoastUserName(user),
                uid: user.uid,
                avatar: user.photoURL || 0,
            },
        });
        return true;
    };

    const updateUserDetails = async (newUserDetails) => {
        if (!state.user) {
            dispatch({ type: 'error', payload: "can't update user details: user is not logged in" });
            return;
        }

        try {
            await state.user.updateProfile({
                displayName: 'Jane Q. User',
                photoURL: 'https://example.com/jane-q-user/profile.jpg',
            });

            dispatch({ type: 'updateUserDetails', payload: { user: newUserDetails } });
        } catch (error) {
            dispatch({ type: 'error', payload: "can't update user details: " + error });
        }
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

    return (
        <firebaseStore.Provider value={{ state, submitComment, updateUserDetails, dispatch }}>
            {children}
        </firebaseStore.Provider>
    );
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
