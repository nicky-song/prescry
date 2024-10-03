// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IHumanName } from '../../../models/fhir/human-name';
import { ICoverage } from '../../../models/fhir/patient-coverage/coverage';
import { IPatient } from '../../../models/fhir/patient/patient';
import { getActiveCoveragesOfPatient } from '../../../utils/fhir-patient/get-active-coverages-of-patient';
import { matchFirstName } from '../../../utils/fhir/human-name.helper';
import { getMasterIdFromCoverage } from '../../../utils/get-master-id-from-coverage.helper';
import { getPatientByMasterId } from '../../../utils/external-api/identity/get-patient-by-master-id';
import {
  invalidMemberDetailsResponse,
  invalidMemberRxIdResponse,
} from '../../login/helpers/login-response.helper';
import { membershipVerificationHelperV2 } from './membership-verification-v2.helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { membershipVerificationHelper } from './membership-verification.helper';
import { ICoding } from '../../../models/fhir/coding';
import { getPatientCoverageByMemberId } from '../../../utils/coverage/get-patient-coverage-by-member-id';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { getPatientCoverageByFamilyId } from '../../../utils/coverage/get-patient-coverage-by-family-id';
import { getCoverageRecordsByFirstName } from '../../../utils/coverage/get-coverage-records-by-first-name';
import { getMobileContactPhone } from '../../../utils/fhir-patient/get-contact-info-from-patient';

jest.mock('../../../utils/fhir-patient/get-contact-info-from-patient');
const getMobileContactPhoneMock = getMobileContactPhone as jest.Mock;

jest.mock('../../../utils/coverage/get-patient-coverage-by-member-id');
const getPatientCoverageByMemberIdMock =
  getPatientCoverageByMemberId as jest.Mock;

jest.mock('../../../utils/coverage/get-patient-coverage-by-family-id');
const getPatientCoverageByFamilyIdMock =
  getPatientCoverageByFamilyId as jest.Mock;

jest.mock('../../../utils/fhir-patient/get-active-coverages-of-patient');
const getActiveCoveragesOfPatientMock =
  getActiveCoveragesOfPatient as jest.Mock;

jest.mock('../../../utils/get-master-id-from-coverage.helper');
const getMasterIdFromCoverageMock = getMasterIdFromCoverage as jest.Mock;

jest.mock('../../../utils/external-api/identity/get-patient-by-master-id');
const getPatientByMasterIdMock = getPatientByMasterId as jest.Mock;

jest.mock('../../../utils/fhir/human-name.helper');
const matchFirstNameMock = matchFirstName as jest.Mock;

jest.mock('../../login/helpers/login-response.helper');
const invalidMemberDetailsResponseMock =
  invalidMemberDetailsResponse as jest.Mock;

const invalidMemberRxIdResponseMock = invalidMemberRxIdResponse as jest.Mock;

jest.mock('./membership-verification.helper');
const membershipVerificationHelperMock =
  membershipVerificationHelper as jest.Mock;

jest.mock('../../../utils/coverage/get-coverage-records-by-first-name');
const getCoverageRecordsByFirstNameMock =
  getCoverageRecordsByFirstName as jest.Mock;

