// Copyright 2020 Prescryptive Health, Inc.

import { IMemberLoginState } from '../../member-login/member-login-reducer';
import { addMembershipDispatch } from './add-membership.dispatch';
import { addMembership } from '../../../api/api-v1.add-membership';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { resetStackToHome } from '../../navigation/navigation-reducer.actions';
import { ErrorApiResponse } from '../../../../../errors/error-api-response';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { ErrorAddMembership } from '../../../../../errors/error-add-membership';
import { ErrorConstants } from '../../../../../theming/constants';
import { expectToHaveBeenCalledOnceOnlyWith } from '../../../../../testing/test.helper';
import { IApiResponse } from '../../../../../models/api-response';
import { getFeedResponseAction } from '../../feed/actions/get-feed-response.action';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { IMemberInfoResponseData } from '../../../../../models/api-response/member-info-response';
import { RootState } from '../../root-reducer';
import {
  IProfile,
  RxGroupTypesEnum,
} from '../../../../../models/member-profile/member-profile-info';
import { IMemberProfileState } from '../../member-profile/member-profile-reducer';

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

jest.mock('../../../api/api-v1.add-membership');
const addMembershipMock = addMembership as jest.Mock;

jest.mock('../../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

jest.mock('../../member-list-info/dispatch/load-member-data.dispatch');
const loadMemberDataDispatchMock = loadMemberDataDispatch as jest.Mock;

jest.mock('../../navigation/navigation-reducer.actions');
const resetStackToHomeMock = resetStackToHome as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

describe('addMembershipDispatch', () => {
  const authTokenMock = 'auth_token';
  const deviceTokenMock = 'device_token';

  const defaultStateMock = {
    config: {
      apis: {},
    },
    settings: {
      deviceToken: deviceTokenMock,
      token: authTokenMock,
    },
  } as RootState;

  const getStateMock = jest.fn();

  const memberLoginInfo: IMemberLoginState = {
    dateOfBirth: '05-15-1947',
    errorMessage: '',
    firstName: 'fake firstName',
    isTermAccepted: true,
    lastName: 'fake lastName',
    primaryMemberRxId: '1947',
  };

  const cashProfileMock = {
    rxGroupType: RxGroupTypesEnum.CASH,
  } as IProfile;
  const profileListWithCashOnlyMock: IProfile[] = [cashProfileMock];

  const sieProfileMock = {
    rxGroupType: RxGroupTypesEnum.SIE,
  } as IProfile;

  const stateWithCashMemberProfile: RootState = {
    ...defaultStateMock,
    memberProfile: {
      profileList: profileListWithCashOnlyMock,
    } as IMemberProfileState,
  };

  const memberInfoResponseDataWithUnchangedProfile = {
    profileList: profileListWithCashOnlyMock,
  } as IMemberInfoResponseData;

  const memberInfoResponseDataWithUpdatedProfile = {
    profileList: [...profileListWithCashOnlyMock, sieProfileMock],
  } as IMemberInfoResponseData;

  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
    addMembershipMock.mockResolvedValue(undefined);
    tokenUpdateDispatchMock.mockResolvedValue(true);
    loadMemberDataDispatchMock.mockResolvedValue(true);
  });

  it('calls addMembership API', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };

    getStateMock.mockReturnValue(stateMock);

    await addMembershipDispatch(
      jest.fn(),
      getStateMock,
      rootStackNavigationMock,
      memberLoginInfo
    );

    expectToHaveBeenCalledOnceOnlyWith(
      addMembershipMock,
      guestExperienceApiMock,
      memberLoginInfo,
      deviceTokenMock,
      authTokenMock,
      getEndpointRetryPolicy
    );
  });

  it('resets feed if add succeeds', async () => {
    const dispatchMock = jest.fn();

    const addMemberResponseMock: Partial<IApiResponse> = {
      status: 'success',
    };
    addMembershipMock.mockResolvedValue(addMemberResponseMock);

    await addMembershipDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      memberLoginInfo
    );

    expectToHaveBeenCalledOnceOnlyWith(dispatchMock, getFeedResponseAction([]));
  });

  it('dispatches token update if add succeeds', async () => {
    const dispatchMock = jest.fn();

    const refreshTokenMock = 'refresh-token';
    const addMemberResponseMock: Partial<IApiResponse> = {
      status: 'success',
      refreshToken: refreshTokenMock,
    };
    addMembershipMock.mockResolvedValue(addMemberResponseMock);

    await addMembershipDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      memberLoginInfo
    );

    expectToHaveBeenCalledOnceOnlyWith(
      tokenUpdateDispatchMock,
      dispatchMock,
      refreshTokenMock
    );
  });

  it('loads member data if add succeeds', async () => {
    const dispatchMock = jest.fn();

    const addMemberResponseMock: Partial<IApiResponse> = {
      status: 'success',
    };
    addMembershipMock.mockResolvedValue(addMemberResponseMock);

    await addMembershipDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      memberLoginInfo
    );

    expectToHaveBeenCalledOnceOnlyWith(
      loadMemberDataDispatchMock,
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      expect.any(Function)
    );
  });

  it.each([
    [memberInfoResponseDataWithUnchangedProfile, true],
    [memberInfoResponseDataWithUpdatedProfile, false],
  ])(
    'logs custom even if member profile unchanged after add succeeds (responseData: %p)',
    async (
      memberInfoResponseDataMock: IMemberInfoResponseData,
      isLoggingExpected: boolean
    ) => {
      getStateMock.mockReturnValue(stateWithCashMemberProfile);

      const addMemberResponseMock: Partial<IApiResponse> = {
        status: 'success',
      };
      addMembershipMock.mockResolvedValue(addMemberResponseMock);

      await addMembershipDispatch(
        jest.fn(),
        getStateMock,
        rootStackNavigationMock,
        memberLoginInfo
      );

      const customEventLogger = loadMemberDataDispatchMock.mock.calls[0][3];

      customEventLogger(memberInfoResponseDataMock);

      if (isLoggingExpected) {
        expectToHaveBeenCalledOnceOnlyWith(
          guestExperienceCustomEventLoggerMock,
          CustomAppInsightEvents.PROFILE_NOT_UPDATED_AFTER_JOIN_EMPLOYER_PLAN,
          { primaryMemberRxId: memberLoginInfo.primaryMemberRxId }
        );
      } else {
        expect(guestExperienceCustomEventLoggerMock).not.toHaveBeenCalled();
      }
    }
  );

  it('resets navigation stack to home if add succeeds', async () => {
    const dispatchMock = jest.fn();

    const responseMock: Partial<IApiResponse> = {
      status: 'success',
    };
    addMembershipMock.mockResolvedValue(responseMock);

    await addMembershipDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      memberLoginInfo
    );

    expectToHaveBeenCalledOnceOnlyWith(
      resetStackToHomeMock,
      rootStackNavigationMock
    );
  });

  it('throws an error when member information could not be found', async () => {
    const supportEmail = 'support@somewhere.com';
    addMembershipMock.mockImplementation(() => {
      throw new ErrorAddMembership(
        ErrorConstants.errorInvalidMemberDetails(supportEmail)
      );
    });
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
        supportEmail,
      },
    };

    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    await expect(
      addMembershipDispatch(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        memberLoginInfo
      )
    ).rejects.toThrow(supportEmail);
  });

  it('should call handlePostLoginApiErrorsActionMock when ErrorApiResponse is thrown', async () => {
    const errorMock = new ErrorApiResponse('BOOM');
    addMembershipMock.mockImplementation(() => {
      throw errorMock;
    });
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };

    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    await addMembershipDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      memberLoginInfo
    );
    expect(loadMemberDataDispatchMock).not.toHaveBeenCalled();
    expect(tokenUpdateDispatchMock).not.toHaveBeenCalled();

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
  });
});
