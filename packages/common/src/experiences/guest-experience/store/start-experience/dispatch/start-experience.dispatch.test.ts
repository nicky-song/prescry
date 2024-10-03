// Copyright 2018 Prescryptive Health, Inc.

import { Workflow } from '../../../../../models/workflow';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { unauthHomeNavigateDispatch } from '../../navigation/dispatch/unauth/unauth-home-navigate.dispatch';
import { setAuthExperienceAction } from '../../secure-pin/secure-pin-reducer.actions';
import { startSsoExperienceAction } from '../async-actions/sso-experience.actions';
import { authenticatedExperienceDispatch } from './authenticated-experience.dispatch';
import { authenticationExperienceDispatch } from './authentication-experience.dispatch';
import { startExperienceDispatch } from './start-experience.dispatch';

jest.mock('../../navigation/dispatch/unauth/unauth-home-navigate.dispatch');
const unauthHomeNavigateDispatchMock = unauthHomeNavigateDispatch as jest.Mock;

jest.mock('./authentication-experience.dispatch');
const authenticationExperienceDispatchMock =
  authenticationExperienceDispatch as jest.Mock;

jest.mock('./authenticated-experience.dispatch');
const authenticatedExperienceDispatchMock =
  authenticatedExperienceDispatch as jest.Mock;

jest.mock('../../secure-pin/secure-pin-reducer.actions');
const setAuthExperienceActionMock = setAuthExperienceAction as jest.Mock;

jest.mock('../async-actions/sso-experience.actions');
const startSsoExperienceActionMock = startSsoExperienceAction as jest.Mock;

describe('startExperienceDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches navigation to unauth home for unauth experience', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const isUnauthExperienceMock = true;
    getStateMock.mockReturnValue({ features: { usesso: false } });
    await startExperienceDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      isUnauthExperienceMock
    );

    expect(unauthHomeNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
    expect(setAuthExperienceActionMock).toBeCalledWith(false);
    expect(authenticationExperienceDispatchMock).not.toHaveBeenCalled();
  });

  it('stops if redirected for authentication', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    getStateMock.mockReturnValue({ features: { usesso: false } });
    authenticationExperienceDispatchMock.mockReturnValue(true);

    await startExperienceDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(setAuthExperienceActionMock).toBeCalledWith(true);
    expect(authenticationExperienceDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(authenticatedExperienceDispatchMock).not.toHaveBeenCalled();
  });

  it('dispatches authenticated experience if authenticated', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    getStateMock.mockReturnValue({ features: { usesso: false } });
    authenticationExperienceDispatchMock.mockReturnValue(false);

    await startExperienceDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(setAuthExperienceActionMock).toBeCalledWith(true);
    expect(authenticationExperienceDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(authenticatedExperienceDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      undefined,
      undefined
    );
  });

  it('dispatches authenticated experience with workflow if authenticated', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    getStateMock.mockReturnValue({ features: { usesso: false } });
    authenticationExperienceDispatchMock.mockReturnValue(false);
    const workflowMock: Workflow = 'startSaving';
    await startExperienceDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      false,
      workflowMock
    );
    expect(setAuthExperienceActionMock).toBeCalledWith(true);
    expect(authenticationExperienceDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(authenticatedExperienceDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      workflowMock,
      undefined
    );
  });
  it('dispatches authenticated experience with verifyPinsuccess prop if authenticated', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    getStateMock.mockReturnValue({ features: { usesso: false } });
    authenticationExperienceDispatchMock.mockReturnValue(false);
    const workflowMock: Workflow = 'startSaving';
    const isVerifyPinSuccess = true;
    await startExperienceDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      false,
      workflowMock,
      isVerifyPinSuccess
    );
    expect(setAuthExperienceActionMock).toBeCalledWith(true);
    expect(authenticationExperienceDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(authenticatedExperienceDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      workflowMock,
      isVerifyPinSuccess
    );
  });

  it('Dispatch sso experience if useSso flag true and sso_token in search params', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const isUnauthExperienceMock = true;
    getStateMock.mockReturnValue({
      features: { usesso: true },
    });

    const loc = { ...window.location, search: '?sso_token=123' };
    //@ts-ignore
    delete window.location;
    //@ts-ignore
    window.location = loc;

    await startExperienceDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      isUnauthExperienceMock
    );

    expect(startSsoExperienceActionMock).toHaveBeenCalledWith({
      jwtToken: '123',
      dispatch: dispatchMock,
      getState: getStateMock,
      navigation: rootStackNavigationMock,
    });
  });
});
