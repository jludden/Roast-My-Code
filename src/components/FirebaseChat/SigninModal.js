import React, { useState, useContext } from 'react';
import { FirebaseCommentsProvider, firebaseStore, FirebaseQuery } from './FirebaseCommentsProvider';
import { FirebaseLogin } from '../../pages/Login';
import { Button, Modal, Media, Title } from 'rbx';


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