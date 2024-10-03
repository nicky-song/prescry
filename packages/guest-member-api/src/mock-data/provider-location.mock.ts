// Copyright 2021 Prescryptive Health, Inc.

import { IServiceQuestion } from '@phx/common/src/models/provider-location';
import {
  IProviderLocationEndpointResponse,
  IProviderLocationListEndpointResponse,
  IProviderLocationResponse,
  IProviderLocationService,
} from '../models/pharmacy-portal/get-provider-location.response';

export const npiNumberMock = '00000001';

export const surviceQuestionsMock: IServiceQuestion[] = [
  {
    id: 'exposure-to-covid',
    label: 'Exposure to COVID-19 in the last 14 days?',
    markdownLabel:
      '**Have you been in contact with someone with COVID-19 in the past 14 days?**',
    placeholder: 'Select a value',
    type: 'single-select',
    selectOptions: [
      ['Yes, patient has been exposed', 'Yes'],
      ['No known exposure', 'No'],
      ['Possible exposure', 'Possibly'],
    ],
    isRequired: true,
    priority: 1,
  },
  {
    id: 'employed-in-healthcare',
    label: 'Employed in Healthcare',
    markdownLabel:
      '**Do you currently work in a healthcare setting with direct patient contact?**',
    placeholder: 'Select a value',
    type: 'single-select',
    selectOptions: [
      ['Yes', 'Yes'],
      ['No', 'No'],
    ],
    isRequired: true,
    priority: 2,
  },
  {
    id: 'symptomatic',
    label: `Symptomatic?`,
    markdownLabel:
      '**Do you currently have one or more of the following symptoms?**',
    description:
      'Fever or chills; Cough; Shortness of breath or difficulty breathing; Fatigue; Muscle or body aches; Headache; New loss of taste or smell; Sore throat; Congestion or runny nose; Nausea or vomiting; Diarrhea',
    placeholder: 'Select a value',
    type: 'single-select',
    selectOptions: [
      ['Yes', 'Yes'],
      ['No', 'No'],
    ],
    isRequired: true,
    priority: 3,
  },
  {
    id: 'symptom-onset',
    label: 'Date of Symptom Onset',
    markdownLabel: '**If yes, when did your symptoms start?**',
    type: 'datepicker',
    selectOptions: [],
    isRequired: false,
    priority: 4,
  },
  {
    id: 'pregnant',
    label: 'Pregnant?',
    markdownLabel: '**Are you currently pregnant?**',
    placeholder: 'Select a value',
    type: 'single-select',
    selectOptions: [
      ['Yes', 'Yes'],
      ['No', 'No'],
      ['Not Applicable', 'Not Applicable'],
    ],
    isRequired: true,
    priority: 5,
  },
  {
    id: 'resident-of-group-setting',
    label: 'Resident in a Congregate Care Setting?',
    markdownLabel:
      '**Do you currently reside in a congregate (group) care setting?**',
    placeholder: 'Select a value',
    type: 'single-select',
    selectOptions: [
      ['Yes', 'Yes'],
      ['No', 'No'],
    ],
    isRequired: true,
    priority: 6,
  },
  {
    id: 'had-covid-test',
    label: 'Have you had COVID-19 test?',
    markdownLabel: '**Have you had a COVID-19 test?**',
    placeholder: 'Select a value',
    type: 'single-select',
    selectOptions: [
      ['Yes', 'Yes'],
      ['No', 'No'],
    ],
    isRequired: true,
    priority: 7,
  },
  {
    id: 'primary-care-name',
    label: 'Primary Care Name',
    markdownLabel: '**What is the name of your Primary Care Provider?**',
    placeholder: 'Enter none if unknown',
    type: 'text',
    selectOptions: [],
    isRequired: true,
    priority: 8,
  },
  {
    id: 'primary-care-phone-number',
    label: 'Primary Care Phone Number',
    markdownLabel:
      '**What is the phone number of your Primary Care Provider?**',
    placeholder: 'Enter none if unknown',
    type: 'text',
    selectOptions: [],
    isRequired: true,
    priority: 9,
  },
  {
    id: 'patient-gender',
    label: 'Patient Gender',
    markdownLabel: '**What is your gender?**',
    placeholder: 'Select a value',
    type: 'single-select',
    selectOptions: [
      ['Female', 'Female'],
      ['Male', 'Male'],
      ['Other', 'Other'],
    ],
    isRequired: true,
    priority: 10,
  },
  {
    id: 'patient-ethnicity',
    label: 'Patient Ethnicity',
    markdownLabel: '**I identify my ethnicity as:**',
    placeholder: 'Select a value',
    type: 'single-select',
    selectOptions: [
      ['Hispanic or Latino', 'Hispanic or Latino'],
      ['Not Hispanic or Latino', 'Not Hispanic or Latino'],
    ],
    isRequired: true,
    priority: 11,
  },
  {
    id: 'patient-race',
    label: 'Patient Race',
    markdownLabel: '**I identify my race as:**',
    placeholder: 'Select a value',
    type: 'multi-select',
    selectOptions: [
      ['American Indian or Alaska Native', 'American Indian or Alaska Native'],
      ['Asian', 'Asian'],
      ['Black or African American', 'Black or African American'],
      [
        'Native Hawaiian or Other Pacific Islander',
        'Native Hawaiian or Other Pacific Islander',
      ],
      ['White', 'White'],
      ['Other Race', 'Other Race'],
    ],
    isRequired: true,
    priority: 12,
  },
];

