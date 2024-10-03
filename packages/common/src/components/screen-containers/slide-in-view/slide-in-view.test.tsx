// Copyright 2021 Prescryptive Health, Inc.

import React, { useState, useEffect, useRef } from 'react';
import renderer from 'react-test-renderer';
import { SlideInView, Origin } from './slide-in-view';
import { Animated, ViewStyle } from 'react-native';
import { ITestContainer } from '../../../testing/test.container';

jest.mock('../../image-asset/image-asset');

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
  useRef: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;
const useRefMock = useRef as jest.Mock;

jest.mock('react-native', () => ({
  Animated: {
    Value: jest.fn(),
    View: ({ children }: ITestContainer) => <div>{children}</div>,
  },
  Easing: { exp: jest.fn() },
  Dimensions: {
    get: jest.fn().mockImplementation(() => {
      return { fontScale: 1, height: 640, scale: 1, width: 320 };
    }),
  },
  Platform: {
    select: jest.fn().mockImplementation((platform) => {
      return platform.web;
    }),
  },
}));

describe('SlideInView', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    useStateMock.mockReturnValue([{}, jest.fn()]);
    useRefMock.mockReturnValue({ current: {} });
    // useEffectMock.mockImplementation((f) => f());
  });

  it('renders with children and correct style', () => {
    const slideInMock = new Animated.Value(10);
    useStateMock.mockReturnValueOnce([1, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      {
        display: 'none',
      },
      jest.fn(),
    ]);
    useRefMock.mockReturnValueOnce({ current: { slideInMock } });
    const ChildMock = jest.fn().mockReturnValue(<div />);
    const styleMock = { width: 1 };
    const testRenderer = renderer.create(
      <SlideInView slideInValue={0} slideOutValue={0} viewStyle={styleMock}>
        <ChildMock />
      </SlideInView>
    );

    const animatedView = testRenderer.root.findByType(Animated.View);

    expect(useRefMock).toHaveNthReturnedWith(1, { current: { slideInMock } });
    expect(animatedView.props.style[0]).toEqual(styleMock);

    const children = animatedView.props.children;
    expect(children).toEqual(<ChildMock />);
    expect(useEffectMock).toBeCalledTimes(2);
  });

  it('on open uses useEffect', () => {
    const mockSlideInValue = -200;
    const mockSlideOutValue = 0;
    const slideInMock = new Animated.Value(mockSlideInValue);
    const slideOutMock = new Animated.Value(mockSlideOutValue);
    const initialDisplayMock = { display: 'none' };
    useRefMock.mockReturnValueOnce({ current: { slideInMock } });
    useRefMock.mockReturnValueOnce({ current: { slideOutMock } });
    useStateMock.mockReturnValueOnce([slideInMock, jest.fn()]);
    useStateMock.mockReturnValueOnce([initialDisplayMock, jest.fn()]);

    const testRenderer = renderer.create(
      <SlideInView
        slideInValue={mockSlideInValue}
        slideOutValue={mockSlideOutValue}
        isOpen={true}
      />
    );

    const container = testRenderer.root.findByType(Animated.View);
    expect(useRefMock).toHaveNthReturnedWith(1, { current: { slideInMock } });
    expect(useRefMock).toHaveNthReturnedWith(2, { current: { slideOutMock } });
    expect(useStateMock).toHaveBeenCalledWith({ slideInMock });
    expect(container.props.style).toEqual([
      undefined,
      { right: slideInMock },
      initialDisplayMock,
    ]);
    expect(useEffectMock).toBeCalledTimes(2);
  });

  it('on close uses useEffect and useState', () => {
    const mockSlideInValue = -200;
    const mockSlideOutValue = 0;
    const initialDisplayMock: ViewStyle = { display: 'none' };
    const slideInMock = new Animated.Value(mockSlideInValue);
    const slideOutMock = new Animated.Value(mockSlideOutValue);
    const setCurrentState = jest.fn();
    const setDisplayMock = jest.fn();
    const ChildMock = jest.fn().mockReturnValue(<div />);
    useRefMock.mockReturnValueOnce({ current: { slideInMock } });
    useRefMock.mockReturnValueOnce({ current: { slideOutMock } });
    useStateMock.mockReturnValueOnce([slideOutMock, setCurrentState]);
    useStateMock.mockReturnValueOnce([initialDisplayMock, setDisplayMock]);

    const testRenderer = renderer.create(
      <SlideInView
        slideInValue={mockSlideInValue}
        slideOutValue={mockSlideOutValue}
        isOpen={false}
      >
        <ChildMock />
      </SlideInView>
    );

    const container = testRenderer.root.findByType(Animated.View);
    expect(useRefMock).toHaveNthReturnedWith(1, { current: { slideInMock } });
    expect(useRefMock).toHaveNthReturnedWith(2, { current: { slideOutMock } });
    expect(container.props.style).toEqual([
      undefined,
      { right: slideOutMock },
      initialDisplayMock,
    ]);
    expect(useEffectMock).toBeCalledTimes(2);

    setTimeout(() => {
      expect(setDisplayMock).toHaveBeenCalledWith({ display: 'flex' });
    }, 1000);
  });

  it.each(['top', 'left', 'right', 'bottom'])(
    'component slides in from the top',
    (input) => {
      const mockSlideInValue = -200;
      const mockSlideOutValue = 0;
      const slideOutMock = new Animated.Value(mockSlideOutValue);
      const initialDisplayMock = { display: 'none' };
      const setCurrentState = jest.fn();
      const ChildMock = jest.fn().mockReturnValue(<div />);
      useRefMock.mockReturnValueOnce({ current: { slideOutMock } });
      useStateMock.mockReturnValueOnce([slideOutMock, setCurrentState]);
      useStateMock.mockReturnValueOnce([initialDisplayMock, jest.fn()]);

      const testRenderer = renderer.create(
        <SlideInView
          slideInValue={mockSlideInValue}
          slideOutValue={mockSlideOutValue}
          isOpen={false}
          direction={input as Origin}
        >
          <ChildMock />
        </SlideInView>
      );

      const container = testRenderer.root.findByType(Animated.View);

      switch (input) {
        case 'top':
          expect(container.props.style[1].top).toMatchObject(slideOutMock);
          break;
        case 'bottom':
          expect(container.props.style[1].bottom).toMatchObject(slideOutMock);
          break;
        case 'left':
          expect(container.props.style[1].left).toMatchObject(slideOutMock);
          break;
        case 'right':
          expect(container.props.style[1].right).toMatchObject(slideOutMock);
          break;
      }
    }
  );
});
