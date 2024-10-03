// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IAccount } from '@phx/common/src/models/account';
import { ICreateAccountRequestBody } from '@phx/common/src/models/api-request-body/create-account.request-body';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import { IPerson } from '@phx/common/src/models/person';
import {
  KnownFailureResponse,
  errorResponseWithTwilioErrorHandling,
} from '../../../utils/response-helper';
import { getResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../../../models/terms-and-conditions-acceptance-info';
import { buildTermsAndConditionsAcceptance } from '../../../utils/terms-and-conditions.helper';
import { validateAutomationToken } from '../../../utils/validate-automation-token/validate-automation-token';
import { generateDeviceToken } from '../../../utils/verify-device-helper';
import { getAllRecordsForLoggedInPerson } from '../../../utils/person/get-logged-in-person.helper';
import { buildExistingAccountResponse } from '../helpers/build-existing-account-response';
import { buildNewAccountResponse } from '../helpers/build-new-account-response';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { createAccountHandler } from './create-account.handler';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { verifyPrescriptionInfoHelper } from '../../prescription/helpers/verify-prescription-info.helper';
import { verifyActivationRecord } from '../../../utils/verify-activation-record';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { createAccount } from '../../../utils/patient-account/create-account';
import { getPatientAccountByPhoneNumber } from '../../../utils/patient-account/get-patient-account-by-phone-number';
import { validateRequestAge } from '../../../utils/request/validate-request-age';
import { BadRequestError } from '../../../errors/request-errors/bad.request-error';
import { validateOneTimePassword } from '../../../utils/request/validate-one-time-password';
import RestException from 'twilio/lib/base/RestException';
import { isPatientAccountVerified } from '../../../utils/patient-account/patient-account.helper';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithPatientMock,
} from '../../../mock-data/patient-account.mock';
import { generateDeviceTokenV2 } from '../../../utils/verify-device-helper-v2';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { generatePrimaryMemberFamilyId } from '../../../utils/person/person-creation.helper';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { validateOneTimePasswordV2 } from '../../../utils/request/validate-one-time-password.v2';
import { Socket } from 'net';
import { updatePatientAccountTermsAndConditionsAcceptance } from '../../../utils/patient-account/update-patient-account-terms-and-conditions-acceptance';
import { membershipVerificationHelperV2 } from '../../members/helpers/membership-verification-v2.helper';
import { addMembershipPlan } from '../../members/helpers/add-membership-link.helper';
import { setPatientAccountStatusToVerified } from '../../../utils/patient-account/set-patient-account-status-to-verified';
import { setPatientAndPatientAccountIdentifiers } from '../../../utils/patient-account/set-patient-and-patient-account-identifiers';
import { updatePatientAccountPin } from '../../../utils/patient-account/update-patient-account-pin';
import { twilioMock } from '../../../mock-data/twilio.mock';
import { databaseMock } from '../../../mock-data/database.mock';
import { getPinDetails } from '../../../utils/patient-account/get-pin-details';
import { createCashCoverageRecord } from '../../../utils/coverage/create-cash-coverage-record';
import { assertHasMasterId } from '../../../assertions/assert-has-master-id';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { IIdentity } from '../../../models/identity';
import {
  doesPatientBirthDateMatch,
  doPatientFirstNameMatch,
} from '../../../utils/fhir-patient/patient.helper';
import dateFormat from 'dateformat';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('../../members/helpers/add-membership-link.helper');
const addMembershipPlanMock = addMembershipPlan as jest.Mock;

jest.mock('../../../utils/response-helper');
const errorResponseWithTwilioErrorHandlingMock =
  errorResponseWithTwilioErrorHandling as jest.Mock;
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;

jest.mock('../../../utils/request/request-app-locals.helper');
const getResponseLocalMock = getResponseLocal as jest.Mock;

jest.mock('../../../utils/terms-and-conditions.helper');
const buildTermsAndConditionsAcceptanceMock =
  buildTermsAndConditionsAcceptance as jest.Mock;

jest.mock('../../../utils/validate-automation-token/validate-automation-token');
const validateAutomationTokenMock = validateAutomationToken as jest.Mock;

jest.mock('../../../utils/verify-device-helper');
const generateDeviceTokenMock = generateDeviceToken as jest.Mock;

jest.mock('../../../utils/person/get-logged-in-person.helper');
const getAllRecordsForLoggedInPersonMock =
  getAllRecordsForLoggedInPerson as jest.Mock;

jest.mock('../helpers/build-existing-account-response');
const buildExistingAccountResponseMock =
  buildExistingAccountResponse as jest.Mock;

jest.mock('../helpers/build-new-account-response');
const buildNewAccountResponseMock = buildNewAccountResponse as jest.Mock;

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/account-collection-helper'
);
const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;

jest.mock('../../prescription/helpers/verify-prescription-info.helper');
const verifyPrescriptionInfoHelperMock =
  verifyPrescriptionInfoHelper as jest.Mock;

jest.mock('../../../utils/verify-activation-record');
const verifyActivationRecordMock = verifyActivationRecord as jest.Mock;

jest.mock('../../../utils/patient-account/get-patient-account-by-phone-number');
const getPatientAccountByPhoneNumberMock =
  getPatientAccountByPhoneNumber as jest.Mock;

jest.mock('../../../utils/patient-account/create-account');
const createAccountMock = createAccount as jest.Mock;

jest.mock('../../../utils/request/validate-request-age');
const validateRequestAgeMock = validateRequestAge as jest.Mock;

jest.mock('../../../utils/request/validate-one-time-password');
const validateOneTimePasswordMock = validateOneTimePassword as jest.Mock;

jest.mock('../../../utils/request/validate-one-time-password.v2');
const validateOneTimePasswordV2Mock = validateOneTimePasswordV2 as jest.Mock;

jest.mock('../../../utils/patient-account/patient-account.helper');
const isPatientAccountVerifiedMock = isPatientAccountVerified as jest.Mock;

jest.mock('../../../utils/verify-device-helper-v2');
const generateDeviceTokenV2Mock = generateDeviceTokenV2 as jest.Mock;

jest.mock('../../../utils/person/person-creation.helper');
const generatePrimaryMemberFamilyIdMock =
  generatePrimaryMemberFamilyId as jest.Mock;

jest.mock('../../../utils/coverage/create-cash-coverage-record');
const createCashCoverageRecordMock = createCashCoverageRecord as jest.Mock;

jest.mock(
  '../../../utils/patient-account/set-patient-account-status-to-verified'
);
const setPatientAccountStatusToVerifiedMock =
  setPatientAccountStatusToVerified as jest.Mock;

jest.mock(
  '../../../utils/patient-account/update-patient-account-terms-and-conditions-acceptance'
);
const updatePatientAccountTermsAndConditionsAcceptanceMock =
  updatePatientAccountTermsAndConditionsAcceptance as jest.Mock;

jest.mock(
  '../../../utils/patient-account/set-patient-and-patient-account-identifiers'
);
const setPatientAndPatientAccountIdentifiersMock =
  setPatientAndPatientAccountIdentifiers as jest.Mock;

jest.mock('../../members/helpers/membership-verification-v2.helper');
const membershipVerificationHelperV2Mock =
  membershipVerificationHelperV2 as jest.Mock;

jest.mock('../../../utils/patient-account/update-patient-account-pin');
const updatePatientAccountPinMock = updatePatientAccountPin as jest.Mock;

jest.mock('../../../utils/patient-account/get-pin-details');
const getPinDetailsMock = getPinDetails as jest.Mock;

