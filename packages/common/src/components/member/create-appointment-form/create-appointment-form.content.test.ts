// Copyright 2020 Prescryptive Health, Inc.

import { createAppointmentFormContent } from './create-appointment-form.content';

describe('CreateAppointmentFormContent', () => {
  it('has expected content', () => {
    const expectedContent = {
      aboutYouCaption: 'About you',
      requestingForCaption: 'I am requesting this appointment for:',
      forMyselfLabel: 'Myself',
      forAnotherPersonLabel: 'For another person',
      anotherPersonDropdownCaption: `Select who the appointment is for`,
      aboutAppointmentText: 'About this appointment',
      sameAddressAsYoursCheckboxLabel: 'Same address as yours',
      firstNameText: `First name`,
      lastNameText: `Last name`,
      dateOfBirthText: `Date of birth`,
    };

    expect(createAppointmentFormContent).toEqual(expectedContent);
  });
});
