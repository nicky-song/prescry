// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ContactDoctorContainer } from './contact-doctor-container';
import { View, ViewStyle } from 'react-native';
import { contactDoctorContainerStyles } from './contact-doctor-container.styles';
import { getChildren } from '../../../testing/test.helper';
import { BaseText } from '../../text/base-text/base-text';
import { BaseButton } from '../../buttons/base/base.button';
import { callPhoneNumber } from '../../../utils/link.helper';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { GrayScaleColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { Heading } from '../heading/heading';
import {
  ContactDoctorContainerCobrandingContent,
  useContactDoctorContainerCobrandingContentHelper,
} from './contact-doctor-container.cobranding-content-helper';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';

jest.mock('../../text/protected-base-text/protected-base-text', () => ({
  ProtectedBaseText: () => <div />,
}));

jest.mock('./contact-doctor-container.cobranding-content-helper');
const useContactDoctorContainerCobrandingContentHelperMock =
  useContactDoctorContainerCobrandingContentHelper as jest.Mock;

jest.mock('../../buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

jest.mock('../../../utils/link.helper');
const callPhoneNumberMock = callPhoneNumber as jest.Mock;

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

void callPhoneNumberMock;
const doctorNameMock = 'doctorName';
const phoneNumberMock = '+19876543210';
const contentMock = {
  switchYourMedsTitle: 'switchYourMedsTitle',
  switchYourMedsDescription: 'switchYourMedsDescriptionMock',
  callNowButtonLabel: 'callNowButtonLabel',
};
const isContentLoadingMock = false;
describe('ContactDoctorContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useContactDoctorContainerCobrandingContentHelperMock.mockReturnValue({
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    });
  });

  it('gets content', () => {
    renderer.create(
      <ContactDoctorContainer
        doctorName={doctorNameMock}
        phoneNumber={phoneNumberMock}
      />
    );

    expect(
      useContactDoctorContainerCobrandingContentHelperMock
    ).toHaveBeenCalledTimes(1);
    expect(
      useContactDoctorContainerCobrandingContentHelperMock
    ).toHaveBeenNthCalledWith(1);
  });

  it('renders in View container', () => {
    const mockViewStyle: ViewStyle = {
      width: 1,
    };
    const testRenderer = renderer.create(
      <ContactDoctorContainer
        doctorName={doctorNameMock}
        phoneNumber={phoneNumberMock}
        viewStyle={mockViewStyle}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual('contactDoctorContainer');
    expect(container.props.style).toEqual(mockViewStyle);
    expect(getChildren(container).length).toEqual(4);
  });

  it('renders title text', () => {
    const testRenderer = renderer.create(
      <ContactDoctorContainer
        doctorName={doctorNameMock}
        phoneNumber={phoneNumberMock}
      />
    );

    const container = testRenderer.root.findByProps({
      testID: 'contactDoctorContainer',
    });
    const baseText = getChildren(container)[0];

    expect(baseText.type).toEqual(Heading);
    expect(baseText.props.level).toEqual(2);
    expect(baseText.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(baseText.props.children).toEqual(contentMock.switchYourMedsTitle);
    expect(baseText.props.skeletonWidth).toEqual('medium');
  });

  it('renders description text', () => {
    const testRenderer = renderer.create(
      <ContactDoctorContainer
        doctorName={doctorNameMock}
        phoneNumber={phoneNumberMock}
      />
    );

    const container = testRenderer.root.findByProps({
      testID: 'contactDoctorContainer',
    });
    const baseText = getChildren(container)[1];

    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(baseText.props.children).toEqual(
      contentMock.switchYourMedsDescription
    );
    expect(baseText.props.style).toEqual(
      contactDoctorContainerStyles.descriptionTextStyle
    );
    expect(baseText.props.skeletonWidth).toEqual('medium');
  });

  it.each([
    ['Dr. Ned', '555-555-5555'],
    [undefined, undefined],
    ['Dr. Ned', undefined],
    [undefined, '555-555-5555'],
  ])(
    'renders doctor name with doctorName: %s, phoneNumber: %s',
    (doctorName?: string, phoneNumber?: string) => {
      const testRenderer = renderer.create(
        <ContactDoctorContainer
          doctorName={doctorName}
          phoneNumber={phoneNumber}
        />
      );

      const container = testRenderer.root.findByProps({
        testID: 'contactDoctorContainer',
      });
      const baseText = getChildren(container)[2];
      if (doctorName && phoneNumber) {
        expect(baseText.type).toEqual(ProtectedBaseText);
        expect(baseText.props.isSkeleton).toEqual(isContentLoadingMock);
        expect(baseText.props.children).toEqual(doctorName);
        expect(baseText.props.style).toEqual(
          contactDoctorContainerStyles.doctorNameTextStyle
        );
        expect(baseText.props.skeletonWidth).toEqual('medium');
      } else {
        expect(baseText).toEqual(undefined);
      }
    }
  );

  it('renders doctor name from cobranding content', () => {
    const cobrandingContentMock: ContactDoctorContainerCobrandingContent = {
      content: {
        ...contentMock,
        switchYourMedsProviderName: 'switch-your-meds-provider-name-mock',
        callNowButtonLabel: 'switch-your-meds-call-button-label-mock',
        switchYourMedsDescription: 'switch-your-meds-description-mock',
        switchYourMedsPhoneNumber: 'switch-your-meds-phone-number-mock',
      },
      isContentLoading: false,
      isCobranding: true,
    };

    useContactDoctorContainerCobrandingContentHelperMock.mockReturnValue(
      cobrandingContentMock
    );

    const testRenderer = renderer.create(<ContactDoctorContainer />);

    const container = testRenderer.root.findByProps({
      testID: 'contactDoctorContainer',
    });
    const baseText = getChildren(container)[2];
    expect(baseText.type).toEqual(ProtectedBaseText);
    expect(baseText.props.children).toEqual(
      cobrandingContentMock.content.switchYourMedsProviderName
    );
    expect(baseText.props.style).toEqual(
      contactDoctorContainerStyles.doctorNameTextStyle
    );
  });

  it.each([
    ['Dr. Ned', '555-555-5555'],
    [undefined, undefined],
    ['Dr. Ned', undefined],
    [undefined, '555-555-5555'],
  ])(
    'renders call now button when given doctorName: %s, phoneNumber: %s',
    (doctorName?: string, phoneNumber?: string) => {
      const testRenderer = renderer.create(
        <ContactDoctorContainer
          doctorName={doctorName}
          phoneNumber={phoneNumber}
        />
      );

      const container = testRenderer.root.findByProps({
        testID: 'contactDoctorContainer',
      });
      const baseButton = getChildren(container)[3];
      if (doctorName && phoneNumber) {
        expect(baseButton.type).toEqual(BaseButton);
        expect(baseButton.props.isSkeleton).toEqual(isContentLoadingMock);
        expect(getChildren(baseButton)[1]).toEqual(
          contentMock.callNowButtonLabel
        );
        expect(baseButton.props.viewStyle).toEqual(
          contactDoctorContainerStyles.callButtonViewStyle
        );
        expect(baseButton.props.skeletonWidth).toEqual('medium');
        expect(baseButton.props.onPress).toEqual(expect.any(Function));
        baseButton.props.onPress();

        expect(callPhoneNumberMock).toHaveBeenCalledTimes(1);
        expect(callPhoneNumberMock).toHaveBeenNthCalledWith(1, phoneNumber);
      } else {
        expect(baseButton).toEqual(undefined);
      }
    }
  );

  it('renders call now button with label from cobranding content', () => {
    const cobrandingContentMock: ContactDoctorContainerCobrandingContent = {
      content: {
        ...contentMock,
        switchYourMedsProviderName: 'switch-your-meds-provider-name-mock',
        callNowButtonLabel: 'switch-your-meds-call-button-label-mock',
        switchYourMedsDescription: 'switch-your-meds-description-mock',
        switchYourMedsPhoneNumber: 'switch-your-meds-phone-number-mock',
      },
      isContentLoading: false,
      isCobranding: true,
    };

    useContactDoctorContainerCobrandingContentHelperMock.mockReturnValue(
      cobrandingContentMock
    );

    const testRenderer = renderer.create(<ContactDoctorContainer />);

    const container = testRenderer.root.findByProps({
      testID: 'contactDoctorContainer',
    });
    const baseButton = getChildren(container)[3];
    expect(baseButton.type).toEqual(BaseButton);
    expect(getChildren(baseButton)[1]).toEqual(
      cobrandingContentMock.content.callNowButtonLabel
    );
    expect(baseButton.props.viewStyle).toEqual(
      contactDoctorContainerStyles.callButtonViewStyle
    );
    expect(baseButton.props.onPress).toEqual(expect.any(Function));
    baseButton.props.onPress();

    expect(callPhoneNumberMock).toHaveBeenCalledTimes(1);
    expect(callPhoneNumberMock).toHaveBeenNthCalledWith(
      1,
      cobrandingContentMock.content.switchYourMedsPhoneNumber
    );
  });

  it('renders phone icon in call button', () => {
    const testRenderer = renderer.create(
      <ContactDoctorContainer
        doctorName={doctorNameMock}
        phoneNumber={phoneNumberMock}
      />
    );

    const container = testRenderer.root.findByProps({
      testID: 'contactDoctorContainer',
    });
    const baseButton = getChildren(container)[3];
    expect(baseButton.props.testID).toBe('contactDoctorCallNowButton');

    const callIcon = getChildren(baseButton)[0];
    expect(callIcon.type).toEqual(FontAwesomeIcon);
    expect(callIcon.props.name).toEqual('phone-alt');
    expect(callIcon.props.color).toEqual(GrayScaleColor.white);
    expect(callIcon.props.size).toEqual(IconSize.regular);
    expect(callIcon.props.style).toEqual(
      contactDoctorContainerStyles.callIconViewStyle
    );
  });
});
