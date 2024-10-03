// Copyright 2018 Prescryptive Health, Inc.

import { ErrorInternalServer } from '../../../../errors/error-internal-server';
import { ErrorConstants } from '../../../../theming/constants';
import { loginUser } from '../../api/api-v1';
import {
  GuestExperienceSettings,
  ISettings,
} from '../../guest-experience-settings';
import { RootState } from '../root-reducer';
import { IMemberLoginState } from './member-login-reducer';
import {
  MemberLoginStateActionKeys,
  setMemberLoginInfoAction,
  dispatchLoginUserResponse,
} from './member-login-reducer.actions';
import { ILoginRequestBody } from '../../../../models/api-request-body/login.request-body';
import { loginMemberRetryPolicy } from '../../../../utils/retry-policies/login-user.retry-policy';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { internalErrorDispatch } from '../error-handling/dispatch/internal-error.dispatch';
import { InternalResponseCode } from '../../../../errors/error-codes';
import { ICreatePinScreenRouteProps } from '../../create-pin-screen/create-pin-screen';
import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { setMissingAccountErrorMessageAction } from '../support-error/support-error.reducer.actions';

jest.mock('../error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

jest.mock('../support-error/support-error.reducer.actions', () => ({
  setMissingAccountErrorMessageAction: jest.fn(),
}));
const setMissingAccountErrorMessageActionMock =
  setMissingAccountErrorMessageAction as jest.Mock;

jest.mock('../navigation/navigation-reducer.actions', () => ({
  dispatchNavigateToScreen: jest.fn(),
}));

jest.mock('../../api/api-v1');

const supportEmail = 'support@somewhere.com';
const mockState: RootState = {
  config: {
    apis: {
      guestExperienceApi: {
        env: {
          host: '127.0.0.1',
          port: '4300',
          protocol: 'https',
          version: 'v1',
          url: '/api',
        },
        paths: {
          login: '/login',
          pendingPrescriptions: '/pending-prescriptions/:id',
        },
      },
    },
    supportEmail,
  } as unknown,
  features: {},
  settings: {
    lastZipCode: 'unknown',
    token: 'unknown',
    deviceToken: 'device-token',
  } as ISettings,
} as RootState;

const memberLoginInfo: IMemberLoginState = {
  dateOfBirth: '05-15-1947',
  errorMessage: '',
  firstName: 'fake firstName',
  isTermAccepted: true,
  lastName: 'fake lastName',
  primaryMemberRxId: '1947',
  emailAddress: 'test@test.com',
  claimAlertId: 'identifier',
};
const loginUserRequestBody: ILoginRequestBody = {
  dateOfBirth: '05-15-1947',
  firstName: 'fake firstName',
  lastName: 'fake lastName',
  primaryMemberRxId: '1947',
  accountRecoveryEmail: 'test@test.com',
  claimAlertId: 'identifier',
};

const mockLoginUserCall = loginUser as jest.Mock;

const mockDispatch = jest.fn();
const mockGetState = jest.fn();
GuestExperienceSettings.update = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockLoginUserCall.mockReturnValue(
    new Promise((resolve) =>
      resolve({
        message: '',
        status: 'success',
      })
    )
  );
  mockGetState.mockReturnValue(mockState);
});

