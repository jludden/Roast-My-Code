import React, { useState, useRef } from 'react';
import { Button, Icon } from 'rbx';
import {
    FaPlusCircle,
    FaPlus,
    FaPlusSquare,
    FaRegPlusSquare,
    FaGooglePlus,
    FaSearchPlus,
    FaComment,
    FaCommentDots,
    FaShareAlt,
} from 'react-icons/fa';

export const AddCommentBtnGroup = ({ styles, ...props }: any) => {
    return (
        <Button.Group style={{...styles, padding: '1px'}} align="right">
            <Button
                size="small"
                rounded
                onClick={() => props.handleCommentAdd()}
                tooltip="Add a comment"
                color="primary"
            >
                <FaCommentDots />
            </Button>
            <Button
                size="small"
                rounded
                onClick={() => props.handleShare()}
                tooltip="Share to Social Media"
                color="warning"
            >
                <FaShareAlt />
            </Button>
        </Button.Group>
    );
};
