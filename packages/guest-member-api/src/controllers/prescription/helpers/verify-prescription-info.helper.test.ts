// Copyright 2022 Prescryptive Health, Inc.

import { configurationMock } from '../../../mock-data/configuration.mock';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IPerson } from '@phx/common/src/models/person';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { isLoginDataValid } from '../../../utils/login-helper';
import {
  prescriptionBlockchainFhirMock,
  prescriptionFhirMock,
  prescriptionFhirNoBirthdateMock,
  prescriptionFhirNoPatientMock,
  prescriptionFhirWithoutMemberIdMock,
} from '../mock/get-mock-fhir-object';
import { getPrescriptionById } from './get-prescription-by-id';
import { getMobileContactPhone } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import {
  getFirstAddress,
  getIAddressAsIMemberAddress,
} from './get-prescription-address';
import { buildUpdatePrescriptionParams } from './build-update-prescription-params';
import { getPrescriptionInfoForSmartContractAddress } from './get-prescription-info-for-smart-contract-address.helper';
import { IPatient } from '../../../models/fhir/patient/patient';
import { getPatientByMasterId } from '../../../utils/external-api/identity/get-patient-by-master-id';
import { IHumanName } from '../../../models/fhir/human-name';
import { matchFirstName } from '../../../utils/fhir/human-name.helper';
import {
  IPrescriptionVerificationInfo,
  verifyPrescriptionInfoHelper,
} from './verify-prescription-info.helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { ICommonBusinessMonitoringEvent } from '../../../models/common-business-monitoring-event';

jest.mock('../../prescription/helpers/get-prescription-by-id');
const getPrescriptionByIdMock = getPrescriptionById as jest.Mock;

jest.mock(
  '../../prescription/helpers/get-prescription-info-for-smart-contract-address.helper'
);
const getPrescriptionInfoForSmartContractAddressMock =
  getPrescriptionInfoForSmartContractAddress as jest.Mock;

jest.mock('../../../utils/fhir-patient/get-contact-info-from-patient');
const getMobileContactPhoneMock = getMobileContactPhone as jest.Mock;

jest.mock('../../prescription/helpers/get-prescription-address');
const getIAddressAsIMemberAddressMock =
  getIAddressAsIMemberAddress as jest.Mock;

jest.mock('../../prescription/helpers/build-update-prescription-params');
const buildUpdatePrescriptionParamsMock =
  buildUpdatePrescriptionParams as jest.Mock;

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/account-collection-helper'
);
const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;

jest.mock('../../../utils/login-helper');
const isLoginDataValidMock = isLoginDataValid as jest.Mock;
const getFirstAddressMock = getFirstAddress as jest.Mock;

jest.mock('../../../utils/external-api/identity/get-patient-by-master-id');
const getPatientByMasterIdMock = getPatientByMasterId as jest.Mock;

jest.mock('../../../utils/fhir/human-name.helper', () => ({
  ...jest.requireActual('../../../utils/fhir/human-name.helper'),
  matchFirstName: jest.fn(),
}));
const matchFirstNameMock = matchFirstName as jest.Mock;

const prescriptionInfoMock: IPrescriptionVerificationInfo = {
  prescriptionId: 'prescription-id',
  firstName: 'DIAN',
  dateOfBirth: '1980-01-01',
};

const addressInMemberAddressFormat = {
  address1: '6800 Jericho Turnpike',
  city: 'HICKSVILLE',
  state: 'NY',
  zip: '11753',
  county: undefined,
};

