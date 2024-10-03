// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle, View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../../testing/test.helper';
import { formatPhoneNumber } from '../../../../utils/formatters/phone-number.formatter';
import { callPhoneNumber, goToUrl } from '../../../../utils/link.helper';
import { ProtectedView } from '../../../containers/protected-view/protected-view';
import { FontAwesomeIcon } from '../../../icons/font-awesome/font-awesome.icon';
import { Heading } from '../../heading/heading';
import { InlineLink } from '../../links/inline/inline.link';
import { ContactInfoPanel, IContactInfoPanelProps } from './contact-info.panel';
import { contactInfoPanelStyles } from './contact-info.panel.styles';

jest.mock('../../heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../../links/inline/inline.link', () => ({
  InlineLink: () => <div />,
}));

jest.mock('../../../../utils/link.helper');
const callPhoneNumberMock = callPhoneNumber as jest.Mock;
const goToUrlMock = goToUrl as jest.Mock;

const contactInfoPanelPropsMock: IContactInfoPanelProps = {
  title: '',
  email: '',
};

describe('ContactInfoPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders in View container', () => {
    const customViewStyle: ViewStyle = {
      width: 1,
    };
    const testRenderer = renderer.create(
      <ContactInfoPanel
        {...contactInfoPanelPropsMock}
        viewStyle={customViewStyle}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual('ContactInfoPanel');
    expect(container.props.style).toEqual(customViewStyle);
    expect(getChildren(container).length).toEqual(3);
  });

  it('renders title', () => {
    const titleMock = 'title';
    const testRenderer = renderer.create(
      <ContactInfoPanel {...contactInfoPanelPropsMock} title={titleMock} />
    );

    const container = testRenderer.root.findByProps({
      testID: 'ContactInfoPanel',
    });
    const title = getChildren(container)[0];

    expect(title.type).toEqual(Heading);
    expect(title.props.children).toEqual([titleMock, ' ']);
    expect(title.props.level).toEqual(2);
  });

  it.each([[undefined], [''], ['+1234567890']])(
    'renders phone container (phoneNumber: %p)',
    (phoneNumberMock: string | undefined) => {
      const testRenderer = renderer.create(
        <ContactInfoPanel
          {...contactInfoPanelPropsMock}
          phoneNumber={phoneNumberMock}
        />
      );

      const container = testRenderer.root.findByProps({
        testID: 'ContactInfoPanel',
      });
      const phoneContainer = getChildren(container)[1];

      if (!phoneNumberMock) {
        expect(phoneContainer).toBeNull();
      } else {
        expect(phoneContainer.type).toEqual(ProtectedView);
        expect(phoneContainer.props.testID).toEqual('phoneContent');
        expect(phoneContainer.props.style).toEqual(
          contactInfoPanelStyles.rowViewStyle
        );
        expect(getChildren(phoneContainer).length).toEqual(2);
      }
    }
  );

  it('renders phone icon', () => {
    const phoneNumberMock = '+11234567890';
    const testRenderer = renderer.create(
      <ContactInfoPanel
        {...contactInfoPanelPropsMock}
        phoneNumber={phoneNumberMock}
      />
    );

    const phoneContainer = testRenderer.root.findByProps({
      testID: 'phoneContent',
    });
    const icon = getChildren(phoneContainer)[0];

    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual('phone-alt');
    expect(icon.props.style).toEqual(contactInfoPanelStyles.iconTextStyle);
    expect(icon.props.size).toEqual(16);
  });

  it('renders phone number link', () => {
    const phoneNumberMock = '+11234567890';
    const testIDMock = 'contactInfoPanelPhoneNumberInlineLink';
    const testRenderer = renderer.create(
      <ContactInfoPanel
        {...contactInfoPanelPropsMock}
        phoneNumber={phoneNumberMock}
      />
    );

    const phoneContainer = testRenderer.root.findByProps({
      testID: 'phoneContent',
    });
    const phoneNumber = getChildren(phoneContainer)[1];

    expect(phoneNumber.type).toEqual(InlineLink);
    expect(phoneNumber.props.textStyle).toEqual(
      contactInfoPanelStyles.linkTextStyle
    );
    expect(phoneNumber.props.testID).toEqual(testIDMock);
    expect(phoneNumber.props.onPress).toEqual(expect.any(Function));
    expect(phoneNumber.props.children).toEqual(
      formatPhoneNumber(phoneNumberMock)
    );
  });

  it('handles phone number link press', async () => {
    const phoneNumberMock = '+11234567890';
    const testRenderer = renderer.create(
      <ContactInfoPanel
        {...contactInfoPanelPropsMock}
        phoneNumber={phoneNumberMock}
      />
    );

    const phoneContainer = testRenderer.root.findByProps({
      testID: 'phoneContent',
    });
    const phoneNumber = getChildren(phoneContainer)[1];

    await phoneNumber.props.onPress();

    expect(callPhoneNumberMock).toHaveBeenCalledWith(phoneNumberMock);
  });

  it('renders support email container', () => {
    const emailMock = 'someone@somewhere.com';
    const testRenderer = renderer.create(
      <ContactInfoPanel {...contactInfoPanelPropsMock} email={emailMock} />
    );

    const container = testRenderer.root.findByProps({
      testID: 'ContactInfoPanel',
    });
    const emailContainer = getChildren(container)[2];

    expect(emailContainer.type).toEqual(ProtectedView);
    expect(emailContainer.props.testID).toEqual('supportEmailContent');
    expect(emailContainer.props.style).toEqual(
      contactInfoPanelStyles.rowViewStyle
    );
    expect(getChildren(emailContainer).length).toEqual(2);
  });

  it('renders email icon', () => {
    const emailMock = 'someone@somewhere.com';
    const testRenderer = renderer.create(
      <ContactInfoPanel {...contactInfoPanelPropsMock} email={emailMock} />
    );

    const supportEmailContainer = testRenderer.root.findByProps({
      testID: 'supportEmailContent',
    });
    const icon = getChildren(supportEmailContainer)[0];

    expect(icon.type).toEqual(FontAwesomeIcon);
    expect(icon.props.name).toEqual('envelope');
    expect(icon.props.style).toEqual(contactInfoPanelStyles.iconTextStyle);
    expect(icon.props.size).toEqual(16);
  });

  it('renders support email address link', () => {
    const emailMock = 'someone@somewhere.com';
    const testRenderer = renderer.create(
      <ContactInfoPanel {...contactInfoPanelPropsMock} email={emailMock} />
    );

    const supportEmailContainer = testRenderer.root.findByProps({
      testID: 'supportEmailContent',
    });
    const emailAddress = getChildren(supportEmailContainer)[1];

    expect(emailAddress.type).toEqual(InlineLink);
    expect(emailAddress.props.textStyle).toEqual(
      contactInfoPanelStyles.linkTextStyle
    );
    expect(emailAddress.props.onPress).toEqual(expect.any(Function));
    expect(emailAddress.props.children).toEqual(emailMock);
  });

  it('handles support email link press', async () => {
    const emailMock = 'someone@somewhere.com';
    const testRenderer = renderer.create(
      <ContactInfoPanel {...contactInfoPanelPropsMock} email={emailMock} />
    );

    const supportEmailContainer = testRenderer.root.findByProps({
      testID: 'supportEmailContent',
    });
    const emailAddress = getChildren(supportEmailContainer)[1];

    await emailAddress.props.onPress();

    expect(goToUrlMock).toHaveBeenCalledWith(`mailto:${emailMock}`);
  });
});
