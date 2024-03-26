import React, { useState } from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepUsername.module.css';
import { sendOtp } from '../../../../http/index';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../../../store/authSlice';

const Phone = ({ onNext }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const dispatch = useDispatch();

    async function submit() {
        console.log(phoneNumber);
        if (!phoneNumber) return;
        const { data } = await sendOtp({ username: phoneNumber, usernameType: 'phone' });
        console.log(data.username);
        dispatch(setOtp({ username: data.username, hash: data.hash }));
        onNext();
    }

    return (
        <Card title="Enter your Phone Number" icon="phone">
            <TextInput
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div>
                <div className={styles.actionButtonWrap}>
                    <Button text="Next" onClick={submit} />
                </div>
                <p className={styles.bottomParagraph}>
                    By entering your phone number, you’re agreeing to our Terms of
                    Service and Privacy Policy. Thanks!
                </p>
            </div>
        </Card>
    );
};

export default Phone;
