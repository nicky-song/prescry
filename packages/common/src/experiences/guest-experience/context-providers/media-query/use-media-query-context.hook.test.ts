// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IMediaQueryContext } from './media-query.context';
import { useMediaQueryContext } from './use-media-query-context.hook';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useContext: jest.fn(),
}));
const useContextMock = useContext as jest.Mock;

describe('useMediaQueryContext', () => {
  it('returns expected context', () => {
    const contextMock: IMediaQueryContext = {
      mediaSize: 'large',
      windowHeight: 740,
      windowWidth: 360,
    };

    useContextMock.mockReturnValue(contextMock);

    const context: IMediaQueryContext = useMediaQueryContext();
    expect(context).toEqual(contextMock);
  });
});
