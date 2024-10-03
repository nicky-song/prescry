// Copyright 2021 Prescryptive Health, Inc.

import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { Spacing } from '../../../../theming/spacing';
import {
  IMedicineCabinetScreenStyles,
  medicineCabinetScreenStyles,
} from './medicine-cabinet.screen.styles';

describe('medicineCabinetScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IMedicineCabinetScreenStyles = {
      navigationListSeparatorViewStyle: {
        marginBottom: Spacing.base,
        marginLeft: -Spacing.times1pt5,
        marginRight: -Spacing.times1pt5,
      },
      prescriptionListViewStyle: {
        marginBottom: Spacing.base,
      },
      subtitleTextStyle: {
        marginBottom: Spacing.times2,
      },
      subHeadingTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
        marginBottom: Spacing.half,
      },
      lineSeparatorViewStyle: { marginBottom: Spacing.times2 },
      listViewStyle: { marginTop: Spacing.times2 },
      headingTextStyle: { ...getFontFace({ weight: FontWeight.semiBold }) },
      chevronCardViewStyle: { marginBottom: Spacing.half, width: '100%' },
      chevronCardCommonViewStyle: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1,
      },
    };
    expect(medicineCabinetScreenStyles).toEqual(expectedStyles);
  });
});
