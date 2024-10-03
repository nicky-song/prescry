// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { BaseButton, IBaseButtonProps } from '../base/base.button';
import { listItemButtonStyles } from './list-item.button.styles';

export interface IListItemButtonProps extends IBaseButtonProps {
  onPress: () => void;
}

export const ListItemButton = ({ ...props }: IListItemButtonProps) => {
  return <BaseButton viewStyle={listItemButtonStyles.viewStyle} {...props} />;
};
