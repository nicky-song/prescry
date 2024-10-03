// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import {
  ErrorConstants,
  LoginMessages,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { differenceInYear } from '@phx/common/src/utils/date-time-helper';
import { trackRegistrationFailureEvent } from '../../../utils/custom-event-helper';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';

import { addMembershipHandler } from './add-membership.handler';
import { membershipVerificationHelper } from '../helpers/membership-verification.helper';
import {
  publishPersonUpdatePatientDetailsMessage,
  publishPhoneNumberVerificationMessage,
} from '../../../utils/service-bus/person-update-helper';
import { loginSuccessResponse } from '../../login/helpers/login-response.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { membershipVerificationHelperV2 } from '../helpers/membership-verification-v2.helper';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { databaseMock } from '../../../mock-data/database.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { addMembershipPlan } from '../helpers/add-membership-link.helper';
import { mockPatientWithEmail } from '../../../mock-data/fhir-patient.mock';
import { assertHasMasterId } from '../../../assertions/assert-has-master-id';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('@phx/common/src/utils/date-time-helper');
jest.mock('../../../utils/custom-event-helper');
jest.mock('../../../utils/response-helper');
jest.mock('../helpers/membership-verification.helper');
jest.mock('../../../databases/mongo-database/v1/setup/setup-database');
jest.mock('../../../utils/service-bus/person-update-helper');
jest.mock('../../login/helpers/login-response.helper');
jest.mock('../../../utils/request/request-app-locals.helper');
jest.mock('../helpers/membership-verification-v2.helper');
jest.mock('../../../utils/service-bus/person-update-helper');
jest.mock('../../../assertions/assert-has-master-id');
jest.mock('../helpers/add-membership-link.helper');
jest.mock('../../../assertions/assert-has-account-id');

const addMembershipPlanMock = addMembershipPlan as jest.Mock;

const differenceInYearMock = differenceInYear as jest.Mock;
const trackRegistrationFailureEventMock =
  trackRegistrationFailureEvent as jest.Mock;
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownFailureResponseMock = UnknownFailureResponse as jest.Mock;
const membershipVerificationHelperMock =
  membershipVerificationHelper as jest.Mock;
const publishPhoneNumberVerificationMessageMock =
  publishPhoneNumberVerificationMessage as jest.Mock;
const loginSuccessResponseMock = loginSuccessResponse as jest.Mock;
const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;
const membershipVerificationHelperV2Mock =
  membershipVerificationHelperV2 as jest.Mock;
const publishPersonUpdatePatientDetailsMessageMock =
  publishPersonUpdatePatientDetailsMessage as jest.Mock;
const assertHasMasterIdMock = assertHasMasterId as jest.Mock;
const assertHasAccountIdMock = assertHasAccountId as jest.Mock;

