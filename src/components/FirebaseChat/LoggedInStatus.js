import React, {useState, useContext} from  'react';
import { SigninModal, FirebaseCommentsProvider, firebaseStore } from './SigninModal';
import { Navbar, Button, Title } from 'rbx';
import '../../App.css';

export const LoggedInStatus = () => {

    const { dispatch, state: { user }} = useContext(firebaseStore);


    if (user) return (
        <div>
        <div className='hover-container'>
            {/* <button class='hover-button'>
  <span class='hover-button--off'>Default</span>
  <span className='hover-button--on'>Hover!</span>
</button> */}
            {/* <HoverChange
                hoverComponent={<ChangeDisplayName user={user}/>}>
                <LoggedInUserDetails user={user} />
            </HoverChange> */}
            <ChangeDisplayName user={user}/>
            <LoggedInUserDetails user={user} />
            </div>
            <Button color="light" onClick={() => dispatch({type: 'signOut'})}>Sign out</Button>
        </div>
    )

    return (
        <div>
            <Button color="primary" onClick={() => dispatch({type: 'showModal'})}>Sign in</Button>
        </div>
    )
}

const HoverChange = ({children, hoverComponent}) => {
    const [isHovering, setIsHovering] = useState(false);    

    return (
        <div onMouseOver={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            {isHovering ? hoverComponent : children}
        </div>
    )
}

const ChangeDisplayName = ({user}) => {
    return (
        <div className='hover-in'>
        <Button   color="primary" >Change Display Name</Button>
        </div>
    )
}

const LoggedInUserDetails = ({user}) => {
    const name = user.displayName ? user.displayName :
        user.isAnonymous ? "Anonymous" :
        user.email ? user.email : "Anon";

    const textStub = {
        height: '2em',
        lineHeight: '2em',
        paddingRight: '1em',
    };

    return (
        <div className='hover-out' style={textStub}>
            <span title={`display: ${user.displayName} \n email: ${user.email} \n photoURL: ${user.photoURL} \n uid: ${user.uid}`}>
                {name}
            </span>            
        </div>
    )
}