// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useReduxContext } from '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { ITestContainer } from '../../../testing/test.container';
import { getChildren } from '../../../testing/test.helper';
import { BaseText } from '../../text/base-text/base-text';
import { InlineLink } from '../links/inline/inline.link';
import { CustomerSupport } from './customer-support';
import { customerSupportStyle } from './customer-support.style';
import { PrimaryColor } from '../../../theming/colors';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { ICommunicationContent } from '../../../models/cms-content/communication.content';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { IconSize } from '../../../theming/icons';
import { showTalkativeElementStyleDisplay } from '../../../hooks/use-talkative-widget/helpers/show-talkative-element-style-display';
import { hideTalkativeElementStyleDisplay } from '../../../hooks/use-talkative-widget/helpers/hide-talkative-element-style-display';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../links/inline/inline.link', () => ({
  InlineLink: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock(
  '../../../hooks/use-talkative-widget/helpers/show-talkative-element-style-display'
);
const showTalkativeElementStyleDisplayMock =
  showTalkativeElementStyleDisplay as jest.Mock;

jest.mock(
  '../../../hooks/use-talkative-widget/helpers/hide-talkative-element-style-display'
);
const hideTalkativeElementStyleDisplayMock =
  hideTalkativeElementStyleDisplay as jest.Mock;

const getReduxStateMock = jest.fn();

const uiContentGlobalMock: Partial<IGlobalContent> = {
  supportUnlinkedText: 'support-unlinked-phone',
  supportLinkedText: 'support-linked-phone',
  prescryptiveHelp: 'prescryptive-help-mock',
};

const uiContentCommunicationMock: Partial<ICommunicationContent> = {
  supportCashPhone: 'support-cash-phone',
  supportPBMPhone: 'support-pbm-phone',
};

