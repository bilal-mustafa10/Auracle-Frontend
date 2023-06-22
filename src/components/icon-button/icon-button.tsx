import React from 'react';
import { IconButton as CoreIconButton } from 'monday-ui-react-core';
// @ts-ignore
import { Send } from 'monday-ui-react-core/icons';
import classes from './icon-button.module.scss';

interface IconButtonProps {
    onClick: () => void;
    disabled: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, disabled }) => (
    <CoreIconButton
        ariaLabel="Send"
        className={classes.sendButton}
        size={'small'}
        icon={Send}
        onClick={onClick}
        wrapperClassName={classes.sendButtonWrapper}
        disabled={disabled}
    />
);

export default IconButton;
