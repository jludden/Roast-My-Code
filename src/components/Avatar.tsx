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
import RoastComment from './CommentableCodePage/types/findRepositoryByTitle';

export interface IAppProps {
    isLoggedIn: boolean;
    name: string;
}

export default function AvatarPicker(props: IAppProps) {
    const [showMore, setShowMore] = React.useState(false);
    // const identity = useIdentityContext();
    // const name =
    //   (identity && identity.user && identity.user.user_metadata && identity.user.user_metadata.name) || "NoName";
    // const isLoggedIn = identity && identity.isLoggedIn;

    return (
        <Title>
            {props.isLoggedIn && <FaUserAstronaut onClick={() => setShowMore(!showMore)} />}
            {!props.isLoggedIn && <FaUserSecret onClick={() => setShowMore(!showMore)} />}
            {props.isLoggedIn ? ` ${props.name}` : ' Anonymous'}

            {showMore && (
                <>
                    <FaUserCircle />
                    <FaUserAstronaut />
                    <FaUser />
                    <FaUserAlt />
                    <FaUserTie />
                    <FaUserNinja />
                    <FaUserSecret />
                </>
            )}
        </Title>
    );
}

export const UserAvatar = () => {
    return <FaUserAstronaut />;
};
