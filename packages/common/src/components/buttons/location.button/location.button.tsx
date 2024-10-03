// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ToolButton } from '../tool.button/tool.button';
import { locationButtonStyles } from './location.button.styles';

export interface ILocationButtonProps {
  location: string;
  onPress: () => void;
  viewStyle?: StyleProp<ViewStyle>;
}

export const LocationButton: React.FunctionComponent<ILocationButtonProps> = (
  props: ILocationButtonProps
) => {
  const { onPress, location, viewStyle } = props;
  return (
    <ToolButton
      viewStyle={viewStyle}
      onPress={onPress}
      iconName='location-arrow'
      iconTextStyle={locationButtonStyles.locationButtonTextStyle}
      translateContent={false}
      testID='locationButton'
    >
      {location}
    </ToolButton>
  );
};
