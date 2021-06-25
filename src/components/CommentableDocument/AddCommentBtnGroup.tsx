import React, { useState } from 'react';
import { Button } from 'rbx';
import { FaCommentDots, FaShareAlt } from 'react-icons/fa';
import { SocialToolbar } from '../Common/SocialMediaShare';

export const AddCommentBtnGroup = ({ styles, selectedLine, ...props }: any) => {
    const [expandSocial, setExpandSocial] = useState(false);

    const shareText = +selectedLine > 0 ? `Check out line ${selectedLine} of` : ``;

    return (
        <Button.Group style={{ ...styles, padding: '1px' }} align="right">
            <Button
                size="small"
                rounded
                onClick={() => props.handleCommentAdd()}
                tooltip="Add a comment"
                color="primary"  
                state={expandSocial ? "focused" : undefined}                             
            >
                <FaCommentDots />
            </Button>
            <Button
                size="small"
                rounded
                onClick={() => setExpandSocial(!expandSocial)}
                tooltip="Share to Social Media"
                color="warning"
            >
                <FaShareAlt />
            </Button>
            {expandSocial && <SocialToolbar url={window.location.pathname} shareText={shareText} comment={null} />}
        </Button.Group>
    );
};
