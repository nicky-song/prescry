// Copyright 2021 Prescryptive Health, Inc.

import { createContext } from 'react';

export type MediaSize = 'small' | 'medium' | 'large';

export interface IMediaQueryContext {
  readonly mediaSize: MediaSize;
  readonly windowWidth: number;
  readonly windowHeight: number;
}

export const defaultMediaQueryContext: IMediaQueryContext = {
  mediaSize: 'small',
  windowHeight: 0,
  windowWidth: 0,
};

export const MediaQueryContext = createContext<IMediaQueryContext>(
  defaultMediaQueryContext
);