describe('memberLoginAction', () => {
  it('should call loginUser with given memberLoginInfo fields', async () => {
    await dispatchLoginUserResponse(
      mockDispatch,
      mockGetState,
      rootStackNavigationMock,
      memberLoginInfo
    );
    expect(mockLoginUserCall).toHaveBeenCalledWith(
      mockState.config.apis.guestExperienceApi,
      loginUserRequestBody,
      'device-token',
      loginMemberRetryPolicy
    );
  });

  it('should call loginUser with empty string if any field is not passed', async () => {
    const memberLoginInfoWithMissingFields: IMemberLoginState = {
      dateOfBirth: '05-15-1947',
      firstName: 'fake firstName',
      isTermAccepted: true,
      prescriptionId: 'identifier',
      emailAddress: 'test@test.com',
    };
    const loginUserRequestBodyWithEmptyFields: ILoginRequestBody = {
      dateOfBirth: '05-15-1947',
      firstName: 'fake firstName',
      lastName: '',
      accountRecoveryEmail: 'test@test.com',
      prescriptionId: 'identifier',
    };
    await dispatchLoginUserResponse(
      mockDispatch,
      mockGetState,
      rootStackNavigationMock,
      memberLoginInfoWithMissingFields
    );
    expect(mockLoginUserCall).toHaveBeenCalledWith(
      mockState.config.apis.guestExperienceApi,
      loginUserRequestBodyWithEmptyFields,
      'device-token',
      loginMemberRetryPolicy
    );
  });

  it('should navigate to Create Pin screen if successCode is REQUIRE_USER_SET_PIN', async () => {
    mockLoginUserCall.mockReturnValueOnce(
      new Promise((resolve) =>
        resolve({
          message: '',
          responseCode: InternalResponseCode.REQUIRE_USER_SET_PIN,
          status: 'success',
        })
      )
    );
    const actionDispatcher = dispatchLoginUserResponse;
    await actionDispatcher(
      mockDispatch,
      mockGetState,
      rootStackNavigationMock,
      memberLoginInfo
    );
    expect(mockLoginUserCall).toHaveBeenCalledWith(
      mockState.config.apis.guestExperienceApi,
      loginUserRequestBody,
      'device-token',
      loginMemberRetryPolicy
    );
    const expectedCreatePinScreenParams: ICreatePinScreenRouteProps = {};
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'CreatePin',
      expectedCreatePinScreenParams
    );
  });
});

describe('setMemberLoginInfoAction', () => {
  it('should issue SET_MEMBER_LOGIN_INFO action ', () => {
    expect(setMemberLoginInfoAction(memberLoginInfo)).toMatchObject({
      payload: memberLoginInfo,
      type: MemberLoginStateActionKeys.SET_MEMBER_LOGIN_INFO,
    });
  });
});

describe('memberLoginAction negative scenarios', () => {
  it('dispatches internal error when on ErrorInternalServer', async () => {
    const errorMock = new ErrorInternalServer(
      ErrorConstants.errorInternalServer()
    );
    mockLoginUserCall.mockImplementation(() => {
      throw errorMock;
    });
    await dispatchLoginUserResponse(
      mockDispatch,
      mockGetState,
      rootStackNavigationMock,
      memberLoginInfo
    );

    expect(mockLoginUserCall).toHaveBeenCalledWith(
      mockState.config.apis.guestExperienceApi,
      loginUserRequestBody,
      'device-token',
      loginMemberRetryPolicy
    );
    expect(internalErrorDispatchMock).toHaveBeenCalledTimes(1);
    expect(internalErrorDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      errorMock
    );
  });
  it('should navigate to support error when missing account', async () => {
    mockLoginUserCall.mockImplementation(() => {
      throw new ErrorApiResponse('test');
    });

    const actionDispatcher = dispatchLoginUserResponse;

    await actionDispatcher(
      mockDispatch,
      mockGetState,
      rootStackNavigationMock,
      memberLoginInfo
    );

    expect(setMissingAccountErrorMessageActionMock).toHaveBeenCalledWith(
      'test',
      'LogoutAndStartOverAtLogin'
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'SupportError'
    );
  });
  it('should throw an error when member information could not be found', async () => {
    mockLoginUserCall.mockImplementation(() => {
      throw new Error('test');
    });

    const actionDispatcher = dispatchLoginUserResponse;

    await expect(
      actionDispatcher(
        mockDispatch,
        mockGetState,
        rootStackNavigationMock,
        memberLoginInfo
      )
    ).rejects.toThrow('test');
  });
});
