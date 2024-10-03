// Copyright 2018 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { AccountLockedContainer } from '../../../../../components/member/account-locked-container/account-locked-container';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { getChildren } from '../../../../../testing/test.helper';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { AccountLockedScreen } from './account-locked.screen';
import { accountLockedScreenContent } from './account-locked.screen.content';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { useConfigContext } from '../../../context-providers/config/use-config-context.hook';

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('@react-navigation/native');
const navigationMock = useNavigation as jest.Mock;
const routeMock = useRoute as jest.Mock;

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const reduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock('../../../context-providers/config/use-config-context.hook');
const useConfigContextMock = useConfigContext as jest.Mock;

const routePropsMock = { params: { accountLockedResponse: false } };
const reduxStateMock = {
  identityVerification: { recoveryEmailExists: true },
};
const configStateMock = { supportEmail: 'example@example.com' };

describe('AccountLockedScreen', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    navigationMock.mockReturnValue(rootStackNavigationMock);
    routeMock.mockReturnValue(routePropsMock);
    reduxContextMock.mockReturnValue({
      getState: jest.fn().mockReturnValue(reduxStateMock),
    });
    useConfigContextMock.mockReturnValue({ configState: configStateMock });
  });
  it('renders as BasicPage', () => {
    const testRenderer = renderer.create(<AccountLockedScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it('renders body in content container', () => {
    const testRenderer = renderer.create(<AccountLockedScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(getChildren(bodyContainer).length).toEqual(1);
  });

  it('renders title in body container', () => {
    const testRenderer = renderer.create(<AccountLockedScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    expect(bodyContainer.props.title).toEqual(accountLockedScreenContent.title);
    expect(bodyContainer.props.testID).toEqual(
      'accountLockedBodyContentContainer'
    );
  });

  it('renders account locked container', () => {
    const testRenderer = renderer.create(<AccountLockedScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const accountLockedContainer = getChildren(bodyContainer)[0];

    expect(accountLockedContainer.type).toEqual(AccountLockedContainer);
    expect(accountLockedContainer.props.supportEmail).toEqual(
      configStateMock.supportEmail
    );
    expect(accountLockedContainer.props.recoveryEmailExists).toEqual(
      reduxStateMock.identityVerification.recoveryEmailExists
    );
    expect(accountLockedContainer.props.accountLockedResponse).toEqual(
      routePropsMock.params.accountLockedResponse
    );
  });

  it('navigates to verify identity screen correctly', () => {
    const testRenderer = renderer.create(<AccountLockedScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const accountLockedContainer = getChildren(bodyContainer)[0];

    accountLockedContainer.props.onResetPinPress();

    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.CLICKED_FORGOT_PIN_LINK,
      {}
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'VerifyIdentity'
    );
  });
});
