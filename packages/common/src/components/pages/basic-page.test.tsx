// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import { ScrollView, Text, View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  defaultMediaQueryContext,
  IMediaQueryContext,
} from '../../experiences/guest-experience/context-providers/media-query/media-query.context';
import { useMediaQueryContext } from '../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook';
import { getChildren } from '../../testing/test.helper';
import {
  ApplicationHeader,
  IApplicationHeaderProps,
  LogoClickAction,
  LogoClickActionEnum,
} from '../app/application-header/application-header';
import { FooterContentContainer } from '../containers/footer-content/footer-content.container';
import { ProtectedView } from '../containers/protected-view/protected-view';
import { TranslatableView } from '../containers/translated-view/translatable-view';
import { WelcomeModal } from '../modal/welcome-modal/welcome-modal';
import { BaseText } from '../text/base-text/base-text';
import { BasicPage, IBasicPageProps } from './basic-page';
import { basicPageStyles } from './basic-page.styles';

jest.mock('../app/application-header/application-header', () => ({
  ApplicationHeader: () => <div />,
  LogoClickActionEnum: {
    NONE: 'none' as LogoClickAction,
    CONFIRM: 'confirm' as LogoClickAction,
    NO_CONFIRM: 'noConfirm' as LogoClickAction,
  },
}));

jest.mock(
  '../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook'
);
const useMediaQueryContextMock = useMediaQueryContext as jest.Mock;

jest.mock('../modal/welcome-modal/welcome-modal', () => ({
  WelcomeModal: () => <div />,
}));

