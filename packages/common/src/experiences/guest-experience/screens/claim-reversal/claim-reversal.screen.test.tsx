// Copyright 2023 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { useClaimAlertContext } from '../../context-providers/claim-alert/use-claim-alert-context';
import { View } from 'react-native';
import { ImageAsset } from '../../../../components/image-asset/image-asset';
import { Heading } from '../../../../components/member/heading/heading';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { FontAwesomeIcon } from '../../../../components/icons/font-awesome/font-awesome.icon';
import { GrayScaleColor } from '../../../../theming/colors';
import { IconSize } from '../../../../theming/icons';
import { MarkdownText } from '../../../../components/text/markdown-text/markdown-text';
import { ProtectedBaseText } from '../../../../components/text/protected-base-text/protected-base-text';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { useNavigation } from '@react-navigation/core';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { callPhoneNumber } from '../../../../utils/link.helper';
import { claimReversalScreenStyles } from './claim-reversal.screen.styles';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { ClaimReversalScreen } from './claim-reversal.screen';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { getChildren } from '../../../../testing/test.helper';
import { NeedHelpSection } from '../../../../components/member/need-help/need-help.section';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import { getProfilesByGroup } from '../../../../utils/profile.helper';
import { ClaimReversalSlideUpModal } from '../claim-reversal.slide-up-modal/claim-reversal.slide-up-modal';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../../../components/member/need-help/need-help.section', () => ({
  NeedHelpSection: () => <div />,
}));

jest.mock('../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../../utils/profile.helper');
const getProfilesByGroupMock = getProfilesByGroup as jest.Mock;

jest.mock(
  '../claim-reversal.slide-up-modal/claim-reversal.slide-up-modal',
  () => ({
    ClaimReversalSlideUpModal: () => <div />,
  })
);

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../context-providers/claim-alert/use-claim-alert-context');
const useClaimAlertContextMock = useClaimAlertContext as jest.Mock;

jest.mock('../../../../components/image-asset/image-asset', () => ({
  ImageAsset: () => <div />,
}));

jest.mock('../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock(
  '../../../../components/icons/font-awesome/font-awesome.icon',
  () => ({
    FontAwesomeIcon: () => <div />,
  })
);

jest.mock('../../../../components/text/markdown-text/markdown-text', () => ({
  MarkdownText: () => <div />,
}));

jest.mock(
  '../../../../components/text/protected-base-text/protected-base-text',
  () => ({
    ProtectedBaseText: () => <div />,
  })
);

