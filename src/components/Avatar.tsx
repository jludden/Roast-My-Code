import * as React from 'react';
import 'rbx/index.css';
import {
    Section,
    Title,
    Tag,
    Container,
    Input,
    Button,
    Block,
    Help,
    Control,
    Delete,
    Field,
    Panel,
    Checkbox,
    Icon,
} from 'rbx';
import {
    FaUserCircle,
    FaUser,
    FaUserAstronaut,
    FaUserAlt,
    FaUserTie,
    FaUserCheck,
    FaUserClock,
    FaUserCog,
    FaUserSecret,
    FaUserFriends,
    FaUserGraduate,
    FaUserNinja,
} from 'react-icons/fa';
import RoastComment, { User } from './CommentableCodePage/types/findRepositoryByTitle';

export interface IAppProps {
    isLoggedIn: boolean;
    name: string;
}

const AvatarMap = [
    <FaUserCircle />,
    <FaUserAstronaut />,
    <FaUser />,
    <FaUserAlt />,
    <FaUserTie />,
    <FaUserNinja />,
    <FaUserSecret />,
]

export const AvatarPicker = ({avatar, setAvatar}: any) => {
    const [showMore, setShowMore] = React.useState(false);
    // const identity = useIdentityContext();
    // const name =
    //   (identity && identity.user && identity.user.user_metadata && identity.user.user_metadata.name) || "NoName";
    // const isLoggedIn = identity && identity.isLoggedIn;

    return (
        <Title>            
            <span id="avatar" name="avatar" onClick={() => setShowMore(!showMore)}>
                <label for="avatar">Change Avatar</label>
                {AvatarMap[avatar || 0]}                
            </span>
            
            {/* {props.isLoggedIn && <FaUserAstronaut onClick={() => setShowMore(!showMore)} />}
            {!props.isLoggedIn && <FaUserSecret onClick={() => setShowMore(!showMore)} />}
            {props.isLoggedIn ? ` ${props.name}` : ' Anonymous'} */}

            {showMore && (
                <>
                    {AvatarMap.map((a, i) => (
                        <div>
                            {a}
                            <Button onClick={() => setAvatar(i)} />
                        </div>
                    ))}
                </>
            )}
        </Title>
    );
}

export const UserAvatar = ({ avatar }: { avatar?: number }) => {
    return <FaUserAstronaut />;
};
export const UserHeader = ({ user }: { user?: User }) => {
    const style = {
        display: 'flex',
    };

    if (!user)
        return (
            <div style={style}>
                <UserAvatar />
                <div style={{ fontWeight: 'bold', fontSize: '14px', paddingLeft: '10px' }} title={'unknown'}>
                    Unknown user
                </div>
            </div>
        );

    return (
        <div style={style}>
            <UserAvatar avatar={user.avatar} />
            <div style={{ fontWeight: 'bold', fontSize: '14px', paddingLeft: '10px' }} title={user.uid}>
                {user.name}
            </div>
        </div>
    );
};

