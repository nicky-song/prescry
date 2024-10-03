// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useRef } from 'react';
import renderer from 'react-test-renderer';
import { FadeView } from './fade-view';
import { Animated, Easing, ViewStyle } from 'react-native';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useRef: jest.fn(),
  Animated: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useRefMock = useRef as jest.Mock;

jest.mock('react-native', () => ({
  Animated: {
    View: () => <div />,
    Value: jest.fn().mockImplementation(() => {
      return {
        setOffset: jest.fn(),
        setValue: jest.fn(),
      };
    }),
    timing: jest.fn().mockReturnValue({ start: jest.fn() }),
  },
  Platform: {
    select: jest.fn(),
  },
  Dimensions: {
    get: jest.fn().mockReturnValue({}),
  },
  Easing: {
    linear: jest.fn(),
  },
}));

const ChildMock = jest.fn().mockReturnValue(<div />);

describe('FadeView', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useRefMock.mockReset();
    useRefMock.mockReturnValue({ current: {} });
  });

  it('renders with children and correct style', () => {
    const styleMock: ViewStyle = { width: 1 };
    const opacityAnimMock = 0.5;
    const pointerEventsMock = 'box-none';

    useRefMock.mockReturnValueOnce({ current: opacityAnimMock });

    const testRenderer = renderer.create(
      <FadeView
        type='fade-in'
        style={styleMock}
        pointerEvents={pointerEventsMock}
      >
        <ChildMock />
      </FadeView>
    );

    const container = testRenderer.root.findByType(Animated.View);
    expect(container.props.style).toEqual([
      styleMock,
      { opacity: opacityAnimMock },
    ]);
    expect(container.props.pointerEvents).toEqual(pointerEventsMock);
    expect(container.props.children).toEqual(<ChildMock />);
  });

  it('calls useEffect with expected arguments', () => {
    const opacityAnimMock = 0.5;
    useRefMock.mockReturnValueOnce({ current: opacityAnimMock });

    renderer.create(
      <FadeView type='fade-in'>
        <ChildMock />
      </FadeView>
    );

    expect(useEffectMock).toHaveBeenCalledWith(expect.any(Function), [
      opacityAnimMock,
    ]);

    useEffectMock.mock.calls[0][0]();

    expect(Animated.timing).toHaveBeenNthCalledWith(1, opacityAnimMock, {
      toValue: 1,
      delay: 5000,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.linear,
    });
  });
});
