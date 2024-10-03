// Copyright 2020 Prescryptive Health, Inc.

import { ITestResultStyles, testResultStyles } from './test-result.styles';
import { Spacing } from '../../../theming/spacing';
import { FontSize, FontWeight, getFontFace } from '../../../theming/fonts';

describe('testResultStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: ITestResultStyles = {
      providerNameTextStyle: {
        ...getFontFace({ weight: FontWeight.bold }),
      },
      instructionsTextStyle: {
        fontSize: FontSize.small,
      },
      moreInfoTextStyle: {
        marginTop: Spacing.threeQuarters,
      },
      firstMoreInfoTextStyle: {
        marginTop: 0,
      },
      separatorViewStyle: {
        marginTop: Spacing.times1pt5,
        marginBottom: Spacing.times1pt5,
      },
      toolButtonIconTextStyle: { fontSize: FontSize.xLarge },
      toolButtonViewStyle: { marginBottom: Spacing.base },
      spinnerViewStyle: { marginBottom: Spacing.base },
      allowPopUpsTextStyle: {
        fontSize: FontSize.small,
        marginBottom: Spacing.threeQuarters,
      },
    };

    expect(testResultStyles).toEqual(expectedStyles);
  });
});
