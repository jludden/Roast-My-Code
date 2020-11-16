import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import Signup from '../../pages/Signup';
import Login, { Logout, FirebaseLogin } from '../../pages/Login';
import { db, auth } from '../../services/firebase';
import { firebaseUserToRoastUserName, firebasePhotoURLToRoastAvatar } from './LoggedInStatus';
import RoastComment from '../CommentableCodePage/types/findRepositoryByTitle';
import { generateUserName } from './helpers/nameGen';
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
    submitComment: async (comment, filePath, queryVariables) => false,
    signOut: async () => {},
});

export const FirebaseCommentsProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'showSignIn':
                return { ...state, showSignIn: true };

            case 'hideSignIn':
                return { ...state, showSignIn: false };

            case 'showUserDetails': //todo consolidate to one modal
                return { ...state, showUserDetails: true };

            case 'hideUserDetails':
                return { ...state, showUserDetails: false };

            // case 'authenticate':
            //     const newState = {
            //         ...state,
            //         showSignIn: false,
            //         authenticated: true,
            //         user: auth().currentUser,
            //     }; //todo merge to updateUserDetails
            //     return newState;

            case 'updateUserDetails':
                return {
                    ...state,
                    user: action.payload,
                    showUserDetails: false,
                    showSignIn: false,
                    authenticated: true,
                };

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

    const submitComment = async (comment, filePath, queryVariables) => {
        if (!state.authenticated) {
            dispatch({ type: 'error', payload: 'cannot add comment - not authenticated' });
            return false;
        }

        const user = state.user;
        if (!user) {
            dispatch({ type: 'error', payload: "can't add comment - not logged in" });
            return false;
        }

        const newCommentData = {
            filePath,
            queryVariables,
            text: comment.text,
            lineNumber: comment.lineNumber,
            timestamp: Date.now(),
            author: {
                displayName: firebaseUserToRoastUserName(user),
                uid: user.uid,
                photoURL: user.photoURL || 0,
            },
        };

        // Write the comment to a few separate places
        var ref = db.ref();
        // Generate a new push ID for the new post
        var newCommentRef = await ref.child('posts').push();
        var newCommentKey = newCommentRef.key;
        // Create the data we want to update
        var fbUpdates = {};
        fbUpdates[`user-comments/${user.uid || 1}/${newCommentKey}`] = true;
        fbUpdates[`file-comments/${filePath}/${newCommentKey}`] = newCommentData;
        fbUpdates[`comments/${newCommentKey}`] = newCommentData;
        // Do a deep-path update
        ref.update(fbUpdates, function (error) {
            if (error) {
                console.log('Error updating data:', error);
                return false;
            }
        });

        return true;
    };

    const signOut = async () => {
        await auth().signOut();
        dispatch({ type: 'signOut' });
    }

    const handleSignup = async (user) => {
        if (!user.displayName && user.isAnonymous) {
            // todo set random name and avatar
            const avatar = 3;
            const displayName = generateUserName();

            updateUserDetails({ ...user, photoURL: `rbx/${avatar}`, displayName });
        } else {
            updateUserDetails(user);
        }
    };

    const updateUserDetails = async (newUserDetails) => {      
        try {
            await auth().currentUser.updateProfile({
                ...newUserDetails,
            });

            dispatch({
                type: 'updateUserDetails',
                payload: {
                    ...auth().currentUser,
                    ...newUserDetails,
                },
            });
        } catch (error) {
            dispatch({ type: 'error', payload: "can't update user details: " + error });
        }
    };

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            user ? handleSignup(user) : signOut();
        });
        return () => unsubscribe();
    }, []);

    return (
        <firebaseStore.Provider value={{ state, submitComment, signOut, updateUserDetails, dispatch }}>
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

export const FirebaseQuery = () => {
    const [showQuery, setShowQuery] = useState(false);
    if (!showQuery) return <Button onClick={() => setShowQuery(!showQuery)}>Query Firebase</Button>;

    return (
        <div>
            <Button onClick={() => setShowQuery(!showQuery)}>Query Firebase</Button>
            <div>
                <h1>Results:</h1>
                <FirebaseQueryInner />
            </div>
        </div>
    );
};

export const FirebaseQueryInner = ({ children }) => {
    const [loadCommentsError, setLoadCommentsError] = useState();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const dbRef = db.ref('comments');
        try {
            dbRef
                .orderByChild('timestamp')
                .limitToLast(20)
                .on('child_added', function (snap) {
                    const snapval = snap.val();
                    console.log(
                        snap.key + ' was posted on' + snapval.timestamp + ' and had this text: ' + snapval.text,
                    );

                    setComments((c) => [
                        {
                            ...snapval,
                            _id: snap.key,
                            updatedAt: new Date(snapval.timestamp),
                            decodedFilePath: atob(snapval.filePath),
                        },
                        ...c,
                    ]);
                });
        } catch (error) {
            setLoadCommentsError(error.message);
        }
        return () => dbRef.off();
    }, []);

    if (loadCommentsError) return <div>failed to load comment query for doc</div>;

    return <div>{children({ comments })}</div>;

    return (
        <>
            {comments.map((comment) => (
                <div key={comment._id}>
                    {comment.decodedFilePath +
                        `[${comment._id}]` +
                        ' was posted on' +
                        comment.updatedAt +
                        ' and had this text: ' +
                        comment.text}
                </div>
            ))}
        </>
    );
};
