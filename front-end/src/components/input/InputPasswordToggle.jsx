import React, { Fragment, useState } from 'react';
import Input from './input';
import { IconEyeClose , IconEyeOpen } from '../Icon';

const InputPasswordToggle = ({control}) => {
    const [togglePassword,setTogglePassword] = useState(false);
    if(!control) return null;
    return (
        <Fragment>
            <Input
              name="password"
              type={togglePassword ? "text" : "password"}
              placeholder="Enter Your Password"
              control={control}
            >
              {!togglePassword ? (
                <IconEyeClose
                  onClick={() => setTogglePassword(true)}
                ></IconEyeClose>
              ) : (
                <IconEyeOpen
                  onClick={() => setTogglePassword(false)}
                ></IconEyeOpen>
              )}
            </Input>
        </Fragment>
    );
};

export default InputPasswordToggle;