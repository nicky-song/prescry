// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import {
  differenceInYear,
  UTCDate,
} from '@phx/common/src/utils/date-time-helper';
import { membershipVerificationHelper } from '../helpers/membership-verification.helper';
import { trackRegistrationFailureEvent } from '../../../utils/custom-event-helper';
import {
  KnownFailureResponse,
  SuccessResponseWithoutHeaders,
  errorResponseWithTwilioErrorHandling,
} from '../../../utils/response-helper';
import { verifyMembershipHandler } from './verify-membership.handler';
import { LoginMessages as responseMessage } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { membershipVerificationHelperV2 } from '../helpers/membership-verification-v2.helper';
import { databaseMock } from '../../../mock-data/database.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('../../../utils/response-helper');
jest.mock('../helpers/membership-verification.helper');
jest.mock('../../../utils/custom-event-helper');
jest.mock('@phx/common/src/utils/date-time-helper');
jest.mock(
  '@phx/common/src/experiences/guest-experience/api/api-response-messages'
);

jest.mock('../helpers/membership-verification-v2.helper');
const membershipVerificationHelperV2Mock =
  membershipVerificationHelperV2 as jest.Mock;

const membershipVerificationHelperMock =
  membershipVerificationHelper as jest.Mock;
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const errorResponseWithTwilioErrorHandlingMock =
  errorResponseWithTwilioErrorHandling as jest.Mock;
const UTCDateMock = UTCDate as jest.Mock;
const differenceInYearMock = differenceInYear as jest.Mock;
const trackRegistrationFailureEventMock =
  trackRegistrationFailureEvent as jest.Mock;
const SuccessResponseWithoutHeadersMock =
  SuccessResponseWithoutHeaders as jest.Mock;

const phoneNumberMock = '1234567890';
const firstNameMock = 'Johnny';
const lastNameMock = 'AppleSeed';
const dateOfBirthMock = 'January-01-2010';
const formattedDateOfBirthMock = '2010-01-01';
const emailMock = 'test@test.com';
const memberIdMock = 'CASH01';

const requestBody = {
  firstName: firstNameMock,
  lastName: lastNameMock,
  email: emailMock,
  dateOfBirth: dateOfBirthMock,
  phoneNumber: phoneNumberMock,
  primaryMemberRxId: memberIdMock,
};

const requestMock = {
  body: requestBody,
  headers: {
    authorization: 'token',
  },
} as Request;
const requestV2Mock = {
  body: requestBody,
  headers: {
    authorization: 'token',
    [RequestHeaders.apiVersion]: 'v2',
  },
} as Request;


const responseMock = {} as Response;

describe('verifyMembershipHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    differenceInYearMock.mockReturnValue(30);
    membershipVerificationHelperMock.mockReturnValue({
      isValidMembership: false,
    });
  });
  it('calculates age by calling "differenceInYear"', async () => {
    await verifyMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );
    expect(differenceInYearMock).toHaveBeenCalled();
    expect(UTCDateMock).toHaveBeenCalled();
  });

  it('"trackRegistrationFailureEvent & KnownFailureResponse" are called when determined age is less than predefined childMemberAgeLimit', async () => {
    differenceInYearMock.mockReturnValue(12);
    await verifyMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );
    expect(trackRegistrationFailureEventMock).toBeCalledWith(
      'ChildMember',
      firstNameMock,
      lastNameMock,
      memberIdMock,
      formattedDateOfBirthMock
    );
    expect(KnownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      responseMessage.AUTHENTICATION_FAILED
    );
  });
  it('calls membershipVerificationHelper and return success if user entered details matches with database ', async () => {
    membershipVerificationHelperMock.mockReturnValueOnce({
      isValidMembership: true,
    });
    await verifyMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );
    expect(SuccessResponseWithoutHeadersMock).toBeCalledWith(
      responseMock,
      SuccessConstants.VERIFY_MEMBERSHIP_SUCCESS
    );
  });
  it('calls membershipVerificationHelperV2 and return success if user entered details matches with identity data', async () => {
    membershipVerificationHelperV2Mock.mockReturnValueOnce({
      isValidMembership: true,
    });
    await verifyMembershipHandler(
      requestV2Mock,
      responseMock,
      databaseMock,
      configurationMock,
    );
    expect(membershipVerificationHelperV2Mock).toBeCalledWith(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      formattedDateOfBirthMock,
      memberIdMock,
      configurationMock
    );
    expect(SuccessResponseWithoutHeadersMock).toBeCalledWith(
      responseMock,
      SuccessConstants.VERIFY_MEMBERSHIP_SUCCESS
    );
  });
  it('should call errorResponseWithTwilioErrorHandling when exception occurs', async () => {
    const error = {
      message: 'internal error',
      code: '111111',
      status: 'failed',
    };
    membershipVerificationHelperMock.mockImplementationOnce(() => {
      throw error;
    });
    const expected = {};
    errorResponseWithTwilioErrorHandlingMock.mockReturnValueOnce(expected);
    const actual = await verifyMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );
    expect(errorResponseWithTwilioErrorHandlingMock).toHaveBeenCalledWith(
      responseMock,
      phoneNumberMock,
      error
    );
    expect(actual).toBe(expected);
  });
  it('should return INTERNAL SERVER ERROR when response code is not returned from membershipVerificationHelper', async () => {
    membershipVerificationHelperMock.mockReset();
    membershipVerificationHelperMock.mockReturnValueOnce({
      isValidMembership: false,
    });

    await verifyMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      undefined,
      undefined
    );
  });
  it('should return Internal response code when response message is  ACCOUNT_PERSON_DATA_MISMATCH error from membershipVerificationHelper', async () => {
    membershipVerificationHelperMock.mockReturnValueOnce({
      isValidMembership: false,
      responseCode: HttpStatusCodes.NOT_FOUND,
      responseMessage: ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH,
    });

    await verifyMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.NOT_FOUND,
      ErrorConstants.ACCOUNT_PERSON_DATA_MISMATCH,
      undefined,
      InternalResponseCode.ACCOUNT_PERSON_DATA_MISMATCH
    );
  });
});
