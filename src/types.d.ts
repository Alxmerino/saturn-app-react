import { ColorPartial } from '@mui/material';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    blue: ColorPartial;
  }
}
