// Copyright 2018 Prescryptive Health, Inc.

import { ErrorRequireUserVerifyPin } from '../../../../errors/error-require-user-verify-pin';
import { ErrorUnauthorizedAccess } from '../../../../errors/error-unauthorized-access';
import { ErrorConstants } from '../../../../theming/constants';
import { updateMemberContactInfo } from '../../api/api-v1';
import { ISettings } from '../../guest-experience-settings';
import { handleUnauthorizedAccessErrorAction } from '../error-handling.actions';
import { loginPinNavigateDispatch } from '../navigation/dispatch/sign-in/login-pin-navigate.dispatch';
import { RootState } from '../root-reducer';
import { IEditMemberProfileState } from './edit-member-profile-reducer';
import {
  IUpdatedMemberContactInfoActionArgs,
  updatedMemberContactInfoAction,
} from './edit-member-profile-reducer.actions';
import { tokenUpdateDispatch } from '../settings/dispatch/token-update.dispatch';
import { IApiResponse } from '../../../../models/api-response';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { internalErrorDispatch } from '../error-handling/dispatch/internal-error.dispatch';

jest.mock('../navigation/dispatch/sign-in/login-pin-navigate.dispatch');
const mockDispatchToLoginPinScreen = loginPinNavigateDispatch as jest.Mock;

jest.mock('../../api/api-v1', () => ({
  updateMemberContactInfo: jest.fn(),
}));
const mockUpdateMemberContactInfo = updateMemberContactInfo as jest.Mock;

jest.mock('../../store/error-handling.actions', () => ({
  handleUnauthorizedAccessErrorAction: jest.fn(),
}));
const mockHandleUnauthorizedAccess =
  handleUnauthorizedAccessErrorAction as jest.Mock;

jest.mock('../error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

jest.mock('../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

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
      },
    },
  } as unknown,
  editMemberProfile: {
    memberInfo: {
      identifier: 'identifier',
      primaryMemberRxId: 'member-id',
    },
  },
  settings: {
    lastZipCode: 'unknown',
    token: 'fake-token',
  } as ISettings,
} as RootState;

const mockGetState = jest.fn().mockReturnValue(mockState);

describe('updatedMemberContactInfoAction', () => {
  const fakeMember: IEditMemberProfileState = {
    memberInfo: {
      email: 'fake_email',
      firstName: 'fake_firstName',
      lastName: 'fake_lastName',
      identifier: 'fake-identifier',
      phoneNumber: 'fake_phoneNumber',
      primaryMemberRxId: 'fake_primaryMemberRxId',
      rxGroupType: 'SIE',
      rxSubGroup: 'HMA01',
      dateOfBirth: '2000-01-01',
    },
    secondaryUser: {
      identifier: 'secondary-identifier',
      rxGroupType: 'SIE',
      rxSubGroup: 'HMA01',
      firstName: 'adult_firstName',
      lastName: 'adult_lastName',
      isPrimary: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls dispatchToLoginPinScreen if ErrorRequireUserVerifyPin is thrown', async () => {
    mockUpdateMemberContactInfo.mockImplementation(() => {
      throw new ErrorRequireUserVerifyPin();
    });
    const dispatchMock = jest.fn();

    const argsMock: IUpdatedMemberContactInfoActionArgs = {
      editMemberProfileState: fakeMember,
      navigation: rootStackNavigationMock,
    };
    const asyncAction = updatedMemberContactInfoAction(argsMock);
    await asyncAction(dispatchMock, mockGetState);

    expect(mockDispatchToLoginPinScreen).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {}
    );
  });

  it('calls dispatchToLoginPinScreen with workflow if ErrorRequireUserVerifyPin is thrown', async () => {
    mockUpdateMemberContactInfo.mockImplementation(() => {
      throw new ErrorRequireUserVerifyPin(true, 'prescriptionTransfer');
    });
    const dispatchMock = jest.fn();

    const argsMock: IUpdatedMemberContactInfoActionArgs = {
      editMemberProfileState: fakeMember,
      navigation: rootStackNavigationMock,
    };
    const asyncAction = updatedMemberContactInfoAction(argsMock);
    await asyncAction(dispatchMock, mockGetState);

    expect(mockDispatchToLoginPinScreen).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {
        workflow: 'prescriptionTransfer',
      }
    );
  });

  it('calls HandleUnauthorizedAccess if ErrorUnauthorizedAccess is thrown', async () => {
    mockUpdateMemberContactInfo.mockImplementation(() => {
      throw new ErrorUnauthorizedAccess(
        ErrorConstants.errorUnauthorizedToUpdateMemberContactInfo
      );
    });
    const dispatchMock = jest.fn();

    const argsMock: IUpdatedMemberContactInfoActionArgs = {
      editMemberProfileState: fakeMember,
      navigation: rootStackNavigationMock,
    };
    const asyncAction = updatedMemberContactInfoAction(argsMock);
    await asyncAction(dispatchMock, mockGetState);

    expect(mockHandleUnauthorizedAccess).toHaveBeenCalledTimes(1);
    expect(mockHandleUnauthorizedAccess).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      rootStackNavigationMock,
      ErrorConstants.errorUnauthorizedToUpdateMemberContactInfo
    );
  });

  it('calls internalErrorDispatch if Error is thrown', async () => {
    const error = new Error('error message');
    mockUpdateMemberContactInfo.mockImplementation(() => {
      throw error;
    });
    const dispatchMock = jest.fn();

    const argsMock: IUpdatedMemberContactInfoActionArgs = {
      editMemberProfileState: fakeMember,
      navigation: rootStackNavigationMock,
    };
    const asyncAction = updatedMemberContactInfoAction(argsMock);
    await asyncAction(dispatchMock, mockGetState);

    expect(internalErrorDispatchMock).toHaveBeenCalledTimes(1);
    expect(internalErrorDispatchMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock,
      error
    );
  });

  it('dispatches account token update', async () => {
    const dispatchMock = jest.fn();

    const responseMock: IApiResponse = {
      message: 'success',
      refreshToken: 'refresh-token',
      status: 'ok',
    };
    mockUpdateMemberContactInfo.mockResolvedValue(responseMock);

    const argsMock: IUpdatedMemberContactInfoActionArgs = {
      editMemberProfileState: fakeMember,
      navigation: rootStackNavigationMock,
    };
    const asyncAction = updatedMemberContactInfoAction(argsMock);
    await asyncAction(dispatchMock, mockGetState);

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      responseMock.refreshToken
    );
  });
});
