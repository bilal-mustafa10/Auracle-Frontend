import React, { ChangeEvent, useCallback, useState, useEffect } from 'react';
import IconButton from '../icon-button/icon-button';
import Loader from '../icon-button/loader';
import classes from './text-input-with-send.module.scss';
import { isValidInput } from '@/helpers/input-validation';

type Props = {
    error?: string;
    onSend(userMessage: string): void;
    loading: boolean;
    success: boolean;
};

const TextInputWithSend = ({error, onSend, loading, success,}: Props): JSX.Element => {
    const [inputValue, setInputValue] = useState<string>('');
    const canSendInput = !loading && isValidInput(inputValue);

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.currentTarget.value ?? '');
    };

    const resetInput = useCallback(() => {
        setInputValue('');
    }, []);

    const handleOnSend = useCallback(() => {
        if (canSendInput) {
            onSend(inputValue);
            resetInput();
        }
    }, [canSendInput, inputValue, onSend, resetInput]);

    // show error message when error occurs
    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    return (
        <div className={classes.inputContainer}>
            {error && <div className={classes.error}>{error}</div>}
            <textarea
                className={classes.input}
                placeholder={'Write your prompt here...'}
                value={inputValue}
                onChange={onChange}
            />
            <div className={classes.loaderContainer}>
                {loading && <Loader />}
            </div>
            <IconButton
                onClick={handleOnSend}
                disabled={!canSendInput}
            />
        </div>
    );
};

export default TextInputWithSend;
