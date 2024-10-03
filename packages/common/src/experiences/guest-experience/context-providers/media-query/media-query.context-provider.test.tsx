// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../../testing/test.container';
import { MediaQueryContextProvider } from './media-query.context-provider';
import {
  defaultMediaQueryContext,
  IMediaQueryContext,
  MediaQueryContext,
  MediaSize,
} from './media-query.context';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('./media-query.context', () => ({
  MediaQueryContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

let windowSpy: jest.SpyInstance;

describe('MediaQueryContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStateMock.mockReturnValue([defaultMediaQueryContext, jest.fn()]);
    windowSpy = jest.spyOn(global, 'window', 'get');
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  it('initializes state', () => {
    renderer.create(<MediaQueryContextProvider />);

    expect(useStateMock).toBeCalledTimes(1);
    expect(useStateMock).toHaveBeenNthCalledWith(1, defaultMediaQueryContext);
  });

  it.each([
    [360, 'small'],
    [599, 'small'],
    [600, 'medium'],
    [899, 'medium'],
    [900, 'large'],
  ])(
    'initializes context provider on mount (outerWidth: %p)',
    (outerWidthMock: number, expectedSize: string) => {
      const setContextMock = jest.fn();
      useStateMock.mockReturnValue([defaultMediaQueryContext, setContextMock]);

      renderer.create(<MediaQueryContextProvider />);

      expect(useEffectMock).toHaveBeenCalledTimes(1);
      expect(useEffectMock).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
        []
      );

      const addEventListenerMock = jest.fn();
      const removeEventListenerMock = jest.fn();

      const innerWidthMock = 100;
      const innerHeightMock = 200;
      windowSpy.mockImplementation(() => ({
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        innerWidth: innerWidthMock,
        innerHeight: innerHeightMock,
        outerWidth: outerWidthMock,
      }));

      const effectHandler = useEffectMock.mock.calls[0][0];
      const teardown = effectHandler();

      const expectedContext: IMediaQueryContext = {
        mediaSize: expectedSize as MediaSize,
        windowWidth: innerWidthMock,
        windowHeight: innerHeightMock,
      };
      expect(setContextMock).toHaveBeenCalledWith(expectedContext);

      expect(addEventListenerMock).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      const eventListener = addEventListenerMock.mock.calls[0][1];

      teardown();
      expect(removeEventListenerMock).toHaveBeenCalledWith(
        'resize',
        eventListener
      );
    }
  );

  it.each([
    [360, 'small'],
    [599, 'small'],
    [600, 'medium'],
    [899, 'medium'],
    [900, 'large'],
  ])(
    'sets media size in state (window width: %p)',
    (outerWidthMock: number, expectedMediaSize: string) => {
      const setContextMock = jest.fn();
      useStateMock.mockReturnValue([{}, setContextMock]);

      renderer.create(<MediaQueryContextProvider />);

      const addEventListenerMock = jest.fn();

      const innerWidthMock = 100;
      const innerHeightMock = 200;
      windowSpy.mockImplementation(() => ({
        addEventListener: addEventListenerMock,
        innerWidth: innerWidthMock,
        innerHeight: innerHeightMock,
        outerWidth: outerWidthMock,
      }));

      const effectHandler = useEffectMock.mock.calls[0][0];
      effectHandler();

      expect(addEventListenerMock).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      const eventListener = addEventListenerMock.mock.calls[0][1] as jest.Mock;
      eventListener();

      const expectedContext: IMediaQueryContext = {
        mediaSize: expectedMediaSize as MediaSize,
        windowHeight: innerHeightMock,
        windowWidth: innerWidthMock,
      };
      expect(setContextMock).toHaveBeenCalledWith(expectedContext);
    }
  );

  it.each([['small'], ['medium'], ['large']])(
    'renders as MediaQueryContext.Provider (mediaSize: %p)',
    (mediaSizeMock: string) => {
      const contextMock: IMediaQueryContext = {
        mediaSize: mediaSizeMock as MediaSize,
        windowHeight: 10,
        windowWidth: 20,
      };
      useStateMock.mockReturnValue([contextMock]);

      const testRenderer = renderer.create(<MediaQueryContextProvider />);

      const contextProvider = testRenderer.root.findByType(
        MediaQueryContext.Provider
      );
      expect(contextProvider).toBeDefined();

      expect(contextProvider.props.value).toEqual(contextMock);
    }
  );
});
