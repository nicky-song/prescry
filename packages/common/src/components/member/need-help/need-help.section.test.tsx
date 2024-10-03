// Copyright 2023 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import { BaseText } from '../../text/base-text/base-text';
import { InlineLink } from '../links/inline/inline.link';
import { PrimaryColor } from '../../../theming/colors';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { callPhoneNumber } from '../../../utils/link.helper';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IconSize } from '../../../theming/icons';
import { needHelpSectionStyles } from './need-help.section.styles';
import { NeedHelpSection } from './need-help.section';
import { getChildren } from '../../../testing/test.helper';

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../links/inline/inline.link', () => ({
  InlineLink: () => <div />,
}));

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../../../utils/link.helper');
const callPhoneNumberMock = callPhoneNumber as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const globalContentMock = {
  content: {
    needHelp: 'need-help-mock',
    contactUs: 'contact-us-mock',
  },
  isContentLoading: false,
};

const communicationContentMock = {
  content: {
    supportPBMPhone: 'support-pbm-phone-mock',
    supportCashPhone: 'support-cash-phone-mock',
  },
  isContentLoading: false,
};

describe('NeedHelpSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValueOnce(globalContentMock);
    useContentMock.mockReturnValueOnce(communicationContentMock);
  });

  it('renders as View with expected styles', () => {
    const viewStyleMock = {};

    const testRenderer = renderer.create(
      <NeedHelpSection viewStyle={viewStyleMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    expect(view.type).toEqual(View);
    expect(view.props.style).toEqual([
      needHelpSectionStyles.containerViewStyle,
      viewStyleMock,
    ]);
    expect(getChildren(view).length).toEqual(2);
  });

  it('renders FontAwesomeIcon as first element', () => {
    const viewStyleMock = {};

    const testRenderer = renderer.create(
      <NeedHelpSection viewStyle={viewStyleMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const fontAwesomeIcon = getChildren(view)[0];

    expect(fontAwesomeIcon.type).toEqual(FontAwesomeIcon);
    expect(fontAwesomeIcon.props.name).toEqual('headphones');
    expect(fontAwesomeIcon.props.size).toEqual(IconSize.regular);
    expect(fontAwesomeIcon.props.color).toEqual(PrimaryColor.darkBlue);
    expect(fontAwesomeIcon.props.style).toEqual(
      needHelpSectionStyles.iconImageStyle
    );
  });

  it('renders BaseText as second element with InlineLink', () => {
    const viewStyleMock = {};
    const testIDMock = 'test-id-mock';

    const testRenderer = renderer.create(
      <NeedHelpSection viewStyle={viewStyleMock} testID={testIDMock} />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;

    const baseText = getChildren(view)[1];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.isSkeleton).toEqual(
      globalContentMock.isContentLoading
    );
    expect(baseText.props.skeletonWidth).toEqual('long');

    const textChildren = getChildren(baseText);

    const needHelpText = textChildren[0];
    const spaceText = textChildren[1];
    const inlineLink = textChildren[2];

    expect(needHelpText).toEqual(globalContentMock.content.needHelp);
    expect(spaceText).toEqual(' ');
    expect(inlineLink.type).toEqual(InlineLink);
    expect(inlineLink.props.onPress).toEqual(expect.any(Function));
    expect(inlineLink.props.testID).toEqual(testIDMock);
    expect(inlineLink.props.children).toEqual(
      globalContentMock.content.contactUs
    );
  });

  it.each([[true], [false]])(
    'calls expected phone number on contact us press (isSieMember: %s)',
    (isSieMemberMock) => {
      const supportPhoneNumber = isSieMemberMock
        ? communicationContentMock.content.supportPBMPhone
        : communicationContentMock.content.supportCashPhone;

      const testRenderer = renderer.create(
        <NeedHelpSection isSieMember={isSieMemberMock} />
      );

      const view = testRenderer.root.children[0] as ReactTestInstance;

      const baseText = getChildren(view)[1];

      const textChildren = getChildren(baseText);

      const inlineLink = textChildren[2];

      inlineLink.props.onPress();

      expect(callPhoneNumberMock).toHaveBeenCalledTimes(1);
      expect(callPhoneNumberMock).toHaveBeenNthCalledWith(
        1,
        supportPhoneNumber
      );
    }
  );
});
