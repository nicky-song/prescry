// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { View } from 'react-native';
import { languageSideMenuDrawerItemStyles as itemStyles } from './language.side-menu.drawer-item.styles';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { ProtectedBaseText } from '../../../../../../components/text/protected-base-text/protected-base-text';
import { SideMenuDrawerItem } from './side-menu.drawer-item';

export interface ILanguageSideMenuDrawerItemProps {
  label: string;
  languageName: string;
  onPress: () => void;
  isSkeleton?: boolean;
  testID?: string;
}

export const LanguageSideMenuDrawerItem = ({
  label,
  languageName,
  onPress,
  isSkeleton,
  testID,
}: ILanguageSideMenuDrawerItemProps): ReactElement => {
  const itemLabel: ReactNode = (
    <View style={itemStyles.itemLabelViewStyle}>
      <BaseText style={itemStyles.labelTextStyle} isSkeleton={isSkeleton}>
        {label}
      </BaseText>
      <ProtectedBaseText style={itemStyles.labelDotTextStyle}>
        {' · '}
      </ProtectedBaseText>
      <BaseText isSkeleton={isSkeleton}>{languageName}</BaseText>
    </View>
  );

  return (
    <SideMenuDrawerItem
      label={itemLabel}
      iconName='globe'
      iconSize={18}
      onPress={onPress}
      isSkeleton={isSkeleton}
      testID={testID}
    />
  );
};
