// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { pinDisplayCircleStyles } from './pin-display-circle.styles';
import { IPinDisplayCircleProps, PinDisplayCircle } from './pin-display-circle';

const pinDisplayCircleProps: IPinDisplayCircleProps = {
  isViewEmpty: false,
};

describe('PinDisplayCircle component', () => {
  it('should render PinDisplayCircle with default state', () => {
    const pinDisplayCircle = renderer.create(
      <PinDisplayCircle {...pinDisplayCircleProps} />
    );
    const view = pinDisplayCircle.root.findByType(View);
    expect(view.props.style).toEqual([
      pinDisplayCircleStyles.circleShapeSmall,
      pinDisplayCircleStyles.purpleCircleColor,
    ]);
  });

  it('should change isViewEmpty status with the props', () => {
    pinDisplayCircleProps.isViewEmpty = true;
    const pinDisplayCircle = renderer.create(
      <PinDisplayCircle {...pinDisplayCircleProps} />
    );
    const view = pinDisplayCircle.root.findByType(View);
    expect(view.props.style).toEqual([
      pinDisplayCircleStyles.circleShapeSmall,
      pinDisplayCircleStyles.whiteCircleColor,
    ]);
  });
});
