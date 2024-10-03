// Copyright 2022 Prescryptive Health, Inc.

import { ApiConstants } from '../../constants/api-constants';
import { ErrorConstants } from '../../constants/response-messages';
import { configurationMock } from '../../mock-data/configuration.mock';
import { IContactPoint } from '../../models/fhir/contact-point';
import { IHumanName } from '../../models/fhir/human-name';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { IPatient } from '../../models/fhir/patient/patient';
import { getPatientCoverageByQuery } from '../external-api/coverage/get-patient-coverage-by-query';
import { getPatientByPatientDetails } from '../external-api/identity/get-patient-by-patient-details';
import { getActiveCoveragesOfPatient } from '../fhir-patient/get-active-coverages-of-patient';
import { matchFirstName } from '../fhir/human-name.helper';
import { verifyPatientsByPhoneNumberAndOrMemberId } from './verify-patients-by-phone-number';

jest.mock('../external-api/identity/get-patient-by-patient-details');
const getPatientByPatientDetailsMock = getPatientByPatientDetails as jest.Mock;

jest.mock('../fhir/human-name.helper');
const matchFirstNameMock = matchFirstName as jest.Mock;

jest.mock('../external-api/coverage/get-patient-coverage-by-query');
const getPatientCoverageByQueryMock = getPatientCoverageByQuery as jest.Mock;

jest.mock('../fhir-patient/get-active-coverages-of-patient');
const getActiveCoveragesOfPatientMock =
  getActiveCoveragesOfPatient as jest.Mock;

