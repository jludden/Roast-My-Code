import * as React from 'react';
// import 'rbx/index.css';
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
    Image,
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
    FaRedoAlt,
} from 'react-icons/fa';
import RoastComment, { User } from './CommentableCodePage/types/findRepositoryByTitle';
import { generateAvatar } from './FirebaseChat/helpers/nameGen';
import '../App.css';

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

const Avatars = ({ index, style, size = 70 }: { index: number; style?: any; size?: number }) => {
    switch (+index) {
        case 0:
            return <FaUserCircle style={style} size={size} />;
        case 1:
            return <FaUserAstronaut style={style} size={size} />;
        case 2:
            return <FaUser style={style} size={size} />;
        case 3:
            return <FaUserAlt style={style} size={size} />;
        case 4:
            return <FaUserTie style={style} size={size} />;
        case 5:
            return <FaUserNinja style={style} size={size} />;
        case 6:
            return <FaUserSecret style={style} size={size} />;
    }

    return <FaUser style={style} />;
};

export const AvataaarPicker = ({ imageUrl, setImageUrl }: any) => {
    const [generated, setGenerated] = React.useState(new Array(8));
    const extrabutton = '';
    const [generateMore, setGenerateMore] = React.useState(1);

    React.useEffect(() => {
        var tmp = [...generated];
        setGenerated(tmp.map((_) => generateAvatar()));
    }, [generateMore]);

    return (
        <>
            {/* <span id="avatar" onClick={() => setShowMore(!showMore)}>
                <label>Change Avatar</label>
                <UserAvatar imageUrl={imageUrl} />
            </span>
            {showMore && ( */}
            <div className="auto-fill">
                {generated.map((item, i) => (
                    <Button key={i} onClick={() => setImageUrl(item)} size="large">
                        <UserAvatarInner imageUrl={item} size={72} />
                    </Button>
                ))}
                <Button key={'extra'} onClick={() => setImageUrl(extrabutton)} size="large">
                    <UserAvatarInner imageUrl={extrabutton} size={72} />
                </Button>
                <Button
                    key="random-button"
                    size="large"
                    title="random avatar"
                    onClick={() => setGenerateMore(generateMore + 1)}
                >
                    <FaRedoAlt />
                    Random
                </Button>
            </div>
            {/* )} */}
        </>
    );
};

export const UserAvatarBadge = ({
    photoURL,
    onClickHandler,
    badge,
    tooltip,
    isActive,
}: {
    photoURL?: string;
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
            {/* <Avatars index={avatar || 0} /> */}
            <UserAvatarInner imageUrl={photoURL} />
        </Button>
    </div>
);

export const UserAvatar = ({
    imageUrl,
    onClickHandler,
    containerStyle,
    iconStyle,
    children
}: {
    imageUrl?: string;
    onClickHandler?: any;
    containerStyle?: any;
    iconStyle?: any;
    children?: React.ReactChildren;
}) => {
    return (
        <div style={containerStyle} onClick={onClickHandler}>
            {/* <Avatars index={avatar || 0} style={iconStyle} size={28}/> */}
            {/* <Avatar name="test_poop" src={avatar} /> */}
            <UserAvatarInner imageUrl={imageUrl} />
            {/* <Image.Container size={32}>
                <Image rounded src={avatar}></Image>
            </Image.Container> */}
            {children}
        </div>
    );
};

type sizes = 32 | 16 | "square" | 24 | 48 | 64 | 96 | 128 | "16by9" | "1by1" | "1by2" | "1by3" | "2by1" | "2by3" | "3by1" | "3by2" | "3by4" | "3by5" | "4by3" | "4by5" | "5by3" | "5by4" | "9by16";
export const UserAvatarInner = ({ imageUrl, size = 32 }: { imageUrl?: string; size?: any }) => {
    // todo handle eg rbx/6
    const [loadError, setLoadError] = React.useState(!imageUrl);
    const fallback = 'https://avataaars.io/';
    const onLoadError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setLoadError(true);
    };
    React.useEffect(() => setLoadError(!imageUrl), [imageUrl]);
    return (
        <div id="user-avatar">
            {!loadError && (
                <Image.Container size={size}>
                    <Image as="img" rounded src={loadError ? fallback : imageUrl} onError={onLoadError}></Image>
                </Image.Container>
            )}
            {loadError && <FaUserNinja size={size} />}
        </div>
    );
};

export const UserHeader = ({ user }: { user?: User }) => {
    const containerStyle = {
        display: 'flex',
    };

    const userHeaderTextStyle = {
        // fontWeight: 'bold',
        fontSize: '16px',
        paddingLeft: '10px',
    };

    if (!user)
        return (
            <div style={containerStyle}>
                <UserAvatar />
                <div style={userHeaderTextStyle} title={'unknown'}>
                    Unknown user
                </div>
            </div>
        );

    return (
        <div style={containerStyle}>
            <UserAvatar imageUrl={user.photoURL} />
            <div style={userHeaderTextStyle} title={'' + user.uid || ''}>
                {truncateLongDisplayNames(user.displayName)}
            </div>
        </div>
    );
};

const truncateLongDisplayNames = (name: string): string => {
    if (name.length > 20) {
        return `${name.substring(0, 20)}...`;
    }
    return name;
};
