// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { IconSize } from '../../../theming/icons';
import { ToolButton } from '../tool.button/tool.button';
import { filterButtonContent } from './filter.button.content';
import { filterButtonStyles } from './filter.button.styles';

export interface IFilterButtonProps {
  onPress: () => void;
}

export const FilterButton: React.FunctionComponent<IFilterButtonProps> = (
  props: IFilterButtonProps
) => {
  const { onPress } = props;
  const { iconTextStyle, toolButtonViewStyle } = filterButtonStyles;

  return (
    <ToolButton
      testID='toolButton'
      onPress={onPress}
      iconName='sliders-h'
      iconSize={IconSize.regular}
      iconTextStyle={iconTextStyle}
      viewStyle={toolButtonViewStyle}
    >
      {filterButtonContent.filterLabel}
    </ToolButton>
  );
};
