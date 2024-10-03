// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { pinDisplayCircleStyles } from './pin-display-circle.styles';
export interface IPinDisplayCircleProps {
  isViewEmpty: boolean;
}

export const PinDisplayCircle = ({
  isViewEmpty,
}: IPinDisplayCircleProps): ReactElement => {
  const colorStyle = isViewEmpty
    ? pinDisplayCircleStyles.whiteCircleColor
    : pinDisplayCircleStyles.purpleCircleColor;

  return <View style={[pinDisplayCircleStyles.circleShapeSmall, colorStyle]} />;
};
