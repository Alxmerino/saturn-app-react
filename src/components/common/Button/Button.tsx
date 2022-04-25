import React from 'react';
import { Button as ButtonMUI } from '@mui/material';

interface ButtonProps extends Record<string, unknown> {
  type: string;
  children: JSX.Element | string;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps): JSX.Element => {
  const { children, type } = props;
  const btnPropsMap: Record<string, any> = {
    primary: 'contained',
    outlined: 'outlined',
    clean: 'text',
  };

  return (
    <ButtonMUI variant={btnPropsMap[type]} {...(props as unknown)}>
      {children}
    </ButtonMUI>
  );
};

export default Button;
