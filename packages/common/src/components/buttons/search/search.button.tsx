// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { IconSize } from '../../../theming/icons';
import { BaseText } from '../../text/base-text/base-text';
import { searchButtonStyles } from './search.button.styles';
import {
  SecondaryButton,
  ISecondaryButtonProps,
} from '../secondary/secondary.button';
import { PrimaryColor } from '../../../theming/colors';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

export interface ISearchButtonProps
  extends Omit<
    ISecondaryButtonProps,
    'textStyle' | 'children' | 'size' | 'disabled'
  > {
  label: string;
  onPress: () => void;
}

export const SearchButton = ({
  viewStyle,
  label,
  ...props
}: ISearchButtonProps): ReactElement => {
  const searchButtonIcon = (
    <FontAwesomeIcon
      name='search'
      color={PrimaryColor.darkBlue}
      size={IconSize.medium}
    />
  );

  const searchButtonText = (
    <BaseText style={searchButtonStyles.textStyle}>{label}</BaseText>
  );

  return (
    <SecondaryButton
      viewStyle={[searchButtonStyles.buttonViewStyle, viewStyle]}
      {...props}
    >
      <View style={searchButtonStyles.buttonContentViewStyle}>
        {searchButtonIcon}
        {searchButtonText}
      </View>
    </SecondaryButton>
  );
};