describe('addMembershipHandler', () => {
  const memberFoundResponse = {
    isValidMembership: false,
    responseCode: 404,
    responseMessage: 'failure-response',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    membershipVerificationHelperMock.mockReturnValue(memberFoundResponse);
  });

  it('returns failure response if any exception ocurs', async () => {
    const responseMock = {
      locals: {
        device: {
          data: 'mock-phone',
        },
      },
    } as unknown as Response;
    const requestMock = {
      body: {
        dateOfBirth: 'May-10-2000',
        firstName: 'John',
        lastName: 'Doe',
        primaryMemberRxId: '201704071001',
      },
      headers: {
        authorization: 'token',
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    getRequiredResponseLocalMock.mockReturnValueOnce({ data: 'mock-phone' });
    differenceInYearMock.mockReturnValueOnce(14);

    const error = new Error('internal-server-error');

    membershipVerificationHelperV2Mock.mockImplementationOnce(() => {
      throw error;
    });
    await addMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(membershipVerificationHelperV2Mock).toHaveBeenCalled();
    expect(unknownFailureResponseMock).toBeCalledWith(
      responseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });

  it('returns 400 if age of the user is less than child age', async () => {
    const responseMock = {
      locals: {
        device: {
          data: 'mock-phone',
        },
      },
    } as unknown as Response;
    const requestMock = {
      body: {
        dateOfBirth: 'May-10-2010',
        firstName: 'John',
        lastName: 'Doe',
        primaryMemberRxId: '201704071001',
      },
      headers: {
        authorization: 'token',
      },
    } as Request;
    const expectedDob = '2010-05-10';
    const mockResponse = { code: 401, status: 'failure' };
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: 'mock-phone' });
    differenceInYearMock.mockReturnValueOnce(10);
    KnownFailureResponseMock.mockReturnValueOnce(mockResponse);
    const response = await addMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );
    expect(response).toEqual(mockResponse);
    expect(KnownFailureResponseMock).toBeCalledTimes(1);
    expect(KnownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      LoginMessages.AUTHENTICATION_FAILED
    );
    expect(trackRegistrationFailureEventMock).toBeCalledTimes(1);
    expect(trackRegistrationFailureEventMock).toBeCalledWith(
      'ChildMember',
      requestMock.body.firstName,
      requestMock.body.lastName,
      requestMock.body.primaryMemberRxId,
      expectedDob
    );
    expect(membershipVerificationHelperMock).not.toHaveBeenCalled();
  });
  it('calls membershipVerificationHelper if user is more than child age', async () => {
    const responseMock = {
      locals: {
        device: {
          data: 'mock-phone',
        },
      },
    } as unknown as Response;
    const requestMock = {
      body: {
        dateOfBirth: 'May-10-2000',
        firstName: 'John',
        lastName: 'Doe',
        primaryMemberRxId: '201704071001',
      },
      headers: {
        authorization: 'token',
      },
    } as Request;
    const expectedDob = '2000-05-10';
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: 'mock-phone' });
    differenceInYearMock.mockReturnValueOnce(14);
    await addMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );
    expect(membershipVerificationHelperMock).toHaveBeenCalledTimes(1);
    expect(membershipVerificationHelperMock).toBeCalledWith(
      databaseMock,
      'mock-phone',
      requestMock.body.firstName,
      requestMock.body.lastName,
      expectedDob,
      requestMock.body.primaryMemberRxId
    );
  });
  it('throws error response if user is more than child age and user entered details are not found', async () => {
    const responseMock = {
      locals: {
        device: {
          data: 'mock-phone',
        },
      },
    } as unknown as Response;
    const requestMock = {
      body: {
        dateOfBirth: 'May-10-2000',
        firstName: 'John',
        lastName: 'Doe',
        primaryMemberRxId: '201704071001',
      },
      headers: {
        authorization: 'token',
      },
    } as Request;
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: 'mock-phone' });
    differenceInYearMock.mockReturnValueOnce(14);
    membershipVerificationHelperMock.mockReturnValueOnce(memberFoundResponse);
    await addMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      404,
      'failure-response'
    );
    expect(publishPhoneNumberVerificationMessageMock).not.toBeCalled();
  });
  it('publishes phone number verification message if user is more than child age and details are verified', async () => {
    const responseMock = {
      locals: {
        device: {
          data: 'mock-phone',
        },
      },
    } as unknown as Response;
    const requestMock = {
      body: {
        dateOfBirth: 'May-10-2000',
        firstName: 'John',
        lastName: 'Doe',
        primaryMemberRxId: '201704071001',
      },
      headers: {
        authorization: 'token',
      },
    } as Request;
    const memberMock = {
      identifier: '123',
      rxGroupTYpe: 'SIE',
    };
    const verifyMemberResponse = {
      isValidMembership: true,
      member: memberMock,
    };
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: 'mock-phone' });
    differenceInYearMock.mockReturnValueOnce(14);
    membershipVerificationHelperMock.mockReturnValueOnce(verifyMemberResponse);
    await addMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(KnownFailureResponseMock).not.toBeCalled();
    expect(publishPhoneNumberVerificationMessageMock).toHaveBeenCalledWith(
      verifyMemberResponse.member.identifier,
      'mock-phone'
    );
  });
  it('calls login success response if user is more than child age and details are verified', async () => {
    const responseMock = {
      locals: {
        device: {
          data: 'mock-phone',
        },
      },
    } as unknown as Response;
    const requestMock = {
      body: {
        dateOfBirth: 'May-10-2000',
        firstName: 'John',
        lastName: 'Doe',
        primaryMemberRxId: '201704071001',
      },
      headers: {
        authorization: 'token',
      },
    } as Request;
    const memberMock = {
      identifier: '123',
      rxGroupTYpe: 'SIE',
    };
    const verifyMembershipResponse = {
      isValidMembership: true,
      member: memberMock,
    };
    const expectedDob = '2000-05-10';
    getRequiredResponseLocalMock.mockReturnValueOnce({ data: 'mock-phone' });
    differenceInYearMock.mockReturnValueOnce(14);
    membershipVerificationHelperMock.mockReturnValueOnce(
      verifyMembershipResponse
    );
    await addMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(KnownFailureResponseMock).not.toBeCalled();
    expect(publishPhoneNumberVerificationMessageMock).toHaveBeenCalledWith(
      verifyMembershipResponse.member.identifier,
      'mock-phone'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      loginSuccessResponseMock,
      responseMock,
      'mock-phone',
      'John',
      'Doe',
      expectedDob,
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime,
      verifyMembershipResponse.member,
      true
    );
  });

  it('returns failure response if masterId is missing for v2 endpoint', async () => {
    const responseMock = {
      locals: {
        device: {
          data: 'mock-phone',
        },
      },
    } as unknown as Response;
    const requestMock = {
      body: {
        dateOfBirth: 'May-10-2000',
        firstName: 'John',
        lastName: 'Doe',
        primaryMemberRxId: '201704071001',
      },
      headers: {
        authorization: 'token',
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;
    const memberMock = {
      identifier: '123',
      rxGroupTYpe: 'SIE',
    };

    const verifyMemberResponse = {
      isValidMembership: true,
      memberId: '201704071001',
      masterId: undefined,
      member: memberMock,
    };

    const patientAccountMock = {
      reference: [] as string[],
    } as IPatientAccount;

    const phoneNumberMock = 'mock-phone';

    getRequiredResponseLocalMock
      .mockReturnValueOnce({ data: phoneNumberMock })
      .mockReturnValueOnce(patientAccountMock)
      .mockReturnValueOnce(mockPatientWithEmail);
    differenceInYearMock.mockReturnValueOnce(14);

    membershipVerificationHelperV2Mock.mockReturnValueOnce(
      verifyMemberResponse
    );

    await addMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    const expectedFormattedDateOfBirth = '2000-05-10';

    expect(membershipVerificationHelperV2Mock).toHaveBeenCalledWith(
      databaseMock,
      phoneNumberMock,
      requestMock.body.firstName,
      requestMock.body.lastName,
      expectedFormattedDateOfBirth,
      requestMock.body.primaryMemberRxId,
      configurationMock
    );

    expect(KnownFailureResponseMock).toBeCalledTimes(1);
    expect(KnownFailureResponseMock).toBeCalledWith(
      responseMock,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.COVERAGE_MASTER_ID_MISSING
    );
  });

  it('updates patient link', async () => {
    const memberIdMock = '201704071001';
    const responseMock = {
      locals: {
        device: {
          data: 'mock-phone',
        },
      },
    } as unknown as Response;
    const requestMock = {
      body: {
        dateOfBirth: 'May-10-2000',
        firstName: 'John',
        lastName: 'Doe',
        primaryMemberRxId: memberIdMock,
      },
      headers: {
        authorization: 'token',
        [RequestHeaders.apiVersion]: 'v2',
      },
    } as Request;

    const masterIdMock = 'MASTER-ID-MOCK';
    const accountIdMock = 'patient-id1';
    const memberMock = {
      identifier: '123',
      rxGroupTYpe: 'SIE',
    };
    const verifyMemberResponse = {
      isValidMembership: true,
      masterId: masterIdMock,
      memberId: memberIdMock,
      member: memberMock,
    };

    const patientAccountMock = {
      accountId: accountIdMock,
      reference: [] as string[],
      patientProfile: `https://gears.test.prescryptive.io/identity/patient/${masterIdMock}`,
      patient: { id: masterIdMock },
    } as IPatientAccount;

    const phoneNumberMock = 'mock-phone';

    getRequiredResponseLocalMock
      .mockReturnValueOnce({ data: phoneNumberMock })
      .mockReturnValueOnce(patientAccountMock)
      .mockReturnValueOnce(mockPatientWithEmail);
    differenceInYearMock.mockReturnValueOnce(20);

    membershipVerificationHelperV2Mock.mockReturnValueOnce(
      verifyMemberResponse
    );

    await addMembershipHandler(
      requestMock,
      responseMock,
      databaseMock,
      configurationMock,
    );

    expect(assertHasMasterIdMock).toHaveBeenCalledWith(
      masterIdMock,
      phoneNumberMock
    );
    expect(assertHasAccountIdMock).toHaveBeenCalledWith(accountIdMock);

    expect(publishPersonUpdatePatientDetailsMessageMock).toHaveBeenCalledWith(
      memberMock.identifier,
      masterIdMock,
      accountIdMock
    );

    expect(addMembershipPlanMock).toHaveBeenCalledWith(
      patientAccountMock,
      mockPatientWithEmail,
      masterIdMock,
      configurationMock,
      memberIdMock
    );
  });
});
