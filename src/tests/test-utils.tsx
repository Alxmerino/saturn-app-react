import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { render, RenderOptions } from '@testing-library/react';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

interface Options extends RenderOptions {
  wrapper: any;
}

const customRender = (ui: ReactElement, options?: Options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export { customRender as render };
