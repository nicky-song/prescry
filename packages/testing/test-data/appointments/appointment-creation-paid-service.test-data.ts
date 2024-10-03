// Copyright 2023 Prescryptive Health, Inc.

export const member = {
  phoneNumber: '4252875335',
  phoneNumberDialingCode: '+1',
  code: '123456',
  dateOfBirth: '1990-01-01T00:00:00Z',
  firstName: 'CASH_AUTOMATION',
  lastName: 'TEST',
  email: 'testing@prescryptive.com',
  pin: '1234',
  rxGroupType: 'CASH',
  address: {
    countryAbbreviation: 'US',
    street: 'Avondale Way',
    city: 'Redmond',
    zipCode: '98052',
    county: 'King',
    stateAbbreviation: 'WA',
  },
};

export const automationProviderService = {
  zip: 90310,
  identifier: 'booking-providerautomation@pharmacy.test.myrx.io',
  service: {
    type: 'covid-antigen-test',
    paymentRequired: true,
    answers: [
      {
        questionId: '3b8ab266-96e2-45a3-91eb-bec48c26106e',
        questionType: 'text',
        responseValue: 'test',
      },
      {
        questionId: 'exposure-to-covid',
        questionType: 'single-select',
        responseValue: 'No',
      },
      {
        questionId: 'employed-in-healthcare',
        questionType: 'single-select',
        responseValue: 'No',
      },
      {
        questionId: 'had-covid-test',
        questionType: 'single-select',
        responseValue: 'Yes',
      },
      {
        questionId: 'symptomatic',
        questionType: 'multi-select',
        responseValue: ['None of the above'],
      },
      {
        questionId: 'pregnant',
        questionType: 'single-select',
        responseValue: 'No',
      },
      {
        questionId: 'resident-of-group-setting',
        questionType: 'single-select',
        responseValue: 'No',
      },
      {
        questionId: 'primary-care-name',
        questionType: 'text',
        responseValue: 'test',
      },
      {
        questionId: 'primary-care-phone-number',
        questionType: 'text',
        responseValue: 'test',
      },
      {
        questionId: 'patient-gender',
        questionType: 'single-select',
        responseValue: 'Other',
      },
      {
        questionId: 'patient-ethnicity',
        questionType: 'single-select',
        responseValue: 'Not Hispanic or Latino',
      },
      {
        questionId: 'patient-race',
        questionType: 'multi-select',
        responseValue: ['Other Race'],
      },
    ],
  },
};

export const stripePayment = {
  cardNumber: 4242424242424242,
  cardCvc: 123,
  cardExpiry: (): [string, string] => {
    const currDay = new Date(Date.now());
    currDay.setMonth(currDay.getMonth() + 12);

    return [
      currDay.toLocaleDateString('en-US', { month: '2-digit' }),
      currDay.toLocaleDateString('en-US', { year: '2-digit' }),
    ];
  },
};
