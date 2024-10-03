// Copyright 2022 Prescryptive Health, Inc.

import { ImageStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';

export interface IExpandableCardStyles {
  expandIconViewStyle: ImageStyle;
  headingContainerViewStyle: ViewStyle;
  lineSeparatorViewStyle: ViewStyle;
}

const headingVerticalPadding = Spacing.half;

export const expandableCardStyles: IExpandableCardStyles = {
  headingContainerViewStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: headingVerticalPadding,
    paddingBottom: headingVerticalPadding,
    marginBottom: Spacing.threeQuarters - headingVerticalPadding,
  },
  expandIconViewStyle: {
    alignSelf: 'center',
    flex: 0,
    flexBasis: 'initial',
  },
  lineSeparatorViewStyle: {
    marginTop: Spacing.times2,
  },
};
