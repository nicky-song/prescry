// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { PrimaryColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { chevronCardStyles as styles } from './chevron.card.styles';

export interface IChevronCardProps {
  onPress: () => void;
  children: ReactNode;
  viewStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const ChevronCard = ({
  onPress,
  children,
  viewStyle,
  testID,
}: IChevronCardProps): ReactElement => {
  return (
    <TouchableOpacity
      style={[styles.chevronCardViewStyle, viewStyle]}
      onPress={onPress}
      testID={testID}
    >
      {children}
      <FontAwesomeIcon
        name='chevron-right'
        size={IconSize.small}
        color={PrimaryColor.darkBlue}
      />
    </TouchableOpacity>
  );
};
