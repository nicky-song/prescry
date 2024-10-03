// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { ListItem } from '../../primitives/list-item';
import { BaseText } from '../../text/base-text/base-text';
import { baseTagStyles } from './base.tag.styles';

export interface IBaseTagProps {
  viewStyle?: StyleProp<ViewStyle>;
  label: string;
  labelTextStyle?: StyleProp<TextStyle>;
  iconName?: string;
  iconTextStyle?: StyleProp<TextStyle>;
  iconSolid?: boolean;
  iconColor?: string;
  iconSize?: number;
  isSkeleton?: boolean;
  testID?: string;
}

export const BaseTag = ({
  viewStyle,
  label,
  labelTextStyle,
  iconName,
  iconTextStyle,
  iconSolid,
  iconColor,
  iconSize = IconSize.smaller,
  isSkeleton,
  testID,
}: IBaseTagProps): ReactElement => {
  const icon = iconName ? (
    <FontAwesomeIcon
      name={iconName}
      style={[baseTagStyles.iconTextStyle, iconTextStyle]}
      solid={iconSolid}
      color={iconColor}
      size={iconSize}
    />
  ) : null;

  return (
    <ListItem style={[baseTagStyles.viewStyle, viewStyle]} testID={testID}>
      {icon}
      <BaseText
        isSkeleton={isSkeleton}
        style={[baseTagStyles.labelTextStyle, labelTextStyle]}
      >
        {label}
      </BaseText>
    </ListItem>
  );
};
