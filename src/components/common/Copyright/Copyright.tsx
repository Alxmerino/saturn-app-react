import React from 'react';
import Link from '@mui/material/Link';

import { Text } from '../../common';

export default function Copyright(props: any) {
  return (
    <Text variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://amayamedia.com/">
        René Merino
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Text>
  );
}
