// Copyright 2023 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { defaultInstallContext, InstallContext } from './install.context';
import { InstallContextProvider } from './install.context-provider';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('./install.context', () => ({
  InstallContext: {
    Provider: () => <div />,
  },
}));

let windowSpy: jest.SpyInstance;

describe('InstallContextProvider', () => {
  const childrenMock = <View />;
  const setContextMock = jest.fn();

  const addEventListenerMock = jest.fn();
  const removeEventListenerMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useStateMock.mockReturnValueOnce([defaultInstallContext, setContextMock]);

    windowSpy = jest.spyOn(global, 'window', 'get');

    windowSpy.mockImplementation(() => ({
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    }));
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  it('renders as InstallContext.Provider with expected children', () => {
    const testRenderer = renderer.create(
      <InstallContextProvider children={childrenMock} />
    );

    const installContextProvider = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(installContextProvider.type).toEqual(InstallContext.Provider);
    expect(installContextProvider.props.context).toEqual(defaultInstallContext);
    expect(installContextProvider.props.children).toEqual(childrenMock);
  });

  it('calls useEffect callback function on mount as expected', () => {
    renderer.create(<InstallContextProvider children={childrenMock} />);

    expect(useEffectMock.mock.calls[0][1]).toEqual([]);

    useEffectMock.mock.calls[0][0]();

    const addEventListenerWithBeforeInstallPromptMock =
      addEventListenerMock.mock.calls.filter((instance) => {
        return instance[0] === 'beforeinstallprompt';
      });

    expect(addEventListenerWithBeforeInstallPromptMock.length).toEqual(1);

    const onBeforeInstallPrompt =
      addEventListenerWithBeforeInstallPromptMock[0][1];

    const eventMock = { preventDefault: jest.fn() } as unknown as Event;

    onBeforeInstallPrompt(eventMock);

    expect(eventMock.preventDefault).toHaveBeenCalledTimes(1);

    expect(setContextMock).toHaveBeenCalledTimes(1);
    expect(setContextMock).toHaveBeenNthCalledWith(1, {
      ...defaultInstallContext,
      installPromptEvent: eventMock,
    });

    const result = useEffectMock.mock.calls[0][0]();

    result();

    const removeEventListenerWithBeforeInstallPromptMock =
      removeEventListenerMock.mock.calls.filter((instance) => {
        return instance[0] === 'beforeinstallprompt';
      });

    expect(removeEventListenerWithBeforeInstallPromptMock.length).toEqual(1);
  });
});
