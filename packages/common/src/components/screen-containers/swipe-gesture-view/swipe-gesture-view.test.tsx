// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import {
  View,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  PanResponderCallbacks,
  ViewStyle,
} from 'react-native';
import { SwipeGestureView } from './swipe-gesture-view';

const instance = {
  panHandlers: {
    onMoveShouldSetResponder: jest.fn(),
    onResponderRelease: jest.fn(),
  },
};

const createMock = jest.fn((config: PanResponderCallbacks) => {
  return config ? instance : instance;
});

PanResponder.create = createMock;

describe('Swipe gesture view', () => {
  beforeEach(() => {
    createMock.mockReset();
    createMock.mockReturnValue(instance);
  });

  it('renders children and properties correctly', () => {
    const onSwipeMock = jest.fn();
    const mockStyle: ViewStyle = { display: 'flex' };
    createMock.mockReturnValue(instance);

    const testRenderer = renderer.create(
      <SwipeGestureView onSwipe={onSwipeMock} viewStyle={mockStyle}>
        <div />
      </SwipeGestureView>
    );
    const container = testRenderer.root.findByType(View);

    expect(createMock).toHaveBeenCalled();
    expect(container.props.onMoveShouldSetResponder).toEqual(
      instance.panHandlers.onMoveShouldSetResponder
    );
    expect(container.props.onResponderRelease).toEqual(
      instance.panHandlers.onResponderRelease
    );

    const setPanResponder =
      createMock.mock.calls[0][0].onStartShouldSetPanResponder;

    const mockEmptyEvent = (jest.fn() as unknown) as GestureResponderEvent;
    const mockEmptyGestureState = {};

    let panResponderReturn;
    if (setPanResponder) {
      panResponderReturn = setPanResponder(
        mockEmptyEvent,
        (mockEmptyGestureState as unknown) as PanResponderGestureState
      );
    }
    expect(panResponderReturn).toEqual(true);
    expect(container.props.style).toEqual(mockStyle);
    expect(container.props.children).toEqual(<div />);
  });

  it.each([
    ['up', { dx: 1, dy: -1 }],
    ['down', { dx: 0, dy: 1 }],
    ['left', { dx: -1, dy: 0 }],
    ['right', { dx: 2, dy: 1 }],
  ])('can swipe to (%p) direction ', (expected, input) => {
    const onSwipeMock = jest.fn();
    createMock.mockReturnValue(instance);
    renderer.create(
      <SwipeGestureView onSwipe={onSwipeMock}>
        <div />
      </SwipeGestureView>
    );

    const mockEmptyEvent = (jest.fn() as unknown) as GestureResponderEvent;

    const mockGestureState = input;

    const responderRelease = createMock.mock.calls[0][0].onPanResponderRelease;
    if (responderRelease) {
      responderRelease(
        mockEmptyEvent,
        (mockGestureState as unknown) as PanResponderGestureState
      );
    }

    expect(onSwipeMock).toHaveBeenCalledWith(expected);
  });
});