jest.mock('../../../assertions/assert-has-master-id');
const assertHasMasterIdMock = assertHasMasterId as jest.Mock;

jest.mock('../../../assertions/assert-has-account-id');
const assertHasAccountIdMock = assertHasAccountId as jest.Mock;
jest.mock('../../../utils/fhir-patient/patient.helper');
const doesPatientBirthDateMatchMock = doesPatientBirthDateMatch as jest.Mock;
const doPatientFirstNameMatchMock = doPatientFirstNameMatch as jest.Mock;

describe('createAccountHandler', () => {
  const termsAndConditionsAcceptanceMock = {
    hasAccepted: true,
    allowSmsMessages: true,
    allowEmailMessages: true,
    fromIP: '128.0.0.1',
    acceptedDateTime: '01/01/2020',
    browser: 'safari',
    authToken: 'mock-auth-token',
  } as ITermsAndConditionsWithAuthTokenAcceptance;

  const responseMock = {} as Response;
  const tokenMock = 'token';
  const phoneNumberMock = '1234567890';
  const firstNameMock = 'JOHNNY';
  const lastNameMock = 'APPLESEED';
  const dateOfBirthMock = 'January-01-2010';
  const formattedDateOfBirthMock = '2010-01-01';
  const emailMock = 'test@test.com';
  const codeMock = '1234';

  const requestBody: ICreateAccountRequestBody = {
    firstName: firstNameMock,
    lastName: lastNameMock,
    email: emailMock,
    dateOfBirth: dateOfBirthMock,
    phoneNumber: phoneNumberMock,
    code: codeMock,
  };

  const requestMock = {
    body: requestBody,
    socket: {},
    headers: {},
  } as Request;

  const requestV2Mock = {
    body: requestBody,
    socket: {},
    headers: {
      [RequestHeaders.apiVersion]: 'v2',
    },
  } as Request;

  const siePersonMock = {
    identifier: 'person-identifier-sie',
    firstName: firstNameMock,
    lastName: lastNameMock,
    email: emailMock,
    dateOfBirth: formattedDateOfBirthMock,
    phoneNumber: phoneNumberMock,
    primaryMemberFamilyId: 'CAJY',
    primaryMemberRxId: 'CAJY01',
    isPrimary: true,
    rxGroupType: RxGroupTypesEnum.SIE,
  } as unknown as IPerson;

  const cashPersonMock = {
    identifier: 'person-identifier-cash',
    firstName: firstNameMock,
    lastName: lastNameMock,
    email: emailMock,
    dateOfBirth: formattedDateOfBirthMock,
    phoneNumber: phoneNumberMock,
    primaryMemberFamilyId: 'CAJY',
    primaryMemberRxId: 'CAJY01',
    isPrimary: true,
    rxGroupType: RxGroupTypesEnum.CASH,
  } as unknown as IPerson;

  const accountMock = { phoneNumber: phoneNumberMock } as IAccount;

  const createAccountResponseMock: IPatientAccount = {
    ...patientAccountPrimaryMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    getAllRecordsForLoggedInPersonMock.mockResolvedValue([]);

    validateAutomationTokenMock.mockResolvedValue({ status: false });
    validateOneTimePasswordMock.mockResolvedValue(undefined);
    validateOneTimePasswordV2Mock.mockResolvedValue(undefined);

    validateRequestAgeMock.mockReturnValue(undefined);

    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);
    getPatientAccountByPhoneNumberMock.mockResolvedValue(undefined);

    isPatientAccountVerifiedMock.mockReturnValue(false);

    verifyPrescriptionInfoHelperMock.mockResolvedValue(undefined);

    buildTermsAndConditionsAcceptanceMock.mockReturnValue(
      termsAndConditionsAcceptanceMock
    );
    generateDeviceTokenMock.mockResolvedValue({ token: tokenMock });
    generateDeviceTokenV2Mock.mockResolvedValue({});
    verifyActivationRecordMock.mockResolvedValue({
      isValid: true,
    });

    generatePrimaryMemberFamilyIdMock.mockResolvedValue(undefined);
    createCashCoverageRecordMock.mockResolvedValue(undefined);
    setPatientAccountStatusToVerifiedMock.mockResolvedValue(undefined);

    updatePatientAccountTermsAndConditionsAcceptanceMock.mockResolvedValue(
      undefined
    );
    updatePatientAccountPinMock.mockResolvedValue(undefined);
    setPatientAndPatientAccountIdentifiersMock.mockResolvedValue(undefined);
    doesPatientBirthDateMatchMock.mockResolvedValue(true);
    doPatientFirstNameMatchMock.mockResolvedValue(true);
  });

  it('returns error if automation token is invalid', async () => {
    validateAutomationTokenMock.mockResolvedValue({
      status: true,
      errorMessage: 'error',
      errorRequest: 400,
    });

    const knownFailureMock = 'known-failure';
    knownFailureResponseMock.mockReturnValue(knownFailureMock);

    const result = await createAccountHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(result).toEqual(knownFailureMock);

    expectToHaveBeenCalledOnceOnlyWith(
      validateAutomationTokenMock,
      requestMock,
      responseMock,
      configurationMock,
      phoneNumberMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      400,
      'error',
      undefined,
      undefined
    );
  });

  it('returns error if code is invalid', async () => {
    const badRequestErrorMock = new BadRequestError('error-message', 1);
    validateOneTimePasswordMock.mockImplementation(() => {
      throw badRequestErrorMock;
    });

    const knownFailureMock = 'known-failure';
    knownFailureResponseMock.mockReturnValue(knownFailureMock);

    const result = await createAccountHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(result).toEqual(knownFailureMock);

    expectToHaveBeenCalledOnceOnlyWith(
      validateOneTimePasswordMock,
      twilioMock,
      configurationMock.twilioVerificationServiceId,
      phoneNumberMock,
      codeMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      badRequestErrorMock.message,
      undefined,
      badRequestErrorMock.internalCode
    );

    expect(searchAccountByPhoneNumberMock).not.toBeCalled();
    expect(buildNewAccountResponseMock).not.toBeCalled();
    expect(buildExistingAccountResponseMock).not.toBeCalled();
  });

  it('returns error if code is invalid (v2)', async () => {
    const badRequestErrorMock = new BadRequestError('error-message', 1);
    validateOneTimePasswordV2Mock.mockImplementation(() => {
      throw badRequestErrorMock;
    });

    const knownFailureMock = 'known-failure';
    knownFailureResponseMock.mockReturnValue(knownFailureMock);

    const result = await createAccountHandler(
      requestV2Mock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(result).toEqual(knownFailureMock);

    expectToHaveBeenCalledOnceOnlyWith(
      validateOneTimePasswordV2Mock,
      configurationMock,
      phoneNumberMock,
      codeMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      badRequestErrorMock.message,
      undefined,
      badRequestErrorMock.internalCode
    );
  });

  it('should skip otp verification if automation token is valid', async () => {
    validateAutomationTokenMock.mockResolvedValue({
      status: true,
    });
    getResponseLocalMock.mockReturnValue(codeMock);
    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue(undefined);

    await createAccountHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(validateAutomationToken).toBeCalledWith(
      requestMock,
      responseMock,
      configurationMock,
      phoneNumberMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      buildNewAccountResponseMock,
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      formattedDateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptanceMock,
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
  });

  it.each([
    [undefined, undefined],
    [[accountMock], undefined],
  ])(
    'returns known failure response if user is under the age limit based on account',
    async (
      account: IAccount[] | undefined,
      primaryMemberRxId: string | undefined
    ) => {
      const badRequestErrorMock = new BadRequestError('bad-request', 1);
      validateRequestAgeMock.mockImplementation(() => {
        throw badRequestErrorMock;
      });

      searchAccountByPhoneNumberMock.mockResolvedValue(account);
      const requestMockLocal = {
        body: {
          firstName: firstNameMock,
          lastName: lastNameMock,
          email: emailMock,
          dateOfBirth: dateOfBirthMock,
          phoneNumber: phoneNumberMock,
          code: codeMock,
          primaryMemberRxId,
        },
      } as Request;
      await createAccountHandler(
        requestMockLocal,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );

      expectToHaveBeenCalledOnceOnlyWith(
        validateRequestAgeMock,
        dateOfBirthMock,
        configurationMock.childMemberAgeLimit,
        firstNameMock.trim().toUpperCase(),
        lastNameMock.trim().toLocaleUpperCase(),
        undefined,
        ErrorConstants.ACCOUNT_CREATION_AGE_REQUIREMENT_NOT_MET(
          configurationMock.childMemberAgeLimit
        )
      );
      expectToHaveBeenCalledOnceOnlyWith(
        knownFailureResponseMock,
        responseMock,
        HttpStatusCodes.BAD_REQUEST,
        badRequestErrorMock.message,
        undefined,
        badRequestErrorMock.internalCode
      );
    }
  );

  it.each([[false], [true]])(
    'performs age verification (isAccountVerified: %p) (v2)',
    async (isAccountVerified: boolean) => {
      const badRequestErrorMock = new BadRequestError('bad-request', 1);
      validateRequestAgeMock.mockImplementation(() => {
        throw badRequestErrorMock;
      });

      getPatientAccountByPhoneNumberMock.mockResolvedValue(
        patientAccountPrimaryWithPatientMock
      );
      isPatientAccountVerifiedMock.mockReturnValue(isAccountVerified);

      const requestV2MockLocal = {
        body: {
          firstName: firstNameMock,
          lastName: lastNameMock,
          email: emailMock,
          dateOfBirth: dateOfBirthMock,
          phoneNumber: phoneNumberMock,
          code: codeMock,
        },
        headers: requestV2Mock.headers
      } as Request;
      await createAccountHandler(
        requestV2MockLocal,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );

      expect(isPatientAccountVerifiedMock).toHaveBeenCalledWith(
        patientAccountPrimaryWithPatientMock
      );

      if (!isAccountVerified) {
        expectToHaveBeenCalledOnceOnlyWith(
          validateRequestAgeMock,
          dateOfBirthMock,
          configurationMock.childMemberAgeLimit,
          firstNameMock.trim().toUpperCase(),
          lastNameMock.trim().toLocaleUpperCase(),
          undefined,
          ErrorConstants.ACCOUNT_CREATION_AGE_REQUIREMENT_NOT_MET(
            configurationMock.childMemberAgeLimit
          )
        );

        expectToHaveBeenCalledOnceOnlyWith(
          knownFailureResponseMock,
          responseMock,
          HttpStatusCodes.BAD_REQUEST,
          badRequestErrorMock.message,
          undefined,
          badRequestErrorMock.internalCode
        );
      } else {
        expect(validateRequestAgeMock).not.toHaveBeenCalled();
        expect(knownFailureResponseMock).not.toHaveBeenCalled();
      }
    }
  );

  it.each([['v1'], ['v2']])(
    'calls verifyActivationRecord to check if activationPersonRecord exists for that phoneNumber (version: %p)',
    async (versionMock: string) => {
      const accountMockWithPinHash: IAccount = {
        _id: 'id-1',
        firstName: firstNameMock,
        lastName: lastNameMock,
        dateOfBirth: dateOfBirthMock,
        phoneNumber: phoneNumberMock,
        accountKey: 'account-key',
        pinHash: 'hash-key',
      };

      isPatientAccountVerifiedMock.mockReturnValue(true);
      searchAccountByPhoneNumberMock.mockResolvedValue(accountMockWithPinHash);
      getPatientAccountByPhoneNumberMock.mockResolvedValue(
        accountMockWithPinHash
      );

      getAllRecordsForLoggedInPersonMock.mockResolvedValue([]);

      await createAccountHandler(
        versionMock === 'v1' ? requestMock : requestV2Mock,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );

      if (versionMock === 'v2') {
        expectToHaveBeenCalledOnceOnlyWith(
          getPatientAccountByPhoneNumberMock,
          configurationMock,
          phoneNumberMock
        );
      } else {
        expect(getPatientAccountByPhoneNumberMock).not.toHaveBeenCalled();
      }

      expectToHaveBeenCalledOnceOnlyWith(
        searchAccountByPhoneNumberMock,
        databaseMock,
        phoneNumberMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        verifyActivationRecordMock,
        databaseMock,
        phoneNumberMock,
        firstNameMock,
        formattedDateOfBirthMock,
        undefined,
        configurationMock,
        versionMock
      );
    }
  );

  it('returns failure response when user entered info not matches with activationRecord ', async () => {
    const accountMockWithPinHash: IAccount = {
      _id: 'id-1',
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      phoneNumber: phoneNumberMock,
      accountKey: 'account-key',
      pinHash: 'hash-key',
    };
    searchAccountByPhoneNumberMock.mockResolvedValue(accountMockWithPinHash);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([]);
    verifyActivationRecordMock.mockResolvedValue({ isValid: false });
    await createAccountHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );
    expectToHaveBeenCalledOnceOnlyWith(
      verifyActivationRecordMock,
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      formattedDateOfBirthMock,
      undefined,
      configurationMock,
      'v1'
    );
    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.ACCOUNT_CREATION_ACTIVATION_PERSON_RECORD_DATA_MISMATCH,
      undefined,
      InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH
    );
  });

  it.each([
    [undefined, undefined, undefined],
    [[siePersonMock], undefined, undefined],
    [[cashPersonMock], cashPersonMock, undefined],
    [[cashPersonMock], cashPersonMock, siePersonMock],
  ])(
    'calls buildExistingAccountResponse if account exists with correct value of cashMember and activationRecord',
    async (
      personList: IPerson[] | undefined,
      cashMember: IPerson | undefined,
      activationRecord: IPerson | undefined
    ) => {
      const accountMockWithPinHash: IAccount = {
        _id: 'id-1',
        firstName: firstNameMock,
        lastName: lastNameMock,
        dateOfBirth: dateOfBirthMock,
        phoneNumber: phoneNumberMock,
        accountKey: 'account-key',
        pinHash: 'hash-key',
      };
      searchAccountByPhoneNumberMock.mockResolvedValue(accountMockWithPinHash);
      verifyActivationRecordMock.mockResolvedValue({
        isValid: true,
        activationRecord,
      });
      getAllRecordsForLoggedInPersonMock.mockResolvedValue(personList);
      await createAccountHandler(
        requestMock,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildExistingAccountResponseMock,
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        tokenMock,
        accountMockWithPinHash,
        termsAndConditionsAcceptanceMock,
        cashMember,
        undefined,
        undefined,
        undefined,
        activationRecord,
        undefined,
        undefined,
        undefined,
        undefined,
      );
      expect(buildNewAccountResponseMock).not.toBeCalled();
    }
  );

  it.each([
    [[], undefined, undefined],
    [[siePersonMock], undefined, undefined],
    [[cashPersonMock], cashPersonMock, undefined],
    [[cashPersonMock], cashPersonMock, siePersonMock],
  ])(
    'calls buildExistingAccountResponse if account exists and verified with correct value of cashMember and activationRecord (v2)',
    async (
      personListMock: IPerson[],
      cashMemberMock: IPerson | undefined,
      activationRecordMock: IPerson | undefined
    ) => {
      const accountMockWithPinHash: IAccount = {
        _id: 'id-1',
        firstName: firstNameMock,
        lastName: lastNameMock,
        dateOfBirth: dateOfBirthMock,
        phoneNumber: phoneNumberMock,
        accountKey: 'account-key',
        pinHash: 'hash-key',
      };
      getPatientAccountByPhoneNumberMock.mockResolvedValue(
        patientAccountPrimaryWithPatientMock
      );
      searchAccountByPhoneNumberMock.mockResolvedValue(accountMockWithPinHash);

      isPatientAccountVerifiedMock.mockReturnValue(true);

      verifyActivationRecordMock.mockResolvedValue({
        isValid: true,
        activationRecord: activationRecordMock,
      });
      getAllRecordsForLoggedInPersonMock.mockResolvedValue(personListMock);

      const v2TokenMock = 'v2-token';
      generateDeviceTokenV2Mock.mockResolvedValue({ token: v2TokenMock });

      await createAccountHandler(
        requestV2Mock,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );

      expect(isPatientAccountVerifiedMock).toHaveBeenCalledWith(
        patientAccountPrimaryWithPatientMock
      );

      const expectedPhoneNumber = requestBody.phoneNumber;
      expectToHaveBeenCalledOnceOnlyWith(
        generateDeviceTokenV2Mock,
        expectedPhoneNumber,
        configurationMock,
        patientAccountPrimaryWithPatientMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildExistingAccountResponseMock,
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        v2TokenMock,
        accountMockWithPinHash,
        termsAndConditionsAcceptanceMock,
        cashMemberMock,
        undefined,
        undefined,
        undefined,
        activationRecordMock,
        undefined,
        patientAccountPrimaryWithPatientMock.patient?.id,
        patientAccountPrimaryWithPatientMock.accountId,
        undefined
      );
      expect(buildNewAccountResponseMock).not.toBeCalled();
    }
  );

  it.each([[false], [true]])(
    'calls createAccount for new account (hasCashProfile: %p) (v2)',
    async (hasCashProfileMock: boolean) => {
      const pinHashMock = 'pin-hash';
      const accountKeyMock = 'account-key';
      const accountWithPinHashMock: IAccount = {
        ...accountMock,
        pinHash: pinHashMock,
        accountKey: accountKeyMock,
      };
      searchAccountByPhoneNumberMock.mockResolvedValueOnce(
        accountWithPinHashMock
      );

      getPatientAccountByPhoneNumberMock.mockResolvedValue(undefined);

      getAllRecordsForLoggedInPersonMock.mockResolvedValue(
        hasCashProfileMock ? [cashPersonMock] : []
      );

      const newFamilyIdMock = 'new-family-id';
      generatePrimaryMemberFamilyIdMock.mockResolvedValue(newFamilyIdMock);

      const fromIPMock = 'from-ip';
      const browserMock = 'browser';
      const requestWithIPAndBrowserMock = {
        ...requestMock,
        socket: {
          remoteAddress: fromIPMock,
        } as Socket,
        headers: {
          'user-agent': browserMock,
          ...requestV2Mock.headers
        },
      } as Request;

      await createAccountHandler(
        requestWithIPAndBrowserMock,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );

      if (hasCashProfileMock) {
        expect(generatePrimaryMemberFamilyIdMock).not.toHaveBeenCalled();
      } else {
        expectToHaveBeenCalledOnceOnlyWith(
          generatePrimaryMemberFamilyIdMock,
          databaseMock,
          configurationMock
        );
      }

      const expectedFamilyId = hasCashProfileMock
        ? cashPersonMock.primaryMemberFamilyId
        : newFamilyIdMock;

      const { dateOfBirth, firstName, lastName, phoneNumber, email } =
        requestBody;
      const expectedIdentity: IIdentity = {
        isoDateOfBirth: dateFormat(dateOfBirth, 'yyyy-mm-dd'),
        firstName: firstName.trim().toUpperCase(),
        lastName: lastName.trim().toUpperCase(),
        phoneNumber,
        email,
      };
      expectToHaveBeenCalledOnceOnlyWith(
        createAccountMock,
        configurationMock,
        expectedIdentity,
        expectedFamilyId,
        accountKeyMock,
        pinHashMock,
        fromIPMock,
        browserMock
      );
    }
  );
  it('calls membershipVerificationHelperV2 if primaryMemberRxId is passed in the request body for v2', async () => {
    const requestWithMemberIdMock = {
      ...requestV2Mock,
      body: { ...requestV2Mock.body, primaryMemberRxId: 'member-id' },
    } as Request;
    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([]);
    membershipVerificationHelperV2Mock.mockReturnValueOnce({
      isValidMembership: true,
    });

    const createAccountResponseWithPatientMock: IPatientAccount = {
      ...patientAccountPrimaryWithPatientMock,
    };

    createAccountMock.mockResolvedValue(createAccountResponseWithPatientMock);

    const v2TokenMock = 'v2-token';
    generateDeviceTokenV2Mock.mockResolvedValue({ token: v2TokenMock });
    await createAccountHandler(
      requestWithMemberIdMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    const expectedDateOfBirth = '2010-01-01';

    expect(membershipVerificationHelperV2Mock).toBeCalledWith(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      expectedDateOfBirth,
      'member-id',
      configurationMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      buildNewAccountResponseMock,
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      formattedDateOfBirthMock,
      v2TokenMock,
      termsAndConditionsAcceptanceMock,
      false,
      'member-id',
      undefined,
      undefined,
      undefined,
      patientAccountPrimaryWithPatientMock.patient?.id,
      patientAccountPrimaryWithPatientMock.accountId,
      undefined
    );
    expect(buildExistingAccountResponseMock).not.toBeCalled();
  });

  it('returns failure response if membershipVerificationHelperV2 returns failure when primaryMemberRxId is passed in the request body for v2', async () => {
    const requestWithMemberIdMock = {
      ...requestV2Mock,
      body: { ...requestV2Mock.body, primaryMemberRxId: 'member-id' },
    } as Request;
    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([]);
    membershipVerificationHelperV2Mock.mockReturnValueOnce({
      isValidMembership: false,
      responseCode: 400,
    });

    await createAccountHandler(
      requestWithMemberIdMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    const expectedDateOfBirth = '2010-01-01';

    expect(membershipVerificationHelperV2Mock).toBeCalledWith(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      expectedDateOfBirth,
      'member-id',
      configurationMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ''
    );
  });

  it('should not call membership membershipVerificationHelperV2 if activation record exists and primaryMemberRxId is passed in the request body for v2', async () => {
    const requestWithMemberIdMock = {
      ...requestV2Mock,
      body: { ...requestV2Mock.body, primaryMemberRxId: 'member-id' },
    } as Request;

    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([]);
    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: true,
      activationPatientMasterId: 'patient-id',
      activationPatientMemberId: 'member-id',
      activationRecord: siePersonMock,
    });
    updatePatientAccountTermsAndConditionsAcceptanceMock.mockReturnValueOnce(
      patientAccountPrimaryWithPatientMock
    );
    createAccountMock.mockResolvedValue(createAccountResponseMock);
    getPatientAccountByPhoneNumberMock.mockResolvedValue(
      patientAccountPrimaryWithPatientMock
    );

    await createAccountHandler(
      requestWithMemberIdMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    const expectedDateOfBirth = '2010-01-01';

    expect(verifyActivationRecordMock).toBeCalledWith(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      expectedDateOfBirth,
      'member-id',
      configurationMock,
      'v2'
    );

    expect(membershipVerificationHelperV2Mock).not.toBeCalled();

    expectToHaveBeenCalledOnceOnlyWith(
      addMembershipPlanMock,
      patientAccountPrimaryWithPatientMock,
      patientAccountPrimaryWithPatientMock.patient,
      'patient-id',
      configurationMock,
      'member-id'
    );
  });

  it('activates membership plan when all validations are succeeded and primaryMemberRxId is passed in the request body for v2', async () => {
    const requestWithMemberIdMock = {
      ...requestV2Mock,
      body: { ...requestV2Mock.body, primaryMemberRxId: 'member-id' },
    } as Request;

    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([]);
    membershipVerificationHelperV2Mock.mockReturnValueOnce({
      isValidMembership: true,
      masterId: 'patient-id',
      memberId: 'member-id',
      member: siePersonMock,
    });
    updatePatientAccountTermsAndConditionsAcceptanceMock.mockReturnValueOnce(
      patientAccountPrimaryWithPatientMock
    );
    createAccountMock.mockResolvedValue(createAccountResponseMock);
    getPatientAccountByPhoneNumberMock.mockResolvedValue(
      patientAccountPrimaryWithPatientMock
    );

    await createAccountHandler(
      requestWithMemberIdMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    const expectedDateOfBirth = '2010-01-01';

    expect(membershipVerificationHelperV2Mock).toBeCalledWith(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      expectedDateOfBirth,
      'member-id',
      configurationMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      addMembershipPlanMock,
      patientAccountPrimaryWithPatientMock,
      patientAccountPrimaryWithPatientMock.patient,
      'patient-id',
      configurationMock,
      'member-id'
    );
  });

  it('generates device token using new account (v2)', async () => {
    getPatientAccountByPhoneNumberMock.mockResolvedValue(undefined);

    createAccountMock.mockResolvedValue(createAccountResponseMock);

    await createAccountHandler(
      requestV2Mock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    const expectedPhoneNumber = phoneNumberMock;
    expectToHaveBeenCalledOnceOnlyWith(
      generateDeviceTokenV2Mock,
      expectedPhoneNumber,
      configurationMock,
      createAccountResponseMock
    );
  });

  it('creates cash coverage record for new or unverified patient account', async () => {
    getPatientAccountByPhoneNumberMock.mockResolvedValue(undefined);

    createAccountMock.mockResolvedValue(createAccountResponseMock);

    const newFamilyIdMock = 'new-family-id';
    generatePrimaryMemberFamilyIdMock.mockResolvedValue(newFamilyIdMock);

    const createAccountResponseWithPatientMock: IPatientAccount = {
      ...patientAccountPrimaryWithPatientMock,
    };

    createAccountMock.mockResolvedValue(createAccountResponseWithPatientMock);

    const v2TokenMock = 'v2-token';
    generateDeviceTokenV2Mock.mockResolvedValue({ token: v2TokenMock });

    await createAccountHandler(
      requestV2Mock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      generatePrimaryMemberFamilyIdMock,
      databaseMock,
      configurationMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      createCashCoverageRecordMock,
      configurationMock,
      createAccountResponseMock.patientProfile?.split('/').pop(),
      newFamilyIdMock
    );
  });

  it('updates T&C acceptance for existing patient account (v2)', async () => {
    const masterIdMock = 'master-id';
    const existingPatientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryWithPatientMock,
      patient: {
        ...patientAccountPrimaryMock.patient,
        id: masterIdMock,
      },
    };

    const updatedPatientAccount = {
      ...existingPatientAccountMock,
      termsAndConditions: termsAndConditionsAcceptanceMock,
    };

    const accountWithPinHashMock: IAccount = {
      ...accountMock,
      accountKey: 'account-key-mock',
      pinHash: 'pin-hash-mock',
    };
    searchAccountByPhoneNumberMock.mockResolvedValue(accountWithPinHashMock);

    getPatientAccountByPhoneNumberMock.mockResolvedValue(
      existingPatientAccountMock
    );

    const v2TokenMock = 'v2-token';
    generateDeviceTokenV2Mock.mockResolvedValue({ token: v2TokenMock });

    buildTermsAndConditionsAcceptanceMock.mockReturnValue(
      termsAndConditionsAcceptanceMock
    );

    isPatientAccountVerifiedMock.mockReturnValue(false);

    updatePatientAccountTermsAndConditionsAcceptanceMock.mockReturnValue(
      updatedPatientAccount
    );

    getPinDetailsMock.mockReturnValue(undefined);

    await createAccountHandler(
      requestV2Mock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      buildTermsAndConditionsAcceptanceMock,
      requestV2Mock,
      v2TokenMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      updatePatientAccountTermsAndConditionsAcceptanceMock,
      configurationMock,
      existingPatientAccountMock,
      termsAndConditionsAcceptanceMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      updatePatientAccountPinMock,
      accountWithPinHashMock.accountKey,
      accountWithPinHashMock.pinHash,
      configurationMock,
      updatedPatientAccount
    );
  });

  it.each([
    [true, undefined, undefined, false],
    [false, undefined, undefined, false],
    [false, 'account-key', undefined, false],
    [false, undefined, 'pin-key', false],
    [false, 'account-key', 'pin-key', true],
  ])(
    'updates pin if no pin exists in patient account and account pin values exist (hasPin: %p, accountKey: %p, pinHash: %p) (v2)',
    async (
      hasPinMock: boolean,
      accountKeyMock: undefined | string,
      pinHashMock: undefined | string,
      isPinUpdateExpected: boolean
    ) => {
      const existingPatientAccountMock = patientAccountPrimaryWithPatientMock;
      getPatientAccountByPhoneNumberMock.mockResolvedValue(
        existingPatientAccountMock
      );

      getPinDetailsMock.mockReturnValue(hasPinMock);

      const accountWithPinHashMock: IAccount = {
        ...accountMock,
        accountKey: accountKeyMock,
        pinHash: pinHashMock,
      };
      searchAccountByPhoneNumberMock.mockResolvedValue(accountWithPinHashMock);

      updatePatientAccountTermsAndConditionsAcceptanceMock.mockReturnValueOnce(
        patientAccountPrimaryWithPatientMock
      );

      await createAccountHandler(
        requestV2Mock,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );

      expectToHaveBeenCalledOnceOnlyWith(
        getPinDetailsMock,
        existingPatientAccountMock
      );

      if (isPinUpdateExpected) {
        expectToHaveBeenCalledOnceOnlyWith(
          updatePatientAccountPinMock,
          accountKeyMock,
          pinHashMock,
          configurationMock,
          existingPatientAccountMock
        );
      } else {
        expect(updatePatientAccountPinMock).not.toHaveBeenCalled();
      }
    }
  );

  it('asserts patient account id exists in unverified account', async () => {
    const accountIdMock = 'account-id';
    const existingPatientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryWithPatientMock,
      accountId: accountIdMock,
    };
    getPatientAccountByPhoneNumberMock.mockResolvedValue(
      existingPatientAccountMock
    );

    isPatientAccountVerifiedMock.mockReturnValue(false);

    await createAccountHandler(
      requestV2Mock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(isPatientAccountVerifiedMock).toHaveBeenCalledWith(
      existingPatientAccountMock
    );

    expectToHaveBeenCalledOnceOnlyWith(assertHasAccountIdMock, accountIdMock);
  });

  it('asserts master (patient) id exists for unverified account', async () => {
    const masterIdMock = 'master-id';
    const existingPatientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryWithPatientMock,
      patient: {
        ...patientAccountPrimaryMock.patient,
        id: masterIdMock,
      },
    };
    getPatientAccountByPhoneNumberMock.mockResolvedValue(
      existingPatientAccountMock
    );

    isPatientAccountVerifiedMock.mockReturnValue(false);

    const v2TokenMock = 'v2-token';
    generateDeviceTokenV2Mock.mockResolvedValue({ token: v2TokenMock });

    await createAccountHandler(
      requestV2Mock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(isPatientAccountVerifiedMock).toHaveBeenCalledWith(
      existingPatientAccountMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      assertHasMasterIdMock,
      masterIdMock,
      phoneNumberMock
    );
  });

  it.each([[false], [true]])(
    'sets patient identifiers for unverified account (hasCashProfile: %p)',
    async (hasCashProfileMock: boolean) => {
      const patientIdMock = 'patient-id';
      const existingPatientAccountMock: IPatientAccount = {
        ...patientAccountPrimaryWithPatientMock,
        accountId: 'account-id',
      };
      getPatientAccountByPhoneNumberMock.mockResolvedValue(
        existingPatientAccountMock
      );

      isPatientAccountVerifiedMock.mockReturnValue(false);

      getAllRecordsForLoggedInPersonMock.mockResolvedValue(
        hasCashProfileMock ? [cashPersonMock] : []
      );

      const newFamilyIdMock = 'new-family-id';
      generatePrimaryMemberFamilyIdMock.mockResolvedValue(newFamilyIdMock);

      updatePatientAccountTermsAndConditionsAcceptanceMock.mockReturnValueOnce(
        existingPatientAccountMock
      );

      await createAccountHandler(
        requestV2Mock,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );

      expect(isPatientAccountVerifiedMock).toHaveBeenCalledWith(
        existingPatientAccountMock
      );

      if (hasCashProfileMock) {
        expect(generatePrimaryMemberFamilyIdMock).not.toHaveBeenCalled();
      } else {
        expectToHaveBeenCalledOnceOnlyWith(
          generatePrimaryMemberFamilyIdMock,
          databaseMock,
          configurationMock
        );
      }

      const expectedFamilyId = hasCashProfileMock
        ? cashPersonMock.primaryMemberFamilyId
        : newFamilyIdMock;
      expectToHaveBeenCalledOnceOnlyWith(
        setPatientAndPatientAccountIdentifiersMock,
        configurationMock,
        existingPatientAccountMock,
        expectedFamilyId,
        patientIdMock,
        phoneNumberMock
      );
    }
  );

  it('creates cash coverage record for unverified account', async () => {
    const patientIdMock = 'patient-id';
    const existingPatientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryWithPatientMock,
      accountId: 'account-id',
    };
    getPatientAccountByPhoneNumberMock.mockResolvedValue(
      existingPatientAccountMock
    );

    isPatientAccountVerifiedMock.mockReturnValue(false);

    const newFamilyIdMock = 'new-family-id';
    generatePrimaryMemberFamilyIdMock.mockResolvedValue(newFamilyIdMock);

    await createAccountHandler(
      requestV2Mock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expect(isPatientAccountVerifiedMock).toHaveBeenCalledWith(
      existingPatientAccountMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      generatePrimaryMemberFamilyIdMock,
      databaseMock,
      configurationMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      createCashCoverageRecordMock,
      configurationMock,
      patientIdMock,
      newFamilyIdMock
    );
  });

  it('sets status to verified for unverified account', async () => {
    const accountIdMock = 'account-id';
    const existingPatientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryWithPatientMock,
      accountId: accountIdMock,
      patient: {
        ...patientAccountPrimaryWithPatientMock.patient,
        id: 'patient-id',
      },
    };
    getPatientAccountByPhoneNumberMock.mockResolvedValue(
      existingPatientAccountMock
    );

    isPatientAccountVerifiedMock.mockReturnValue(false);

    await createAccountHandler(
      requestV2Mock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      setPatientAccountStatusToVerifiedMock,
      configurationMock,
      accountIdMock
    );
  });

  it.each([[false], [true]])(
    'builds existing account for unverified patient account (hasCashProfile: %p)',
    async (hasCashProfileMock: boolean) => {
      getPatientAccountByPhoneNumberMock.mockResolvedValue(
        patientAccountPrimaryWithPatientMock
      );

      const accountMock: Partial<IAccount> = {
        dateOfBirth: dateOfBirthMock,
      };
      searchAccountByPhoneNumberMock.mockResolvedValue(accountMock);

      isPatientAccountVerifiedMock.mockReturnValue(false);

      getAllRecordsForLoggedInPersonMock.mockResolvedValue(
        hasCashProfileMock ? [cashPersonMock] : []
      );

      const newFamilyIdMock = 'new-family-id';
      generatePrimaryMemberFamilyIdMock.mockResolvedValue(newFamilyIdMock);

      const v2TokenMock = 'v2-token';
      generateDeviceTokenV2Mock.mockResolvedValue({ token: v2TokenMock });

      const createAccountResponseWithPatientMock: IPatientAccount = {
        ...patientAccountPrimaryWithPatientMock,
      };

      createAccountMock.mockResolvedValue(createAccountResponseWithPatientMock);

      await createAccountHandler(
        requestV2Mock,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );

      expectToHaveBeenCalledOnceOnlyWith(
        buildExistingAccountResponseMock,
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        v2TokenMock,
        accountMock,
        termsAndConditionsAcceptanceMock,
        hasCashProfileMock ? cashPersonMock : undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        hasCashProfileMock ? undefined : newFamilyIdMock,
        patientAccountPrimaryWithPatientMock.patient?.id,
        patientAccountPrimaryWithPatientMock.accountId,
        undefined
      );
    }
  );

  it.each([[false], [true]])(
    'calls buildNewAccountResponse with master id and account id (hasCashProfile: %p)(v2)',
    async (hasCashProfileMock: boolean) => {
      getPatientAccountByPhoneNumberMock.mockResolvedValue(undefined);
      createAccountMock.mockResolvedValue(createAccountResponseMock);

      getAllRecordsForLoggedInPersonMock.mockResolvedValue(
        hasCashProfileMock ? [cashPersonMock] : []
      );

      const newFamilyIdMock = 'new-family-id';
      generatePrimaryMemberFamilyIdMock.mockResolvedValue(newFamilyIdMock);

      const v2TokenMock = 'v2-token';
      generateDeviceTokenV2Mock.mockResolvedValue({ token: v2TokenMock });

      const createAccountResponseWithPatientMock: IPatientAccount = {
        ...patientAccountPrimaryWithPatientMock,
      };

      createAccountMock.mockResolvedValue(createAccountResponseWithPatientMock);

      await createAccountHandler(
        requestV2Mock,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );
      const expectedFamilyId = hasCashProfileMock
        ? cashPersonMock.primaryMemberFamilyId
        : newFamilyIdMock;
      expectToHaveBeenCalledOnceOnlyWith(
        buildNewAccountResponseMock,
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        firstNameMock,
        lastNameMock,
        emailMock,
        formattedDateOfBirthMock,
        v2TokenMock,
        termsAndConditionsAcceptanceMock,
        hasCashProfileMock,
        undefined,
        undefined,
        undefined,
        undefined,
        createAccountResponseMock.patientProfile?.split('/').pop(),
        createAccountResponseMock.accountId,
        expectedFamilyId
      );
    }
  );

  it.each([
    [undefined, undefined, undefined],
    [{ phoneNumber: phoneNumberMock, _id: '1' }, undefined, undefined],
    [undefined, [siePersonMock], undefined],
    [{ phoneNumber: phoneNumberMock, _id: '1' }, [siePersonMock], undefined],
    [undefined, [cashPersonMock], cashPersonMock],
    [
      { phoneNumber: phoneNumberMock, _id: '1' },
      [cashPersonMock],
      cashPersonMock,
    ],
  ])(
    'calls buildNewAccountResponse with correct value of cashMember if account does not exist (account: %p)',
    async (
      account: IAccount | undefined,
      personList: IPerson[] | undefined,
      cashMember: IPerson | undefined
    ) => {
      searchAccountByPhoneNumberMock.mockResolvedValue(account);
      getAllRecordsForLoggedInPersonMock.mockResolvedValue(personList);
      await createAccountHandler(
        requestMock,
        responseMock,
        databaseMock,
        configurationMock,
        twilioMock,
      );
      expectToHaveBeenCalledOnceOnlyWith(
        buildNewAccountResponseMock,
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        firstNameMock,
        lastNameMock,
        emailMock,
        formattedDateOfBirthMock,
        tokenMock,
        termsAndConditionsAcceptanceMock,
        !!cashMember,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        cashMember?.primaryMemberFamilyId
      );
      expect(buildExistingAccountResponseMock).not.toBeCalled();
    }
  );

  it('calls errorResponseWithTwilioErrorHandlingMock when any other exception occurs', async () => {
    const error: Partial<RestException> = {
      message: 'internal error',
      status: 1,
    };
    validateAutomationTokenMock.mockImplementation(() => {
      throw error;
    });
    const expected = {};
    errorResponseWithTwilioErrorHandlingMock.mockReturnValue(expected);

    const actual = await createAccountHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      errorResponseWithTwilioErrorHandlingMock,
      responseMock,
      phoneNumberMock,
      error
    );
    expect(searchAccountByPhoneNumberMock).not.toBeCalled();
    expect(actual).toBe(expected);
  });

  it('calls buildNewAccountResponse with primaryMemberRxId if firstName and account does not exist', async () => {
    const requestWithFeatureFlagMock = {
      ...requestMock,
      body: { ...requestMock.body, primaryMemberRxId: 'member-id' },
    } as Request;
    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([]);

    await createAccountHandler(
      requestWithFeatureFlagMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      buildNewAccountResponseMock,
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      formattedDateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptanceMock,
      false,
      'member-id',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(buildExistingAccountResponseMock).not.toBeCalled();
  });

  it('calls buildExistingAccountResponse with primaryMemberRxId if given and account exists with correct value of cashMember', async () => {
    const accountMockWithPinHash: IAccount = {
      _id: 'id-1',
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      phoneNumber: phoneNumberMock,
      accountKey: 'account-key',
      pinHash: 'hash-key',
    };
    const memberIdMock = 'member-id';
    const requestWithFeatureFlagMock = {
      ...requestMock,
      body: { ...requestMock.body, primaryMemberRxId: memberIdMock },
    } as Request;

    searchAccountByPhoneNumberMock.mockResolvedValue(accountMockWithPinHash);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([cashPersonMock]);

    await createAccountHandler(
      requestWithFeatureFlagMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      buildExistingAccountResponseMock,
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      tokenMock,
      accountMockWithPinHash,
      termsAndConditionsAcceptanceMock,
      cashPersonMock,
      memberIdMock,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(buildNewAccountResponseMock).not.toBeCalled();
  });

  it('calls buildNewAccountResponse with prescription address and phone number if prescription id is set and no account exists', async () => {
    const body: ICreateAccountRequestBody = {
      firstName: firstNameMock,
      lastName: lastNameMock,
      email: emailMock,
      dateOfBirth: dateOfBirthMock,
      code: codeMock,
      prescriptionId: 'mock-id',
      phoneNumber: '+1111111111',
    };

    const requestWithPrescriptionIdMock = {
      body,
    } as Request;

    const prescriptionPhoneNumberMock = '111111111';
    const memberAddressMock: IMemberAddress = {
      address1: '1 Main Avenue',
      address2: 'Park Central',
      county: 'GreenBay',
      city: 'Racoon City',
      state: 'WI',
      zip: '23433',
    };
    const updatedPrescriptionParamsMock = {
      clientPatientId: 'CAJY01',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);
    verifyPrescriptionInfoHelperMock.mockResolvedValue({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: prescriptionPhoneNumberMock,
        address: memberAddressMock,
        lastName: 'last-name',
        updatePrescriptionParams: updatedPrescriptionParamsMock,
      },
    });
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([cashPersonMock]);

    await createAccountHandler(
      requestWithPrescriptionIdMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      verifyPrescriptionInfoHelperMock,
      databaseMock,
      {
        prescriptionId: 'mock-id',
        firstName: firstNameMock,
        dateOfBirth: formattedDateOfBirthMock,
      },
      configurationMock,
      [cashPersonMock],
      undefined
    );

    expectToHaveBeenCalledOnceOnlyWith(
      buildNewAccountResponseMock,
      responseMock,
      databaseMock,
      configurationMock,
      prescriptionPhoneNumberMock,
      firstNameMock,
      'LAST-NAME',
      emailMock,
      formattedDateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptanceMock,
      true,
      undefined,
      memberAddressMock,
      updatedPrescriptionParamsMock,
      undefined,
      undefined,
      undefined,
      cashPersonMock.primaryMemberFamilyId
    );
    expect(buildExistingAccountResponseMock).not.toBeCalled();
  });

  it('calls buildExistingAccountResponse with prescription address and phone number info if prescription id is set and account exists', async () => {
    const accountMockWithPinHash: IAccount = {
      _id: 'id-1',
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      phoneNumber: phoneNumberMock,
      accountKey: 'account-key',
      pinHash: 'hash-key',
    };
    const body: ICreateAccountRequestBody = {
      firstName: firstNameMock,
      lastName: lastNameMock,
      email: emailMock,
      dateOfBirth: dateOfBirthMock,
      code: codeMock,
      prescriptionId: 'mock-id',
      phoneNumber: '+1111111111',
    };

    const requestWithPrescriptionIdMock = {
      body,
    } as Request;
    const prescriptionPhoneNumberMock = '111111111';
    const memberAddressMock: IMemberAddress = {
      address1: '1 Main Avenue',
      address2: 'Park Central',
      county: 'GreenBay',
      city: 'Racoon City',
      state: 'WI',
      zip: '23433',
    };
    const updatedPrescriptionParamsMock = {
      clientPatientId: 'CAJY01',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    verifyPrescriptionInfoHelperMock.mockResolvedValue({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: prescriptionPhoneNumberMock,
        address: memberAddressMock,
        lastName: 'last-name',
        updatePrescriptionParams: updatedPrescriptionParamsMock,
      },
    });
    searchAccountByPhoneNumberMock.mockResolvedValue(accountMockWithPinHash);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([cashPersonMock]);

    await createAccountHandler(
      requestWithPrescriptionIdMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      verifyPrescriptionInfoHelperMock,
      databaseMock,
      {
        prescriptionId: 'mock-id',
        firstName: firstNameMock,
        dateOfBirth: formattedDateOfBirthMock,
      },
      configurationMock,
      [cashPersonMock],
      undefined
    );

    expectToHaveBeenCalledOnceOnlyWith(
      buildExistingAccountResponseMock,
      responseMock,
      databaseMock,
      configurationMock,
      prescriptionPhoneNumberMock,
      tokenMock,
      accountMockWithPinHash,
      termsAndConditionsAcceptanceMock,
      cashPersonMock,
      undefined,
      memberAddressMock,
      updatedPrescriptionParamsMock,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(buildNewAccountResponseMock).not.toBeCalled();
  });

  it('calls buildNewAccountResponseMock without address information if prescription id is correctly challenged and lacks address', async () => {
    const body: ICreateAccountRequestBody = {
      firstName: firstNameMock,
      lastName: lastNameMock,
      email: emailMock,
      dateOfBirth: dateOfBirthMock,
      code: codeMock,
      prescriptionId: 'mock-id',
      phoneNumber: '+1111111111',
    };

    const updatedPrescriptionParamsMock = {
      clientPatientId: 'CAJY01',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    const requestWithPrescriptionIdMock = {
      body,
    } as Request;

    const prescriptionPhoneNumberMock = '111111111';
    verifyPrescriptionInfoHelperMock.mockResolvedValue({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: prescriptionPhoneNumberMock,
        address: undefined,
        lastName: 'last-name',
        updatePrescriptionParams: updatedPrescriptionParamsMock,
      },
    });
    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([cashPersonMock]);

    await createAccountHandler(
      requestWithPrescriptionIdMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      verifyPrescriptionInfoHelperMock,
      databaseMock,
      {
        prescriptionId: 'mock-id',
        firstName: firstNameMock,
        dateOfBirth: formattedDateOfBirthMock,
      },
      configurationMock,
      [cashPersonMock],
      undefined
    );
    expectToHaveBeenCalledOnceOnlyWith(
      buildNewAccountResponseMock,
      responseMock,
      databaseMock,
      configurationMock,
      prescriptionPhoneNumberMock,
      firstNameMock,
      'LAST-NAME',
      emailMock,
      formattedDateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptanceMock,
      true,
      undefined,
      undefined,
      updatedPrescriptionParamsMock,
      undefined,
      undefined,
      undefined,
      cashPersonMock.primaryMemberFamilyId
    );
    expect(buildExistingAccountResponseMock).not.toBeCalled();
  });

  it('calls buildExistingAccountResponse without address information if prescription id is correctly challenged and lacks address', async () => {
    const requestWithPrescriptionIdMock = {
      body: {
        firstName: firstNameMock,
        lastName: lastNameMock,
        email: emailMock,
        dateOfBirth: dateOfBirthMock,
        code: codeMock,
        prescriptionId: 'mock-id',
      },
    } as Request;
    const prescriptionPhoneNumberMock = '111111111';
    const accountMockWithPinHash: IAccount = {
      _id: 'id-1',
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      phoneNumber: phoneNumberMock,
      accountKey: 'account-key',
      pinHash: 'hash-key',
    };
    const updatedPrescriptionParamsMock = {
      clientPatientId: 'CAJY01',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    verifyPrescriptionInfoHelperMock.mockReset();
    verifyPrescriptionInfoHelperMock.mockResolvedValue({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: prescriptionPhoneNumberMock,
        address: undefined,
        lastName: 'last-name',
        updatePrescriptionParams: updatedPrescriptionParamsMock,
      },
    });
    searchAccountByPhoneNumberMock.mockResolvedValue(accountMockWithPinHash);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([cashPersonMock]);

    await createAccountHandler(
      requestWithPrescriptionIdMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      verifyPrescriptionInfoHelperMock,
      databaseMock,
      {
        prescriptionId: 'mock-id',
        firstName: firstNameMock,
        dateOfBirth: formattedDateOfBirthMock,
      },
      configurationMock,
      [cashPersonMock],
      undefined
    );
    expectToHaveBeenCalledOnceOnlyWith(
      buildExistingAccountResponseMock,
      responseMock,
      databaseMock,
      configurationMock,
      prescriptionPhoneNumberMock,
      tokenMock,
      accountMockWithPinHash,
      termsAndConditionsAcceptanceMock,
      cashPersonMock,
      undefined,
      undefined,
      updatedPrescriptionParamsMock,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(buildNewAccountResponseMock).not.toBeCalled();
  });

  it('returns BAD_REQUEST if prescription id is sent and prescription challenge succeeds but lacks a contact telephone number', async () => {
    const accountMockWithPinHash: IAccount = {
      _id: 'id-1',
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      phoneNumber: phoneNumberMock,
      accountKey: 'account-key',
      pinHash: 'hash-key',
    };
    const requestWithPrescriptionIdMock = {
      body: {
        firstName: firstNameMock,
        lastName: lastNameMock,
        email: emailMock,
        dateOfBirth: dateOfBirthMock,
        code: codeMock,
        prescriptionId: 'mock-id',
      },
    } as Request;
    const prescriptionAddressMock: IMemberAddress = {
      address1: '1 Main Avenue',
      address2: 'Park Central',
      county: 'GreenBay',
      city: 'Racoon City',
      state: 'WI',
      zip: '23433',
    };
    const updatedPrescriptionParamsMock = {
      clientPatientId: 'CAJY01',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };

    verifyPrescriptionInfoHelperMock.mockResolvedValue({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: undefined,
        address: prescriptionAddressMock,
        lastName: 'last-name',
        updatePrescriptionParams: updatedPrescriptionParamsMock,
      },
    });
    searchAccountByPhoneNumberMock.mockResolvedValue(accountMockWithPinHash);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([cashPersonMock]);

    await createAccountHandler(
      requestWithPrescriptionIdMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      verifyPrescriptionInfoHelperMock,
      databaseMock,
      {
        prescriptionId: 'mock-id',
        firstName: firstNameMock,
        dateOfBirth: formattedDateOfBirthMock,
      },
      configurationMock,
      [cashPersonMock],
      undefined
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.INVALID_PRESCRIPTION_DATA,
      undefined,
      undefined
    );
  });

  it('returns FAILURE response if prescription id is passed and verifyPrescriptionHelperResponse returns false', async () => {
    const accountMockWithPinHash: IAccount = {
      _id: 'id-1',
      firstName: firstNameMock,
      lastName: lastNameMock,
      dateOfBirth: dateOfBirthMock,
      phoneNumber: phoneNumberMock,
      accountKey: 'account-key',
      pinHash: 'hash-key',
    };
    const requestWithPrescriptionIdMock = {
      body: {
        firstName: firstNameMock,
        lastName: lastNameMock,
        email: emailMock,
        dateOfBirth: dateOfBirthMock,
        code: codeMock,
        prescriptionId: 'mock-id',
      },
    } as Request;
    verifyPrescriptionInfoHelperMock.mockResolvedValue({
      prescriptionIsValid: false,
      errorCode: HttpStatusCodes.BAD_REQUEST,
      errorMessage: ErrorConstants.PRESCRIPTION_DATA_DOES_NOT_MATCH,
    });
    searchAccountByPhoneNumberMock.mockResolvedValue(accountMockWithPinHash);
    getAllRecordsForLoggedInPersonMock.mockResolvedValue([cashPersonMock]);

    await createAccountHandler(
      requestWithPrescriptionIdMock,
      responseMock,
      databaseMock,
      configurationMock,
      twilioMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      verifyPrescriptionInfoHelperMock,
      databaseMock,
      {
        prescriptionId: 'mock-id',
        firstName: firstNameMock,
        dateOfBirth: formattedDateOfBirthMock,
      },
      configurationMock,
      [cashPersonMock],
      undefined
    );
    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.PRESCRIPTION_DATA_DOES_NOT_MATCH,
      undefined,
      undefined
    );
  });
});
