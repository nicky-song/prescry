// Copyright 2018 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dispatchResetStackToPhoneLoginScreen } from '../navigation/navigation-reducer.actions';
import { resetSettingsAction } from '../settings/settings-reducer.actions';
import {
  MissingAccountActionKeys,
  navigateToPhoneLoginScreenAndResetSettings,
  setMissingAccountErrorMessageAction,
} from './support-error.reducer.actions';

jest.mock(
  '../../../../experiences/guest-experience/store/settings/settings-reducer.actions',
  () => ({
    resetSettingsAction: jest.fn(),
  })
);
jest.mock('../navigation/navigation-reducer.actions', () => ({
  dispatchResetStackToPhoneLoginScreen: jest.fn(),
}));
const mockDispatchResetStackToPhoneLoginScreen =
  dispatchResetStackToPhoneLoginScreen as jest.Mock;

const mockResetSettingsAction = resetSettingsAction as jest.Mock;
const mockReduxDispatchHandler = jest.fn();

beforeEach(() => {
  mockReduxDispatchHandler.mockReset();
  mockResetSettingsAction.mockReset();
  mockResetSettingsAction.mockReturnValueOnce(jest.fn());
  mockDispatchResetStackToPhoneLoginScreen.mockReset();
});

describe('setMissingAccountErrorMessageAction', () => {
  it('should issue SET_MISSING_ACCOUNT_ERROR_MESSAGE with errorBackNavigationType', () => {
    const errorMessage =
      'you have tried too many times, please wait 10 minutes';
    expect(
      setMissingAccountErrorMessageAction(
        errorMessage,
        'LogoutAndStartOverAtLogin'
      )
    ).toMatchObject({
      payload: {
        errorBackNavigationType: 'LogoutAndStartOverAtLogin',
        errorMessage,
      },
      type: MissingAccountActionKeys.SET_MISSING_ACCOUNT_ERROR_MESSAGE,
    });
  });
});

describe('navigateToPhoneLoginScreenAndResetSettings', () => {
  it('returns a THUNK dispatcher function', () => {
    const actionDispatcher = navigateToPhoneLoginScreenAndResetSettings(
      rootStackNavigationMock
    );
    expect(typeof actionDispatcher === 'function').toBeTruthy();
  });

  it('should have called resetSettingsAction', async () => {
    const actionDispatcher = navigateToPhoneLoginScreenAndResetSettings(
      rootStackNavigationMock
    );
    await actionDispatcher(mockReduxDispatchHandler);
    expect(mockResetSettingsAction).toHaveBeenCalledTimes(1);
  });

  it('should have called resetSettingsAction', async () => {
    const actionDispatcher = navigateToPhoneLoginScreenAndResetSettings(
      rootStackNavigationMock
    );
    await actionDispatcher(mockReduxDispatchHandler);
    expect(mockDispatchResetStackToPhoneLoginScreen).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });
});
