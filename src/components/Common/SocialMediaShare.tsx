import React from 'react';
import RoastComment from '../CommentableCodePage/types/findRepositoryByTitle';
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    RedditShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    RedditIcon,
    EmailIcon,
    WeiboIcon,
    WeiboShareButton,
} from 'react-share';

export const SocialToolbar = ({
    url,
    shareText,
    comment,
}: {
    url: string;
    shareText: string;
    comment: RoastComment | null;
}) => {
    const repoPath = window.location.pathname;
    const owner = repoPath.slice(repoPath.lastIndexOf('repo/') + 5, repoPath.lastIndexOf('/'));
    const name = repoPath.slice(repoPath.lastIndexOf('/') + 1);

    const params = new URLSearchParams(window.location.search);

    const [{ filePath }] = React.useState({
        filePath: params.get('file'),
    });

    const fileName = filePath ? filePath.slice(filePath.lastIndexOf('/') + 1) : '';
    const fromText = `[${owner}/${name}/~/${fileName}]`;
    const shortPitch = shareText ? `${shareText} ` : '' + fromText;
    let longPitch = shortPitch;

    if (comment) {
        const fromText = ` [${
            comment.author ? `${comment.author.displayName} commented on ` : ' comment on '
        }${owner}/${name}${comment.updatedAt ? ' at ' + comment.updatedAt.toLocaleString() : ''}]`;
        longPitch = shareText + fromText;
    }

    return (
        <>
            <EmailShareButton url={url} subject={shortPitch} body={longPitch}>
                <EmailIcon size={32} round />
            </EmailShareButton>
            <FacebookShareButton url={url} quote={longPitch} hashtag="#RoastMyCode">
                <FacebookIcon size={32} round />
            </FacebookShareButton>
            <LinkedinShareButton url={url} summary={shortPitch} source="roast-my-code.com">
                <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <RedditShareButton url={url} title={longPitch}>
                <RedditIcon size={32} round />
            </RedditShareButton>
            <TwitterShareButton
                url={url}
                title={shortPitch}
                via="RoastMyCode"
                hashtags={['RoastMyCode', 'roast', 'codereview']}
            >
                <TwitterIcon size={32} round />
            </TwitterShareButton>
            <WeiboShareButton url={url} title={shortPitch}>
                <WeiboIcon size={32} round />
            </WeiboShareButton>
        </>
    );
};
