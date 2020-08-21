import React, { useState, useContext } from 'react';
import { SigninModal, FirebaseCommentsProvider, firebaseStore } from './SigninModal';
import { Navbar, Button, Modal, Title, Textarea } from 'rbx';
import { UserAvatar, UserHeader, AvatarPicker } from '../Avatar';
import ErrorBoundary from '../Common/ErrorBoundary';
import '../../App.css';

export const LoggedInStatus = () => {
    const {
        dispatch,
        state: { user },
    } = useContext(firebaseStore);

    if (user)
        return (
            <ErrorBoundary message="Unable to resolve auth" >
                <div>
                    <div className="hover-container">
                        <ChangeDisplayName onClickHandler={() => dispatch({ type: 'showUserDetails' })} />
                        <LoggedInUserDetails user={user} />
                    </div>
                    <Button color="light" onClick={() => dispatch({ type: 'signOut' })}>
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
    const name = firebaseUserToRoastUserName(user);

    const textStub = {
        height: '2em',
        // lineHeight: '2em',
        paddingRight: '1em',
    };

    return (
        <div className="hover-out" style={textStub}>
            
            <UserHeader
                user={{
                    name,
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

    const [dname, setDname] = useState(user ? user.displayName : 'Set display name');
    const [avatar, setAvatar] = useState(user ? firebasePhotoURLToRoastAvatar(user) : 1);

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
                        {user && (
                            <>
                                <span>{`display: ${user.displayName} \n email: ${user.email} \n photoURL: ${user.photoURL} \n uid: ${user.uid}`}</span>
                                <br />
                                <label htmlFor="displayname">Display name:</label>
                                <input
                                    type="text"
                                    id="displayname"
                                    name="displayname"
                                    value={dname}
                                    onChange={(event) => setDname(event.target.value)}
                                />
                            </>
                        )}
                    </span>
                    <AvatarPicker avatar={avatar} setAvatar={(avatar) => setAvatar(avatar)} />
                </Modal.Card.Body>
                <Modal.Card.Foot>
                    <Button
                        color="success"
                        onClick={() => updateUserDetails({ photoURL: `rbx/${avatar}`, displayName: dname })}
                    >
                        Save changes
                    </Button>
                    <Button onClick={() => dispatch({ type: 'hideUserDetails' })}>Cancel</Button>
                </Modal.Card.Foot>
            </Modal.Card>
        </Modal>
    );
};
