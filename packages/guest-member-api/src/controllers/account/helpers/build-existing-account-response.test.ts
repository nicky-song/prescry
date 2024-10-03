// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IAccount } from '@phx/common/src/models/account';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../../../models/terms-and-conditions-acceptance-info';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';

import { buildExistingAccountResponse } from './build-existing-account-response';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { createCashProfileAndAddToRedis } from '../../../utils/person/create-cash-profile-and-add-to-redis';
import { membershipVerificationHelper } from '../../members/helpers/membership-verification.helper';
import {
  publishPersonUpdatePatientDetailsMessage,
  publishPhoneNumberVerificationMessage,
} from '../../../utils/service-bus/person-update-helper';
import { trackNewPhoneNumberRegistrationEvent } from '../../../utils/custom-event-helper';
import { addPhoneRegistrationKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { updatePrescriptionWithMemberId } from '../../prescription/helpers/update-prescriptions-with-member-id';
import { IDataToValidate, isLoginDataValid } from '../../../utils/login-helper';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('../../../utils/response-helper');
jest.mock('../../../utils/service-bus/account-update-helper');
jest.mock('../../../utils/service-bus/person-update-helper');
jest.mock('@phx/common/src/utils/date-time-helper');
jest.mock('../../members/helpers/membership-verification.helper');

jest.mock('../../../utils/person/create-cash-profile-and-add-to-redis');
const createCashProfileAndAddToRedisMock =
  createCashProfileAndAddToRedis as jest.Mock;

jest.mock('../../../utils/service-bus/person-update-helper');
jest.mock('../../../utils/custom-event-helper');
jest.mock('../../../databases/redis/redis-query-helper');

jest.mock('../../prescription/helpers/update-prescriptions-with-member-id');
const updatePrescriptionWithMemberIdMock =
  updatePrescriptionWithMemberId as jest.Mock;

jest.mock('../../../utils/login-helper');
const isLoginDataValidMock = isLoginDataValid as jest.Mock;

const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;
const successResponsesMock = SuccessResponse as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;

const membershipVerificationHelperMock =
  membershipVerificationHelper as jest.Mock;

const UTCDateStringMock = UTCDateString as jest.Mock;
const publishPhoneNumberVerificationMessageMock =
  publishPhoneNumberVerificationMessage as jest.Mock;
const trackNewPhoneNumberRegistrationEventMock =
  trackNewPhoneNumberRegistrationEvent as jest.Mock;
const addPhoneRegistrationKeyInRedisMock =
  addPhoneRegistrationKeyInRedis as jest.Mock;

const publishPersonUpdatePatientDetailsMessageMock =
  publishPersonUpdatePatientDetailsMessage as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  isLoginDataValidMock.mockReturnValue(true);
  UTCDateStringMock.mockReturnValue('2000-01-01');
  membershipVerificationHelperMock.mockReturnValue({
    isValidMembership: false,
  });
});
const responseMock = {} as Response;
const databaseMock = {} as IDatabase;
const tokenMock = 'token';
const phoneNumberMock = '1234567890';
const firstNameMock = 'JOHNNY';
const lastNameMock = 'APPLESEED';
const dateOfBirthMock =
  'Fri Dec 31 1999 16:00:00 GMT-0800 (Pacific Standard Time)';
const termsAndConditionsAcceptanceMock =
  {} as ITermsAndConditionsWithAuthTokenAcceptance;
const accountMock: IAccount = {
  _id: 'id-1',
  firstName: firstNameMock,
  lastName: lastNameMock,
  dateOfBirth: dateOfBirthMock,
  phoneNumber: phoneNumberMock,
  accountKey: 'account-key',
  pinHash: 'hash-key',
};
const activationPersonRecordMock = {
  firstName: 'JOHNNY',
  lastName: 'APPLESEED',
  dateOfBirth: '2000-01-01',
  activationPhoneNumber: phoneNumberMock,
  phoneNumber: '',
  primaryMemberRxId: 'T123456789',
  identifier: '12345',
} as IPerson;

