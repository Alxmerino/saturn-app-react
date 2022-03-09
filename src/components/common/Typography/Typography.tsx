import React, { ElementType } from 'react';
import { Typography, TypographyTypeMap } from '@mui/material';

interface TextProps extends Record<any, any> {
  component?: ElementType<any>;
  variant?:
    | 'button'
    | 'caption'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'overline'
    | 'inherit'
    | undefined;
  children: JSX.Element | string;
}

const Text: React.FC<TextProps> = (props: TextProps): JSX.Element => {
  const { children, variant, component = 'p' } = props;

  return (
    <Typography variant={variant} component={component} {...props}>
      {children}
    </Typography>
  );
};

export default Text;
