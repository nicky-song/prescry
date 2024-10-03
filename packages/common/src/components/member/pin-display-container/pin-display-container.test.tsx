// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { PinDisplayCircle } from '../../pin/pin-display-circle/pin-display-circle';
import {
  IPinDisplayContainerProps,
  PinDisplayContainer,
} from './pin-display-container';
import { pinDisplayContainerStyle } from './pin-display-container.style';

const pinDisplayContainerProps: IPinDisplayContainerProps = {
  pinIndex: 2,
};

describe('PinDisplayContainer', () => {
  it('renders container with expected props', () => {
    const testRenderer = renderer.create(
      <PinDisplayContainer {...pinDisplayContainerProps} />
    );
    const container = testRenderer.root.findAllByType(View, { deep: false })[0];
    expect(container.props.style).toEqual(
      pinDisplayContainerStyle.containerViewStyle
    );
    container.props.children.forEach((circle: ReactTestInstance) => {
      expect(circle.props.style).toEqual(
        pinDisplayContainerStyle.pinContainerViewStyle
      );
    });
  });

  it('PinDisplayContainer renders correctly with defaults', () => {
    const pinDisplayContainer = renderer.create(
      <PinDisplayContainer {...pinDisplayContainerProps} />
    );
    const PinDisplayCircleList =
      pinDisplayContainer.root.findAllByType(PinDisplayCircle);
    expect(PinDisplayCircleList.length).toBe(4);
  });

  it('PinDisplayContainer renders correctly with props', () => {
    const pinDisplayContainer = renderer.create(
      <PinDisplayContainer {...pinDisplayContainerProps} />
    );
    const PinDisplayCircleList =
      pinDisplayContainer.root.findAllByType(PinDisplayCircle);
    expect(PinDisplayCircleList[0].props.isViewEmpty).toBeFalsy();
    expect(PinDisplayCircleList[1].props.isViewEmpty).toBeFalsy();
    expect(PinDisplayCircleList[2].props.isViewEmpty).toBeTruthy();
    expect(PinDisplayCircleList[3].props.isViewEmpty).toBeTruthy();
  });

  it('PinDisplayContainer renders correctly with when pinIndex is 0', () => {
    pinDisplayContainerProps.pinIndex = 0;
    const pinDisplayContainer = renderer.create(
      <PinDisplayContainer {...pinDisplayContainerProps} />
    );
    const PinDisplayCircleList =
      pinDisplayContainer.root.findAllByType(PinDisplayCircle);
    expect(PinDisplayCircleList[0].props.isViewEmpty).toBeTruthy();
    expect(PinDisplayCircleList[1].props.isViewEmpty).toBeTruthy();
    expect(PinDisplayCircleList[2].props.isViewEmpty).toBeTruthy();
    expect(PinDisplayCircleList[3].props.isViewEmpty).toBeTruthy();
  });

  it('PinDisplayContainer renders correctly with when pinIndex is 4', () => {
    pinDisplayContainerProps.pinIndex = 4;
    const pinDisplayContainer = renderer.create(
      <PinDisplayContainer {...pinDisplayContainerProps} />
    );
    const PinDisplayCircleList =
      pinDisplayContainer.root.findAllByType(PinDisplayCircle);
    expect(PinDisplayCircleList[0].props.isViewEmpty).toBeFalsy();
    expect(PinDisplayCircleList[1].props.isViewEmpty).toBeFalsy();
    expect(PinDisplayCircleList[2].props.isViewEmpty).toBeFalsy();
    expect(PinDisplayCircleList[3].props.isViewEmpty).toBeFalsy();
  });
});