const prescriptionAddressMock = {
  line: ['6800 Jericho Turnpike'],
  city: 'HICKSVILLE',
  state: 'NY',
  postalCode: '11753',
};
const updatePrescriptionParamsMock = {
  clientPatientId: 'member-id',
  rxNo: 'rx-no',
  pharmacyManagementSystemPatientId: 'prime-rx-id',
  refillNo: 0,
};
const cashPersonMock: IPerson = {
  dateOfBirth: '1990-01-01',
  email: 'mockEmail',
  firstName: 'John',
  identifier: '',
  isPhoneNumberVerified: true,
  isPrimary: true,
  lastName: 'mockLastName',
  phoneNumber: 'mockPhoneNumber',
  primaryMemberFamilyId: 'family-id',
  primaryMemberPersonCode: 'person-code-id1',
  primaryMemberRxId: 'mock-id1',
  rxGroupType: 'CASH',
  rxGroup: 'group1',
  rxBin: 'rx-bin',
  carrierPCN: 'pcn',
};

const siePersonMock: IPerson = {
  email: 'fake_email',
  firstName: 'fake_firstName',
  lastName: 'fake_lastName',
  identifier: 'fake-identifier',
  phoneNumber: 'fake_phoneNumber',
  primaryMemberRxId: 'fake_primaryMemberRxId',
  rxGroupType: 'SIE',
  rxSubGroup: 'HMA01',
  dateOfBirth: '2000-01-01',
  isPhoneNumberVerified: true,
  isPrimary: true,
  rxGroup: 'group1',
  rxBin: 'rx-bin',
  carrierPCN: 'pcn',
  primaryMemberPersonCode: 'person-code-id1',
};

const databaseMock = {} as IDatabase;

const humanNameMock: IHumanName = { family: 'ALAM', given: ['DIAN'] };

const humanNamesMock: IHumanName[] = [humanNameMock];

const patientMock: IPatient = {
  name: humanNamesMock,
  birthDate: '1980-01-01',
  telecom: [
    {
      system: 'phone',
      use: 'mobile',
      value: '+11111111111',
    },
  ],
};

describe('verifyPrescriptionInfoHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();

    getPrescriptionByIdMock.mockReturnValue({
      prescription: prescriptionFhirMock,
    });
    getPrescriptionInfoForSmartContractAddressMock.mockReturnValue({
      prescription: prescriptionBlockchainFhirMock,
    });
    getMobileContactPhoneMock.mockReturnValue('+11111111111');
    getFirstAddressMock.mockReturnValue(prescriptionAddressMock);
    getIAddressAsIMemberAddressMock.mockReturnValue(
      addressInMemberAddressFormat
    );
    buildUpdatePrescriptionParamsMock.mockReturnValue(
      updatePrescriptionParamsMock
    );
    getPatientByMasterIdMock.mockReturnValue(patientMock);
  });

  it('returns failure response if any error occurs', async () => {
    const errorMock = new Error('unknown error occured');
    getPrescriptionByIdMock.mockImplementation(() => {
      throw errorMock;
    });

    const actual = await verifyPrescriptionInfoHelper(
      databaseMock,
      prescriptionInfoMock,
      configurationMock,
      [cashPersonMock, siePersonMock]
    );

    expect(actual).toEqual({
      prescriptionIsValid: false,
      errorCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      errorMessage: ErrorConstants.INTERNAL_SERVER_ERROR,
    });
  });

  it.each([[undefined], [true]])(
    'returns error if get prescription api returns error',
    async (blockchainMock?: boolean) => {
      getPrescriptionByIdMock.mockReset();
      if (blockchainMock) {
        getPrescriptionInfoForSmartContractAddressMock.mockReturnValue({
          errorCode: 404,
        });
      } else {
        getPrescriptionByIdMock.mockReturnValueOnce({
          errorCode: 404,
        });
      }

      const actual = await verifyPrescriptionInfoHelper(
        databaseMock,
        prescriptionInfoMock,
        configurationMock,
        [cashPersonMock, siePersonMock],
        blockchainMock
      );

      if (blockchainMock) {
        expect(getPrescriptionInfoForSmartContractAddressMock).toBeCalledWith(
          prescriptionInfoMock.prescriptionId,
          configurationMock
        );
      } else {
        expect(getPrescriptionByIdMock).toBeCalledWith(
          prescriptionInfoMock.prescriptionId,
          configurationMock
        );
      }

      expect(actual).toEqual({ prescriptionIsValid: false, errorCode: 404 });
    }
  );

  it('returns prescriptionIsValid as false when prescription doesnt contain patient resource', async () => {
    getPrescriptionByIdMock.mockReset();
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirNoPatientMock,
    });
    const actual = await verifyPrescriptionInfoHelper(
      databaseMock,
      prescriptionInfoMock,
      configurationMock,
      [cashPersonMock, siePersonMock]
    );

    expect(actual).toEqual({
      prescriptionIsValid: false,
      errorCode: HttpStatusCodes.BAD_REQUEST,
      errorMessage: ErrorConstants.PATIENT_RECORD_MISSING,
    });
  });

  it('returns prescriptionIsValid as false when prescription doesnt contain first name or dob or telephone', async () => {
    getPrescriptionByIdMock.mockReset();
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirNoBirthdateMock,
    });

    const actual = await verifyPrescriptionInfoHelper(
      databaseMock,
      prescriptionInfoMock,
      configurationMock,

      [cashPersonMock, siePersonMock]
    );

    expect(actual).toEqual({
      prescriptionIsValid: false,
      errorCode: HttpStatusCodes.BAD_REQUEST,
      errorMessage: ErrorConstants.INVALID_PRESCRIPTION_DATA,
    });
  });

  it('returns prescriptionIsValid as false when prescription does not match with patient entered', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const firstNameMock = 'first-name';

    const mockData: IPrescriptionVerificationInfo = {
      prescriptionId: 'prescription-id',
      firstName: firstNameMock,
      dateOfBirth: 'January-01-1980',
    };
    const actual = await verifyPrescriptionInfoHelper(
      databaseMock,
      mockData,
      configurationMock,
      [cashPersonMock, siePersonMock]
    );

    expect(matchFirstNameMock).toHaveBeenCalledWith(
      firstNameMock,
      humanNamesMock
    );

    expect(actual).toEqual({
      prescriptionIsValid: false,
      errorCode: HttpStatusCodes.BAD_REQUEST,
      errorMessage: ErrorConstants.PRESCRIPTION_DATA_DOES_NOT_MATCH,
      serviceBusEvent: undefined,
    });
  });

  it('returns prescriptionIsValid as false when blockchain does not match with patient entered', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const firstNameMock = 'first-name';

    const mockData: IPrescriptionVerificationInfo = {
      prescriptionId: 'prescription-id',
      firstName: firstNameMock,
      dateOfBirth: 'January-01-1980',
    };
    const actual = await verifyPrescriptionInfoHelper(
      databaseMock,
      mockData,
      configurationMock,
      [cashPersonMock, siePersonMock],
      true
    );

    expect(matchFirstNameMock).toHaveBeenCalledWith(
      firstNameMock,
      humanNamesMock
    );

    const expectedServiceBusEvent: ICommonBusinessMonitoringEvent = {
      topic: 'Business',
      eventData: {
        eventDateTime: '2020-01-01T00:00:00.000Z',
        id: 'mock-blockchain',
        idType: 'smartContractId',
        messageData: '',
        messageOrigin: 'myPHX',
        tags: ['dRx', 'supportDashboard'],
        type: 'error',
        subject: "Prescription data doesn't match with Patient entered",
      },
    };

    expect(actual).toEqual({
      prescriptionIsValid: false,
      errorCode: HttpStatusCodes.BAD_REQUEST,
      errorMessage: ErrorConstants.PRESCRIPTION_DATA_DOES_NOT_MATCH,
      serviceBusEvent: expectedServiceBusEvent,
    });
  });

  it('returns prescriptionIsValid as true with empty telephone when getMobileContactPhone returns undefined', async () => {
    matchFirstNameMock.mockReturnValueOnce(humanNameMock);
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirWithoutMemberIdMock,
    });
    getMobileContactPhoneMock.mockReturnValueOnce(undefined);
    searchAccountByPhoneNumberMock.mockReturnValueOnce(undefined);
    const actual = await verifyPrescriptionInfoHelper(
      databaseMock,
      prescriptionInfoMock,
      configurationMock,
      [cashPersonMock, siePersonMock]
    );

    expect(actual).toEqual({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: undefined,
        address: addressInMemberAddressFormat,
        lastName: 'ALAM',
        updatePrescriptionParams: updatePrescriptionParamsMock,
      },
    });
  });

  it('returns prescriptionIsValid as true with no address when prescription doesnt contain address', async () => {
    matchFirstNameMock.mockReturnValueOnce(humanNameMock);
    const fhirMock = { ...prescriptionFhirMock };
    fhirMock.entry[0].resource = {
      ...fhirMock.entry[0].resource,
      ...{ address: undefined },
    };
    getPrescriptionByIdMock.mockReset();
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: fhirMock,
    });
    searchAccountByPhoneNumberMock.mockReturnValueOnce(undefined);
    const actual = await verifyPrescriptionInfoHelper(
      databaseMock,
      prescriptionInfoMock,
      configurationMock,
      [cashPersonMock, siePersonMock]
    );

    expect(actual).toEqual({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: '+11111111111',
        address: undefined,
        lastName: 'ALAM',
        updatePrescriptionParams: undefined,
      },
    });
    expect(getFirstAddressMock).not.toBeCalled();
    expect(getIAddressAsIMemberAddressMock).not.toBeCalled();
  });

  it.each([[undefined], [true]])(
    'returns prescriptionIsValid as true if user has account and matches with user entered info when blockchain is %p',
    async (blockchainMock?: boolean) => {
      const masterIdMock = 'MYRX-ID';

      matchFirstNameMock.mockReturnValueOnce(humanNameMock);

      if (blockchainMock) {
        getPrescriptionInfoForSmartContractAddressMock.mockReset();
        getPrescriptionInfoForSmartContractAddressMock.mockReturnValue({
          prescription: prescriptionBlockchainFhirMock,
        });
        getPatientByMasterIdMock.mockReturnValue(patientMock);
      } else {
        getPrescriptionByIdMock.mockReset();
        getPrescriptionByIdMock.mockReturnValueOnce({
          prescription: prescriptionFhirMock,
        });
      }

      searchAccountByPhoneNumberMock.mockReturnValueOnce({
        phoneNumber: '+11111111111',
        firstName: 'DIAN',
        dateOfBirth: '1980-01-01',
      });
      isLoginDataValidMock.mockReturnValueOnce(true);
      const actual = await verifyPrescriptionInfoHelper(
        databaseMock,
        prescriptionInfoMock,
        configurationMock,
        [cashPersonMock, siePersonMock],
        blockchainMock
      );

      if (blockchainMock) {
        expect(getPatientByMasterIdMock).toHaveBeenCalledWith(
          masterIdMock,
          configurationMock
        );
      }

      expect(actual).toEqual({
        prescriptionIsValid: true,
        filteredUserInfo: {
          telephone: '+11111111111',
          address: undefined,
          lastName: 'ALAM',
          masterId: blockchainMock ? masterIdMock : undefined,
          updatePrescriptionParams: undefined,
        },
      });
    }
  );

  it('returns prescriptionIsValid as true with prescription params only when prescription doesnt have myrxid', async () => {
    getPrescriptionByIdMock.mockReset();
    getPrescriptionByIdMock.mockReturnValueOnce({
      prescription: prescriptionFhirWithoutMemberIdMock,
    });
    searchAccountByPhoneNumberMock.mockReturnValueOnce(undefined);
    matchFirstNameMock.mockReturnValueOnce(humanNameMock);
    const actual = await verifyPrescriptionInfoHelper(
      databaseMock,
      prescriptionInfoMock,
      configurationMock,
      [cashPersonMock, siePersonMock]
    );

    expect(actual).toEqual({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: '+11111111111',
        address: addressInMemberAddressFormat,
        lastName: 'ALAM',
        updatePrescriptionParams: updatePrescriptionParamsMock,
      },
    });
  });
});