describe('BasicPage', () => {
  beforeEach(() => {
    useMediaQueryContextMock.mockReturnValue(defaultMediaQueryContext);
  });

  it('has main container ProtectedView with default pageViewStyle if not passed translateContent', () => {
    const mediaQueryContextMock: Partial<IMediaQueryContext> = {
      windowHeight: 123,
    };
    useMediaQueryContextMock.mockReturnValue(mediaQueryContextMock);

    const testRenderer = renderer.create(<BasicPage />);

    const mainContainer = testRenderer.root.children[0] as ReactTestInstance;

    expect(mainContainer.type).toEqual(ProtectedView);
    expect(mainContainer.props.testID).toEqual('BasicPage');
    expect(mainContainer.props.style).toEqual([
      basicPageStyles.pageViewStyle,
      { height: mediaQueryContextMock.windowHeight },
    ]);
    expect(getChildren(mainContainer.props.children).length).toEqual(5);
  });

  it('has main container ProtectedView with default pageViewStyle if passed translateContent', () => {
    const mediaQueryContextMock: Partial<IMediaQueryContext> = {
      windowHeight: 123,
    };
    useMediaQueryContextMock.mockReturnValue(mediaQueryContextMock);

    const testRenderer = renderer.create(
      <BasicPage translateContent={false} />
    );

    const mainContainer = testRenderer.root.children[0] as ReactTestInstance;

    expect(mainContainer.type).toEqual(ProtectedView);
    expect(mainContainer.props.testID).toEqual('BasicPage');
    expect(mainContainer.props.style).toEqual([
      basicPageStyles.pageViewStyle,
      { height: mediaQueryContextMock.windowHeight },
    ]);
    expect(getChildren(mainContainer.props.children).length).toEqual(5);
  });

  it('has main container TranslatableView with default pageViewStyle if not passed translateContent', () => {
    const mediaQueryContextMock: Partial<IMediaQueryContext> = {
      windowHeight: 123,
    };
    useMediaQueryContextMock.mockReturnValue(mediaQueryContextMock);

    const testRenderer = renderer.create(<BasicPage translateContent={true} />);

    const mainContainer = testRenderer.root.children[0] as ReactTestInstance;

    expect(mainContainer.type).toEqual(TranslatableView);
    expect(mainContainer.props.testID).toEqual('BasicPage');
    expect(mainContainer.props.style).toEqual([
      basicPageStyles.pageViewStyle,
      { height: mediaQueryContextMock.windowHeight },
    ]);
    expect(getChildren(mainContainer.props.children).length).toEqual(5);
  });

  it.each([
    [undefined, basicPageStyles.contentContainerNoGrowViewStyle, false],
    [false, basicPageStyles.contentContainerNoGrowViewStyle, false],
    [true, basicPageStyles.contentContainerAllowGrowViewStyle, false],
    [undefined, basicPageStyles.contentContainerNoGrowViewStyle, true],
    [false, basicPageStyles.contentContainerNoGrowViewStyle, true],
    [true, basicPageStyles.contentContainerAllowGrowViewStyle, true],
  ])(
    'should have ScrollView with default props (allowBodyGrow: %p)',
    (
      allowBodyGrowMock: undefined | boolean,
      expectedContentContainerViewStyle: ViewStyle,
      translateContent: boolean
    ) => {
      const mockBasicPageProps = {} as IBasicPageProps;
      const testRenderer = renderer.create(
        <BasicPage
          {...mockBasicPageProps}
          allowBodyGrow={allowBodyGrowMock}
          translateContent={translateContent}
        />
      );

      const mainContainer = testRenderer.root.children[0] as ReactTestInstance;
      const scrollViewProps =
        mainContainer.props.children.props.children[1].props;

      expect(scrollViewProps.testID).toEqual('scrollView');
      expect(scrollViewProps.scrollEventThrottle).toBe(16);
      expect(scrollViewProps.contentContainerStyle).toEqual(
        expectedContentContainerViewStyle
      );
      expect(scrollViewProps.stickyHeaderIndices).toBeUndefined();
      expect(scrollViewProps.style).toEqual([
        basicPageStyles.scrollViewStyle,
        undefined,
      ]);
    }
  );

  it('should ScrollView renders correctly with props', () => {
    const mockBodyViewStyle = { backgroundColor: '#000000' };
    const mockBasicPageProps = {} as IBasicPageProps;
    const mockPageProps = {
      ...mockBasicPageProps,
      bodyViewStyle: mockBodyViewStyle,
      stickyIndices: [],
    };
    const scrollEnabledMock = false;
    const basicPage = renderer.create(
      <BasicPage {...mockPageProps} scrollEnabled={scrollEnabledMock} />
    );
    const scrollViewProps = basicPage.root.findByType(ScrollView).props;
    expect(scrollViewProps.stickyHeaderIndices).toBe(
      mockPageProps.stickyIndices
    );
    expect(scrollViewProps.style).toEqual([
      basicPageStyles.scrollViewStyle,
      mockBodyViewStyle,
    ]);
    expect(scrollViewProps.scrollEnabled).toEqual(scrollEnabledMock);
  });

  it('should not render ApplicationHeader, when props.hideApplicationHeader=true', () => {
    const mockPageProps: IBasicPageProps = {
      hideApplicationHeader: true,
    };
    const basicPage = renderer.create(<BasicPage {...mockPageProps} />);
    const appHeaders = basicPage.root.findAllByType(ApplicationHeader);
    expect(appHeaders.length).toBe(0);
  });

  it('should have ApplicationHeader with props, when props.hideApplicationHeader=true', () => {
    const mockPageProps: IBasicPageProps = {
      hideApplicationHeader: false,
      hideNavigationMenuButton: true,
      navigateBack: jest.fn(),
      pageTitle: 'mockTitle',
      showProfileAvatar: true,
      isCardStyle: true,
      logoClickAction: LogoClickActionEnum.CONFIRM,
    };
    const basicPage = renderer.create(<BasicPage {...mockPageProps} />);
    const headerProps = basicPage.root.findByType(ApplicationHeader)
      .props as IApplicationHeaderProps;
    expect(headerProps.title).toBe(mockPageProps.pageTitle);
    expect(headerProps.hideNavigationMenuButton).toBeTruthy();
    expect(headerProps.showProfileAvatar).toBeTruthy();
    expect(headerProps.isCardStyle).toBeDefined();
    expect(headerProps.logoClickAction).toBeDefined();
  });

  it('should render header view', () => {
    const mockHeaderView = <Text>mock header</Text>;
    const applicationHeaderHamburgerTestIDMock = 'testIDMock';
    const mockPageProps: IBasicPageProps = {
      header: mockHeaderView,
      hideApplicationHeader: false,
      hideNavigationMenuButton: true,
      pageTitle: 'mockTitle',
      applicationHeaderHamburgerTestID: applicationHeaderHamburgerTestIDMock,
    };
    const testRenderer = renderer.create(<BasicPage {...mockPageProps} />);
    const mainContainer = testRenderer.root.children[0] as ReactTestInstance;
    const scrollView = mainContainer.props.children.props.children[1];
    const applicationHeader = scrollView.props.children[0].props;
    const headerView = scrollView.props.children[2];
    expect(headerView).toBeDefined();
    expect(headerView.type).toEqual(View);
    expect(headerView.props.children).toEqual(mockHeaderView);
    expect(headerView.props.style).toEqual(basicPageStyles.headerViewStyle);
    expect(applicationHeader.testID).toEqual(
      applicationHeaderHamburgerTestIDMock
    );
  });

  it('does not render header view, when no header supplied', () => {
    const mockPageProps: IBasicPageProps = {
      header: undefined,
      headerViewStyle: { backgroundColor: '#ff00ff' },
      hideApplicationHeader: false,
      hideNavigationMenuButton: true,
      pageTitle: 'mockTitle',
    };
    const basicPage = renderer.create(<BasicPage {...mockPageProps} />);
    const headerViews = basicPage.root.findAllByProps({
      style: mockPageProps.headerViewStyle,
    });
    expect(headerViews.length).toEqual(0);
  });

  it('should render body view', () => {
    const mockBodyView = <Text>mock body</Text>;
    const mockPageProps: IBasicPageProps = {
      body: mockBodyView,
      header: mockBodyView,
      headerViewStyle: { backgroundColor: '#ff00ff' },
      hideApplicationHeader: false,
      hideNavigationMenuButton: true,
      pageTitle: 'mockTitle',
    };

    const testRenderer = renderer.create(<BasicPage {...mockPageProps} />);
    const mainContainer = testRenderer.root.children[0] as ReactTestInstance;
    const scrollView = mainContainer.props.children.props.children[1];
    const bodyView = scrollView.props.children[3];

    expect(bodyView).toBeDefined();
    expect(bodyView.type).toEqual(View);
    expect(bodyView.props.children).toEqual(mockBodyView);
    expect(bodyView.props.style).toEqual(basicPageStyles.bodyViewStyle);
  });

  it('renders notification', () => {
    const notificationMock = <BaseText>notification</BaseText>;
    const testRenderer = renderer.create(
      <BasicPage notification={notificationMock} />
    );

    const baseContainer = testRenderer.root.findByProps({
      testID: 'BasicPage',
    });
    const notification = getChildren(baseContainer.props.children)[2];

    expect(notification.type).toEqual(View);
    expect(notification.props.style).toEqual(
      basicPageStyles.notificationViewStyle
    );

    const notificationChildren = getChildren(notification);
    expect(notificationChildren.length).toEqual(1);
    expect(notificationChildren[0]).toEqual(notificationMock);
  });

  it('renders notification with footer styling if footer exists', () => {
    const notificationMock = <BaseText>notification</BaseText>;
    const footerMock = <BaseText>footer</BaseText>;
    const testRenderer = renderer.create(
      <BasicPage notification={notificationMock} footer={footerMock} />
    );

    const baseContainer = testRenderer.root.findByProps({
      testID: 'BasicPage',
    });
    const notification = getChildren(baseContainer.props.children)[2];

    expect(notification.type).toEqual(View);
    expect(notification.props.style).toEqual(
      basicPageStyles.notificationWithFooterViewStyle
    );

    const notificationChildren = getChildren(notification);
    expect(notificationChildren.length).toEqual(1);
    expect(notificationChildren[0]).toEqual(notificationMock);
  });

  it('renders no notification if none passed in prop', () => {
    const testRenderer = renderer.create(<BasicPage />);

    const baseContainer = testRenderer.root.findByProps({
      testID: 'BasicPage',
    });
    const notification = getChildren(baseContainer.props.children)[2];

    expect(notification).toBeNull();
  });

  it('renders footer', () => {
    const footerMock = <BaseText>footer</BaseText>;
    const testRenderer = renderer.create(<BasicPage footer={footerMock} />);

    const baseContainer = testRenderer.root.findByProps({
      testID: 'BasicPage',
    });
    const footer = getChildren(baseContainer.props.children)[3];

    expect(footer.type).toEqual(FooterContentContainer);
    expect(footer.props.viewStyle).toEqual(basicPageStyles.footerViewStyle);

    const footerChildren = getChildren(footer);
    expect(footerChildren.length).toEqual(1);
    expect(footerChildren[0]).toEqual(footerMock);
  });

  it('renders no footer if none passed in props', () => {
    const testRenderer = renderer.create(<BasicPage />);

    const baseContainer = testRenderer.root.findByProps({
      testID: 'BasicPage',
    });
    const footer = getChildren(baseContainer.props.children)[3];

    expect(footer).toBeNull();
  });

  it('should render modal on top of screen if set on props', () => {
    const modalMock = <div />;
    const mockPageProps: IBasicPageProps = {
      modals: modalMock,
    };
    const testRenderer = renderer.create(<BasicPage {...mockPageProps} />);
    const mainContainer = testRenderer.root.children[0] as ReactTestInstance;
    const modal = mainContainer.props.children.props.children[4];

    expect(modal).toEqual(modalMock);
  });

  it('should render stickyView if set on props', () => {
    const viewMock = <div />;
    const stickyViewsMock = { view: viewMock };
    const stickyIndices = [1];
    const mockPageProps: IBasicPageProps = {
      stickyViews: [stickyViewsMock],
      stickyIndices,
    };
    const basicPage = renderer.create(<BasicPage {...mockPageProps} />);
    const scrollView = basicPage.root.findAllByType(ScrollView)[0];

    expect(scrollView.props.stickyHeaderIndices).toEqual(stickyIndices);
  });

  it('should render welcome modal correctly', () => {
    // @ts-ignore
    delete window.location;
    window.location = {
      search: '?rxgroup=test-group&brokerid=test-broker-group',
    } as unknown as Location;
    const testRenderer = renderer.create(<BasicPage />);

    const outerContainer = testRenderer.root.children[0] as ReactTestInstance;
    const welcomeModal = outerContainer.props.children.props.children[0];

    expect(welcomeModal.type).toEqual(WelcomeModal);
    expect(welcomeModal.props.rxGroup).toEqual('test-group');
    expect(welcomeModal.props.brokerId).toEqual('test-broker-group');
  });
});
