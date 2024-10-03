// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '../../../../theming/spacing';
import {
  IPrescriptionBenefitPlanScreenStyles,
  prescriptionBenefitPlanScreenStyles,
} from './prescription-benefit-plan.screen.styles';
import { FontSize, getFontDimensions } from '../../../../theming/fonts';
import { ViewStyle } from 'react-native';

describe('Prescription Benefit Plan Screen Styles', () => {
  it('has expected styles', () => {
    const subTitleTextCommonViewStyle: ViewStyle = {
      marginTop: Spacing.base,
      marginRight: Spacing.times1pt5,
    };
    const expectedStyles: IPrescriptionBenefitPlanScreenStyles = {
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
    expect(prescriptionBenefitPlanScreenStyles).toEqual(expectedStyles);
  });
});
