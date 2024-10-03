// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle, TextStyle } from 'react-native';
import { FontSize, getFontDimensions } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';

export interface IPrescriptionBenefitPlanScreenStyles {
  subTitleFirstTextViewStyle: ViewStyle;
  subTitleSecondTextViewStyle: ViewStyle;
  linkViewStyle: ViewStyle;
  linkTextStyle: TextStyle;
  navigationListSeparatorViewStyle: ViewStyle;
  openPlanDetailsButtonViewStyle: ViewStyle;
}

const subTitleTextCommonViewStyle: ViewStyle = {
  marginTop: Spacing.base,
  marginRight: Spacing.times1pt5,
};
export const prescriptionBenefitPlanScreenStyles: IPrescriptionBenefitPlanScreenStyles =
  {
    subTitleFirstTextViewStyle: {
      ...subTitleTextCommonViewStyle,
      marginBottom: Spacing.times2,
    },
    subTitleSecondTextViewStyle: {
      ...subTitleTextCommonViewStyle,
    },
    linkViewStyle: {
      alignItems: 'flex-start',
      marginLeft: 0,
      paddingLeft: 0,
    },
    linkTextStyle: {
      ...getFontDimensions(FontSize.small),
      borderBottomWidth: 1,
    },
    navigationListSeparatorViewStyle: {
      marginTop: Spacing.base,
      marginBottom: Spacing.base,
      marginLeft: -Spacing.times1pt5,
      marginRight: -Spacing.times1pt5,
    },
    openPlanDetailsButtonViewStyle: {
      width: 'fit-content',
      marginLeft: -Spacing.base,
      marginTop: -Spacing.base,
      marginBottom: Spacing.base,
    },
  };
