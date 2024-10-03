// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { BorderRadius } from '../../../theming/borders';
import { prescriptionPriceContainerStyles } from './prescription-price.container.styles';

export type ContainerFormat = 'highlighted' | 'plain';

export interface IPrescriptionPriceContainerProps
  extends Omit<ViewProps, 'style'> {
  viewStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  containerFormat?: ContainerFormat;
  isRounded?: boolean;
}

export const PrescriptionPriceContainer = ({
  viewStyle,
  testID = 'prescriptionPriceContainer',
  containerFormat,
  isRounded = true,
  ...props
}: IPrescriptionPriceContainerProps): ReactElement => (
  <View
    style={[
      getPriceContainerFormatStyle(containerFormat, isRounded),
      viewStyle,
    ]}
    testID={testID}
    {...props}
  />
);

const getPriceContainerFormatStyle = (
  containerFormat?: ContainerFormat,
  isRounded?: boolean
): ViewStyle => {
  const borderRadius =
    containerFormat !== 'plain' && isRounded ? BorderRadius.half : undefined;

  const viewStyle = {
    ...prescriptionPriceContainerStyles.viewStyle,
    borderRadius,
  };

  const plainViewStyle = prescriptionPriceContainerStyles.plainViewStyle;

  switch (containerFormat) {
    case 'highlighted':
      return viewStyle;
    case 'plain':
      return plainViewStyle;
    default:
      return viewStyle;
  }
};
