// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { PinDisplayCircle } from '../../../components/pin/pin-display-circle/pin-display-circle';
import { pinDisplayContainerStyle } from './pin-display-container.style';

export interface IPinDisplayContainerProps {
  pinIndex: number;
}

export const PinDisplayContainer = ({
  pinIndex,
}: IPinDisplayContainerProps): ReactElement => {
  const renderPinItems = () => {
    const displayPinMap = [1, 2, 3, 4];
    return displayPinMap.map((pin, index) => {
      const isViewEmpty = pin <= pinIndex ? false : true;

      return (
        <View
          style={pinDisplayContainerStyle.pinContainerViewStyle}
          key={index}
          testID='pinDisplay'
        >
          <PinDisplayCircle isViewEmpty={isViewEmpty} />
        </View>
      );
    });
  };

  return (
    <View
      style={pinDisplayContainerStyle.containerViewStyle}
      testID='pinDisplayContainer'
    >
      {renderPinItems()}
    </View>
  );
};
