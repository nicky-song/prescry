// Copyright 2022 Prescryptive Health, Inc.

import { BorderRadius } from '../../../../theming/borders';
import { GrayScaleColor, PrimaryColor } from '../../../../theming/colors';
import { FontWeight, getFontFace } from '../../../../theming/fonts';
import { IconSize } from '../../../../theming/icons';
import { Spacing } from '../../../../theming/spacing';
import {
  IRecommendedAlternativesScreenStyles,
  recommendedAlternativesScreenStyles,
} from './recommended-alternatives.screen.styles';

describe('recommendedAlternativesScreenStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IRecommendedAlternativesScreenStyles = {
      prescribedMedicationViewStyle: {
        borderWidth: 1,
        borderColor: GrayScaleColor.borderLines,
        borderRadius: BorderRadius.normal,
        padding: Spacing.base,
        marginTop: Spacing.base,
      },
      headingContainerTextStyle: {
        marginTop: Spacing.times2,
      },
      headingTextStyle: {
        ...getFontFace({ weight: FontWeight.semiBold }),
      },
      learnMoreDescriptionTextStyle: {
        marginTop: Spacing.base,
      },
      alternativeMedicationContainerViewStyle: { marginTop: Spacing.base },
      lineSeparatorViewStyle: { marginTop: Spacing.times1pt5 },
      pricingAtPharmacyNameViewStyle: { marginTop: Spacing.times2 },
      skipButtonTextStyle: { color: PrimaryColor.darkPurple },
      skipButtonViewStyle: {
        backgroundColor: GrayScaleColor.white,
        borderWidth: 2,
        borderColor: PrimaryColor.darkPurple,
        marginTop: Spacing.times2,
      },
      customerSupportViewStyle: {
        marginTop: Spacing.times2,
      },
      slideUpModalHeadingTextStyle: {
        marginBottom: Spacing.half,
      },
      slideUpModalContentTextStyle: { marginBottom: Spacing.times2 },
      iconButtonTextStyle: {
        fontSize: IconSize.regular,
      },
      iconButtonViewStyle: {
        height: 18,
        width: 18,
        marginLeft: Spacing.quarter,
      },
      keepCurrentPrescriptionSectionViewStyle: {
        marginTop: Spacing.times2,
      },
      contactDoctorContainerViewStyle: { marginTop: Spacing.times2 },
    };

    expect(recommendedAlternativesScreenStyles).toEqual(expectedStyles);
  });
});
