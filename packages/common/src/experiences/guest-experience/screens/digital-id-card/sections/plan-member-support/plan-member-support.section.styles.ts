// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../../../../theming/spacing';

export interface IPlanMemberSupportSectionStyles {
  panelViewStyle: ViewStyle;
}

export const planMemberSupportSectionStyles: IPlanMemberSupportSectionStyles = {
  panelViewStyle: {
    marginTop: Spacing.times2,
  },
};
