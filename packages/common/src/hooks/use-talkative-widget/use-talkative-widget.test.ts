// Copyright 2022 Prescryptive Health, Inc.

import { useEffect } from 'react';
import { hideTalkativeElementStyleDisplay } from './helpers/hide-talkative-element-style-display';
import { showTalkativeElementStyleDisplay } from './helpers/show-talkative-element-style-display';
import { useTalkativeWidget } from './use-talkative-widget';
import { useIsFocused } from '@react-navigation/native';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;

jest.mock('./helpers/show-talkative-element-style-display');
const showTalkativeElementStyleDisplayMock =
  showTalkativeElementStyleDisplay as jest.Mock;

jest.mock('./helpers/hide-talkative-element-style-display');
const hideTalkativeElementStyleDisplayMock =
  hideTalkativeElementStyleDisplay as jest.Mock;

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: jest.fn(),
}));
const useIsFocusedMock = useIsFocused as jest.Mock;

describe('useTalkativeWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ON MOUNT: Talkative widget should be displayed when useIsFocused evaluates to true and showTalkativeElementStyleDisplay is called', () => {
    useIsFocusedMock.mockReturnValue(true);

    useTalkativeWidget({ showHeader: true, forceExpandedView: true });

    const callback = useEffectMock.mock.calls[0][0];

    callback();

    expect(showTalkativeElementStyleDisplayMock).toHaveBeenCalledTimes(1);
    expect(showTalkativeElementStyleDisplayMock).toHaveBeenNthCalledWith(1, {
      showHeader: true,
      forceExpandedView: true,
    });
  });

  it('ON MOUNT: Talkative widget should NOT be displayed when useIsFocused evaluates to false and showTalkativeElementStyleDisplay is NOT called', () => {
    useIsFocusedMock.mockReturnValue(false);

    useTalkativeWidget({});

    const callback = useEffectMock.mock.calls[0][0];

    callback();

    expect(showTalkativeElementStyleDisplayMock).not.toHaveBeenCalled();
  });

  it('ON UNMOUNT: Talkative widget should no longer be displayed', () => {
    useIsFocusedMock.mockReturnValue(true);

    useTalkativeWidget({
      showHeader: true,
      forceExpandedView: true,
    });

    const callback = useEffectMock.mock.calls[0][0];
    const secondCallback = callback();

    secondCallback();

    expect(hideTalkativeElementStyleDisplayMock).toHaveBeenCalledTimes(1);
  });
});
