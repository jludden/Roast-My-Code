import * as React from 'react';
import "rbx/index.css";
import { Section, Title, Tag, Container, Input, Button, Block, Help, Control, Delete, Field, Panel, Checkbox, Icon } from "rbx";
import { FaUserCircle, FaUser, FaUserAstronaut, FaUserAlt, FaUserTie,
     FaUserCheck, FaUserClock, FaUserCog, FaUserSecret, FaUserFriends, FaUserGraduate, FaUserNinja } from 'react-icons/fa';
import { useIdentityContext } from "react-netlify-identity-widget"
import "react-netlify-identity-widget/styles.css"



export interface IAppProps {
}

export default function Avatar (props: IAppProps) {
    const [showMore, setShowMore] = React.useState(false);
    const identity = useIdentityContext();    
    const name =
      (identity && identity.user && identity.user.user_metadata && identity.user.user_metadata.name) || "NoName";
    const isLoggedIn = identity && identity.isLoggedIn;

    return (
        <Title>
        
        {isLoggedIn &&
            <FaUserAstronaut onClick={() => setShowMore(!showMore)}/>
        }
        {!isLoggedIn &&
            <FaUserSecret onClick={() => setShowMore(!showMore)}/>
        }
        {showMore && 
            <>
                  <FaUserCircle/>
                  <FaUserAstronaut/>
                  <FaUser/>
                  <FaUserAlt/>
                  <FaUserTie/>
                  <FaUserNinja />
                <FaUserSecret/>      
            </>
        }
      </Title>
    );
}
