// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { IconButton, IIconButtonProps } from '../icon/icon.button';
import { informationButtonStyles } from './information.button.styles';

export type IInformationButtonProps = Omit<
  IIconButtonProps,
  'iconTextStyle' | 'iconName'
>;

export const InformationButton = (
  props: IInformationButtonProps
): ReactElement => {
  return (
    <IconButton
      iconName='info-circle'
      iconTextStyle={informationButtonStyles.iconTextStyle}
      style={informationButtonStyles.iconButtonViewStyle}
      {...props}
    />
  );
};
