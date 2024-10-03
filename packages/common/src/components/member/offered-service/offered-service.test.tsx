// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View, TouchableOpacity } from 'react-native';
import {
  IOfferedServiceStyles,
  offeredServiceDesktopStyles,
  offeredServiceStyle,
} from './offered-service.styles';
import { OfferedService } from './offered-service';
import { useMediaQueryContext } from '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook';
import { defaultMediaQueryContext } from '../../../experiences/guest-experience/context-providers/media-query/media-query.context';
import { ImageInstanceNames } from '../../../theming/assets';
import { ImageAsset } from '../../image-asset/image-asset';
import { BaseButton } from '../../buttons/base/base.button';
import { BaseText } from '../../text/base-text/base-text';
import { isDesktopDevice } from '../../../utils/responsive-screen.helper';
import { IconSize } from '../../../theming/icons';
import { PrimaryColor } from '../../../theming/colors';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';

jest.mock('../../image-asset/image-asset');

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook'
);
const useMediaQueryContextMock = useMediaQueryContext as jest.Mock;

jest.mock('../../../utils/responsive-screen.helper');
const isDesktopDeviceMock = isDesktopDevice as jest.Mock;

describe('OfferedService', () => {
  beforeEach(() => {
    useMediaQueryContextMock.mockReset();
    useMediaQueryContextMock.mockReturnValue(defaultMediaQueryContext);
    isDesktopDeviceMock.mockReturnValue(false);
  });

  it.each([
    [true, offeredServiceDesktopStyles],
    [false, offeredServiceStyle],
  ])(
    'renders in view container (isDesktop=%p)',
    (isDesktop: boolean, styles: IOfferedServiceStyles) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const mockData = {
        icon: 'lockIcon' as ImageInstanceNames,
        name: 'COVID-19 Vaccines',
        text: 'Schedule an appointment or get on a waitlist.',
        buttonTestId: 'buttonTestId-mock',
      };

      const mockOnClick = jest.fn();
      const mockChildren = <div />;

      const testRenderer = renderer.create(
        <OfferedService
          {...mockData}
          isOpen={false}
          onButtonPressed={mockOnClick}
        >
          {mockChildren}
        </OfferedService>
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;

      expect(container.type).toEqual(View);
      expect(container.props.style).toEqual(styles.serviceDescriptionViewStyle);
      const baseButtonComponent = container.findAllByType(BaseButton)[0];
      expect(baseButtonComponent.props.testID).toEqual(mockData.buttonTestId);
    }
  );

  it('renders content containers on mobile', () => {
    const mockData = {
      icon: 'lockIcon' as ImageInstanceNames,
      name: 'COVID-19 Vaccines',
      text: 'Schedule an appointment or get on a waitlist.',
    };

    const mockOnClick = jest.fn();
    const mockChildren = <div />;

    const testRenderer = renderer.create(
      <OfferedService
        {...mockData}
        isOpen={false}
        onButtonPressed={mockOnClick}
        isCollapsible={false}
      >
        {mockChildren}
      </OfferedService>
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const responsiveContainer = container.props.children[0];

    expect(responsiveContainer.type).toEqual(View);
    expect(responsiveContainer.props.style).toEqual(
      offeredServiceStyle.responsiveContainerViewStyle
    );
    const imageContainer = responsiveContainer.props.children[0];
    expect(imageContainer.type).toEqual(View);
    expect(imageContainer.props.style).toEqual(
      offeredServiceStyle.serviceIconViewStyle
    );
    const mobileImage = imageContainer.props.children;
    expect(mobileImage.type).toEqual(ImageAsset);
    expect(mobileImage.props.resizeMode).toEqual('contain');
    expect(mobileImage.props.resizeMethod).toEqual('scale');
    expect(mobileImage.props.name).toEqual(mockData.icon);
    expect(mobileImage.props.style).toEqual(offeredServiceStyle.iconImageStyle);
  });

  it('renders content containers on desktop', () => {
    isDesktopDeviceMock.mockReturnValue(true);
    const mockData = {
      icon: 'lockIcon' as ImageInstanceNames,
      name: 'COVID-19 Vaccines',
      text: 'Schedule an appointment or get on a waitlist.',
    };

    const mockOnClick = jest.fn();
    const mockChildren = <div />;

    const testRenderer = renderer.create(
      <OfferedService
        {...mockData}
        isOpen={false}
        onButtonPressed={mockOnClick}
        isCollapsible={false}
      >
        {mockChildren}
      </OfferedService>
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    expect(container.props.style).toEqual(
      offeredServiceStyle.serviceDescriptionDesktopViewStyle
    );
    const serviceIconView = container.props.children[0];
    expect(serviceIconView.type).toEqual(View);
    expect(serviceIconView.props.style).toEqual(
      offeredServiceStyle.serviceIconViewStyle
    );
    const serviceIcon = serviceIconView.props.children;
    expect(serviceIcon.type).toEqual(ImageAsset);
    expect(serviceIcon.props.resizeMode).toEqual('contain');
    expect(serviceIcon.props.resizeMethod).toEqual('scale');
    expect(serviceIcon.props.name).toEqual(mockData.icon);
    expect(serviceIcon.props.style).toEqual(offeredServiceStyle.iconImageStyle);
  });

  it.each([
    [true, offeredServiceDesktopStyles],
    [false, offeredServiceStyle],
  ])(
    'renders button in content (isDesktop=%p)',
    (isDesktop: boolean, styles: IOfferedServiceStyles) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const mockData = {
        icon: 'lockIcon' as ImageInstanceNames,
        name: 'COVID-19 Vaccines',
        text: 'Schedule an appointment or get on a waitlist.',
        buttonLabel: 'Go',
      };

      const mockOnClick = jest.fn();
      const mockChildren = <div />;

      const testRenderer = renderer.create(
        <OfferedService
          {...mockData}
          isOpen={false}
          onButtonPressed={mockOnClick}
          isCollapsible={true}
        >
          {mockChildren}
        </OfferedService>
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;
      let buttonContainer;
      if (isDesktop) {
        const serviceContentView = container.props.children[1];
        buttonContainer = serviceContentView.props.children[2];
      } else {
        buttonContainer = container.props.children[2];
      }
      expect(buttonContainer.type).toEqual(BaseButton);
      expect(buttonContainer.props.viewStyle).toEqual(styles.buttonViewStyle);
      expect(buttonContainer.props.onPress).toEqual(mockOnClick);
      expect(buttonContainer.props.children).toEqual('Go');
    }
  );

  it.each([
    [true, offeredServiceDesktopStyles],
    [false, offeredServiceStyle],
  ])(
    'renders children in correct container (isDesktop=%p)',
    (isDesktop: boolean, styles: IOfferedServiceStyles) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const mockChildren = <div />;
      const testRenderer = renderer.create(
        <OfferedService
          icon={'lockIcon' as ImageInstanceNames}
          isOpen={false}
          isCollapsible={true}
        >
          {mockChildren}
        </OfferedService>
      );

      const childrenContainer = testRenderer.root.findByProps({
        style: styles.hiddenContainerStyle,
      });
      expect(childrenContainer.type).toEqual(View);
      expect(childrenContainer.props.children).toEqual(mockChildren);
    }
  );

  it.each([
    [true, offeredServiceDesktopStyles],
    [false, offeredServiceStyle],
  ])(
    'renders correct open style (isDesktop=%p)',
    (isDesktop: boolean, styles: IOfferedServiceStyles) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      if (isDesktop) {
        useMediaQueryContextMock.mockReturnValue({ mediaSize: 'large' });
      }

      const testRenderer = renderer.create(
        <OfferedService
          icon={'lockIcon' as ImageInstanceNames}
          isOpen={true}
          isCollapsible={true}
        />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;
      let childrenContainer;
      if (isDesktop) {
        const serviceContentContainer = container.props.children[1];
        childrenContainer = serviceContentContainer.props.children[1];
      } else {
        childrenContainer = container.props.children[1];
      }
      expect(childrenContainer.props.style).toEqual(
        styles.visibleContainerStyle
      );
      expect(childrenContainer.type).toEqual(View);
    }
  );

  it.each([
    [true, offeredServiceDesktopStyles],
    [false, offeredServiceStyle],
  ])(
    'renders expected text in content (isDesktop=%p)',
    (isDesktop: boolean, styles: IOfferedServiceStyles) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const mockData = {
        icon: 'lockIcon' as ImageInstanceNames,
        name: 'COVID-19 Vaccines',
        text: 'Schedule an appointment or get on a waitlist.',
        buttonLabel: 'Go',
      };

      const mockOnClick = jest.fn();
      const mockChildren = <div />;

      const testRenderer = renderer.create(
        <OfferedService
          {...mockData}
          isOpen={false}
          onButtonPressed={mockOnClick}
        >
          {mockChildren}
        </OfferedService>
      );
      const textContainer = testRenderer.root.findByProps({
        style: styles.flexViewStyle,
      });
      const nameContainer = textContainer.props.children[0];
      expect(nameContainer.type).toEqual(BaseText);
      expect(nameContainer.props.style).toEqual(styles.serviceTitleTextStyle);
      expect(nameContainer.props.children).toEqual('COVID-19 Vaccines');
      const descriptionContainer = textContainer.props.children[1];
      expect(descriptionContainer.type).toEqual(BaseText);
      expect(descriptionContainer.props.style).toEqual(
        styles.serviceTextTextStyle
      );
      expect(descriptionContainer.props.children).toEqual(
        'Schedule an appointment or get on a waitlist.'
      );
    }
  );

  it.each([
    [true, offeredServiceDesktopStyles],
    [false, offeredServiceStyle],
  ])(
    'renders expected toggleImage in content (isDesktop=%p)',
    (isDesktop: boolean, styles: IOfferedServiceStyles) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      useMediaQueryContextMock.mockReturnValue({ mediaSize: 'large' });
      const mockData = {
        icon: 'lockIcon' as ImageInstanceNames,
        name: 'COVID-19 Vaccines',
        text: 'Schedule an appointment or get on a waitlist.',
        buttonLabel: 'Go',
      };

      const mockOnClick = jest.fn();
      const mockChildren = <div />;

      const testRenderer = renderer.create(
        <OfferedService
          {...mockData}
          isOpen={false}
          onButtonPressed={mockOnClick}
          isCollapsible={true}
        >
          {mockChildren}
        </OfferedService>
      );

      const touchableContainer =
        testRenderer.root.findAllByType(TouchableOpacity)[0];
      expect(touchableContainer.props.activeOpacity).toEqual(1);

      const contentContainer = touchableContainer.props.children;

      const imageComponent = contentContainer.props.children[2];

      expect(imageComponent.type).toEqual(View);
      expect(imageComponent.props.style).toEqual(
        styles.labelContainerViewStyle
      );
      const serviceIcon = imageComponent.props.children;
      expect(serviceIcon.type).toEqual(FontAwesomeIcon);
      expect(serviceIcon.props.size).toEqual(IconSize.small);
    }
  );

  it('renders expected image in correct place in mobile size', () => {
    useMediaQueryContextMock.mockReturnValue({ mediaSize: 'small' });
    const mockData = {
      icon: 'lockIcon' as ImageInstanceNames,
      name: 'COVID-19 Vaccines',
      text: 'Schedule an appointment or get on a waitlist.',
      buttonLabel: 'Go',
    };

    const mockOnClick = jest.fn();
    const mockChildren = <div />;

    const testRenderer = renderer.create(
      <OfferedService
        {...mockData}
        isOpen={false}
        onButtonPressed={mockOnClick}
        isCollapsible={true}
      >
        {mockChildren}
      </OfferedService>
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    const touchableContainer = container.props.children[0];
    const contentContainer = touchableContainer.props.children;
    const mobileImageContainer = contentContainer.props.children[2];

    expect(mobileImageContainer.type).toEqual(View);
    expect(mobileImageContainer.props.style).toEqual(
      offeredServiceStyle.labelContainerViewStyle
    );
    const mobileImage = mobileImageContainer.props.children;

    expect(mobileImage.type).toEqual(FontAwesomeIcon);
    expect(mobileImage.props.size).toEqual(IconSize.small);
    expect(mobileImage.props.name).toEqual('chevron-down');
    expect(mobileImage.props.color).toEqual(PrimaryColor.darkBlue);
    expect(mobileImage.props.style).toEqual(
      offeredServiceStyle.dropDownArrowImage
    );
  });
});
