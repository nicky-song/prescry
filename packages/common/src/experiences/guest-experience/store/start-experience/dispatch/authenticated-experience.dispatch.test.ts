// Copyright 2018 Prescryptive Health, Inc.

import { Workflow } from '../../../../../models/workflow';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { navigateHomeScreenDispatch } from '../../navigation/dispatch/navigate-home-screen.dispatch';
import { resetURLAfterNavigation } from '../../navigation/navigation-reducer.helper';
import { authenticatedExperienceDispatch } from './authenticated-experience.dispatch';
import { deepLinkIfPathNameDispatch } from './deep-link-if-path-name.dispatch';
import { IFeaturesState } from '../../../guest-experience-features';
import { CommonConstants } from '../../../../../theming/constants';

jest.mock('../../navigation/dispatch/navigate-home-screen.dispatch');
const navigateHomeScreenDispatchMock = navigateHomeScreenDispatch as jest.Mock;

jest.mock('./deep-link-if-path-name.dispatch');
const deepLinkIfPathNameDispatchMock = deepLinkIfPathNameDispatch as jest.Mock;

jest.mock('../../navigation/navigation-reducer.helper');
const resetURLAfterNavigationMock = resetURLAfterNavigation as jest.Mock;

const featuresMock: IFeaturesState = {
  usegrouptypecash: true,
} as IFeaturesState;

beforeEach(() => {
  jest.resetAllMocks();
});

describe('authenticatedExperienceDispatch', () => {
  it('dispatches deep links', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    deepLinkIfPathNameDispatchMock.mockResolvedValue(true);

    await authenticatedExperienceDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(deepLinkIfPathNameDispatch).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock,
      true
    );

    expect(navigateHomeScreenDispatch).not.toHaveBeenCalled();
  });

  it('dispatches home screen without modal content if no deep link and recoveryEmail exists', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      features: featuresMock,
      memberProfile: { account: { recoveryEmail: 'test@test.com' } },
      identityVerification: {},
    });
    deepLinkIfPathNameDispatchMock.mockResolvedValue(false);

    await authenticatedExperienceDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(deepLinkIfPathNameDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock,
      true
    );
    expect(navigateHomeScreenDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock,
      undefined,
      undefined
    );
    expect(resetURLAfterNavigationMock).toHaveBeenCalledWith(featuresMock);
  });

  it('dispatches home screen with modal content if isVerifyPinSuccess param is passed true', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      features: featuresMock,
      memberProfile: { account: {} },
      identityVerification: { recoveryEmailExists: true },
    });
    deepLinkIfPathNameDispatchMock.mockResolvedValue(false);
    const isVerifyPinSuccess = true;

    await authenticatedExperienceDispatch(
      dispatch,
      getState,
      rootStackNavigationMock,
      undefined,
      isVerifyPinSuccess
    );
    expect(deepLinkIfPathNameDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock,
      true
    );
    expect(navigateHomeScreenDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock,
      {
        modalContent: {
          title: CommonConstants.successText,
          modalTopContent: CommonConstants.pinUpdateSuccess,
        },
      },
      undefined
    );
    expect(resetURLAfterNavigationMock).toHaveBeenCalledWith(featuresMock);
  });

  it('dispatches home screen with modal content when expected', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      features: featuresMock,
      memberProfile: { account: {} },
      identityVerification: {},
    });
    deepLinkIfPathNameDispatchMock.mockResolvedValue(false);

    await authenticatedExperienceDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(deepLinkIfPathNameDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock,
      true
    );
    expect(navigateHomeScreenDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock,
      { modalContent: { modalType: 'recoveryEmailModal' } },
      undefined
    );
    expect(resetURLAfterNavigationMock).toHaveBeenCalledWith(featuresMock);
  });

  it('dispatches home screen with workflow when passed', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      features: featuresMock,
      memberProfile: { account: { recoveryEmail: 'test@test.com' } },
      identityVerification: {},
    });
    deepLinkIfPathNameDispatchMock.mockResolvedValue(false);
    const workflowMock: Workflow = 'startSaving';
    await authenticatedExperienceDispatch(
      dispatch,
      getState,
      rootStackNavigationMock,
      workflowMock
    );
    expect(deepLinkIfPathNameDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock,
      true
    );
    expect(navigateHomeScreenDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock,
      undefined,
      workflowMock
    );
    expect(resetURLAfterNavigationMock).toHaveBeenCalledWith(featuresMock);
  });

  it('dispatches home screen and clears URL to handle deeplinks that are behind feature flags', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      features: featuresMock,
      memberProfile: { account: {} },
      identityVerification: { recoveryEmailExists: true },
    });
    deepLinkIfPathNameDispatchMock.mockResolvedValue(false);

    await authenticatedExperienceDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(resetURLAfterNavigationMock).toHaveBeenCalledWith(featuresMock);
    expect(deepLinkIfPathNameDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock,
      true
    );
    expect(navigateHomeScreenDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatch,
      getState,
      rootStackNavigationMock,
      undefined,
      undefined
    );
  });
});