describe('CustomerSupport', () => {
  beforeEach(() => {
    useReduxContextMock.mockReturnValue({
      dispatch: jest.fn(),
      getState: getReduxStateMock,
    });
    getReduxStateMock.mockReturnValue({ features: {} });
    useContentMock.mockReset();
    useContentMock.mockReturnValueOnce({
      content: uiContentGlobalMock,
      isContentLoading: false,
    });
    useContentMock.mockReturnValueOnce({
      content: uiContentCommunicationMock,
      isContentLoading: false,
    });
  });

  it('should display outer container correctly', () => {
    const testRenderer = renderer.create(<CustomerSupport />);
    const outerContainer = testRenderer.root.children[0] as ReactTestInstance;
    expect(outerContainer.type).toEqual(View);
    expect(outerContainer.props.style).toEqual([
      customerSupportStyle.customerSupportContainerViewStyle,
      undefined,
    ]);
    expect(getChildren(outerContainer).length).toEqual(2);
  });

  it('should display outer container correctly with passed-in view style', () => {
    const passedInViewStyle: ViewStyle = {};
    const testRenderer = renderer.create(
      <CustomerSupport viewStyle={passedInViewStyle} />
    );
    const outerContainer = testRenderer.root.findByType(View);
    expect(outerContainer.props.style).toEqual([
      customerSupportStyle.customerSupportContainerViewStyle,
      passedInViewStyle,
    ]);
  });

  it('should display icon correctly', () => {
    const testRenderer = renderer.create(<CustomerSupport />);
    const outerContainer = testRenderer.root.findByType(View);
    const customerSupportIcon = getChildren(outerContainer)[0];
    expect(customerSupportIcon.type).toEqual(FontAwesomeIcon);
    expect(customerSupportIcon.props.style).toEqual(
      customerSupportStyle.iconImageStyle
    );
    expect(customerSupportIcon.props.name).toEqual('headphones');
    expect(customerSupportIcon.props.size).toEqual(IconSize.regular);
    expect(customerSupportIcon.props.color).toEqual(PrimaryColor.darkBlue);
  });

  it('should display both help texts correctly', () => {
    const testRenderer = renderer.create(<CustomerSupport />);
    const outerContainer = testRenderer.root.findByType(View);
    const helpView = getChildren(outerContainer)[1];

    expect(helpView.type).toEqual(View);
    expect(helpView.props.style).toEqual(
      customerSupportStyle.textContainerViewStyle
    );

    const prescryptiveHelpText = getChildren(helpView)[0];

    expect(prescryptiveHelpText.type).toEqual(BaseText);
    expect(prescryptiveHelpText.props.isSkeleton).toEqual(false);
    expect(prescryptiveHelpText.props.skeletonWidth).toEqual('medium');
    expect(prescryptiveHelpText.props.style).toEqual(
      customerSupportStyle.prescryptiveHelpTextStyle
    );
    expect(prescryptiveHelpText.props.children).toEqual(
      uiContentGlobalMock.prescryptiveHelp
    );

    const helpText = getChildren(helpView)[1];

    expect(helpText.type).toEqual(BaseText);
    expect(getChildren(helpText).length).toEqual(3);
    expect(getChildren(helpText)[2]).toEqual(
      uiContentGlobalMock.supportUnlinkedText
    );
  });

  it('should display space correctly', () => {
    const testRenderer = renderer.create(<CustomerSupport />);
    const outerContainer = testRenderer.root.findByType(View);
    const helpView = getChildren(outerContainer)[1];
    const helpText = getChildren(helpView)[1];
    const spaceText = getChildren(helpText)[1];
    expect(spaceText).toEqual(' ');
  });

  it('should display contact link correctly', () => {
    const testIDMock = 'testIDMock';
    const testRenderer = renderer.create(
      <CustomerSupport testID={testIDMock} />
    );
    const outerContainer = testRenderer.root.findByType(View);
    const helpView = getChildren(outerContainer)[1];
    const helpText = getChildren(helpView)[1];
    const contactLink = getChildren(helpText)[0];
    expect(contactLink.type).toEqual(InlineLink);
    expect(contactLink.props.children).toEqual(
      uiContentGlobalMock.supportLinkedText
    );
    expect(contactLink.props.onPress).toEqual(expect.any(Function));
    expect(contactLink.props.testID).toEqual(testIDMock);
  });

  it('renders skeletons when isSkeleton is true', () => {
    useContentMock.mockReset();
    useContentMock.mockReturnValueOnce({
      content: uiContentGlobalMock,
      isContentLoading: true,
    });
    useContentMock.mockReturnValueOnce({
      content: uiContentCommunicationMock,
      isContentLoading: true,
    });
    const testRenderer = renderer.create(<CustomerSupport />);
    const outerContainer = testRenderer.root.findByType(View);
    const helpView = getChildren(outerContainer)[1];
    const helpText = getChildren(helpView)[1];

    expect(helpText.type).toEqual(BaseText);
    expect(helpText.props.isSkeleton).toEqual(true);
    expect(helpText.props.skeletonWidth).toEqual('long');
  });

  it('should launch the Talkative widget when the "Contact Us" link is pressed', () => {
    const testRenderer = renderer.create(<CustomerSupport />);
    const outerContainer = testRenderer.root.findByType(View);
    const helpView = getChildren(outerContainer)[1];
    const helpText = getChildren(helpView)[1];
    const contactLink = getChildren(helpText)[0];

    contactLink.props.onPress();

    expect(showTalkativeElementStyleDisplayMock).toHaveBeenNthCalledWith(1, {
      forceExpandedView: true,
      showHeader: false,
    });
  });

  it('should hide the Talkative widget when the component unmounts', () => {
    renderer.create(<CustomerSupport />);

    const callback = useEffectMock.mock.calls[0][0];
    const secondCallback = callback();

    secondCallback();

    expect(hideTalkativeElementStyleDisplayMock).toHaveBeenNthCalledWith(1);
  });
});
