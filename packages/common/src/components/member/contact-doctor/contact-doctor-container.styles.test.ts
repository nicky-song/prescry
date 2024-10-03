// Copyright 2022 Prescryptive Health, Inc.

import { getFontDimensions, FontSize } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  contactDoctorContainerStyles,
  IContactDoctorContainerStyles,
} from './contact-doctor-container.styles';

describe('contactDoctorContainerStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IContactDoctorContainerStyles = {
      descriptionTextStyle: {
        marginTop: Spacing.base,
      },
      doctorNameTextStyle: {
        marginTop: Spacing.times1pt5,
        ...getFontDimensions(FontSize.h3),
      },
      callButtonViewStyle: {
        marginTop: Spacing.base,
      },
      callIconViewStyle: {
        marginRight: Spacing.half,
      },
    };

    expect(contactDoctorContainerStyles).toEqual(expectedStyles);
  });
});
