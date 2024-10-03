// Copyright 2020 Prescryptive Health, Inc.

import {
  updateAnswer,
  initializeAppointmentQuestions,
} from './appointment.screen.helper';
import { IServiceInfo } from '../../../models/api-response/provider-location-details-response';

describe('initializeAppointmentQuestions ', () => {
  it('Create initial questions based on selected location', () => {
    const service: IServiceInfo = {
      serviceName: 'COVID-19 AntiBody Test',
      serviceType: 'COVID-19 Antigen Testing',
      questions: [
        {
          id: '1',
          label:
            'Vehicle - Make / Model / Color (appointment will be delayed if vehicle is not correct)',
          markdownLabel:
            '**Vehicle - Make / Model / Color (appointment will be delayed if vehicle is not correct)**',
          isRequired: true,
          type: 'text',
          priority: 900,
          validation: '^.{3,}$',
          errorMessage: 'Error',
        },
        {
          id: '2',
          label: 'Medication Allergies',
          markdownLabel: '**Medication Allergies**',
          description: 'Enter none if no allergies',
          isRequired: true,
          type: 'text',
          priority: 901,
        },
        {
          id: '3',
          label: 'Chronic Conditions',
          markdownLabel: '**Chronic Conditions**',
          isRequired: false,
          type: 'text',
          priority: 902,
        },
      ],
      screenTitle: 'Schedule Appointment',
      screenDescription:
        'Choose appointment date and time. Testing takes approximately 15 minutes.',
      minLeadDays: 'P6D',
      maxLeadDays: 'P30D',
    };

    const expectedState = [
      {
        questionId: '1',
        questionText:
          'Vehicle - Make / Model / Color (appointment will be delayed if vehicle is not correct)',
        answer: '',
        required: true,
      },
      {
        questionId: '2',
        questionText: 'Medication Allergies',
        answer: '',
        required: true,
      },
      {
        questionId: '3',
        questionText: 'Chronic Conditions',
        answer: '',
        required: false,
      },
    ];
    expect(initializeAppointmentQuestions(service)).toEqual(expectedState);
  });
});

describe('updateAnswer ', () => {
  it('update answer for the index', () => {
    const currentAnswers = [
      {
        questionId: '1',
        questionText:
          'Vehicle - Make / Model / Color (appointment will be delayed if vehicle is not correct)',
        answer: '',
      },
      {
        questionId: '2',
        questionText: 'Medication Allergies',
        answer: '',
      },
      {
        questionId: '3',
        questionText: 'Chronic Conditions',
        answer: '',
      },
    ];

    const expectedState = [
      {
        questionId: '1',
        questionText:
          'Vehicle - Make / Model / Color (appointment will be delayed if vehicle is not correct)',
        answer: '',
      },
      {
        questionId: '2',
        questionText: 'Medication Allergies',
        answer: 'test',
      },
      {
        questionId: '3',
        questionText: 'Chronic Conditions',
        answer: '',
      },
    ];
    expect(updateAnswer(currentAnswers, '2', 'test')).toEqual(expectedState);
  });
});
