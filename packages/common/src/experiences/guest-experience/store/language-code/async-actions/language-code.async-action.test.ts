// Copyright 2022 Prescryptive Health, Inc.

import {
  ILimitedAccount,
  IPrimaryProfile,
  IProfile,
} from '../../../../../models/member-profile/member-profile-info';
import { IApiConfig } from '../../../../../utils/api.helper';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import {
  ILanguageCodeAsyncActionArgs,
  languageCodeAsyncAction,
} from './language-code.async-action';
import { 
  setLanguageCodeDispatch as setMemberLanguageDispatch 
} from '../../../state/membership/dispatch/set-language-code.dispatch';
import {
  languageCodeDispatch,
  ILanguageCodeDispatchArgs,
} from '../dispatch/language-code.dispatch';
import { LanguageCode } from '../../../../../models/language';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';

jest.mock('../dispatch/language-code.dispatch');
const languageCodeDispatchMock = languageCodeDispatch as jest.Mock;

jest.mock('../../../state/membership/dispatch/set-language-code.dispatch');
const setMemberLanguageDispatchMock = setMemberLanguageDispatch as jest.Mock;

jest.mock('../../modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

const phoneNumberMock = 'phone-number-mock';
const accountMock: ILimitedAccount = {
  phoneNumber: phoneNumberMock,
  favoritedPharmacies: [],
};
const rxGroupTypeMock = 'CASH';
const primaryProfileMock: IPrimaryProfile = {
  identifier: 'identifier-mock',
  firstName: 'first-name-mock',
  lastName: 'last-name-mock',
  dateOfBirth: 'date-of-birth-mock',
  primaryMemberRxId: 'primary-member-rx-id-mock',
  phoneNumber: 'phone-number-mock',
  rxGroupType: rxGroupTypeMock,
  rxSubGroup: 'rx-sub-group-mock',
};
const profileMock: IProfile = {
  rxGroupType: rxGroupTypeMock,
  primary: primaryProfileMock,
};
const profileListMock: IProfile[] = [profileMock];
const guestExperienceApiMock = {} as IApiConfig;
const deviceTokenMock = 'device-token-mock';
const tokenMock = 'token-mock';
const languageCodeMock: LanguageCode = 'en';

const dispatchMock = jest.fn();
const getStateMock = jest.fn().mockReturnValue({
  memberProfile: { account: accountMock, profileList: profileListMock },
  config: {
    apis: { guestExperienceApi: guestExperienceApiMock },
  },
  settings: { deviceToken: deviceTokenMock, token: tokenMock },
});
const membershipDispatchMock = jest.fn();

const languageCodeAsyncActionArgsMock: ILanguageCodeAsyncActionArgs = {
  languageCode: languageCodeMock,
  navigation: rootStackNavigationMock,
  reduxDispatch: dispatchMock,
  reduxGetState: getStateMock,
  membershipDispatch: membershipDispatchMock,
  showSpinner: undefined,
};

describe('languageCodeAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    languageCodeAsyncActionArgsMock.showSpinner = undefined;

    dataLoadingActionMock.mockReturnValue(jest.fn());
    languageCodeDispatchMock.mockResolvedValue(true);
  });

  it('calls dataLoadingAction if showSpinner is true', async () => {
    languageCodeAsyncActionArgsMock.showSpinner = true;

    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);

    const result = await languageCodeAsyncAction(
      languageCodeAsyncActionArgsMock
    );

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      languageCodeAsyncActionArgsMock
    );
    expect(dataLoadingAsyncMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock
    );

    expect(result).toEqual(true);
  });

  it('dispatches languageCodeDispatchMock with languageCode', async () => {
    const result = await languageCodeAsyncAction(
      languageCodeAsyncActionArgsMock
    );

    const { languageCode, ...argsMock } = languageCodeAsyncActionArgsMock;
    const languageCodeDispatchArgsMock: ILanguageCodeDispatchArgs = {
      ...argsMock,
      updateLanguageCodeRequestBody: { languageCode },
    };

    expect(languageCodeDispatchMock).toBeCalledTimes(1);
    expect(languageCodeDispatchMock).toBeCalledWith(
      languageCodeDispatchArgsMock
    );

    expect(result).toEqual(true);
  });

  it('dispatches setMemberLanguageDispatch with languageCode', async () => {
    await languageCodeAsyncAction(languageCodeAsyncActionArgsMock);

    expect(setMemberLanguageDispatchMock).toBeCalledTimes(1);
    expect(setMemberLanguageDispatchMock).toBeCalledWith(
      membershipDispatchMock,
      languageCodeMock
    );
  });

  it('passes on languageCodeDispatch error', async () => {
    languageCodeDispatchMock.mockReturnValue(false);

    try {
      await languageCodeAsyncAction(languageCodeAsyncActionArgsMock);
    } catch (error) {
      expect(dispatchMock).toBeCalledTimes(0);
      expect(dispatchMock).not.toBeCalled();

      expect(error).toEqual('languageCodeDispatch failed');
    }
  });
});