export const providerLocationEndpointResponseMock: IProviderLocationEndpointResponse =
  {
    id: 'id-1',
    providerInfo: {
      name: 'provider-name',
      taxId: 'provider-tax-id',
      cliaNumber: '00000000',
      npiNumber: npiNumberMock,
    },
    name: 'test-location',
    address: {
      line1: 'mock-address1',
      line2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zipCode: 'mock-zip',
      timezone: 'America/Los_Angeles',
      coordinates: {
        latitude: 40.694214,
        longitude: -73.96529,
      },
    },
    phoneNumber: 'mock-phone',
    isEnabled: true,
    isTest: false,
    services: [
      {
        id: 'COVID-19 Antigen Testing',
        name: 'service-name',
        description: 'service-desc',
        questions: [],
        clientText: {
          serviceName: 'service-name-myrx',
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          cancellationPolicy: 'cancellation policy text',
          aboutQuestionsDescription: 'primary person appointment text',
          aboutDependentDescription: 'dependent policy text',
          confirmationDescription: 'confirm-desc',
          confirmationAdditionalInfo: 'additional-info',
        },
        schedulerMinimumAge: 18,
        minimumAge: 3,
        duration: 15,
        minLeadDuration: 'P6D',
        maxLeadDuration: 'P30D',
        scheduleMode: 'everyone',
        procedureCode: '87811',
      },
      {
        name: 'service-name2',
        description: 'service-desc2',
        questions: surviceQuestionsMock,
        id: 'Other Testing',
        clientText: {
          serviceName: 'service-name2-myrx',
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          cancellationPolicy: 'cancellation policy text',
          aboutQuestionsDescription: 'primary person appointment text',
          aboutDependentDescription: 'dependent policy text',
          confirmationDescription: 'confirm-desc',
          confirmationAdditionalInfo: 'additional-info',
        },
        duration: 15,
        schedulerMinimumAge: 18,
        minimumAge: 3,
        minLeadDuration: 'P6D',
        maxLeadDuration: 'P30D',
        scheduleMode: 'everyone',
      },
    ] as IProviderLocationService[],
  };

export const providerLocationResponseWithServiceTypeFilterMock: IProviderLocationResponse =
  {
    location: {
      identifier: 'id-1',
      providerInfo: {
        providerName: 'provider-name',
      },
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      enabled: true,
      providerTaxId: 'provider-tax-id',
      serviceList: [
        {
          serviceName: 'fake-name',
          serviceDescription: 'fake-desc',
          questions: [],
          serviceType: 'COVID-19 Antigen Testing',
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          confirmationDescription: 'confirm-desc',
          duration: 15,
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
          status: 'everyone',
        },
      ],
      latitude: 40.694214,
      longitude: -73.96529,
      isTest: false,
      cliaNumber: '00000000',
      npiNumber: npiNumberMock,
    },
    service: {
      serviceType: 'COVID-19 Antigen Testing',
      serviceName: 'service-name-myrx',
      minimumAge: 3,
      schedulerMinimumAge: 18,
      confirmationDescriptionMyRx: 'confirm-desc',
      cancellationPolicyMyRx: 'cancellation policy text',
      aboutQuestionsDescriptionMyRx: 'primary person appointment text',
      aboutDependentDescriptionMyRx: 'dependent policy text',
      serviceDescription: 'service-desc',
      serviceNameMyRx: 'service-name-myrx',
      procedureCode: '87811',
    },
    message: 'success',
  };

