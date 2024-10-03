// Copyright 2021 Prescryptive Health, Inc.

import { GuestExperienceConfig } from '../../../guest-experience-config';
import { verifyMembershipDispatch } from './verify-membership.dispatch';
import { verifyMembership } from '../../../api/api-v1.verify-membership';
import { IVerifyMembershipRequestBody } from '../../../../../models/api-request-body/verify-membership.request-body';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { ErrorNotFound } from '../../../../../errors/error-not-found';
import { ErrorInternalServer } from '../../../../../errors/error-internal-server';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../../api/api-v1.verify-membership');
const verifyMembershipMock = verifyMembership as jest.Mock;

jest.mock('../../error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

describe('verifyMembershipDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls API', async () => {
    const getStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig });
    const requestBodyMock: Partial<IVerifyMembershipRequestBody> = {
      firstName: 'first-name',
      lastName: 'last-name',
    };

    const isVerified = await verifyMembershipDispatch(
      getStateMock,
      rootStackNavigationMock,
      requestBodyMock as IVerifyMembershipRequestBody
    );

    expect(verifyMembershipMock).toHaveBeenCalledWith(
      GuestExperienceConfig.apis.guestExperienceApi,
      requestBodyMock
    );
    expect(isVerified).toEqual(true);
  });

  it('re-throws "not found" errors', async () => {
    const getStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig });
    const requestBodyMock: Partial<IVerifyMembershipRequestBody> = {
      firstName: 'first-name',
      lastName: 'last-name',
    };

    const errorMock = new ErrorNotFound('Bogus membership id');
    verifyMembershipMock.mockImplementation(() => {
      throw errorMock;
    });

    try {
      await verifyMembershipDispatch(
        getStateMock,
        rootStackNavigationMock,
        requestBodyMock as IVerifyMembershipRequestBody
      );
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(error).toEqual(errorMock);
    }
  });

  it('handles internal error', async () => {
    const getStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig });
    const requestBodyMock: Partial<IVerifyMembershipRequestBody> = {
      firstName: 'first-name',
      lastName: 'last-name',
    };

    const errorMock = new ErrorInternalServer('Nope on a rope!');
    verifyMembershipMock.mockImplementation(() => {
      throw errorMock;
    });

    const isVerified = await verifyMembershipDispatch(
      getStateMock,
      rootStackNavigationMock,
      requestBodyMock as IVerifyMembershipRequestBody
    );

    expect(internalErrorDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      errorMock
    );
    expect(isVerified).toEqual(false);
  });
});
