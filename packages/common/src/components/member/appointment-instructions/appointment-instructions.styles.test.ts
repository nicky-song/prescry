// Copyright 2020 Prescryptive Health, Inc.

import { FontSize } from '../../../theming/fonts';
import {
  appointmentInstructionsStyles,
  IAppointmentInstructionsStyles,
} from './appointment-instructions.styles';

describe('appointmentInstructionsStyles', () => {
  it('has expected styles', () => {
    const expectedStyles: IAppointmentInstructionsStyles = {
      appointmentInstructionsDescriptionTextStyle: {
        fontSize: FontSize.small,
      },
      appointmentInstructionsCancelDescriptionTextStyle: {
        fontSize: FontSize.small,
      },
    };

    expect(appointmentInstructionsStyles).toEqual(expectedStyles);
  });
});