describe('verifyPatientsByPhoneNumberAndOrMemberId', () => {
  it('returns failure response if patient if not found', async () => {
    getPatientByPatientDetailsMock.mockReturnValue([]);

    const actual = await verifyPatientsByPhoneNumberAndOrMemberId(
      configurationMock,
      false,
      'first-name-mock',
      'date-of-birth-mock',
      'member-id-mock',
      'phone-number-mock'
    );

    const expectedResponse = {
      errorDetails:
        ErrorConstants.ACTIVATION_PATIENT_PHONE_NUMBER_NOT_FOUND(
          'phone-number-mock'
        ),
      isValid: false,
    };

    expect(matchFirstNameMock).not.toBeCalled();
    expect(getPatientCoverageByQueryMock).not.toBeCalled();
    expect(getActiveCoveragesOfPatientMock).not.toBeCalled();

    expect(actual).toEqual(expectedResponse);
  });

  it('returns failure response if patient details does not match', async () => {
    const firstNameMock = 'first-name-mock';

    const phoneNumberMock = '1111111112';
    const phoneNumberWithCountryCodeMock = `${ApiConstants.COUNTRY_CODE}${phoneNumberMock}`;

    const telecomMock = [
      {
        system: 'phone',
        value: phoneNumberMock,
        use: 'mobile',
      },
    ] as IContactPoint[];

    const humanNameMock = [
      { family: 'family-mock', given: ['given-mock'] },
    ] as IHumanName[];

    const patientMock: IPatient = {
      resourceType: 'Patient',
      id: 'master-id-mock',
      name: humanNameMock,
      birthDate: 'birth-date-mock',
      telecom: telecomMock,
      meta: {
        security: [
          {
            system: 'http://prescryptive.io/tenant',
            code: 'myrx-tenant-id',
          },
        ],
      },
    };

    getPatientByPatientDetailsMock.mockReturnValue([patientMock]);

    matchFirstNameMock.mockReturnValue(undefined);

    const actual = await verifyPatientsByPhoneNumberAndOrMemberId(
      configurationMock,
      true,
      firstNameMock,
      'date-of-birth-mock',
      'member-id-mock',
      phoneNumberWithCountryCodeMock
    );

    const expectedResponse = {
      errorDetails: ErrorConstants.ACTIVATION_PATIENT_USER_DATA_MISMATCH,
      isValid: false,
    };

    expect(matchFirstNameMock).toHaveBeenCalledWith(
      firstNameMock,
      humanNameMock
    );
    expect(getPatientCoverageByQueryMock).not.toBeCalled();
    expect(getActiveCoveragesOfPatientMock).not.toBeCalled();

    expect(actual).toEqual(expectedResponse);
  });

  it('returns failure response if multiple pbm plans are found', async () => {
    const firstNameMock = 'given-mock';

    const phoneNumberMock = '1111111111';

    const phoneNumberWithCountryCodeMock = `${ApiConstants.COUNTRY_CODE}${phoneNumberMock}`;

    const masterIdMock = 'master-id-mock';

    const memberIdMock = 'subscriber-id-mock01';

    const telecomMock = [
      {
        system: 'phone',
        value: phoneNumberMock,
        use: 'mobile',
      },
    ] as IContactPoint[];

    const humanNameMock = [
      { family: 'family-mock', given: ['given-mock'] },
    ] as IHumanName[];

    const patientMock1: IPatient = {
      resourceType: 'Patient',
      id: masterIdMock,
      name: humanNameMock,
      birthDate: 'birth-date-mock',
      telecom: telecomMock,
      meta: {
        security: [
          {
            system: 'http://prescryptive.io/tenant',
            code: 'myrx-tenant-id',
          },
        ],
      },
    };

    const patientMock2: IPatient = {
      resourceType: 'Patient',
      id: masterIdMock,
      name: humanNameMock,
      birthDate: 'birth-date-mock',
      telecom: telecomMock,
      meta: {
        security: [
          {
            system: 'http://prescryptive.io/tenant',
            code: 'myrx-tenant-id',
          },
        ],
      },
    };

    getPatientByPatientDetailsMock.mockReturnValue([
      patientMock1,
      patientMock2,
    ]);

    matchFirstNameMock.mockReturnValue(humanNameMock);

    const actual = await verifyPatientsByPhoneNumberAndOrMemberId(
      configurationMock,
      true,
      firstNameMock,
      'birth-date-mock',
      memberIdMock,
      phoneNumberWithCountryCodeMock
    );

    const expectedResponse = {
      errorDetails: ErrorConstants.ACTIVATION_PATIENT_MULTIPLE_PBM_PLANS(
        phoneNumberWithCountryCodeMock
      ),
      isValid: false,
    };

    expect(matchFirstNameMock).toHaveBeenCalledWith(
      firstNameMock,
      humanNameMock
    );

    expect(actual).toEqual(expectedResponse);
  });

  it('returns failure response if no coverages are found', async () => {
    const firstNameMock = 'given-mock';

    const phoneNumberMock = '1111111111';

    const masterIdMock = 'master-id-mock';

    const memberIdMock = 'subscriber-id-mock01';

    const telecomMock = [
      {
        system: 'phone',
        value: phoneNumberMock,
        use: 'mobile',
      },
    ] as IContactPoint[];

    const humanNameMock = [
      { family: 'family-mock', given: ['given-mock'] },
    ] as IHumanName[];

    const patientMock: IPatient = {
      resourceType: 'Patient',
      id: masterIdMock,
      name: humanNameMock,
      birthDate: 'birth-date-mock',
      telecom: telecomMock,
      meta: {
        security: [
          {
            system: 'http://prescryptive.io/tenant',
            code: 'myrx-tenant-id',
          },
        ],
      },
    };

    getPatientByPatientDetailsMock.mockReturnValue([patientMock]);

    matchFirstNameMock.mockReturnValue(humanNameMock);

    getPatientCoverageByQueryMock.mockReturnValue([]);

    const actual = await verifyPatientsByPhoneNumberAndOrMemberId(
      configurationMock,
      true,
      firstNameMock,
      'birth-date-mock',
      memberIdMock,
      '+11111111111'
    );

    const expectedResponse = {
      errorDetails:
        ErrorConstants.ACTIVATION_PATIENT_COVERAGES_NOT_FOUND(masterIdMock),
      isValid: false,
    };

    expect(matchFirstNameMock).toHaveBeenCalledWith(
      firstNameMock,
      humanNameMock
    );

    const queryMock = 'beneficiary=patient/master-id-mock';

    expect(getPatientCoverageByQueryMock).toHaveBeenCalledWith(
      configurationMock,
      queryMock
    );
    expect(getActiveCoveragesOfPatientMock).not.toBeCalled();

    expect(actual).toEqual(expectedResponse);
  });

  it('returns valid response if patient details match', async () => {
    const firstNameMock = 'given-mock';

    const phoneNumberMock = '1111111111';

    const masterIdMock = 'master-id-mock';

    const memberIdMock = 'subscriber-id-mock01';

    const telecomMock = [
      {
        system: 'phone',
        value: phoneNumberMock,
        use: 'mobile',
      },
    ] as IContactPoint[];

    const humanNameMock = [
      { family: 'family-mock', given: ['given-mock'] },
    ] as IHumanName[];

    const patientMock: IPatient = {
      resourceType: 'Patient',
      id: masterIdMock,
      name: humanNameMock,
      birthDate: 'birth-date-mock',
      telecom: telecomMock,
      meta: {
        security: [
          {
            system: 'http://prescryptive.io/tenant',
            code: 'myrx-tenant-id',
          },
        ],
      },
    };

    const coverageResponseMock: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      status: 'active',
      subscriberId: 'subscriber-id-mock',
      dependent: '01',
    };

    getPatientByPatientDetailsMock.mockReturnValue([patientMock]);

    matchFirstNameMock.mockReturnValue(humanNameMock);

    getPatientCoverageByQueryMock.mockReturnValue([coverageResponseMock]);

    getActiveCoveragesOfPatientMock.mockReturnValue([coverageResponseMock]);

    const actual = await verifyPatientsByPhoneNumberAndOrMemberId(
      configurationMock,
      true,
      firstNameMock,
      'birth-date-mock',
      memberIdMock,
      '+11111111111'
    );

    const expectedResponse = {
      activationPatientMasterId: masterIdMock,
      activationPatientMemberId: memberIdMock,
      isValid: true,
    };

    expect(matchFirstNameMock).toHaveBeenCalledWith(
      firstNameMock,
      humanNameMock
    );

    const queryMock = 'beneficiary=patient/master-id-mock';

    expect(getPatientCoverageByQueryMock).toHaveBeenCalledWith(
      configurationMock,
      queryMock
    );
    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledWith([
      coverageResponseMock,
    ]);

    expect(actual).toEqual(expectedResponse);
  });
});
