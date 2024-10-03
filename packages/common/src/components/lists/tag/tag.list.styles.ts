// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../theming/spacing';
import { IExtendedViewStyle } from '../../../typings/extended-view-style';

export interface ITagListStyles {
  viewStyle: IExtendedViewStyle;
}

export const tagListStyles: ITagListStyles = {
  viewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.half,
  },
};
