// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { DrawerItem } from '@react-navigation/drawer';
import { FontAwesomeIcon } from '../../../../../../components/icons/font-awesome/font-awesome.icon';
import { View } from 'react-native';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { sideMenuDrawerItemStyles } from './side-menu.drawer-item.styles';

export interface ISideMenuDrawerItemProps {
  label: ReactNode;
  iconName: string;
  iconSize: number;
  onPress: () => void;
  isSkeleton?: boolean;
  testID?: string;
}

const itemLabel = (label: string, isSkeleton?: boolean) => () =>
  (
    <BaseText
      style={sideMenuDrawerItemStyles.labelTextStyle}
      isSkeleton={isSkeleton}
    >
      {label}
    </BaseText>
  );

const itemIcon = (iconName: string, iconSize: number, testID?: string) => () =>
  (
    <View style={sideMenuDrawerItemStyles.iconViewStyle} testID={testID}>
      <FontAwesomeIcon name={iconName} size={iconSize} />
    </View>
  );

export const SideMenuDrawerItem = ({
  label,
  iconName,
  iconSize,
  onPress,
  isSkeleton,
  testID,
}: ISideMenuDrawerItemProps): ReactElement => {
  const labelFunc =
    typeof label === 'string' ? itemLabel(label, isSkeleton) : () => label;

  return (
    <DrawerItem
      label={labelFunc}
      icon={itemIcon(iconName, iconSize, testID)}
      onPress={onPress}
      style={sideMenuDrawerItemStyles.itemViewStyle}
    />
  );
};
