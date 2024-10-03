// Copyright 2022 Prescryptive Health, Inc.

import { GrayScaleColor, PrimaryColor } from '../../../theming/colors';
import { Spacing } from '../../../theming/spacing';
import {
  IKeepCurrentPrescriptionSectionStyles,
  keepCurrentPrescriptionSectionStyles,
} from './keep-current-prescription.section.styles';

describe('keepCurrentPrescriptionSectionStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IKeepCurrentPrescriptionSectionStyles = {
      headingTextStyle: { marginBottom: Spacing.base },
      descriptionTextStyle: { marginBottom: Spacing.times1pt5 },
      pharmacyHoursContainerViewStyle: {
        marginBottom: Spacing.base,
      },
      keepCurrentPrescriptionButtonViewStyle: {
        backgroundColor: GrayScaleColor.white,
        borderColor: PrimaryColor.darkPurple,
        borderWidth: 2,
      },
      keepCurrentPrescriptionButtonTextStyle: {
        color: PrimaryColor.darkPurple,
        textAlign: 'center',
      },
    };

    expect(keepCurrentPrescriptionSectionStyles).toEqual(expectedStyles);
  });
});
