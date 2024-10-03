// Copyright 2021 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { ISignUpContent } from '../../../../../models/cms-content/sign-up.ui-content';
import { getChildren } from '../../../../../testing/test.helper';
import { ISessionContext } from '../../../context-providers/session/session.context';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { defaultSessionState } from '../../../state/session/session.state';
import { PbmMemberBenefitsList } from './pbm-member-benefits-list';
import { PbmMemberBenefitsScreen } from './pbm-member-benefits.screen';
import { pbmMemberBenefitsScreenStyles } from './pbm-member-benefits.screen.styles';

import { useFlags } from 'launchdarkly-react-client-sdk';

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../../../components/member/lists/benefits/benefits.list',
  () => ({
    BenefitsList: () => <div />,
  })
);

jest.mock('../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

const uiContentMock: Partial<ISignUpContent> = {
  pbmSignUpHeader: 'pbm-sign-up-header-mock',
  pbmSignUpDescription: 'pbm-sign-up-description-mock',
  continueButton: 'continue-button-mock',
};

describe('PbmMemberBenefitsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const sesssionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sesssionContextMock);
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({ params: {} });
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
    useFlagsMock.mockReturnValue({ uselangselector: false });
  });

  it.each([[false], [true]])(
    'renders as Basic Page (uselangselectorMock: %p)',
    (uselangselectorMock: boolean) => {
      useFlagsMock.mockReturnValue({
        uselangselector: uselangselectorMock,
      });
      const testRenderer = renderer.create(<PbmMemberBenefitsScreen />);

      const basicPage = testRenderer.root.children[0] as ReactTestInstance;

      expect(basicPage.type).toEqual(BasicPageConnected);
      expect(basicPage.props.bodyViewStyle).toEqual({});
      expect(basicPage.props.allowBodyGrow).toEqual(true);
      expect(basicPage.props.showProfileAvatar).toEqual(uselangselectorMock);
      expect(basicPage.props.translateContent).toEqual(true);
    }
  );

  it.each([[undefined], [false]])(
    'has no back button handler if showBackButton is %p',
    (showBackButtonMock: boolean | undefined) => {
      useRouteMock.mockReturnValue({
        params: {
          showBackButton: showBackButtonMock,
        },
      });
      const testRenderer = renderer.create(<PbmMemberBenefitsScreen />);

      const basicPage = testRenderer.root.children[0] as ReactTestInstance;

      expect(basicPage.props.navigateBack).toBeUndefined();
    }
  );

  it('dispatches navigate back (showBackButton=true)', () => {
    useRouteMock.mockReturnValue({
      params: {
        showBackButton: true,
      },
    });
    const testRenderer = renderer.create(<PbmMemberBenefitsScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.props.navigateBack).toEqual(expect.any(Function));
    basicPage.props.navigateBack();
    expect(rootStackNavigationMock.goBack).toBeCalled();
  });

  it('renders body in content container', () => {
    const testRenderer = renderer.create(<PbmMemberBenefitsScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const contentContainer = basicPage.props.body;

    expect(contentContainer.type).toEqual(BodyContentContainer);
    expect(getChildren(contentContainer).length).toEqual(2);
  });

  it('renders benefits list', () => {
    const testRenderer = renderer.create(<PbmMemberBenefitsScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = basicPage.props.body;
    const topContentContainer = getChildren(bodyContentContainer)[0];

    expect(topContentContainer.type).toEqual(PbmMemberBenefitsList);
  });

  it('renders bottom content container', () => {
    const testRenderer = renderer.create(<PbmMemberBenefitsScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = basicPage.props.body;
    const bottomContentContainer = getChildren(bodyContentContainer)[1];

    expect(bottomContentContainer.type).toEqual(View);
    expect(bottomContentContainer.props.style).toEqual(
      pbmMemberBenefitsScreenStyles.bottomContentViewStyle
    );
    expect(getChildren(bottomContentContainer).length).toEqual(1);
  });

  it('renders "Continue" button in bottom content', () => {
    const testRenderer = renderer.create(<PbmMemberBenefitsScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = basicPage.props.body;
    const bottomContentContainer = getChildren(bodyContentContainer)[1];
    const button = getChildren(bottomContentContainer)[0];

    expect(button.type).toEqual(BaseButton);
    expect(button.props.children).toEqual(uiContentMock.continueButton);
    expect(button.props.onPress).toEqual(expect.any(Function));
    expect(button.props.isSkeleton).toEqual(false);
    expect(button.props).toHaveProperty('testID');
    expect(button.props.testID).toEqual(
      'pbmMemberBenefitsScreenContinueButton'
    );
  });

  it('handles "Continue" button press', () => {
    const testRenderer = renderer.create(<PbmMemberBenefitsScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const button = bodyRenderer.root.findByType(BaseButton);

    button.props.onPress();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'CreateAccount',
      {
        workflow: 'pbmActivate',
      }
    );
  });

  it('content container has test id prop', () => {
    const testRenderer = renderer.create(<PbmMemberBenefitsScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = basicPage.props.body;

    expect(bodyContentContainer.props).toHaveProperty('testID');
    expect(bodyContentContainer.props.testID).toEqual(
      'pbmMemberBenefitsScreenBodyContentContainer'
    );
  });
});
