// Copyright 2022 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { configurationMock } from '../mock-data/configuration.mock';
import { IContactPoint } from '../models/fhir/contact-point';
import { Identifier } from '../models/fhir/identifier';
import {
  IPatient,
  PatientIdentifierCodeableConceptCode,
} from '../models/fhir/patient/patient';
import { getPatientByPatientDetails } from './external-api/identity/get-patient-by-patient-details';
import {
  getDependentByPatientDetails,
  IGetDependentByPatientDetailsProps,
} from './get-dependent-by-person-details';

jest.mock('./external-api/identity/get-patient-by-patient-details');
const getPatientByPatientDetailsMock = getPatientByPatientDetails as jest.Mock;

describe('getDependentByPatientDetails', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('returns undefined if dependent patient details do not match', async () => {
    const patientMock: IPatient = {
      resourceType: 'Patient',
      id: 'master-id-mock',
      name: [{ use: 'official', family: 'family-mock', given: ['given-mock'] }],
      birthDate: 'birthdate-mock',
    };

    const patientResponseMock: IPatient[] = [patientMock];

    const getDependentByPatientDetailsPropsMock: IGetDependentByPatientDetailsProps =
      {
        firstName: 'not-match-given-mock',
        familyName: 'family-mock',
        birthDate: 'birthdate-mock',
        phoneNumber: 'phone-number-mock',
      };

    getPatientByPatientDetailsMock.mockReturnValue([patientResponseMock]);

    const actual = await getDependentByPatientDetails(
      configurationMock,
      getDependentByPatientDetailsPropsMock
    );

    expect(actual).toEqual(undefined);
  });

  it('returns dependent patient details if dependent patient details match', async () => {
    const firstNameMock = 'given-mock';
    const familyNameMock = 'family-mock';
    const birthDateMock = 'birthdate-mock';
    const phoneNumberMock = '+11111111111';
    const primaryMemberRxIdMock = 'MYRX-ID';
    const masterIdMock = 'master-id';

    const patientMock: IPatient = {
      resourceType: 'Patient',
      id: masterIdMock,
      name: [
        { use: 'official', family: familyNameMock, given: [firstNameMock] },
      ],
      birthDate: birthDateMock,
      identifier: [
        {
          type: {
            coding: [
              {
                system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                code: 'MYRX-PHONE',
                display: "Patient's MyRx Phone Number",
              },
            ],
          },
          value: phoneNumberMock,
        } as Identifier,
        {
          type: {
            coding: [
              {
                system: 'http://hl7.org/fhir/ValueSet/identifier-type',
                code: PatientIdentifierCodeableConceptCode.MEMBER_ID,
                display: 'Unique MyRx ID',
              },
            ],
          },
          value: primaryMemberRxIdMock,
        } as Identifier,
      ],
      telecom: [
        {
          system: 'phone',
          value: '9999999999',
          use: 'mobile',
          period: {
            start: '2005-01-01',
            end: '2015-01-01',
          },
        },
        {
          system: 'phone',
          value: '2222222222',
          use: 'home',
        } as IContactPoint,
        {
          system: 'phone',
          value: '1111111111',
          use: 'mobile',
        } as IContactPoint,
        {
          system: 'phone',
          value: '3333333333',
          use: 'work',
        } as IContactPoint,
      ],
    };

    const patientResponseMock: IPatient[] = [patientMock];

    const getDependentByPatientDetailsPropsMock: IGetDependentByPatientDetailsProps =
      {
        firstName: firstNameMock,
        familyName: familyNameMock,
        birthDate: birthDateMock,
        phoneNumber: phoneNumberMock,
      };

    getPatientByPatientDetailsMock.mockResolvedValue(patientResponseMock);

    const actual = await getDependentByPatientDetails(
      configurationMock,
      getDependentByPatientDetailsPropsMock
    );

    const expectedDependentPersonDetails: Partial<IPerson> = {
      firstName: firstNameMock,
      lastName: familyNameMock,
      dateOfBirth: birthDateMock,
      phoneNumber: phoneNumberMock,
      primaryMemberRxId: primaryMemberRxIdMock,
      masterId: masterIdMock,
    };

    expect(actual).toEqual(expectedDependentPersonDetails as IPerson);
  });
});