const formattedDateOfBirthMock = '2000-01-01';
describe('buildExistingAccountResponse', () => {
  it.each([
    [undefined, undefined, undefined, false],
    ['', 'master-id', 'account-id', false],
    ['test@test.com', 'master-id', 'account-id', true],
  ])(
    'Publishes account update message based on masterid and accountid being passed and return recoveryEmail value based on recoveryEmail status (recoveryEmail: %p)',
    async (
      recoveryEmail: string | undefined,
      masterIdMock: string | undefined,
      accountIdMock: string | undefined,
      recoveryEmailExists: boolean
    ) => {
      const personMock = {} as IPerson;
      const account = { ...accountMock, recoveryEmail };
      await buildExistingAccountResponse(
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        tokenMock,
        account,
        termsAndConditionsAcceptanceMock,
        personMock,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        masterIdMock,
        accountIdMock
      );

      expect(createCashProfileAndAddToRedisMock).not.toBeCalled();
      expect(publishAccountUpdateMessageMock).toBeCalledWith({
        phoneNumber: phoneNumberMock,
        termsAndConditionsAcceptances: termsAndConditionsAcceptanceMock,
        masterId: masterIdMock,
        accountId: accountIdMock,
        recentlyUpdated: true,
      });
      expect(successResponsesMock).toBeCalledWith(
        responseMock,
        SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_VERIFY_PIN,
        { deviceToken: tokenMock, recoveryEmailExists },
        undefined,
        undefined,
        undefined,
        InternalResponseCode.REQUIRE_USER_VERIFY_PIN
      );
    }
  );

  it.each([
    [undefined, false, false],
    ['', false, false],
    ['test@test.com', true, true],
  ])(
    'Creates CASH profile with address if address passed and cash profile does not exist and return recoveryEmail value based on recoveryEmail status (recoveryEmail: %p)',
    async (
      recoveryEmail: string | undefined,
      recoveryEmailExists: boolean,
      isAddressPassed: boolean
    ) => {
      const account = { ...accountMock, recoveryEmail };
      const personMock = { firstName: firstNameMock } as IPerson;
      createCashProfileAndAddToRedisMock.mockResolvedValue(personMock);
      const memberAddress: IMemberAddress = {
        address1: 'address1Mock',
        address2: 'address2Mock',
        county: 'countyMock',
        city: 'cityMock',
        state: 'stateMock',
        zip: 'zipMock',
      };

      const familyIdMock = 'family-id';

      await buildExistingAccountResponse(
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        tokenMock,
        account,
        termsAndConditionsAcceptanceMock,
        undefined,
        undefined,
        isAddressPassed ? memberAddress : undefined,
        undefined,
        undefined,
        familyIdMock
      );

      expect(createCashProfileAndAddToRedisMock).toBeCalledWith(
        databaseMock,
        configurationMock,
        firstNameMock,
        lastNameMock,
        '2000-01-01',
        phoneNumberMock,
        recoveryEmail,
        isAddressPassed ? memberAddress : undefined,
        undefined,
        undefined,
        familyIdMock
      );
      expect(publishAccountUpdateMessageMock).toBeCalledWith({
        phoneNumber: phoneNumberMock,
        termsAndConditionsAcceptances: termsAndConditionsAcceptanceMock,
        recentlyUpdated: true,
      });
      expect(successResponsesMock).toBeCalledWith(
        responseMock,
        SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_VERIFY_PIN,
        { deviceToken: tokenMock, recoveryEmailExists },
        undefined,
        undefined,
        undefined,
        InternalResponseCode.REQUIRE_USER_VERIFY_PIN
      );
    }
  );

  it('calls updatePrescriptions with MemberId if updatePrescriptionparams is passed and clientpatientId exists', async () => {
    const recoveryEmail = 'test@test.com';
    const account = { ...accountMock, recoveryEmail };
    const updatedPrescriptionParamsMock = {
      clientPatientId: 'CAJY01',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };

    updatePrescriptionWithMemberIdMock.mockResolvedValue({ success: true });

    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      undefined,
      undefined,
      updatedPrescriptionParamsMock
    );

    expect(updatePrescriptionWithMemberIdMock).toBeCalledTimes(1);
    expect(updatePrescriptionWithMemberIdMock).toBeCalledWith(
      updatedPrescriptionParamsMock,
      configurationMock
    );

    expect(successResponsesMock).toBeCalledWith(
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_VERIFY_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    );
  });

  it('will NOT call updatePrescriptionsWithMemberId endpoint if updatePrescriptionparams is passed and clientpatientId not exist', async () => {
    const recoveryEmail = 'test@test.com';
    const primaryMemberRxIdMock = 'member-id';
    const account = { ...accountMock, recoveryEmail };
    const updatedPrescriptionParamsMock = {
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };

    updatePrescriptionWithMemberIdMock.mockResolvedValue({ success: true });

    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock,
      undefined,
      updatedPrescriptionParamsMock
    );

    expect(updatePrescriptionWithMemberIdMock).not.toBeCalled();
    expect(successResponsesMock).not.toBeCalled();
  });

  it('utilizes memberID from activation record if updatePrescriptionparams is passed with empty clientpatientId and activationRecord exists', async () => {
    const recoveryEmail = 'test@test.com';
    const account = { ...accountMock, recoveryEmail };
    const updatedPrescriptionParamsMock = {
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    const personMock = {
      firstName: firstNameMock,
      primaryMemberRxId: '12345',
    } as IPerson;
    createCashProfileAndAddToRedisMock.mockResolvedValue(personMock);
    updatePrescriptionWithMemberIdMock.mockResolvedValue({ success: true });

    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      undefined,
      undefined,
      updatedPrescriptionParamsMock,
      activationPersonRecordMock,
      undefined
    );
    expect(updatePrescriptionWithMemberIdMock).toBeCalledTimes(1);
    expect(updatePrescriptionWithMemberIdMock).toBeCalledWith(
      { ...updatedPrescriptionParamsMock, clientPatientId: 'T123456789' },
      configurationMock
    );

    expect(successResponsesMock).toBeCalledWith(
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_VERIFY_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    );
  });

  it('utilizes memberID from created cash profile if updatePrescriptionparams is passed with empty clientpatientId', async () => {
    const recoveryEmail = 'test@test.com';
    const account = { ...accountMock, recoveryEmail };
    const updatedPrescriptionParamsMock = {
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    const personMock = {
      firstName: firstNameMock,
      primaryMemberRxId: '12345',
    } as IPerson;
    createCashProfileAndAddToRedisMock.mockResolvedValue(personMock);
    updatePrescriptionWithMemberIdMock.mockResolvedValue({ success: true });

    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      undefined,
      undefined,
      updatedPrescriptionParamsMock
    );
    expect(updatePrescriptionWithMemberIdMock).toBeCalledTimes(1);
    expect(updatePrescriptionWithMemberIdMock).toBeCalledWith(
      { ...updatedPrescriptionParamsMock, clientPatientId: '12345' },
      configurationMock
    );

    expect(successResponsesMock).toBeCalledWith(
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_VERIFY_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN
    );
  });

  it('calls membershipVerificationHelper if primaryMemberRxId is passed in', async () => {
    const recoveryEmail = 'test@test.com';
    const primaryMemberRxIdMock = 'member-id';
    const expectedDateOfBirthMock = '2000-01-01';
    const account = { ...accountMock, recoveryEmail };
    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock
    );

    expect(membershipVerificationHelperMock).toHaveBeenCalledWith(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      expectedDateOfBirthMock,
      primaryMemberRxIdMock
    );

    expect(successResponsesMock).not.toBeCalled();
  });

  it('returns KNOWN failure response if isValidMembership is false and error details are known', async () => {
    const recoveryEmail = 'test@test.com';
    membershipVerificationHelperMock.mockReturnValueOnce({
      isValidMembership: false,
      responseCode: 403,
      responseMessage: 'invalid user details',
    });
    const primaryMemberRxIdMock = 'member-id';
    const expectedDateOfBirthMock = '2000-01-01';
    const account = { ...accountMock, recoveryEmail };
    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock
    );

    expect(membershipVerificationHelperMock).toHaveBeenCalledWith(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      expectedDateOfBirthMock,
      primaryMemberRxIdMock
    );

    expect(successResponsesMock).not.toBeCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.FORBIDDEN_ERROR,
      'invalid user details',
      undefined,
      undefined
    );
  });

  it('returns KNOWN failure response if isValidMembership is false and error is Account_not_matching error', async () => {
    const recoveryEmail = 'test@test.com';
    membershipVerificationHelperMock.mockReturnValueOnce({
      isValidMembership: false,
      responseCode: HttpStatusCodes.NOT_FOUND,
      responseMessage: ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH,
    });
    const primaryMemberRxIdMock = 'member-id';
    const expectedDateOfBirthMock = '2000-01-01';
    const account = { ...accountMock, recoveryEmail };
    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock
    );

    expect(membershipVerificationHelperMock).toHaveBeenCalledWith(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      expectedDateOfBirthMock,
      primaryMemberRxIdMock
    );

    expect(successResponsesMock).not.toBeCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH,
      undefined,
      InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH
    );
  });

  it('returns KNOWN failure response if isValidMembership is false and error details are unknown', async () => {
    const recoveryEmail = 'test@test.com';
    const primaryMemberRxIdMock = 'member-id';
    const expectedDateOfBirthMock = '2000-01-01';
    const account = { ...accountMock, recoveryEmail };
    membershipVerificationHelperMock.mockReturnValueOnce({
      isValidMembership: false,
    });
    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock
    );

    expect(membershipVerificationHelperMock).toHaveBeenCalledWith(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      expectedDateOfBirthMock,
      primaryMemberRxIdMock
    );

    expect(successResponsesMock).not.toBeCalled();
    expect(knownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      '',
      undefined,
      undefined
    );
  });

  it('returns UNKNOWN failure response if membershipVerificationHelper returns isValidMembership as true but no member', async () => {
    const recoveryEmail = 'test@test.com';
    const primaryMemberRxIdMock = 'member-id';
    const expectedDateOfBirthMock = '2000-01-01';
    const account = { ...accountMock, recoveryEmail };
    membershipVerificationHelperMock.mockReturnValueOnce({
      isValidMembership: true,
    });
    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock
    );

    expect(membershipVerificationHelperMock).toHaveBeenCalledWith(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      expectedDateOfBirthMock,
      primaryMemberRxIdMock
    );

    expect(successResponsesMock).not.toBeCalled();
    expect(unknownFailureResponseMock).toBeCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR
    );
  });

  it('publishes phone number verification message when "primaryMemberRxId" value is present and membership is verified', async () => {
    const recoveryEmail = 'test@test.com';
    const primaryMemberRxIdMock = 'member-id';
    const account = { ...accountMock, recoveryEmail };

    const memberMock = {
      identifier: '123',
    };

    membershipVerificationHelperMock.mockReturnValueOnce({
      member: memberMock,
      isValidMembership: true,
    });

    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock
    );

    expect(publishPhoneNumberVerificationMessageMock).toHaveBeenCalledWith(
      memberMock.identifier,
      phoneNumberMock
    );
  });

  it('publish addPhoneRegistrationKeyInRedis when "primaryMemberRxId" value is present and membership is verified', async () => {
    const recoveryEmail = 'test@test.com';
    const primaryMemberRxIdMock = 'member-id';
    const account = { ...accountMock, recoveryEmail };

    const memberMock = {
      identifier: '123',
    };

    membershipVerificationHelperMock.mockReturnValueOnce({
      member: memberMock,
      isValidMembership: true,
    });

    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock
    );

    expect(addPhoneRegistrationKeyInRedisMock).toHaveBeenCalledWith(
      phoneNumberMock,
      memberMock,
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
    );
  });

  it('tracks phone number verification message when "primaryMemberRxId" value is present and membership is verified', async () => {
    const recoveryEmail = 'test@test.com';
    const primaryMemberRxIdMock = 'member-id';
    const account = { ...accountMock, recoveryEmail };

    const memberMock = {
      identifier: '123',
    };

    membershipVerificationHelperMock.mockReturnValueOnce({
      member: memberMock,
      isValidMembership: true,
    });

    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock
    );

    expect(trackNewPhoneNumberRegistrationEventMock).toHaveBeenCalledWith(
      phoneNumberMock,
      memberMock.identifier
    );
  });

  it.each([[false], [true]])(
    'publishes phone number verification message if activationPersonRecord is passed and activationPersonRecord.phoneNumber is empty(has master id and account id defined %p)',
    async (hasMasterId: boolean) => {
      const personMock = { firstName: firstNameMock } as IPerson;
      const masterIdMock = 'master-id2';
      const patientAccountIdMock = 'patient-account';

      createCashProfileAndAddToRedisMock.mockResolvedValue(personMock);
      await buildExistingAccountResponse(
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        tokenMock,
        accountMock,
        termsAndConditionsAcceptanceMock,
        undefined,
        undefined,
        undefined,
        undefined,
        activationPersonRecordMock,
        undefined,
        hasMasterId ? masterIdMock : undefined,
        hasMasterId ? patientAccountIdMock : undefined
      );

      expect(publishPhoneNumberVerificationMessageMock).toHaveBeenCalledWith(
        activationPersonRecordMock.identifier,
        phoneNumberMock
      );
      expect(addPhoneRegistrationKeyInRedisMock).toBeCalledWith(
        phoneNumberMock,
        activationPersonRecordMock,
        configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
      );
      const activationDataMock: IDataToValidate = {
        firstName: activationPersonRecordMock.firstName,
        dateOfBirth: activationPersonRecordMock.dateOfBirth,
      };
      const accountDataMock: IDataToValidate = {
        firstName: accountMock.firstName ?? '',
        dateOfBirth: formattedDateOfBirthMock,
      };
      expect(isLoginDataValidMock).toBeCalledWith(
        accountDataMock,
        activationDataMock
      );
      if (hasMasterId) {
        expect(
          publishPersonUpdatePatientDetailsMessageMock
        ).toHaveBeenCalledWith(
          activationPersonRecordMock.identifier,
          masterIdMock,
          patientAccountIdMock
        );
      } else {
        expect(publishPersonUpdatePatientDetailsMessageMock).not.toBeCalled();
      }
    }
  );

  it('creates CASH profile if does not exist when "primaryMemberRxId" value is present and membership is verified', async () => {
    const recoveryEmail = 'test@test.com';
    const primaryMemberRxIdMock = 'member-id';
    const account = { ...accountMock, recoveryEmail };

    const memberMock = {
      identifer: '123',
    };
    membershipVerificationHelperMock.mockReturnValueOnce({
      member: memberMock,
      isValidMembership: true,
    });
    const familyIdMock = 'family-id';

    const masterIdMock = 'master-id';

    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock,
      undefined,
      undefined,
      undefined,
      familyIdMock,
      masterIdMock
    );

    expect(publishPhoneNumberVerificationMessageMock).toBeCalled();
    expectToHaveBeenCalledOnceOnlyWith(
      createCashProfileAndAddToRedisMock,
      databaseMock,
      configurationMock,
      firstNameMock,
      lastNameMock,
      formattedDateOfBirthMock,
      phoneNumberMock,
      recoveryEmail,
      undefined,
      masterIdMock,
      undefined,
      familyIdMock
    );
  });

  it.each([[false], [true]])(
    'publishes masterId update message if cash member already exists but doesnt have masterId and masterId parameter is passed (has masterId and accountId defined %p)',
    async (hasMasterId: boolean) => {
      const cashPersonMock = {
        firstName: firstNameMock,
        lastName: lastNameMock,
        identifier: 'identifier-1',
      } as IPerson;
      const masterIdMock = 'master-id';
      const accountIdMock = 'account-id';
      await buildExistingAccountResponse(
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        tokenMock,
        accountMock,
        termsAndConditionsAcceptanceMock,
        cashPersonMock,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        hasMasterId ? masterIdMock : undefined,
        hasMasterId ? accountIdMock : undefined
      );

      if (hasMasterId) {
        expect(
          publishPersonUpdatePatientDetailsMessageMock
        ).toHaveBeenCalledWith(
          cashPersonMock.identifier,
          masterIdMock,
          accountIdMock
        );
      } else {
        expect(publishPersonUpdatePatientDetailsMessageMock).not.toBeCalled();
      }
    }
  );

  it('returns success response with REQUIRE_USER_SET_PIN if account pin hash is not set', async () => {
    const recoveryEmail = 'test@test.com';
    const accountMockWithoutPinHash = {
      _id: 'id-2',
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      phoneNumber: phoneNumberMock,
      accountKey: 'account-key',
    };
    const primaryMemberRxIdMock = 'member-id';
    const account = { ...accountMockWithoutPinHash, recoveryEmail };

    const memberMock = {
      identifer: '123',
    };
    membershipVerificationHelperMock.mockReturnValueOnce({
      member: memberMock,
      isValidMembership: true,
    });
    const familyIdMock = 'family-id';

    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock,
      undefined,
      undefined,
      undefined,
      familyIdMock
    );

    expect(publishPhoneNumberVerificationMessageMock).toBeCalled();

    expectToHaveBeenCalledOnceOnlyWith(
      createCashProfileAndAddToRedisMock,
      databaseMock,
      configurationMock,
      firstNameMock,
      lastNameMock,
      formattedDateOfBirthMock,
      phoneNumberMock,
      recoveryEmail,
      undefined,
      undefined,
      undefined,
      familyIdMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponsesMock,
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });

  it('returns sso success response when account token is passed.', async () => {
    const recoveryEmail = 'test@test.com';
    const primaryMemberRxIdMock = 'member-id';
    const accountTokenMock = 'abc1234567';
    const account = { ...accountMock, recoveryEmail };

    const memberMock = {
      identifer: '123',
    };
    membershipVerificationHelperMock.mockReturnValueOnce({
      member: memberMock,
      isValidMembership: true,
    });
    const familyIdMock = 'family-id';

    await buildExistingAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      account,
      termsAndConditionsAcceptanceMock,
      undefined,
      primaryMemberRxIdMock,
      undefined,
      undefined,
      undefined,
      familyIdMock,
      undefined,
      accountMock.accountId,
      accountTokenMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      successResponsesMock,
      responseMock,
      SuccessConstants.VERIFY_SSO_SUCCESS,
      {
        deviceToken: tokenMock,
        recoveryEmailExists: true,
        accountToken: accountTokenMock,
      }
    );
  });
});