jest.mock(
  '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenNoApiRefreshDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;

jest.mock('@react-navigation/core');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../../utils/link.helper');
const callPhoneNumberMock = callPhoneNumber as jest.Mock;

jest.mock('../../../../components/buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

describe('ClaimReversalScreen', () => {
  const getStateMock = jest.fn();

  const drugNameMock = 'drug-name-mock';
  const strengthMock = 'strength-mock';
  const unitMock = 'unit-mock';
  const formCodeMock = 'form-code-mock';
  const pharmacyInfoNameMock = 'pharmacy-info-name-mock';
  const pharmacyInfoPhoneMock = 'pharmacy-info-phone-mock';
  const isContentLoadingMock = false;
  const contentMock = {
    pharmacyPlaceholder: 'pharmacy-placeholder-mock',
    heading: 'heading-mock',
    descriptionOne: 'description-one-mock',
    descriptionTwo: 'description-two-mock',
    learnMore: 'learn-more-mock',
    phoneButton: 'phone-button-mock',
    homeButton: 'home-button-mock',
  };
  const setIsClaimReversalSlideUpModalVisibleMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useReduxContextMock.mockReturnValue({ getState: getStateMock });
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useClaimAlertContextMock.mockReturnValue({
      claimAlertState: {
        prescribedMedication: {
          drugName: drugNameMock,
          drugDetails: {
            strength: strengthMock,
            unit: unitMock,
            formCode: formCodeMock,
          },
        },
        pharmacyInfo: {
          name: pharmacyInfoNameMock,
          phone: pharmacyInfoPhoneMock,
        },
      },
    });
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });
    useStateMock.mockReturnValue([
      false,
      setIsClaimReversalSlideUpModalVisibleMock,
    ]);
    useMembershipContextMock.mockReturnValue({
      membershipState: { profileList: [] },
    });
    getProfilesByGroupMock.mockReturnValue([{}]);
  });

  it('renders as BasicPageConnected with expected props', () => {
    const testRenderer = renderer.create(<ClaimReversalScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(basicPageConnected.type).toEqual(BasicPageConnected);
    expect(basicPageConnected.props.translateContent).toEqual(true);
    expect(basicPageConnected.props.showProfileAvatar).toEqual(true);
    expect(basicPageConnected.props.navigateBack).toEqual(expect.any(Function));

    basicPageConnected.props.navigateBack();

    expect(navigateHomeScreenNoApiRefreshDispatchMock).toHaveBeenCalledTimes(1);
    expect(navigateHomeScreenNoApiRefreshDispatchMock).toHaveBeenNthCalledWith(
      1,
      getStateMock,
      rootStackNavigationMock
    );

    expect(basicPageConnected.props.modals.length).toEqual(1);

    const claimReversalSlideUpModal = basicPageConnected.props.modals[0];

    expect(claimReversalSlideUpModal.type).toEqual(ClaimReversalSlideUpModal);
    expect(claimReversalSlideUpModal.props.isVisible).toEqual(false);
    expect(claimReversalSlideUpModal.props.onClosePress).toEqual(
      expect.any(Function)
    );

    claimReversalSlideUpModal.props.onClosePress();

    expect(setIsClaimReversalSlideUpModalVisibleMock).toHaveBeenCalledTimes(1);
    expect(setIsClaimReversalSlideUpModalVisibleMock).toHaveBeenNthCalledWith(
      1,
      false
    );

    const footer = basicPageConnected.props.footer;

    expect(footer.type).toEqual(NeedHelpSection);
    expect(footer.props.isSieMember).toEqual(true);
  });

  it('renders the body as View with expected props', () => {
    const testRenderer = renderer.create(<ClaimReversalScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    expect(body.type).toEqual(View);
    expect(body.props.testID).toEqual('claimReversalScreen');
    expect(body.props.style).toEqual(claimReversalScreenStyles.bodyViewStyle);

    expect(getChildren(body).length).toEqual(5);
  });

  it('renders top content as first child', () => {
    const testRenderer = renderer.create(<ClaimReversalScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    const topContent = getChildren(body)[0];

    expect(topContent.type).toEqual(View);
    expect(topContent.props.style).toEqual(
      claimReversalScreenStyles.topViewStyle
    );
    expect(getChildren(topContent).length).toEqual(2);

    const imageAsset = getChildren(topContent)[0];

    expect(imageAsset.type).toEqual(ImageAsset);
    expect(imageAsset.props.name).toEqual('claimReversal');
    expect(imageAsset.props.style).toEqual(
      claimReversalScreenStyles.claimReversalImageStyle
    );

    const heading = getChildren(topContent)[1];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.children).toEqual(contentMock.heading);
  });

  it('renders description content as second child', () => {
    const testRenderer = renderer.create(<ClaimReversalScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    const description = getChildren(body)[1];

    expect(description.type).toEqual(BaseText);
    expect(description.props.style).toEqual(
      claimReversalScreenStyles.descriptionWrapperTextStyle
    );
    expect(getChildren(description).length).toEqual(4);

    const pharmacyName = getChildren(description)[0];

    expect(pharmacyName.type).toEqual(ProtectedBaseText);
    expect(pharmacyName.props.style).toEqual(
      claimReversalScreenStyles.pharmacyNameTextStyle
    );
    expect(pharmacyName.props.children).toEqual(pharmacyInfoNameMock + ' ');

    const descriptionOne = getChildren(description)[1];

    expect(descriptionOne.type).toEqual(BaseText);
    expect(descriptionOne.props.children).toEqual(contentMock.descriptionOne);

    const drugName = getChildren(description)[2];

    expect(drugName.type).toEqual(ProtectedBaseText);
    expect(drugName.props.children).toEqual(
      ` ${drugNameMock} ${strengthMock}${unitMock} ${formCodeMock}.`
    );

    const descriptionTwo = getChildren(description)[3];

    expect(descriptionTwo.type).toEqual(BaseText);
    expect(descriptionTwo.props.children).toEqual(
      ' ' + contentMock.descriptionTwo
    );
  });

  it('renders learn more markdown text as third child', () => {
    const testRenderer = renderer.create(<ClaimReversalScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    const markdownText = getChildren(body)[2];

    expect(markdownText.type).toEqual(MarkdownText);
    expect(markdownText.props.textStyle).toEqual(
      claimReversalScreenStyles.learnMoreTextStyle
    );
    expect(markdownText.props.onLinkPress).toEqual(expect.any(Function));
    expect(markdownText.props.testID).toEqual('learnMore');
    expect(markdownText.props.children).toEqual(contentMock.learnMore);

    markdownText.props.onLinkPress();

    expect(setIsClaimReversalSlideUpModalVisibleMock).toHaveBeenCalledTimes(1);
    expect(setIsClaimReversalSlideUpModalVisibleMock).toHaveBeenNthCalledWith(
      1,
      true
    );
  });

  it('renders phone button as fourth child', () => {
    const testRenderer = renderer.create(<ClaimReversalScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    const phoneButton = getChildren(body)[3];

    expect(phoneButton.type).toEqual(BaseButton);
    expect(phoneButton.props.viewStyle).toEqual(
      claimReversalScreenStyles.phoneButtonViewStyle
    );
    expect(phoneButton.props.onPress).toEqual(expect.any(Function));
    expect(phoneButton.props.testID).toEqual('claimReversalScreenPhoneButton');
    expect(getChildren(phoneButton).length).toEqual(2);

    phoneButton.props.onPress();

    expect(callPhoneNumberMock).toHaveBeenCalledTimes(1);
    expect(callPhoneNumberMock).toHaveBeenNthCalledWith(
      1,
      pharmacyInfoPhoneMock
    );

    const icon = getChildren(phoneButton)[0];

    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual('phone-alt');
    expect(icon.props.color).toEqual(GrayScaleColor.white);
    expect(icon.props.size).toEqual(IconSize.regular);
    expect(icon.props.style).toEqual(
      claimReversalScreenStyles.phoneIconViewStyle
    );

    const content = getChildren(phoneButton)[1];

    expect(content).toEqual(contentMock.phoneButton);
  });

  it('renders home button as fifth child', () => {
    const testRenderer = renderer.create(<ClaimReversalScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    const homeButton = getChildren(body)[4];

    expect(homeButton.type).toEqual(BaseButton);
    expect(homeButton.props.viewStyle).toEqual(
      claimReversalScreenStyles.homeButtonViewStyle
    );
    expect(homeButton.props.textStyle).toEqual(
      claimReversalScreenStyles.homeButtonTextStyle
    );
    expect(homeButton.props.onPress).toEqual(expect.any(Function));
    expect(homeButton.props.testID).toEqual('claimReversalScreenHomeButton');
    expect(homeButton.props.children).toEqual(contentMock.homeButton);

    homeButton.props.onPress();

    expect(navigateHomeScreenNoApiRefreshDispatchMock).toHaveBeenCalledTimes(1);
    expect(navigateHomeScreenNoApiRefreshDispatchMock).toHaveBeenNthCalledWith(
      1,
      getStateMock,
      rootStackNavigationMock
    );
  });

  it('renders descriptionTwo and phone button as null when !pharmacyInfo.phone', () => {
    useClaimAlertContextMock.mockReset();
    useClaimAlertContextMock.mockReturnValue({
      claimAlertState: {
        prescribedMedication: {
          drugName: drugNameMock,
          drugDetails: {
            strength: strengthMock,
            unit: unitMock,
            formCode: formCodeMock,
          },
        },
        pharmacyInfo: {
          name: pharmacyInfoNameMock,
        },
      },
    });

    const testRenderer = renderer.create(<ClaimReversalScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const body = basicPageConnected.props.body;

    const wrappingView = getChildren(body)[0];

    const descriptionText = getChildren(wrappingView)[1];

    const descriptionTwo = getChildren(descriptionText)[3];

    expect(descriptionTwo).toBeUndefined();

    const phoneButton = getChildren(descriptionText)[3];

    expect(phoneButton).toBeUndefined();
  });
});
