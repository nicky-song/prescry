// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import {
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  ColorValue,
  TextStyle,
} from 'react-native';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { BaseText } from '../../text/base-text/base-text';
import { navigationLinkStyles } from './navigation.link.styles';

export interface INavigationLinkProps {
  viewStyle?: StyleProp<ViewStyle>;
  label: string;
  linkColor?: ColorValue;
  isSkeleton?: boolean;
  onPress: () => void;
  testID?: string;
}

export const NavigationLink = ({
  viewStyle,
  label,
  linkColor,
  isSkeleton,
  onPress,
  testID = 'navigationLink',
}: INavigationLinkProps): ReactElement => {
  const styles = navigationLinkStyles;

  const linkColorTextStyle: TextStyle | undefined = linkColor
    ? {
        color: linkColor,
      }
    : undefined;

  return (
    <TouchableOpacity
      accessibilityRole='link'
      style={[styles.linkItemTextStyle, viewStyle]}
      onPress={onPress}
      testID={testID}
    >
      <BaseText
        style={[styles.linkLabelTextStyle, linkColorTextStyle]}
        isSkeleton={isSkeleton}
      >
        {label}
      </BaseText>
      <FontAwesomeIcon name='chevron-right' style={styles.iconTextStyle} />
    </TouchableOpacity>
  );
};
