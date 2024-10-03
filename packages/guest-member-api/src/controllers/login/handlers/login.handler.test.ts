// Copyright 2020 Prescryptive Health, Inc.

import { loginHandler } from './login.handler';
import { Request, Response } from 'express';
import { LoginMessages } from '../../../constants/response-messages';
import { existingAccountHelper } from '../helpers/existing-account.helper';
import {
  HttpStatusCodes,
  InternalErrorCode,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import { trackActivationPersonFailureEvent } from '../../../utils/custom-event-helper';
import {
  KnownFailureResponse,
  SuccessResponseWithoutHeaders,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { membershipVerificationHelper } from '../../members/helpers/membership-verification.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  publishPersonUpdatePatientDetailsMessage,
  publishPhoneNumberVerificationMessage,
} from '../../../utils/service-bus/person-update-helper';
import { getAllRecordsForLoggedInPerson } from '../../../utils/person/get-logged-in-person.helper';
import { createCashProfileAndAddToRedis } from '../../../utils/person/create-cash-profile-and-add-to-redis';
import { loginSuccessResponse } from '../helpers/login-response.helper';
import { IPerson } from '@phx/common/src/models/person';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { ErrorConstants } from '../../../constants/response-messages';
import { getAllPendingPrescriptionsByIdentifierFromMessageEnvelope } from '../../../databases/mongo-database/v1/query-helper/pending-prescriptions.query-helper';
import { trackClaimAlertUnauthorizeFailureEvent } from '../../../utils/claim-alert.custom-event.helper';
import { verifyActivationRecord } from '../../../utils/verify-activation-record';
import { addPhoneRegistrationKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { verifyPrescriptionInfoHelper } from '../../prescription/helpers/verify-prescription-info.helper';
import { processNewAccountOnLogin } from '../helpers/process-new-account-on-login';
import { databaseMock } from '../../../mock-data/database.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { IAppLocals } from '../../../models/app-locals';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithPatientMock,
} from '../../../mock-data/patient-account.mock';
import { ILoginRequestBody } from '@phx/common/src/models/api-request-body/login.request-body';
import dateFormat from 'dateformat';
import { RequestError } from '../../../errors/request-errors/request.error';
import { validateRequestAge } from '../../../utils/request/validate-request-age';
import { generatePrimaryMemberFamilyId } from '../../../utils/person/person-creation.helper';
import { findCashProfile } from '../../../utils/person/find-profile.helper';
import { IIdentity } from '../../../models/identity';
import { EndpointVersion } from '../../../models/endpoint-version';
import { addMembershipPlan } from '../../members/helpers/add-membership-link.helper';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('../../members/helpers/add-membership-link.helper');
const addMembershipPlanMock = addMembershipPlan as jest.Mock;

jest.mock('../../../utils/custom-event-helper');
const trackActivationPersonFailureEventMock =
  trackActivationPersonFailureEvent as jest.Mock;

jest.mock('../../../utils/response-helper');
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const UnknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const SuccessResponseWithoutHeadersMock =
  SuccessResponseWithoutHeaders as jest.Mock;

jest.mock('../../members/helpers/membership-verification.helper');
const membershipVerificationHelperMock =
  membershipVerificationHelper as jest.Mock;

jest.mock('../../../utils/request/request-app-locals.helper');
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;

jest.mock('../helpers/existing-account.helper');
const existingAccountHelperMock = existingAccountHelper as jest.Mock;

jest.mock('../../../utils/service-bus/person-update-helper');
const publishPhoneNumberVerificationMessageMock =
  publishPhoneNumberVerificationMessage as jest.Mock;
const publishPersonUpdatePatientDetailsMessageMock =
  publishPersonUpdatePatientDetailsMessage as jest.Mock;

jest.mock('../../../utils/person/get-logged-in-person.helper');
const getAllRecordsForLoggedInPersonMock =
  getAllRecordsForLoggedInPerson as jest.Mock;

jest.mock('../../../utils/person/create-cash-profile-and-add-to-redis');
const createCashProfileAndAddToRedisMock =
  createCashProfileAndAddToRedis as jest.Mock;

jest.mock('../helpers/login-response.helper');
const loginSuccessResponseMock = loginSuccessResponse as jest.Mock;

jest.mock('../../prescription/helpers/verify-prescription-info.helper');
const verifyPrescriptionInfoHelperMock =
  verifyPrescriptionInfoHelper as jest.Mock;

jest.mock(
  '../../../databases/mongo-database/v1/query-helper/pending-prescriptions.query-helper'
);
const getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock =
  getAllPendingPrescriptionsByIdentifierFromMessageEnvelope as jest.Mock;

jest.mock('../../../utils/claim-alert.custom-event.helper');
const trackClaimAlertUnauthorizeFailureEventMock =
  trackClaimAlertUnauthorizeFailureEvent as jest.Mock;

jest.mock('../../../utils/verify-activation-record');
const verifyActivationRecordMock = verifyActivationRecord as jest.Mock;

jest.mock('../../../databases/redis/redis-query-helper');
const addPhoneRegistrationKeyInRedisMock =
  addPhoneRegistrationKeyInRedis as jest.Mock;

jest.mock('../helpers/process-new-account-on-login');
const processNewAccountOnLoginMock = processNewAccountOnLogin as jest.Mock;

jest.mock('../../../utils/request/validate-request-age');
const validateRequestAgeMock = validateRequestAge as jest.Mock;

jest.mock('../../../utils/person/person-creation.helper');
const generatePrimaryMemberFamilyIdMock =
  generatePrimaryMemberFamilyId as jest.Mock;

jest.mock('../../../utils/person/find-profile.helper');
const findCashProfileMock = findCashProfile as jest.Mock;

const v2: EndpointVersion = 'v2';

describe('loginHandler -> ', () => {
  const primaryMemberRxIdMock = '1234567890';
  const firstNameMock = 'Johnny';
  const lastNameMock = 'Appleseed';
  const firstNameUpperCaseMock = 'JOHNNY';
  const lastNameUpperCaseMock = 'APPLESEED';
  const dateOfBirthMock = '01/01/2020';
  const formattedDateOfBirthMock = '2020-01-01';
  const phoneNumberMock = '111-222-3333';
  const accountRecoveryEmail = 'test@test.com';
  const prescriptionIdMock = 'mock-id';
  const claimAlertIdMock = 'claim-alert-id';
  const addressMock: IMemberAddress = {
    address1: 'Mock address #1',
    address2: 'Mock 2 address',
    city: 'Mock city',
    state: 'Mock state',
    zip: 'Mock zip',
    county: 'Mock county',
  };
  const responseMock = {
    locals: { device: { data: phoneNumberMock } },
  } as unknown as Response;

  const mockLoginData = {
    dateOfBirth: dateOfBirthMock,
    firstName: firstNameMock,
    lastName: lastNameMock.trim().toUpperCase(),
    primaryMemberRxId: primaryMemberRxIdMock,
    accountRecoveryEmail,
  };
  const mockLoginDataWithPrescription = {
    dateOfBirth: dateOfBirthMock,
    firstName: firstNameMock,
    lastName: lastNameMock,
    accountRecoveryEmail,
    prescriptionId: prescriptionIdMock,
  };
  const mockLoginDataWithClaimAlertId = {
    dateOfBirth: dateOfBirthMock,
    firstName: firstNameMock,
    lastName: lastNameMock,
    accountRecoveryEmail,
    claimAlertId: claimAlertIdMock,
  };
  const requestMock = {
    body: mockLoginData,
    headers: {
      authorization: 'token',
    },
  } as Request;
  const requestMockWithPrescription = {
    body: mockLoginDataWithPrescription,
    headers: {
      authorization: 'token',
    },
  } as Request;

  beforeEach(() => {
    jest.clearAllMocks();
    getRequiredResponseLocalMock.mockReturnValue({ data: phoneNumberMock });
    membershipVerificationHelperMock.mockReturnValue({
      isValidMembership: false,
    });
    getAllRecordsForLoggedInPersonMock.mockReturnValue(null);
    verifyActivationRecordMock.mockReturnValue({ isValid: true });
    getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock.mockReturnValueOnce(
      null
    );

    processNewAccountOnLoginMock.mockResolvedValue(undefined);
    findCashProfileMock.mockReturnValue({});
  });

  it('validates age', async () => {
    await loginHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      validateRequestAgeMock,
      dateOfBirthMock,
      configurationMock.childMemberAgeLimit,
      firstNameMock.trim().toUpperCase(),
      lastNameMock.trim().toUpperCase(),
      primaryMemberRxIdMock
    );
  });

  it('existingAccountHelper is called and returned if optional "primaryMemberRxId" value is absent', async () => {
    const requestMockWithNoPrimaryId = {
      app: {
        locals: {
          device: { data: phoneNumberMock },
        },
      },
      body: { ...mockLoginData, ...{ primaryMemberRxId: null } },
      headers: {
        authorization: 'token',
      },
    } as unknown as Request;

    const successResponseMock = 'success';
    SuccessResponseWithoutHeadersMock.mockReturnValue(successResponseMock);

    const response = await loginHandler(
      requestMockWithNoPrimaryId,
      responseMock,
      databaseMock,
      configurationMock,
    );
    expect(existingAccountHelperMock).toBeCalledWith(
      databaseMock,
      phoneNumberMock,
      (firstNameMock?.trim() ?? '').toUpperCase(),
      (lastNameMock?.trim() ?? '').toUpperCase(),
      formattedDateOfBirthMock,
      accountRecoveryEmail,
      configurationMock,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    expectToHaveBeenCalledOnceOnlyWith(
      SuccessResponseWithoutHeadersMock,
      responseMock,
      LoginMessages.AUTHENTICATION_SUCCESSFUL,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
    expect(response).toEqual(successResponseMock);
  });

  it('existingAccountHelper is called with updatePrescriptionParams in case of prescriptionFlow', async () => {
    const requestMockWithNoPrimaryId = {
      app: { locals: { device: { data: '+11112223333' } } },
      body: mockLoginDataWithPrescription,
      headers: {
        authorization: 'token',
      },
    } as unknown as Request;
    const updatedPrescriptionParamsMock = {
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };

    getAllRecordsForLoggedInPersonMock.mockReturnValueOnce([]);
    verifyPrescriptionInfoHelperMock.mockReturnValueOnce({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: phoneNumberMock,
        lastName: lastNameMock,
        address: addressMock,
        updatePrescriptionParams: updatedPrescriptionParamsMock,
      },
    });

    const successResponseMock = 'success';
    SuccessResponseWithoutHeadersMock.mockReturnValue(successResponseMock);

    const response = await loginHandler(
      requestMockWithNoPrimaryId,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(existingAccountHelperMock).toBeCalledWith(
      databaseMock,
      phoneNumberMock,
      (firstNameMock?.trim() ?? '').toUpperCase(),
      (lastNameMock?.trim() ?? '').toUpperCase(),
      formattedDateOfBirthMock,
      accountRecoveryEmail,
      configurationMock,
      addressMock,
      updatedPrescriptionParamsMock,
      undefined,
      undefined,
      undefined
    );

    expectToHaveBeenCalledOnceOnlyWith(
      SuccessResponseWithoutHeadersMock,
      responseMock,
      LoginMessages.AUTHENTICATION_SUCCESSFUL,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
    expect(response).toEqual(successResponseMock);
  });

  it('publishes phone number verification message when "primaryMemberRxId" value is present and membership is verified', async () => {
    const memberMock = {
      identifier: '123',
      firstName: firstNameMock,
      lastName: lastNameMock,
      primaryMemberRxId: primaryMemberRxIdMock,
    } as IPerson;

    membershipVerificationHelperMock.mockReturnValueOnce({
      member: memberMock,
      isValidMembership: true,
    });

    await loginHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(publishPhoneNumberVerificationMessageMock).toBeCalledWith(
      memberMock.identifier,
      phoneNumberMock
    );
    expect(addPhoneRegistrationKeyInRedisMock).toBeCalledWith(
      phoneNumberMock,
      memberMock,
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
    );
  });

  it('creates CASH profile if does not exist when "primaryMemberRxId" value is present and membership is verified and add masterId to CASH profile if masteriD exist in PBM profile (masterId %p)', async () => {
    const sieRecordMock = {
      identifier: 'identifier-1',
      rxGroupType: 'SIE',
      firstName: firstNameUpperCaseMock,
      lastName: lastNameUpperCaseMock,
      primaryMemberRxId: primaryMemberRxIdMock,
    };

    getAllRecordsForLoggedInPersonMock.mockReturnValue([sieRecordMock]);
    membershipVerificationHelperMock.mockReturnValueOnce({
      member: sieRecordMock,
      isValidMembership: true,
    });
    findCashProfileMock.mockReturnValue(undefined);

    await loginHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(createCashProfileAndAddToRedisMock).toHaveBeenCalledWith(
      databaseMock,
      configurationMock,
      firstNameUpperCaseMock,
      lastNameUpperCaseMock,
      formattedDateOfBirthMock,
      phoneNumberMock,
      accountRecoveryEmail,
      undefined,
      undefined,
      undefined
    );
  });

  it('return login success response when "primaryMemberRxId" value is present and membership is verified', async () => {
    const sieRecordMock = {
      identifier: 'identifier-1',
      rxGroupType: 'SIE',
      firstName: firstNameUpperCaseMock,
      lastName: lastNameUpperCaseMock,
    };
    const cashRecordMock = {
      identifier: 'identifier-2',
      rxGroupType: 'CASH',
    };

    getAllRecordsForLoggedInPersonMock.mockReturnValue([
      sieRecordMock,
      cashRecordMock,
    ]);
    membershipVerificationHelperMock.mockReturnValueOnce({
      member: sieRecordMock,
      isValidMembership: true,
    });
    await loginHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(publishPhoneNumberVerificationMessageMock).toBeCalled();
    expect(createCashProfileAndAddToRedisMock).not.toBeCalled();
    expect(loginSuccessResponseMock).toHaveBeenCalledWith(
      responseMock,
      phoneNumberMock,
      firstNameUpperCaseMock,
      lastNameUpperCaseMock,
      formattedDateOfBirthMock,
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime,
      sieRecordMock,
      false,
      accountRecoveryEmail
    );
  });

  it('uses PBM profile information to create account/Cash profile when "primaryMemberRxId" value is present', async () => {
    const firstNamePbm = 'SOME-NAME';
    const lastNamePbm = 'SOME-LAST-NAME';
    const sieRecordMock = {
      identifier: 'identifier-1',
      rxGroupType: 'SIE',
      firstName: firstNamePbm,
      lastName: lastNamePbm,
    };

    getAllRecordsForLoggedInPersonMock.mockReturnValue([]);
    membershipVerificationHelperMock.mockReturnValueOnce({
      member: sieRecordMock,
      isValidMembership: true,
    });
    findCashProfileMock.mockReturnValue(undefined);
    await loginHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(publishPhoneNumberVerificationMessageMock).toBeCalled();
    expect(createCashProfileAndAddToRedisMock).toHaveBeenCalledWith(
      databaseMock,
      configurationMock,
      firstNamePbm,
      lastNamePbm,
      formattedDateOfBirthMock,
      phoneNumberMock,
      accountRecoveryEmail,
      undefined,
      undefined,
      undefined
    );
    expect(loginSuccessResponseMock).toHaveBeenCalledWith(
      responseMock,
      phoneNumberMock,
      firstNamePbm,
      lastNamePbm,
      formattedDateOfBirthMock,
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime,
      sieRecordMock,
      false,
      accountRecoveryEmail
    );
  });

  it.each([[undefined], [true]])(
    'returns success and calls existingAccountHelper with prescription info if prescriptionId is set and prescription validation matches (isBlockchain: %p)',
    async (isBlockchainMock?: boolean) => {
      const masterIdMock = 'pbm-master-id';
      const accountIdMock = 'pbm-master-id';

      const requestWithPrescriptionMock = {
        app: { locals: { device: { data: phoneNumberMock } } },
        body: {
          ...mockLoginDataWithPrescription,
          isBlockchain: isBlockchainMock,
        },
        headers: {
          authorization: 'token',
        },
      } as unknown as Request;
      const sieRecordMock = {
        identifier: 'identifier-1',
        rxGroupType: 'SIE',
        firstName: firstNameMock,
        lastName: lastNameMock,
        primaryMemberRxId: primaryMemberRxIdMock,
      };

      getAllRecordsForLoggedInPersonMock.mockReturnValue([sieRecordMock]);
      const updatedPrescriptionParamsMock = {
        clientPatientId: primaryMemberRxIdMock,
        rxNo: 'MOCK-RXNUMBER',
        pharmacyManagementSystemPatientId: 'PRIMERX-ID',
        refillNo: 0,
      };
      verifyPrescriptionInfoHelperMock.mockReturnValueOnce({
        prescriptionIsValid: true,
        filteredUserInfo: {
          telephone: phoneNumberMock,
          lastName: lastNameMock,
          address: addressMock,
          updatePrescriptionParams: updatedPrescriptionParamsMock,
          masterId: masterIdMock,
        },
      });

      existingAccountHelperMock.mockResolvedValue('family-id');

      const successResponseMock = 'success';
      SuccessResponseWithoutHeadersMock.mockReturnValue(successResponseMock);

      const response = await loginHandler(
        requestWithPrescriptionMock,
        responseMock,
        databaseMock,
        configurationMock,
      );

      expectToHaveBeenCalledOnceOnlyWith(
        verifyPrescriptionInfoHelperMock,
        databaseMock,
        {
          firstName: firstNameMock,
          dateOfBirth: formattedDateOfBirthMock,
          prescriptionId: prescriptionIdMock,
        },
        configurationMock,
        [sieRecordMock],
        isBlockchainMock
      );
      expect(existingAccountHelperMock).toBeCalledWith(
        databaseMock,
        phoneNumberMock,
        firstNameUpperCaseMock,
        lastNameUpperCaseMock,
        formattedDateOfBirthMock,
        accountRecoveryEmail,
        configurationMock,
        addressMock,
        updatedPrescriptionParamsMock,
        undefined,
        masterIdMock,
        accountIdMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        SuccessResponseWithoutHeadersMock,
        responseMock,
        LoginMessages.AUTHENTICATION_SUCCESSFUL,
        InternalResponseCode.REQUIRE_USER_SET_PIN
      );
      expect(response).toEqual(successResponseMock);
    }
  );

  it('returns UNAUTHORIZED_REQUEST if prescriptionId is set and prescription validation matches but not phone number', async () => {
    const sieRecordMock = {
      identifier: 'identifier-1',
      rxGroupType: 'SIE',
      firstName: firstNameMock,
      lastName: lastNameMock,
      primaryMemberRxId: primaryMemberRxIdMock,
    };

    getAllRecordsForLoggedInPersonMock.mockReturnValue([sieRecordMock]);
    membershipVerificationHelperMock.mockReturnValueOnce({
      member: sieRecordMock,
      isValidMembership: true,
    });

    verifyPrescriptionInfoHelperMock.mockReturnValueOnce({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: '+11234567890',
        lastName: lastNameMock,
        address: addressMock,
      },
    });

    await loginHandler(
      requestMockWithPrescription,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      verifyPrescriptionInfoHelperMock,
      databaseMock,
      {
        firstName: firstNameMock,
        dateOfBirth: formattedDateOfBirthMock,
        prescriptionId: prescriptionIdMock,
      },
      configurationMock,
      [sieRecordMock],
      undefined
    );
    expect(createCashProfileAndAddToRedisMock).not.toBeCalled();
    expect(existingAccountHelperMock).not.toBeCalled();
    expect(KnownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.PRESCRIPTION_TELEPHONE_DOES_NOT_MATCH
    );
  });

  it('returns BAD REQUEST if prescriptionId is set and validation fails to match', async () => {
    const sieRecordMock = {
      identifier: 'identifier-1',
      rxGroupType: 'SIE',
      firstName: firstNameMock,
      lastName: lastNameMock,
      primaryMemberRxId: primaryMemberRxIdMock,
    };

    getAllRecordsForLoggedInPersonMock.mockReturnValue([sieRecordMock]);
    membershipVerificationHelperMock.mockReturnValueOnce({
      member: sieRecordMock,
      isValidMembership: true,
    });

    verifyPrescriptionInfoHelperMock.mockReturnValueOnce({
      prescriptionIsValid: false,
      errorCode: HttpStatusCodes.BAD_REQUEST,
      errorMessage: 'prescription does not match with user data',
    });

    await loginHandler(
      requestMockWithPrescription,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      verifyPrescriptionInfoHelperMock,
      databaseMock,
      {
        firstName: firstNameMock,
        dateOfBirth: formattedDateOfBirthMock,
        prescriptionId: prescriptionIdMock,
      },
      configurationMock,
      [sieRecordMock],
      undefined
    );
    expect(KnownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      'prescription does not match with user data'
    );
    expect(createCashProfileAndAddToRedisMock).not.toBeCalled();
    expect(existingAccountHelperMock).not.toBeCalled();
  });

  it.each([[undefined], [true]])(
    'returns NOT_FOUND ERROR if prescriptionId is set and prescription validation fails due to invalid prescription id (isBlockchain: %p)',
    async (isBlockchainMock?: boolean) => {
      const sieRecordMock = {
        identifier: 'identifier-1',
        rxGroupType: 'SIE',
        firstName: firstNameMock,
        lastName: lastNameMock,
        primaryMemberRxId: primaryMemberRxIdMock,
      };

      const requestMock = {
        body: {
          ...mockLoginDataWithPrescription,
          isBlockchain: isBlockchainMock,
        },
        headers: {
          authorization: 'token',
        },
      } as Request;

      getAllRecordsForLoggedInPersonMock.mockReturnValue([sieRecordMock]);
      membershipVerificationHelperMock.mockReturnValueOnce({
        member: sieRecordMock,
        isValidMembership: true,
      });

      verifyPrescriptionInfoHelperMock.mockReturnValueOnce({
        prescriptionIsValid: false,
        errorCode: HttpStatusCodes.NOT_FOUND,
        errorMessage: 'Invalid prescription',
      });

      await loginHandler(
        requestMock,
        responseMock,
        databaseMock,
        configurationMock,
      );

      expectToHaveBeenCalledOnceOnlyWith(
        verifyPrescriptionInfoHelperMock,
        databaseMock,
        {
          firstName: firstNameMock,
          dateOfBirth: formattedDateOfBirthMock,
          prescriptionId: prescriptionIdMock,
        },
        configurationMock,
        [sieRecordMock],
        isBlockchainMock
      );
      expect(createCashProfileAndAddToRedisMock).not.toBeCalled();
      expect(existingAccountHelperMock).not.toBeCalled();
      expect(KnownFailureResponseMock).toBeCalledWith(
        responseMock,
        HttpStatusCodes.NOT_FOUND,
        'Invalid prescription'
      );
    }
  );

  it('returns BAD_REQUEST if claimAlertId is passed and is not matching with user phoneNumber', async () => {
    const requestMockWithClaimAlertId = {
      body: mockLoginDataWithClaimAlertId,
      headers: {
        authorization: 'token',
      },
    } as Request;

    getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock.mockReset();
    getAllPendingPrescriptionsByIdentifierFromMessageEnvelopeMock.mockReturnValueOnce(
      [
        {
          identifier: claimAlertIdMock,
          pendingPrescriptionList: {},
          notificationTarget: '+11234567890',
        },
      ]
    );

    await loginHandler(
      requestMockWithClaimAlertId,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(trackClaimAlertUnauthorizeFailureEventMock).toBeCalledTimes(1);
    expect(createCashProfileAndAddToRedisMock).not.toBeCalled();
    expect(existingAccountHelperMock).not.toBeCalled();
    expect(KnownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.UNAUTHORIZED_ACCESS,
      undefined,
      InternalErrorCode.UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED
    );
  });

  it('continues to next steps if claimAlertId is passed and no prescription found for that claim alert id', async () => {
    const requestMockWithClaimAlertId = {
      body: mockLoginDataWithClaimAlertId,
      headers: {
        authorization: 'token',
      },
    } as Request;

    await loginHandler(
      requestMockWithClaimAlertId,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(existingAccountHelperMock).toBeCalled();
  });

  it('gets activation person record if exists for user phone number', async () => {
    const sieRecordMock = {
      identifier: 'identifier-1',
      rxGroupType: 'SIE',
      firstName: firstNameUpperCaseMock,
      lastName: lastNameUpperCaseMock,
      dateOfBirth: dateOfBirthMock,
      primaryMemberRxId: primaryMemberRxIdMock,
      activationPhoneNumber: phoneNumberMock,
      phoneNumber: '',
    };

    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: true,
      activationRecord: sieRecordMock,
    });
    await loginHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(verifyActivationRecordMock).toBeCalledWith(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      formattedDateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock,
      'v1'
    );
  });

  it('verifies and returns BAD_REQUEST if user info is not matched with activation person record if exists and claimAlertId is passed', async () => {
    const sieRecordMock = {
      identifier: 'identifier-1',
      rxGroupType: 'SIE',
      firstName: 'SECOND-NAME',
      lastName: lastNameUpperCaseMock,
      dateOfBirth: dateOfBirthMock,
      primaryMemberRxId: primaryMemberRxIdMock,
      activationPhoneNumber: phoneNumberMock,
      phoneNumber: '',
    };
    const requestMockWithClaimAlertId = {
      body: mockLoginDataWithClaimAlertId,
      headers: {
        authorization: 'token',
      },
    } as Request;

    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: false,
      activationRecord: sieRecordMock,
    });
    await loginHandler(
      requestMockWithClaimAlertId,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(verifyActivationRecordMock).toBeCalled();
    expect(trackActivationPersonFailureEventMock).toBeCalled();
    expect(trackActivationPersonFailureEventMock).toBeCalledWith(
      'LOGIN_CLAIM_ALERT_FAILURE',
      sieRecordMock.firstName,
      sieRecordMock.dateOfBirth,
      phoneNumberMock,
      mockLoginDataWithClaimAlertId.firstName,
      mockLoginDataWithClaimAlertId.dateOfBirth,
      mockLoginDataWithClaimAlertId.claimAlertId
    );
    expect(KnownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.ACCOUNT_CREATION_ACTIVATION_PERSON_RECORD_DATA_MISMATCH,
      undefined,
      InternalResponseCode.ACTIVATION_PERSON_DATA_MISMATCH
    );
  });

  it('publishes phone number verification message if user info matches with activation person record when exists', async () => {
    const sieRecordMock = {
      identifier: 'identifier-1',
      rxGroupType: 'SIE',
      firstName: firstNameUpperCaseMock,
      lastName: lastNameUpperCaseMock,
      dateOfBirth: '2020-01-01',
      primaryMemberRxId: primaryMemberRxIdMock,
      activationPhoneNumber: phoneNumberMock,
      phoneNumber: '',
    };

    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: true,
      activationRecord: sieRecordMock,
    });
    await loginHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(publishPhoneNumberVerificationMessageMock).toBeCalledWith(
      'identifier-1',
      phoneNumberMock
    );
  });

  it('uses last name from  activation record if user info matches with activation person record when exists', async () => {
    const sieRecordMock = {
      identifier: 'identifier-1',
      rxGroupType: 'SIE',
      firstName: firstNameUpperCaseMock,
      lastName: 'NEW LAST NAME',
      dateOfBirth: '2020-01-01',
      primaryMemberRxId: primaryMemberRxIdMock,
      activationPhoneNumber: phoneNumberMock,
      phoneNumber: '',
    };

    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: true,
      activationRecord: sieRecordMock,
    });
    const requestMockWithClaimAlertId = {
      body: mockLoginDataWithClaimAlertId,
      headers: {
        authorization: 'token',
      },
    } as Request;

    const successResponseMock = 'success';
    SuccessResponseWithoutHeadersMock.mockReturnValue(successResponseMock);

    const response = await loginHandler(
      requestMockWithClaimAlertId,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(publishPhoneNumberVerificationMessageMock).toBeCalledWith(
      'identifier-1',
      phoneNumberMock
    );
    expect(existingAccountHelperMock).toHaveBeenCalledWith(
      databaseMock,
      phoneNumberMock,
      (firstNameMock?.trim() ?? '').toUpperCase(),
      'NEW LAST NAME',
      formattedDateOfBirthMock,
      accountRecoveryEmail,
      configurationMock,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    expectToHaveBeenCalledOnceOnlyWith(
      SuccessResponseWithoutHeadersMock,
      responseMock,
      LoginMessages.AUTHENTICATION_SUCCESSFUL,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
    expect(response).toEqual(successResponseMock);
  });

  it('uses memberID from  activation record when activation person record and prescription needs memberID update', async () => {
    const sieRecordMock = {
      identifier: 'identifier-1',
      rxGroupType: 'SIE',
      firstName: firstNameUpperCaseMock,
      lastName: 'NEW LAST NAME',
      dateOfBirth: '2020-01-01',
      primaryMemberRxId: primaryMemberRxIdMock,
      activationPhoneNumber: phoneNumberMock,
      phoneNumber: '',
    };
    const updatedPrescriptionParamsMock = {
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    const updatedPrescriptionParamsWithMemberIDMock = {
      clientPatientId: primaryMemberRxIdMock,
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };

    verifyPrescriptionInfoHelperMock.mockReturnValueOnce({
      prescriptionIsValid: true,
      filteredUserInfo: {
        telephone: phoneNumberMock,
        lastName: lastNameMock,
        address: addressMock,
        updatePrescriptionParams: updatedPrescriptionParamsMock,
      },
    });
    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: true,
      activationRecord: sieRecordMock,
    });

    await loginHandler(
      requestMockWithPrescription,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(publishPhoneNumberVerificationMessageMock).toBeCalledWith(
      'identifier-1',
      phoneNumberMock
    );
    expect(existingAccountHelperMock).toHaveBeenCalledWith(
      databaseMock,
      phoneNumberMock,
      (firstNameMock?.trim() ?? '').toUpperCase(),
      'NEW LAST NAME',
      formattedDateOfBirthMock,
      accountRecoveryEmail,
      configurationMock,
      addressMock,
      updatedPrescriptionParamsWithMemberIDMock,
      undefined,
      undefined,
      undefined
    );
  });

  it('processes new account (v2)', async () => {
    const patientAccountMock = patientAccountPrimaryMock;
    const responseMock = {
      locals: {
        patientAccount: patientAccountMock,
        device: { data: phoneNumberMock },
      } as IAppLocals,
    } as unknown as Response;

    const firstNameMock = ' first-name  ';
    const lastNameMock = ' last-name  ';
    const dateOfBirthMock = '10/24/2022';
    const recoveryEmailMock = 'recovery-email1';
    const remoteAddressMock = '0.0.0.0';
    const userAgentMock = 'user-agent';

    const requestMock = {
      body: {
        dateOfBirth: dateOfBirthMock,
        firstName: firstNameMock,
        lastName: lastNameMock,
        accountRecoveryEmail: recoveryEmailMock,
      } as ILoginRequestBody,
      socket: {
        remoteAddress: remoteAddressMock,
      },
      headers: {
        'user-agent': userAgentMock,
        [RequestHeaders.apiVersion]: v2,
      },
    } as Request;

    const familyIdMock = 'family-id';

    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: true,
    });

    generatePrimaryMemberFamilyIdMock.mockReturnValue(familyIdMock);

    existingAccountHelperMock.mockResolvedValue(familyIdMock);

    const successResponseMock = 'success';
    SuccessResponseWithoutHeadersMock.mockReturnValue(successResponseMock);

    findCashProfileMock.mockReturnValue(undefined);

    processNewAccountOnLoginMock.mockResolvedValue(patientAccountMock);

    const response = await loginHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    const expectedIdentity: IIdentity = {
      phoneNumber: phoneNumberMock,
      firstName: firstNameMock.toUpperCase().trim(),
      lastName: lastNameMock.toUpperCase().trim(),
      isoDateOfBirth: dateFormat(dateOfBirthMock, 'yyyy-mm-dd'),
      email: recoveryEmailMock,
    };
    expectToHaveBeenCalledOnceOnlyWith(
      processNewAccountOnLoginMock,
      configurationMock,
      patientAccountMock,
      expectedIdentity,
      familyIdMock,
      remoteAddressMock,
      userAgentMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      SuccessResponseWithoutHeadersMock,
      responseMock,
      LoginMessages.AUTHENTICATION_SUCCESSFUL,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
    expect(response).toEqual(successResponseMock);
  });

  it('activates pbm membership and publishes masterId update message in PBM person record if user info matches with activation person record when exists', async () => {
    const sieRecordMock = {
      identifier: 'identifier-1',
      rxGroupType: 'SIE',
      firstName: firstNameUpperCaseMock,
      lastName: lastNameUpperCaseMock,
      dateOfBirth: '2020-01-01',
      primaryMemberRxId: primaryMemberRxIdMock,
      activationPhoneNumber: phoneNumberMock,
      phoneNumber: '',
    };
    const patientAccountMock = patientAccountPrimaryWithPatientMock;

    const responseMock = {
      locals: {
        patientAccount: patientAccountMock,
        device: { data: phoneNumberMock },
      } as IAppLocals,
    } as unknown as Response;

    const firstNameMock = ' first-name  ';
    const lastNameMock = ' last-name  ';
    const dateOfBirthMock = '10/24/2022';
    const recoveryEmailMock = 'recovery-email1';
    const remoteAddressMock = '0.0.0.0';
    const userAgentMock = 'user-agent';

    const requestMock = {
      body: {
        dateOfBirth: dateOfBirthMock,
        firstName: firstNameMock,
        lastName: lastNameMock,
        accountRecoveryEmail: recoveryEmailMock,
      } as ILoginRequestBody,
      socket: {
        remoteAddress: remoteAddressMock,
      },
      headers: {
        'user-agent': userAgentMock,
        [RequestHeaders.apiVersion]: v2,
      },
    } as Request;

    const familyIdMock = 'family-id';

    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: true,
      activationRecord: sieRecordMock,
      activationPatientMemberId: primaryMemberRxIdMock,
      activationPatientMasterId: 'pbm-master-id',
    });
    generatePrimaryMemberFamilyIdMock.mockReturnValue(familyIdMock);

    existingAccountHelperMock.mockResolvedValue(familyIdMock);

    const successResponseMock = 'success';
    SuccessResponseWithoutHeadersMock.mockReturnValue(successResponseMock);

    findCashProfileMock.mockReturnValue(undefined);

    processNewAccountOnLoginMock.mockResolvedValue(patientAccountMock);

    await loginHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(addMembershipPlanMock).toHaveBeenCalledWith(
      patientAccountMock,
      patientAccountMock.patient,
      'pbm-master-id',
      configurationMock,
      primaryMemberRxIdMock
    );

    expect(publishPersonUpdatePatientDetailsMessageMock).toBeCalledWith(
      'identifier-1',
      'patient-id',
      'account-id1'
    );
  });

  it('returns known failure if request error thrown', async () => {
    const requestMock = {
      body: {
        dateOfBirth: dateOfBirthMock,
        firstName: 'first-name',
        lastName: 'last-name',
      } as ILoginRequestBody,
    } as Request;

    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: true,
    });

    const requestErrorMock = new RequestError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      'error-message',
      666
    );
    existingAccountHelperMock.mockImplementation(() => {
      throw requestErrorMock;
    });

    const knownFailureResponseMock = 'known-failure';
    KnownFailureResponseMock.mockReturnValue(knownFailureResponseMock);

    const response = await loginHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      KnownFailureResponseMock,
      responseMock,
      requestErrorMock.httpCode,
      requestErrorMock.message,
      undefined,
      requestErrorMock.internalCode
    );

    expect(response).toEqual(knownFailureResponseMock);
  });

  it('returns unknown failure for non-request errors', async () => {
    const requestMock = {
      body: {
        dateOfBirth: dateOfBirthMock,
        firstName: 'first-name',
        lastName: 'last-name',
      } as ILoginRequestBody,
    } as Request;

    verifyActivationRecordMock.mockReturnValueOnce({
      isValid: true,
    });

    const errorMock = new Error('error-message');
    existingAccountHelperMock.mockImplementation(() => {
      throw errorMock;
    });

    const unknownFailureResponseMock = 'unknown-failure';
    UnknownFailureResponseMock.mockReturnValue(unknownFailureResponseMock);

    const response = await loginHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      UnknownFailureResponseMock,
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      errorMock
    );

    expect(response).toEqual(unknownFailureResponseMock);
  });
});
