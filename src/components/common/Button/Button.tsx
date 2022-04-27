import React from 'react';
import {
  Button as ButtonMUI,
  ButtonProps as ButtonPropsMUI,
} from '@mui/material';

type ButtonProps = ButtonPropsMUI & {
  kind: string;
  children: JSX.Element | string;
};

const Button: React.FC<ButtonProps> = (props: ButtonProps): JSX.Element => {
  const { children, kind } = props;
  const btnPropsMap: Record<string, any> = {
    primary: 'contained',
    outlined: 'outlined',
    clean: 'text',
  };

  return (
    <ButtonMUI variant={btnPropsMap[kind]} {...props}>
      {children}
    </ButtonMUI>
  );
};

export default Button;