describe('membershipVerificationHelperV2', () => {
  const primaryMemberRxIdMock = '1234567890';
  const firstNameMock = 'Johnny';
  const lastNameMock = 'Appleseed';
  const dateOfBirthMock = '2000-01-01';
  const databaseMock = {} as IDatabase;
  const phoneNumberMock = '+12222222222';

  beforeEach(() => {
    jest.clearAllMocks();

    getPatientCoverageByFamilyIdMock.mockResolvedValue(undefined);
    getPatientCoverageByMemberIdMock.mockResolvedValue(undefined);
  });

  it('returns error response if any exception occurs', async () => {
    getPatientCoverageByFamilyIdMock.mockImplementationOnce(() => {
      throw new Error('Unknown error');
    });

    const actual = await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      responseMessage: ErrorConstants.INTERNAL_SERVER_ERROR,
    });
  });

  it('getPatientCoverageByQueryEndpointHelper is called to get patient coverages', async () => {
    await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      getPatientCoverageByMemberIdMock,
      configurationMock,
      primaryMemberRxIdMock
    );
  });

  it('returns failure response if no patient coverages', async () => {
    invalidMemberRxIdResponseMock.mockReturnValue({
      isValidMembership: false,
      responseCode: HttpStatusCodes.NOT_FOUND,
      responseMessage: ErrorConstants.INVALID_MEMBER_RXID,
    });

    const actual = await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    getPatientCoverageByMemberIdMock.mockResolvedValue([]);
    getPatientCoverageByFamilyIdMock.mockResolvedValue([]);

    expect(invalidMemberRxIdResponseMock).toHaveBeenCalledWith(
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );

    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.NOT_FOUND,
      responseMessage: ErrorConstants.INVALID_MEMBER_RXID,
    });
  });

  it('getActiveCoveragesOfPatient is called to get active coverages of patient', async () => {
    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/MASTER-ID-MOCK',
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
    };

    const coverageResponseMock2: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/MASTER-ID-MOCK',
      },
      period: {
        start: '2022-03-01',
        end: '2022-05-01',
      },
    };

    const coveragesMock: ICoverage[] = [
      coverageResponseMock1 as ICoverage,
      coverageResponseMock2 as ICoverage,
    ];

    getPatientCoverageByMemberIdMock.mockResolvedValue(coveragesMock);

    await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledWith(coveragesMock);
  });

  it('returns failure response if no active coverages for patient', async () => {
    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/MASTER-ID-MOCK',
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
    };

    const coverageResponseMock2: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/MASTER-ID-MOCK',
      },
      period: {
        start: '2022-03-01',
        end: '2022-05-01',
      },
    };

    const coveragesMock: ICoverage[] = [
      coverageResponseMock1 as ICoverage,
      coverageResponseMock2 as ICoverage,
    ];

    getPatientCoverageByMemberIdMock.mockResolvedValue(coveragesMock);

    getActiveCoveragesOfPatientMock.mockReturnValue([]);

    const actual = await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledWith(coveragesMock);

    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.BAD_REQUEST,
      responseMessage: ErrorConstants.ACTIVE_COVERAGES_NOT_FOUND,
    });
  });

  it('returns failure response if there are more than one active coverage with different tenantId for patient', async () => {
    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/MASTER-ID-MOCK',
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
      identifier: [
        {
          type: {
            coding: [
              {
                code: 'tenantid',
              },
            ],
            text: 'tenant-id-text-mock',
          },
          value: 'tenant-id-mock',
        },
      ],
    };

    const coverageResponseMock2: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/MASTER-ID-MOCK',
      },
      period: {
        start: '2022-03-01',
        end: '2022-05-01',
      },
      identifier: [
        {
          type: {
            coding: [
              {
                code: 'tenantid',
              },
            ],
            text: 'tenant-id-text-mock',
          },
          value: 'tenant-id-mock',
        },
      ],
    };

    const coveragesMock: ICoverage[] = [
      coverageResponseMock1 as ICoverage,
      coverageResponseMock2 as ICoverage,
    ];

    getPatientCoverageByMemberIdMock.mockResolvedValue(coveragesMock);

    getActiveCoveragesOfPatientMock.mockReturnValue(coveragesMock);

    const actual = await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledWith(coveragesMock);

    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.BAD_REQUEST,
      responseMessage: ErrorConstants.COVERAGE_INVALID_DATA,
    });
  });

  it('returns failure response if there are more than one active coverage and tenant id is missing in identifier for patient', async () => {
    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/MASTER-ID-MOCK',
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
      identifier: [],
    };

    const coverageResponseMock2: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/MASTER-ID-MOCK',
      },
      period: {
        start: '2022-03-01',
        end: '2022-05-01',
      },
      identifier: [],
    };

    const coveragesMock: ICoverage[] = [
      coverageResponseMock1 as ICoverage,
      coverageResponseMock2 as ICoverage,
    ];

    getPatientCoverageByMemberIdMock.mockResolvedValue(coveragesMock);

    getActiveCoveragesOfPatientMock.mockReturnValue(coveragesMock);

    const actual = await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledWith(coveragesMock);

    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.BAD_REQUEST,
      responseMessage: ErrorConstants.COVERAGE_INVALID_DATA,
    });
  });

  it('returns failure response if there are more than one active coverage for patient', async () => {
    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/MASTER-ID-MOCK',
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
    };

    const coverageResponseMock2: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/MASTER-ID-MOCK',
      },
      period: {
        start: '2022-03-01',
        end: '2022-05-01',
      },
    };

    const coveragesMock: ICoverage[] = [
      coverageResponseMock1 as ICoverage,
      coverageResponseMock2 as ICoverage,
    ];

    getPatientCoverageByMemberIdMock.mockResolvedValue(coveragesMock);

    getActiveCoveragesOfPatientMock.mockReturnValue(coveragesMock);

    const actual = await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledWith(coveragesMock);

    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.BAD_REQUEST,
      responseMessage: ErrorConstants.COVERAGE_INVALID_DATA,
    });
  });

  it('returns failure response if there is no patient information', async () => {
    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: 'https://gears.prescryptive.io/patient/',
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
    };

    const coveragesMock: ICoverage[] = [coverageResponseMock1 as ICoverage];

    getPatientCoverageByMemberIdMock.mockResolvedValue(coveragesMock);

    getActiveCoveragesOfPatientMock.mockReturnValue(coveragesMock);

    const actual = await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledWith(coveragesMock);

    expect(getMasterIdFromCoverageMock).toHaveBeenCalledWith(
      coverageResponseMock1
    );

    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.BAD_REQUEST,
      responseMessage: ErrorConstants.INVALID_PATIENT_IDENTITY_DATA,
    });
  });

  it('returns failure response if patient data do not match', async () => {
    const invalidGivenNameMock = 'invalid-given-mock';
    const patientMock: IPatient = {
      name: [{ family: 'family-mock', given: [invalidGivenNameMock] }],
      birthDate: 'birthdate-mock',
    };

    const masterIdMock = 'MASTER-ID-MOCK';

    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: `https://gears.prescryptive.io/patient/${masterIdMock}`,
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
    };

    const coveragesMock: ICoverage[] = [coverageResponseMock1 as ICoverage];

    getPatientCoverageByMemberIdMock.mockResolvedValue(coveragesMock);

    getActiveCoveragesOfPatientMock.mockReturnValue(coveragesMock);

    getPatientByMasterIdMock.mockResolvedValue(patientMock);

    getMasterIdFromCoverageMock.mockReturnValue(masterIdMock);

    await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledWith(coveragesMock);

    expect(getMasterIdFromCoverageMock).toHaveBeenCalledWith(
      coverageResponseMock1
    );

    expect(matchFirstNameMock).toHaveBeenCalledWith(
      firstNameMock,
      patientMock.name
    );

    expect(invalidMemberDetailsResponseMock).toBeCalledWith(
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
  });

  it('returns failure response if patient data do not match with activation phone number patient record', async () => {
    const validGivenNameMock = 'given-mock';
    const patientMock: IPatient = {
      name: [{ family: 'family-mock', given: [validGivenNameMock] }],
      birthDate: dateOfBirthMock,
      telecom: [
        {
          system: 'phone',
          value: 'phone-number-mock',
          use: 'mobile',
        },
      ],
    };

    const masterIdMock = 'MASTER-ID-MOCK';

    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: 'MOCK-ID',
      beneficiary: {
        reference: `patient/${masterIdMock}`,
      },
      period: {
        start: '2022-01-01',
        end: '9999-03-01',
      },
    };
    const patientNameMock: IHumanName[] = [
      { family: 'family-mock', given: [validGivenNameMock] },
    ];

    const coveragesMock: ICoverage[] = [coverageResponseMock1 as ICoverage];

    getPatientCoverageByMemberIdMock.mockResolvedValue(coveragesMock);

    getActiveCoveragesOfPatientMock.mockReturnValue(coveragesMock);

    getPatientByMasterIdMock.mockResolvedValue(patientMock);

    getMasterIdFromCoverageMock.mockReturnValue(masterIdMock);

    matchFirstNameMock.mockReturnValue(patientNameMock);

    getMobileContactPhoneMock.mockReturnValueOnce(phoneNumberMock);

    const actual = await membershipVerificationHelperV2(
      databaseMock,
      'invalid-phone-number',
      firstNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledWith(coveragesMock);

    expect(getMasterIdFromCoverageMock).toHaveBeenCalledWith(
      coverageResponseMock1
    );

    expect(matchFirstNameMock).toHaveBeenCalledWith(
      firstNameMock,
      patientMock.name
    );

    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.BAD_REQUEST,
      responseMessage: ErrorConstants.ACTIVATION_PATIENT_USER_DATA_MISMATCH,
    });
  });

  it('returns success response if patient data matches', async () => {
    const validGivenNameMock = 'given-mock';
    const patientMock: IPatient = {
      name: [{ family: 'family-mock', given: [validGivenNameMock] }],
      birthDate: dateOfBirthMock,
    };

    const masterIdMock = 'MASTER-ID-MOCK';
    const beneficiaryReferenceMock = `https://gears.prescryptive.io/patient/${masterIdMock}`;

    const subscriberIdMock = 'subscriber-id-mock';
    const dependentMock = '01';

    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: masterIdMock,
      beneficiary: {
        reference: beneficiaryReferenceMock,
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
      subscriberId: subscriberIdMock,
      dependent: dependentMock,
    };
    const memberPersonMock = {
      identifier: '123',
      memberId: 'member-id',
    };
    const patientNameMock: IHumanName[] = [
      { family: 'family-mock', given: [validGivenNameMock] },
    ];

    const coveragesMock: ICoverage[] = [coverageResponseMock1 as ICoverage];

    getPatientCoverageByMemberIdMock.mockResolvedValue(coveragesMock);

    getActiveCoveragesOfPatientMock.mockReturnValue(coveragesMock);

    getPatientByMasterIdMock.mockResolvedValue(patientMock);

    getMasterIdFromCoverageMock.mockReturnValue(masterIdMock);

    matchFirstNameMock.mockReturnValue(patientNameMock);

    membershipVerificationHelperMock.mockReturnValueOnce({
      isValidMembership: true,
      member: memberPersonMock,
    });
    const actual = await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      validGivenNameMock,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledWith(coveragesMock);

    expect(getMasterIdFromCoverageMock).toHaveBeenCalledWith(
      coverageResponseMock1
    );

    expect(matchFirstNameMock).toHaveBeenCalledWith(
      validGivenNameMock,
      patientMock.name
    );

    const expectedMemberId = subscriberIdMock + dependentMock;

    expect(actual).toEqual({
      isValidMembership: true,
      masterId: masterIdMock,
      memberId: expectedMemberId,
      member: memberPersonMock,
    });
  });

  it('returns failure response when family-id is passed and multiple coverages match first name', async () => {
    const validGivenNameMock1 = 'given-mock';
    const validGivenNameMock2 = 'given-mock';
    const patientMock1: IPatient = {
      name: [{ family: 'family-mock-1', given: [validGivenNameMock1] }],
      birthDate: dateOfBirthMock,
    };

    const patientMock2: IPatient = {
      name: [{ family: 'family-mock-2', given: [validGivenNameMock2] }],
      birthDate: dateOfBirthMock,
    };

    const masterIdMock1 = 'MASTER-ID-MOCK-111';
    const masterIdMock2 = 'MASTER-ID-MOCK-222';
    const beneficiaryReferenceMock1 = `patient/${masterIdMock1}`;
    const beneficiaryReferenceMock2 = `patient/${masterIdMock2}`;

    const securityMock1: ICoding = {
      system: 'http://prescryptive.io/tenant',
      code: 'tenant-id-mock1',
    };

    const securityMock2: ICoding = {
      system: 'http://prescryptive.io/tenant',
      code: 'tenant-id-mock2',
    };

    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: masterIdMock1,
      beneficiary: {
        reference: beneficiaryReferenceMock1,
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
      identifier: [
        {
          type: {
            coding: [
              {
                code: 'tenantId',
              },
            ],
          },
          value: 'value-mock-1',
        },
      ],
      meta: {
        security: [securityMock1],
      },
    };

    const coverageResponseMock2: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: masterIdMock2,
      beneficiary: {
        reference: beneficiaryReferenceMock2,
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
      identifier: [
        {
          type: {
            coding: [
              {
                code: 'tenantId',
              },
            ],
          },
          value: 'value-mock-2',
        },
      ],
      meta: {
        security: [securityMock2],
      },
    };

    const patientNameMock1: IHumanName[] = [
      { family: 'family-mock-1', given: [validGivenNameMock1] },
    ];

    const patientNameMock2: IHumanName[] = [
      { family: 'family-mock-2', given: [validGivenNameMock2] },
    ];

    const coveragesMock: ICoverage[] = [
      coverageResponseMock1 as ICoverage,
      coverageResponseMock2 as ICoverage,
    ];

    getPatientCoverageByMemberIdMock.mockResolvedValue([]);
    getPatientCoverageByFamilyIdMock.mockResolvedValue(coveragesMock);
    getCoverageRecordsByFirstNameMock.mockReturnValue(coveragesMock);

    getPatientByMasterIdMock
      .mockResolvedValueOnce(patientMock1)
      .mockResolvedValue(patientMock2);

    getActiveCoveragesOfPatientMock.mockReturnValue(coveragesMock);

    getMasterIdFromCoverageMock
      .mockReturnValueOnce(masterIdMock1)
      .mockReturnValue(masterIdMock2);

    matchFirstNameMock
      .mockReturnValueOnce(patientNameMock1)
      .mockReturnValue(patientNameMock2);

    const actual = await membershipVerificationHelperV2(
      databaseMock,
      phoneNumberMock,
      validGivenNameMock2,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(actual).toEqual({
      isValidMembership: false,
      responseCode: HttpStatusCodes.BAD_REQUEST,
      responseMessage: ErrorConstants.COVERAGE_INVALID_DATA,
    });
  });

  it('returns success response when family id is passed', async () => {
    const validGivenNameMock1 = 'given-mock';
    const validGivenNameMock2 = 'given-mock-2';
    const patientMock1: IPatient = {
      name: [{ family: 'family-mock-1', given: [validGivenNameMock1] }],
      birthDate: dateOfBirthMock,
    };

    const patientMock2: IPatient = {
      name: [{ family: 'family-mock-2', given: [validGivenNameMock2] }],
      birthDate: dateOfBirthMock,
    };

    const masterIdMock1 = 'MASTER-ID-MOCK-1';
    const masterIdMock2 = 'MASTER-ID-MOCK-111';
    const beneficiaryReferenceMock1 = `patient/${masterIdMock1}`;
    const beneficiaryReferenceMock2 = `patient/${masterIdMock2}`;

    const subscriberIdMock1 = 'subscriber-id-mock-1';

    const dependentMock1 = '01';

    const subscriberIdMock2 = 'subscriber-id-mock-2';

    const dependentMock2 = '02';

    const securityMock1: ICoding = {
      system: 'http://prescryptive.io/tenant',
      code: configurationMock.myrxIdentityTenantId,
    };

    const securityMock2: ICoding = {
      system: 'http://prescryptive.io/tenant',
      code: 'tenant-id-mock2',
    };

    const coverageResponseMock1: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: masterIdMock1,
      beneficiary: {
        reference: beneficiaryReferenceMock1,
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
      subscriberId: subscriberIdMock1,
      dependent: dependentMock1,
      meta: {
        security: [securityMock1],
      },
    };

    const coverageResponseMock2: Partial<ICoverage> = {
      resourceType: 'Coverage',
      id: masterIdMock2,
      beneficiary: {
        reference: beneficiaryReferenceMock2,
      },
      period: {
        start: '2022-01-01',
        end: '2022-03-01',
      },
      identifier: [
        {
          type: {
            coding: [
              {
                code: 'tenantId',
              },
            ],
          },
          value: 'value-mock-2',
        },
      ],
      subscriberId: subscriberIdMock2,
      dependent: dependentMock2,
      meta: {
        security: [securityMock2],
      },
    };

    const patientNameMock1: IHumanName[] = [
      { family: 'family-mock-1', given: [validGivenNameMock1] },
    ];

    const coveragesMock: ICoverage[] = [
      coverageResponseMock1 as ICoverage,
      coverageResponseMock2 as ICoverage,
    ];

    const expectedMemberId = subscriberIdMock2 + dependentMock2;

    const memberPersonMock = {
      identifier: '123',
      memberId: expectedMemberId,
    };

    getPatientCoverageByMemberIdMock.mockResolvedValue([]);

    getPatientCoverageByFamilyIdMock.mockResolvedValue(coveragesMock);

    getCoverageRecordsByFirstNameMock.mockReturnValue(coveragesMock);

    getActiveCoveragesOfPatientMock.mockReturnValue([coverageResponseMock2]);

    getPatientByMasterIdMock.mockResolvedValue(patientMock2);

    getMasterIdFromCoverageMock.mockResolvedValue(masterIdMock2);

    matchFirstNameMock.mockReturnValue(patientNameMock1);

    membershipVerificationHelperMock.mockReturnValueOnce({
      isValidMembership: true,
      member: memberPersonMock,
    });

    const actual = await membershipVerificationHelperV2(
      databaseMock,
      'phone-number-mock',
      validGivenNameMock1,
      lastNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );

    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledWith(coveragesMock);

    expect(getMasterIdFromCoverageMock).toHaveBeenNthCalledWith(
      1,
      coverageResponseMock2
    );

    expect(matchFirstNameMock).toHaveBeenNthCalledWith(
      1,
      validGivenNameMock1,
      patientMock1.name
    );

    expect(actual).toEqual({
      isValidMembership: true,
      masterId: masterIdMock2,
      memberId: expectedMemberId,
      member: memberPersonMock,
    });
  });
});
