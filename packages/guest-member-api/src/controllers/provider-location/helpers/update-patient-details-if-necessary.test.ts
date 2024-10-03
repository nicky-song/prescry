// Copyright 2020 Prescryptive Health, Inc.

import { Request } from 'express';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { IPatient } from '../../../models/fhir/patient/patient';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { updatePatientByMasterId } from '../../../utils/external-api/identity/update-patient-by-master-id';
import { updatePatientDetailsIfNecessary } from './update-patient-details-if-necessary';
import { IQuestionAnswer } from '@phx/common/src/models/question-answer';

jest.mock('@phx/common/src/utils/date-time-helper');
const utcDateStringMock = UTCDateString as jest.Mock;

jest.mock('../../../utils/external-api/identity/update-patient-by-master-id');
const updatePatientByMasterIdMock = updatePatientByMasterId as jest.Mock;

describe('updatePatientDetailsIfNecessary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    utcDateStringMock.mockReturnValue('2000-02-02');
  });

  it('updates patient object and publishes changes if patientInfo is present but missing address information', async () => {
    const cashPatientInfoInvalidAddress = {
      address: [
        {
          line: [' '],
          city: 'city',
          state: 'state',
          postalCode: 'zip',
          use: 'home',
          type: 'physical',
        },
      ],
      id: 'test',
    } as IPatient;
    const request = {
      body: {
        memberAddress: {
          address1: 'personaddr1',
          address2: 'personaddr2',
          county: 'fakecounty',
          state: 'wa',
          zip: '11111',
          city: 'fakecity',
        },
      },
    } as Request;
    const expected = {
      address: [
        {
          line: ['PERSONADDR1', 'PERSONADDR2'],
          city: 'FAKECITY',
          state: 'WA',
          postalCode: '11111',
          use: 'home',
          type: 'physical',
        },
      ],
      id: 'test',
    } as IPatient;
    const actual = await updatePatientDetailsIfNecessary(
      request,
      cashPatientInfoInvalidAddress,
      configurationMock
    );
    expect(actual).toEqual(expected);
    expect(updatePatientByMasterIdMock).toBeCalledWith(
      expected.id,
      expected,
      configurationMock
    );
  });

  it('Trims name and address fields before publishing to the topic', async () => {
    const cashPatientInfoInvalidAddress = {
      address: [
        {
          line: [' '],
          city: 'city',
          state: 'state',
          postalCode: 'zip',
          use: 'home',
          type: 'physical',
        },
      ],
      id: 'test',
    } as IPatient;
    const request = {
      body: {
        memberAddress: {
          address1: 'persona  ddr1   ',
          address2: '  personaddr2   ',
          county: '  fakecounty',
          state: 'wa',
          zip: '11111',
          city: 'fakecity',
        },
      },
    } as Request;

    const expected = {
      address: [
        {
          line: ['PERSONA  DDR1', 'PERSONADDR2'],
          city: 'FAKECITY',
          state: 'WA',
          postalCode: '11111',
          use: 'home',
          type: 'physical',
        },
      ],
      id: 'test',
    } as IPatient;
    const actual = await updatePatientDetailsIfNecessary(
      request,
      cashPatientInfoInvalidAddress,
      configurationMock
    );
    expect(actual).toEqual(expected);
    expect(updatePatientByMasterIdMock).toBeCalledWith(
      expected.id,
      expected,
      configurationMock
    );
  });

  it('updates patient object and publishes changes if gender answer is included in questions', async () => {
    const cashPatientInfoInvalidAddress = {
      address: [
        {
          line: [' '],
          city: 'city',
          state: 'state',
          postalCode: 'zip',
          use: 'home',
          type: 'physical',
        },
      ],
      id: 'test',
    } as IPatient;
    const genderQuestion: IQuestionAnswer = {
      questionText: 'question text',
      questionId: 'patient-gender',
      answer: 'other',
    };
    const request = {
      body: {
        memberAddress: {
          address1: 'personaddr1',
          address2: 'personaddr2',
          county: 'fakecounty',
          state: 'wa',
          zip: '11111',
          city: 'fakecity',
        },
        questions: [genderQuestion],
      },
    } as Request;
    const expected = {
      address: [
        {
          line: ['PERSONADDR1', 'PERSONADDR2'],
          city: 'FAKECITY',
          state: 'WA',
          postalCode: '11111',
          use: 'home',
          type: 'physical',
        },
      ],
      gender: 'other',
      id: 'test',
    } as IPatient;
    const actual = await updatePatientDetailsIfNecessary(
      request,
      cashPatientInfoInvalidAddress,
      configurationMock
    );
    expect(actual).toEqual(expected);
    expect(updatePatientByMasterIdMock).toBeCalledWith(
      expected.id,
      expected,
      configurationMock
    );
  });
});
