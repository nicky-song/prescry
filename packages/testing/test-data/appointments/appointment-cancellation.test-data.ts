// Copyright 2023 Prescryptive Health, Inc.

export const primaryMember = {
  phoneNumber: '4252875335',
  phoneNumberDialingCode: '+1',
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

export const providerService = {
  providerIdentifier: 'booking-providerautomation@pharmacy.test.myrx.io',
  serviceType: 'medicare_abbott_antigen',
};

export const appointment = {
  createCancellable: true,
  questionAnswers: [
    {
      questionId: '3b8ab266-96e2-45a3-91eb-bec48c26106e',
      questionType: 'text',
      questionText:
        'Enter an Alternative Phone Number for contact tracing (Optional)',
      responseValue: 'test',
    },
    {
      questionId: 'exposure-to-covid',
      questionType: 'single-select',
      questionText:
        'Have you been in contact with someone with COVID-19 in the past 14 days?',
      responseValue: 'No',
    },
    {
      questionId: 'employed-in-healthcare',
      questionType: 'single-select',
      questionText:
        'Do you currently work in a healthcare setting with direct patient contact?',
      responseValue: 'No',
    },
    {
      questionId: 'had-covid-test',
      questionType: 'single-select',
      questionText: 'Have you had a COVID-19 test?',
      responseValue: 'Yes',
    },
    {
      questionId: 'symptomatic',
      questionType: 'multi-select',
      questionText:
        'Do you currently have one or more of the following symptoms?',
      responseValue: ['None of the above'],
    },
    {
      questionId: 'pregnant',
      questionType: 'single-select',
      questionText: 'Are you currently pregnant?',
      responseValue: 'No',
    },
    {
      questionId: 'resident-of-group-setting',
      questionType: 'single-select',
      questionText:
        'Do you currently reside in a congregate (group) care setting?',
      responseValue: 'No',
    },
    {
      questionId: 'primary-care-name',
      questionType: 'text',
      questionText: 'What is the name of your Primary Care Provider?',
      responseValue: 'test',
    },
    {
      questionId: 'primary-care-phone-number',
      questionType: 'text',
      questionText: 'What is the phone number of your Primary Care Provider',
      responseValue: 'test',
    },
    {
      questionId: 'patient-gender',
      questionType: 'single-select',
      questionText: 'What is your gender?',
      responseValue: 'Other',
    },
    {
      questionId: 'patient-ethnicity',
      questionType: 'single-select',
      questionText: 'I identify my ethnicity as:',
      responseValue: 'Not Hispanic or Latino',
    },
    {
      questionId: 'patient-race',
      questionType: 'multi-select',
      questionText: 'I identify my race as:',
      responseValue: ['Other Race'],
    },
    {
      questionId: 'medicare_id',
      questionType: 'text',
      questionText: 'What is your Medicare membership ID?',
      responseValue: 'testmembership',
    },
  ],
};
