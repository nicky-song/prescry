// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { Heading } from '../../../../components/member/heading/heading';
import { TermsConditionsAndPrivacyLinks } from '../../../../components/member/links/terms-conditions-and-privacy/terms-conditions-and-privacy.links';
import { PinFeatureWelcomeScreenContainer } from '../../../../components/member/pin-feature-welcome-screen-container/pin-feature-welcome-screen-container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { getChildren } from '../../../../testing/test.helper';
import { PinFeatureWelcomeScreen } from './pin-feature-welcome.screen';
import { pinFeatureWelcomeScreenStyles } from './pin-feature-welcome.screen.styles';
import { accountTokenClearDispatch } from '../../store/settings/dispatch/account-token-clear.dispatch';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { ICreatePinScreenRouteProps } from '../../create-pin-screen/create-pin-screen';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { ISignInContent } from '../../../../models/cms-content/sign-in.ui-content';

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));
jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../store/settings/dispatch/account-token-clear.dispatch');
const accountTokenClearDispatchMock = accountTokenClearDispatch as jest.Mock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const useRouteParamsMock: ICreatePinScreenRouteProps = {};

const uiContentMock: Partial<ISignInContent> = {
  welcomeText: 'welcome-text-mock',
  containerHeaderText: 'container-header-text-mock',
  pinWelcomeInfoText1: 'pin-welcome-info-text-1-mock',
  pinWelcomeInfoText2: 'pin-welcome-info-text-2-mock',
  continueButtonCaption: 'continue-button-caption-mock',
};

describe('PinFeatureWelcomeScreen', () => {
  beforeEach(() => {
    useReduxContextMock.mockReturnValue({
      dispatch: jest.fn(),
    });
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({ params: useRouteParamsMock });
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });
  it('renders as basic page', () => {
    const testRendrer = renderer.create(<PinFeatureWelcomeScreen />);

    const basicPage = testRendrer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it('renders title', () => {
    const testRenderer = renderer.create(<PinFeatureWelcomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const title = basicPage.props.header;

    expect(title.type).toEqual(Heading);
    expect(title.props.textStyle).toEqual(
      pinFeatureWelcomeScreenStyles.titleTextStyle
    );
    expect(title.props.children).toEqual(uiContentMock.welcomeText);
    expect(title.props.isSkeleton).toEqual(false);
  });

  it('renders PinFeatureWelcomeScreenContainer', () => {
    const testRenderer = renderer.create(<PinFeatureWelcomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    expect(body.type).toEqual(PinFeatureWelcomeScreenContainer);
  });

  it('renders footer fragment', () => {
    const testRenderer = renderer.create(<PinFeatureWelcomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footerFragment = basicPage.props.footer;

    expect(getChildren(footerFragment).length).toEqual(2);
  });

  it('renders policy links in footer container', () => {
    const testRenderer = renderer.create(<PinFeatureWelcomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footerContainer = basicPage.props.footer;
    const policyLinks = getChildren(footerContainer)[0];

    expect(policyLinks.type).toEqual(TermsConditionsAndPrivacyLinks);
    expect(policyLinks.props.viewStyle).toEqual(
      pinFeatureWelcomeScreenStyles.linksViewStyle
    );
  });

  it('renders continue button in footer container', () => {
    const testRenderer = renderer.create(<PinFeatureWelcomeScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footerContainer = basicPage.props.footer;
    const button = getChildren(footerContainer)[1];

    expect(button.type).toEqual(BaseButton);
    expect(button.props.children).toEqual(uiContentMock.continueButtonCaption);
    expect(button.props.isSkeleton).toEqual(false);
  });
  it('dispatches to createPin screen when continue button is pressed', () => {
    const testRenderer = renderer.create(<PinFeatureWelcomeScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footerContainer = basicPage.props.footer;
    const button = getChildren(footerContainer)[1];
    button.props.onPress();
    expect(accountTokenClearDispatchMock).toBeCalledWith(expect.any(Function));
    const expectedCreatePinParams: ICreatePinScreenRouteProps = {};
    expect(rootStackNavigationMock.navigate).toBeCalledWith(
      'CreatePin',
      expectedCreatePinParams
    );
  });
  it('should pass workflow as prop to createPin screen when workflow exists and continue button is pressed', () => {
    useRouteMock.mockReturnValueOnce({
      params: { ...useRouteParamsMock, workflow: 'prescriptionTransfer' },
    });
    const testRenderer = renderer.create(<PinFeatureWelcomeScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const footerContainer = basicPage.props.footer;
    const button = getChildren(footerContainer)[1];
    button.props.onPress();
    expect(accountTokenClearDispatchMock).toBeCalledWith(expect.any(Function));
    const expectedCreatePinParams: ICreatePinScreenRouteProps = {
      workflow: 'prescriptionTransfer',
    };
    expect(rootStackNavigationMock.navigate).toBeCalledWith(
      'CreatePin',
      expectedCreatePinParams
    );
  });
});
