// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { stylesheet } from '../../../theming/member/stylesheet';
import { PurpleScale } from '../../../theming/theme';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

export interface IBackSpaceButtonProps {
  onPress?: () => void;
  testID?: string;
}

export const BackSpaceButton: React.SFC<IBackSpaceButtonProps> = (
  props: IBackSpaceButtonProps
) => {
  return (
    <TouchableOpacity
      style={stylesheet.backButtonTargetAreaView}
      onPress={props.onPress}
      testID={props.testID}
    >
      <FontAwesomeIcon
        name='backspace'
        solid={true}
        size={36}
        color={PurpleScale.darkest}
      />
    </TouchableOpacity>
  );
};
