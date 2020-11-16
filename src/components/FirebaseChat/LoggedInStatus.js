import React, { useState, useContext } from 'react';
import { SigninModal, FirebaseCommentsProvider, firebaseStore } from './SigninModal';
import { Navbar, Button, Modal, Media, Title, Textarea } from 'rbx';
import { UserAvatar, UserHeader, AvatarPicker } from '../Avatar';
import ErrorBoundary from '../Common/ErrorBoundary';
import { generateUserName } from './helpers/nameGen';
import { FaRedoAlt } from 'react-icons/fa';
import '../../App.css';

export const LoggedInStatus = () => {
    const {
        dispatch,
        state: { user },
        signOut,
    } = useContext(firebaseStore);

    if (user)
        return (
            <ErrorBoundary message="Unable to resolve auth" >
                <div>
                    <div className="hover-container">
                        <ChangeDisplayName onClickHandler={() => dispatch({ type: 'showUserDetails' })} />
                        <LoggedInUserDetails user={user} />
                    </div>
                    <Button color="light" onClick={() => signOut()}>
                        Sign out
                    </Button>
                </div>
            </ErrorBoundary>
        );

    return (
        <div>
            <Button color="primary" onClick={() => dispatch({ type: 'showSignIn' })}>
                Sign in
            </Button>
        </div>
    );
};

const ChangeDisplayName = ({ onClickHandler }) => {
    return (
        <div className="hover-in">
            <Button color="primary" onClick={onClickHandler}>
                Change Display Name
            </Button>
        </div>
    );
};

export function firebasePhotoURLToRoastAvatar(user) {
    if (user.photoURL) {
        const parts = user.photoURL.split('/');
        return parts[parts.length-1];
    }
    return 0;
}

export function firebaseUserToRoastUserName(user) {
    return user.displayName || (user.isAnonymous ? 'Anonymous' : user.email) || 'Anon';
}

const LoggedInUserDetails = ({ user }) => {
    const displayName = firebaseUserToRoastUserName(user);

    const textStub = {
        height: '2em',
        // lineHeight: '2em',
        paddingRight: '1em',
    };

    return (
        <div className="hover-out" style={textStub}>
            
            <UserHeader
                user={{
                    displayName,
                    uid: user.uid,
                    avatar: firebasePhotoURLToRoastAvatar(user),
                }}
            />
            {/* <UserAvatar />
            <span
                style={{paddingLeft: '10px'}}
                title={`display: ${user.displayName} \n email: ${user.email} \n photoURL: ${user.photoURL} \n uid: ${user.uid}`}
            >
                {name}
            </span> */}
        </div>
    );
};

export const UserDetailsModal = () => {
    const {
        dispatch,
        updateUserDetails,
        state: { showUserDetails, user },
    } = useContext(firebaseStore);

    const [displayName, setDisplayName] = useState(user ? user.displayName : 'Set display name');
    const [avatar, setAvatar] = useState(user ? firebasePhotoURLToRoastAvatar(user) : 1);

    const validateSaveChanges = () => {
        if (!user) {
            dispatch({ type: 'error', payload: "can't update user details: user is not logged in" });
            return;
        }

        updateUserDetails({ photoURL: `rbx/${avatar}`, displayName });
    }

    return (
        <Modal active={showUserDetails} onClose={() => dispatch({ type: 'hideUserDetails' })} closeOnBlur={true}>
            <Modal.Background />
            <Modal.Close />
            <Modal.Card>
                <Modal.Card.Head>
                    <Modal.Card.Title>User Details</Modal.Card.Title>
                </Modal.Card.Head>
                <Modal.Card.Body>
                <Media>
                    <Media.Item align="left" >
                       <AvatarPicker avatar={avatar} setAvatar={(avatar) => setAvatar(avatar)} />
                    </Media.Item>
                    <Media.Item align="content" >
                        <span>
                        {user && (
                            <>
                                <span>{`display: ${user.displayName} \n email: ${user.email} \n photoURL: ${user.photoURL} \n uid: ${user.uid}`}</span>
                                <br />
                                <div>
                                    <label htmlFor="displayname">Display name:</label>
                                    <input
                                        type="text"
                                        id="displayname"
                                        name="displayname"
                                        value={displayName}
                                        onChange={(event) => setDisplayName(event.target.value)}
                                    />
                                    <Button onClick={() => setDisplayName(generateUserName())}>
                                        <FaRedoAlt />
                                    </Button>
                                </div>
                            </>
                        )}
                    </span>
                    </Media.Item>
                </Media>
                    
                </Modal.Card.Body>
                <Modal.Card.Foot>
                    <Button
                        color="success"
                        onClick={() => validateSaveChanges()}
                    >
                        Save changes
                    </Button>
                    <Button onClick={() => dispatch({ type: 'hideUserDetails' })}>Cancel</Button>
                </Modal.Card.Foot>
            </Modal.Card>
        </Modal>
    );
};
