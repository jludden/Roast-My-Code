import React, { useState, useContext } from 'react';
import { firebaseStore } from './SigninModal';
import { Button, Modal, Media, Title } from 'rbx';
import { UserAvatar, UserHeader, AvataaarPicker } from '../Avatar';
import ErrorBoundary from '../Common/ErrorBoundary';
import { generateUserName } from './helpers/nameGen';
import { FaRedoAlt, FaEdit } from 'react-icons/fa';
import '../../App.css';

export const LoggedInStatus = () => {
    const {
        dispatch,
        state: { user },
        signOut,
    } = useContext(firebaseStore);

    if (user)
        return (
            <ErrorBoundary message="Unable to resolve auth">
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
        return parts[parts.length - 1];
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
                    photoURL: user.photoURL,
                }}
            />
        </div>
    );
};

export const UserDetailsModal = () => {
    const {
        dispatch,
        updateUserDetails,
        state: { showUserDetails, user },
    } = useContext(firebaseStore);

    const [displayName, setDisplayName] = useState(user ? user.displayName : '');
    const [imageUrl, setImageUrl] = useState(user ? user.photoURL : '');
    const [showMore, setShowMore] = React.useState(false);
    React.useEffect(() => {
        if (user) {
            setDisplayName(user.displayName);
            setImageUrl(user.photoURL);
        } else {
            setDisplayName('');
            setImageUrl('');
        }
    }, [user, showUserDetails]);

    const validateSaveChanges = () => {
        if (!user) {
            dispatch({ type: 'error', payload: "can't update user details: user is not logged in" });
            return;
        }

        updateUserDetails({ photoURL: imageUrl, displayName });
    };

    return (
        <Modal active={showUserDetails} onClose={() => dispatch({ type: 'hideUserDetails' })} closeOnBlur={true}>
            <Modal.Background />
            <Modal.Close />
            <Modal.Card>
                <Modal.Card.Head>
                    <Modal.Card.Title
                        size={3}
                        title={
                            user &&
                            `display: ${user.displayName} \n email: ${user.email} \n photoURL: ${user.photoURL} \n uid: ${user.uid}`
                        }
                    >
                        User Details
                    </Modal.Card.Title>
                </Modal.Card.Head>
                <Modal.Card.Body>
                    <Media>
                        <Media.Item align="content">
                            {user && (
                                <div>
                                    <Title size={5}>Update Avatar Image:</Title>
                                    <UserAvatar imageUrl={imageUrl} containerStyle={{ display: 'flex' }}>
                                        <Button title="Edit avatar" onClick={() => setShowMore(!showMore)}>
                                            <FaEdit />
                                            &nbsp;Edit
                                        </Button>
                                    </UserAvatar>

                                    {showMore && (
                                        <AvataaarPicker
                                            imageUrl={imageUrl}
                                            setImageUrl={(imageUrl) => setImageUrl(imageUrl)}
                                        />
                                    )}
                                </div>
                            )}
                            {user && (
                                <div>
                                    <Title size={5} style={{ paddingTop: '3rem' }}>
                                        Update Dispayed Name:
                                    </Title>
                                </div>
                            )}
                            <div>
                                {user && (
                                    <>
                                        <div>
                                            <input
                                                type="text"
                                                id="displayname"
                                                name="displayname"
                                                value={displayName}
                                                onChange={(event) => setDisplayName(event.target.value)}
                                            />
                                            <Button
                                                title="Random name"
                                                onClick={() => setDisplayName(generateUserName())}
                                            >
                                                <FaRedoAlt />
                                                &nbsp;Random
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Media.Item>
                    </Media>
                </Modal.Card.Body>
                <Modal.Card.Foot>
                    <Button color="primary" onClick={() => validateSaveChanges()}>
                        Save changes
                    </Button>
                    <Button onClick={() => dispatch({ type: 'hideUserDetails' })}>Cancel</Button>
                </Modal.Card.Foot>
            </Modal.Card>
        </Modal>
    );
};