export const providerLocationResponseWithoutServicesMock: IProviderLocationResponse =
  {
    location: {
      identifier: 'id-1',
      providerInfo: {
        providerName: 'test-location',
      },
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      enabled: true,
      serviceList: [],
      latitude: 40.694214,
      longitude: -73.96529,
      providerTaxId: 'provider-tax-id',
      cliaNumber: '00000000',
      npiNumber: npiNumberMock,
    },
    service: undefined,
    message: 'success',
  };

export const providerLocationResponseWithVaccineServiceFilterMock: IProviderLocationResponse =
  {
    location: {
      identifier: 'id-1',
      providerInfo: {
        providerName: 'provider-name',
      },
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      enabled: true,
      providerTaxId: 'provider-tax-id',
      serviceList: [
        {
          serviceName: 'COVID-19 vaccine dose 1',
          serviceDescription: 'fake-desc',
          questions: [],
          serviceType: 'c19-vaccine-dose1',
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          confirmationDescription: 'confirm-desc',
          duration: 15,
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
          status: 'everyone',
        },
      ],
      latitude: 40.694214,
      longitude: -73.96529,
      isTest: false,
      cliaNumber: '00000000',
      npiNumber: npiNumberMock,
    },
    service: {
      serviceType: 'c19-vaccine-dose1',
      serviceName: 'COVID-19 vaccine dose 1',
      minimumAge: 18,
      confirmationDescriptionMyRx: 'confirm-desc',
      cancellationPolicyMyRx: 'cancellation policy text',
      aboutQuestionsDescriptionMyRx: 'primary person appointment text',
      aboutDependentDescriptionMyRx: 'dependent policy text',
      serviceDescription: 'service-desc',
      serviceNameMyRx: 'COVID-19 vaccine dose 1',
    },
    message: 'success',
  };

export const providerLocationResponseWithServiceTypeAndSurveyFilterMock: IProviderLocationResponse =
  {
    location: {
      identifier: 'id-1',
      providerInfo: {
        providerName: 'provider-name',
      },
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      enabled: true,
      providerTaxId: 'provider-tax-id',
      serviceList: [
        {
          serviceName: 'fake-name',
          serviceDescription: 'fake-desc',
          questions: [],
          serviceType: 'COVID-19 Antigen Testing',
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          confirmationDescription: 'confirm-desc',
          duration: 15,
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
          status: 'everyone',
        },
      ],
      latitude: 40.694214,
      longitude: -73.96529,
      isTest: false,
      cliaNumber: '00000000',
      npiNumber: npiNumberMock,
    },
    service: {
      serviceType: 'COVID-19 Antigen Testing',
      serviceName: 'service-name-myrx',
      minimumAge: 3,
      schedulerMinimumAge: 18,
      confirmationDescriptionMyRx: 'confirm-desc',
      cancellationPolicyMyRx: 'cancellation policy text',
      aboutQuestionsDescriptionMyRx: 'primary person appointment text',
      aboutDependentDescriptionMyRx: 'dependent policy text',
      serviceDescription: 'service-desc',
      serviceNameMyRx: 'service-name-myrx',
      procedureCode: '87811',
    },
    message: 'success',
  };

export const providerLocationListEndpointResponseMock: IProviderLocationListEndpointResponse =
  {
    locations: [
      {
        id: 'id-1',
        providerName: 'provider',
        locationName: 'test-location',
        address: {
          line1: 'mock-address1',
          line2: 'mock-address2',
          city: 'mock-city',
          state: 'mock-state',
          zipCode: 'mock-zip',
        },
        phoneNumber: 'mock-phone',
        distanceMiles: 5,
      },
      {
        id: 'id-2',
        providerName: 'provider2',
        locationName: 'test-location2',
        address: {
          line1: 'mock2-address1',
          line2: 'mock2-address2',
          city: 'mock-city2',
          state: 'mock-state2',
          zipCode: 'mock-zip2',
        },
        phoneNumber: 'mock-phone2',
        distanceMiles: 3,
      },
      {
        id: 'id-3',
        providerName: 'provider3',
        locationName: 'test-location3',
        address: {
          line1: 'mock3-address1',
          line2: 'mock3-address2',
          city: 'mock-city3',
          state: 'mock-state3',
          zipCode: 'mock-zip3',
        },
        phoneNumber: 'mock-phone3',
        distanceMiles: 4,
      },
    ],
  };
