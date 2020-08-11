import React, { useState, useContext } from 'react';
import { SigninModal, FirebaseCommentsProvider, firebaseStore } from './SigninModal';
import { Navbar, Button, Title } from 'rbx';
import { UserAvatar } from '../Avatar';
import '../../App.css';

export const LoggedInStatus = () => {
    const {
        dispatch,
        state: { user },
    } = useContext(firebaseStore);

    if (user)
        return (
            <div>
                <div className="hover-container">
                    <ChangeDisplayName onClickHandler={() => dispatch({ type: 'showUserDetails' })} />
                    <LoggedInUserDetails user={user} />
                </div>
                <Button color="light" onClick={() => dispatch({ type: 'signOut' })}>
                    Sign out
                </Button>
            </div>
        );

    return (
        <div>
            <Button color="primary" onClick={() => dispatch({ type: 'showSignIn' })}>
                Sign in
            </Button>
        </div>
    );
};

const ChangeDisplayName = ({onClickHandler}) => {
    return (
        <div className="hover-in">
            <Button color="primary" onClick={onClickHandler}>Change Display Name</Button>
        </div>
    );
};

const LoggedInUserDetails = ({ user }) => {
    const name = user.displayName || user.isAnonymous ? 'Anonymous' : user.email || 'Anon';

    const textStub = {
        height: '2em',
        lineHeight: '2em',
        paddingRight: '1em',
    };

    return (
        <div className="hover-out" style={textStub}>
            <UserAvatar />
            <span
                style={{paddingLeft: '10px'}}
                title={`display: ${user.displayName} \n email: ${user.email} \n photoURL: ${user.photoURL} \n uid: ${user.uid}`}
            >
                {name}
            </span>
        </div>
    );
};
