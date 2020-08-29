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
];

const Avatars = ({ index, style }: { index: number; style?: any }) => {
    switch (+index) {
        case 0:
            return <FaUserCircle style={style} />;
        case 1:
            return <FaUserAstronaut style={style} />;
        case 2:
            return <FaUser style={style} />;
        case 3:
            return <FaUserAlt style={style} />;
        case 4:
            return <FaUserTie style={style} />;
        case 5:
            return <FaUserNinja style={style} />;
        case 6:
            return <FaUserSecret style={style} />;
    }

    return <FaUser style={style} />;
};

export const AvatarPicker = ({ avatar, setAvatar }: any) => {
    const [showMore, setShowMore] = React.useState(false);
    // const identity = useIdentityContext();
    // const name =
    //   (identity && identity.user && identity.user.user_metadata && identity.user.user_metadata.name) || "NoName";
    // const isLoggedIn = identity && identity.isLoggedIn;

    return (
        <>
            <span id="avatar" onClick={() => setShowMore(!showMore)}>
                <label>Change Avatar</label>
                <UserAvatar avatar={avatar} />
            </span>

            {/* {props.isLoggedIn && <FaUserAstronaut onClick={() => setShowMore(!showMore)} />}
            {!props.isLoggedIn && <FaUserSecret onClick={() => setShowMore(!showMore)} />}
            {props.isLoggedIn ? ` ${props.name}` : ' Anonymous'} */}

            {showMore && (
                <>
                    {AvatarMap.map((a, i) => (
                        <div key={i}>
                            {a}
                            <Button onClick={() => setAvatar(i)} />
                        </div>
                    ))}
                </>
            )}
        </>
    );
};

export const UserAvatarBadge = ({
    avatar,
    onClickHandler,
    badge,
    tooltip,
    isActive,
}: {
    avatar?: number;
    onClickHandler?: any;
    badge?: number;
    tooltip: string;
    isActive: boolean;
}) => (
    <div className={'comment-badge'}>
        <Button
            badge={badge || 1}
            badgeColor="primary"
            badgeOutlined
            color={isActive ? 'light' : 'primary'}
            size="small"
            onClick={onClickHandler}
            outlinedstyle={{
                marginRight: '5px',
            }}
            tooltip={isActive ? '' : tooltip}
            tooltipPosition="right"
            tooltipMultiline
        >
            <Avatars index={avatar || 0} />
        </Button>
    </div>
);

export const UserAvatar = ({
    avatar,
    onClickHandler,
    containerStyle,
    iconStyle,
}: {
    avatar?: number;
    onClickHandler?: any;
    containerStyle?: any;
    iconStyle?: any;
}) => {
    return (
        <div style={containerStyle} onClick={onClickHandler}>
            <Avatars index={avatar || 0} style={iconStyle} />
        </div>
    );
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
            <UserAvatar avatar={user.photoURL} />
            <div style={{ fontWeight: 'bold', fontSize: '14px', paddingLeft: '10px' }} title={''+user.uid || ''}>
                {user.displayName}
            </div>
        </div>
    );
};
