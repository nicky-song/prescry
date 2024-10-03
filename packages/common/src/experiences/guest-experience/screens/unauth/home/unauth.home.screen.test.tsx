// Copyright 2021 Prescryptive Health, Inc.

import { View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { UnauthHomeScreen } from './unauth.home.screen';
import { getChildren } from '../../../../../testing/test.helper';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { GetStartedModal } from './get-started/get-started.modal';
import { IServiceData, Services } from './services/services';
import {
  getUnauthHomeScreenStyles,
  IUnauthHomeScreenStyles,
  unauthHomeScreenStyles,
} from './unauth.home.screen.styles';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { isDesktopDevice } from '../../../../../utils/responsive-screen.helper';
import { HeadingGradient } from '../../../../../components/text/heading/heading.gradient';
import { DrugSearchCard } from '../../../../../components/member/drug-search-card/drug-search-card';
import { Heading } from '../../../../../components/member/heading/heading';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { ImageAsset } from '../../../../../components/image-asset/image-asset';
import { MarketingCard } from '../../../../../components/member/cards/marketing/marketing.card';
import { LinkButton } from '../../../../../components/buttons/link/link.button';
import {
  IUnauthHomeScreenContent,
  unauthHomeScreenContent,
} from './unauth.home.screen.content';
import { setIsGettingStartedModalOpenDispatch } from '../../../state/session/dispatch/set-is-getting-started-modal.dispatch';
import { ISessionContext } from '../../../context-providers/session/session.context';
import {
  defaultSessionState,
  ISessionState,
} from '../../../state/session/session.state';
import { cmsContentWithGlobalMock } from '../../../__mocks__/global-cms-content.mock';
import { IUIContent, IUIContentGroup } from '../../../../../models/ui-content';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { Footer } from './footer/footer';
import { goToUrl } from '../../../../../utils/link.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { Language } from '../../../../../models/language';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

jest.mock('../../../../../utils/link.helper');
const goToUrlMock = goToUrl as jest.Mock;

jest.mock('./footer/footer', () => ({
  Footer: () => <div />,
}));

jest.mock('./services/services', () => ({
  Services: () => <div />,
}));

jest.mock('./get-started/get-started.modal', () => ({
  GetStartedModal: () => <div />,
}));

jest.mock('../../../../../components/image-asset/image-asset', () => ({
  ImageAsset: () => <div />,
}));

jest.mock(
  '../../../../../components/member/cards/marketing/marketing.card',
  () => ({
    MarketingCard: () => <div />,
  })
);

jest.mock('../../../../../components/buttons/link/link.button', () => ({
  LinkButton: () => <div />,
}));

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../../../components/text/heading/heading.gradient', () => ({
  HeadingGradient: () => <div />,
}));

jest.mock('./footer/footer', () => ({
  Footer: () => <div />,
}));

jest.mock('../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../../../../utils/responsive-screen.helper');
const isDesktopDeviceMock = isDesktopDevice as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/unauth/unauth-home-navigate.dispatch'
);

jest.mock(
  '../../../state/session/dispatch/set-is-getting-started-modal.dispatch'
);
const setIsGettingStartedModalOpenDispatchMock =
  setIsGettingStartedModalOpenDispatch as jest.Mock;

jest.mock('./unauth.home.screen.styles');
const getUnauthHomeScreenStylesMock = getUnauthHomeScreenStyles as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock(
  '../../../../../components/member/drug-search-card/drug-search-card',
  () => ({
    DrugSearchCard: () => <div />,
  })
);

const styles = unauthHomeScreenStyles;

const { location: originalLocation, scrollTo: originalScrollTo } = window;

const homeContentMock: IUIContent[] = [
  {
    fieldKey: 'unauth-home-header',
    language: 'English',
    type: 'text',
    value: 'heading-mock',
  },
  {
    fieldKey: 't-&-c',
    language: 'English',
    type: 'text',
    value: 'terms-and-conditions-text-mock',
  },
];
const uiContentGroupMock: IUIContentGroup = {
  content: homeContentMock,
  lastUpdated: 0,
  isContentLoading: false,
};
const uiContentMapMock = new Map([[CmsGroupKey.homePage, uiContentGroupMock]]);

const contentMock: IUnauthHomeScreenContent = {
  clinicalServicesButton: '',
  clinicalServicesDescription: '',
  clinicalServicesHeader: '',
  drugSearchCardSubtitle: '',
  drugSearchCardTitle: '',
  drugSearchCardButtonLabel: '',
  getStarted: '',
  heading: 'heading-mock',
  healthcareTechnologySectionDescription: '',
  healthcareTechnologySectionTitle: '',
  learnMore: 'learn-more-text-mock',
  ownPrescriptionsDescription: '',
  ownPrescriptionsTitle: '',
  prescriptionBenefitsDescription: '',
  prescriptionBenefitsTitle: '',
  privacyPolicy: 'privacy-policy-text-mock',
  secureDescription: '',
  secureTitle: '',
  shopToSaveDescription: '',
  shopToSaveTitle: '',
  smartPriceButton: '',
  smartPriceDescription: '',
  smartPriceHeader: '',
  termsAndConditions: 'terms-and-conditions-text-mock',
  trustedCliniciansDescription: '',
  trustedCliniciansTitle: '',
  clinicalServicesLearnMoreTitle: '',
  clinicalServicesBullet1: '',
  clinicalServicesBullet2: '',
  clinicalServicesBullet3: '',
  clinicalServicesIcon: '',
  smartPriceLearnMoreTitle: '',
  smartPriceBullet1: '',
  smartPriceBullet2: '',
  smartPriceBullet3: '',
  smartPriceIcon: '',
};

const defaultLanguageMock = 'English';

const sessionStateWithContentMock: Partial<ISessionState> = {
  uiCMSContentMap: uiContentMapMock,
  currentLanguage: defaultLanguageMock,
};

describe('UnauthHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    stateReset({});

    getUnauthHomeScreenStylesMock.mockReturnValue(styles);
    const sessionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    window.scrollTo = jest.fn();
    useSessionContextMock.mockReturnValue({
      sessionState: sessionStateWithContentMock,
    });
  });

  afterEach(() => {
    window.location = originalLocation;
    window.scrollTo = originalScrollTo;
  });

  it('initializes state', () => {
    const expectedContentMock: IUnauthHomeScreenContent = {
      clinicalServicesButton: '',
      clinicalServicesDescription: '',
      clinicalServicesHeader: '',
      drugSearchCardSubtitle: '',
      drugSearchCardTitle: '',
      drugSearchCardButtonLabel: '',
      getStarted: '',
      heading: 'heading-mock',
      healthcareTechnologySectionDescription: '',
      healthcareTechnologySectionTitle: '',
      learnMore: '',
      ownPrescriptionsDescription: '',
      ownPrescriptionsTitle: '',
      prescriptionBenefitsDescription: '',
      prescriptionBenefitsTitle: '',
      privacyPolicy: '',
      secureDescription: '',
      secureTitle: '',
      shopToSaveDescription: '',
      shopToSaveTitle: '',
      smartPriceButton: '',
      smartPriceDescription: '',
      smartPriceHeader: '',
      termsAndConditions: 'terms-and-conditions-text-mock',
      trustedCliniciansDescription: '',
      trustedCliniciansTitle: '',
      clinicalServicesLearnMoreTitle: '',
      clinicalServicesBullet1: '',
      clinicalServicesBullet2: '',
      clinicalServicesBullet3: '',
      clinicalServicesIcon: 'virusSyringeIcon',
      smartPriceLearnMoreTitle: '',
      smartPriceBullet1: '',
      smartPriceBullet2: '',
      smartPriceBullet3: '',
      smartPriceIcon: 'smartpriceCardIcon',
    };
    renderer.create(<UnauthHomeScreen />);

    useSessionContextMock.mockReturnValue(sessionStateWithContentMock);

    expect(useStateMock).toHaveBeenCalledTimes(4);
    expect(useStateMock).toHaveBeenNthCalledWith(1, false);
    expect(useStateMock).toHaveBeenNthCalledWith(2, '');
    expect(useStateMock).toHaveBeenNthCalledWith(3, expectedContentMock);
  });

  it.each([[undefined], [false], [true]])(
    'renders as BasicPage (isGettingStartedModalOpen: %p)',
    (isGettingStartedModalOpenMock: boolean | undefined) => {
      const stylesMock: Partial<IUnauthHomeScreenStyles> = {
        bodyViewStyle: { width: 1 },
      };
      getUnauthHomeScreenStylesMock.mockReturnValue(stylesMock);

      useNavigationMock.mockReturnValue(rootStackNavigationMock);

      const sessionStateMock: Partial<ISessionState> = {
        isGettingStartedModalOpen: isGettingStartedModalOpenMock,
      };
      const sessionContextMock: ISessionContext = {
        sessionDispatch: jest.fn(),
        sessionState: sessionStateMock as ISessionState,
      };
      useSessionContextMock.mockReturnValue(sessionContextMock);

      const testRenderer = renderer.create(<UnauthHomeScreen />);

      const basicPage = testRenderer.root.children[0] as ReactTestInstance;

      expect(basicPage.type).toEqual(BasicPageConnected);
      expect(basicPage.props.showProfileAvatar).toEqual(true);
      expect(basicPage.props.bodyViewStyle).toEqual(stylesMock.bodyViewStyle);
      expect(basicPage.props.translateContent).toEqual(true);
      expect(basicPage.props.applicationHeaderHamburgerTestID).toEqual(
        'unauthHomeScreenHeaderDrawerHamburgerButton'
      );
    }
  );

  it('renders in View container', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    expect(container.type).toEqual(View);
    expect(getChildren(container).length).toEqual(3);
    expect(container.props.testID).toEqual('unauthHomeScreenBodyView');
  });

  it.each([false])(
    'passes correct arguments to styles function by device',
    (isDesktop: boolean) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const testRenderer = renderer.create(<UnauthHomeScreen />);
      expect(getUnauthHomeScreenStylesMock).toHaveBeenCalledTimes(1);
      expect(getUnauthHomeScreenStylesMock).toHaveBeenCalledWith(isDesktop);
      const basicPage = testRenderer.root.children[0] as ReactTestInstance;
      expect(basicPage.props.modals).toEqual(null);
    }
  );

  it('renders inner container View', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const innerContainerView = getChildren(container)[0];
    expect(innerContainerView.type).toEqual(View);
    expect(innerContainerView.props.testID).toEqual(
      'unauthHomeScreenContainerView'
    );
    expect(innerContainerView.props.style).toEqual(styles.containerViewStyle);
  });

  it('renders Heading', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const innerContainerView = getChildren(container)[0];
    const headingContainerView = getChildren(innerContainerView)[0];
    expect(headingContainerView.type).toEqual(View);
    expect(headingContainerView.props.testID).toEqual(
      'unauthHomeScreenHeading'
    );
    const heading = getChildren(headingContainerView)[0];
    expect(heading.type).toEqual(HeadingGradient);
    expect(heading.props.children).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock).heading
    );
  });

  it('renders drug search card', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const innerContainerView = getChildren(container)[0];
    const drugSearchCard = getChildren(innerContainerView)[1];
    expect(drugSearchCard.type).toEqual(DrugSearchCard);
    expect(drugSearchCard.props.title).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .drugSearchCardTitle
    );
    expect(drugSearchCard.props.subtitle).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .drugSearchCardSubtitle
    );
    expect(drugSearchCard.props.viewStyle).toEqual(
      styles.drugSearchCardViewStyle
    );
  });

  it('shows get started modal when drug search button is pressed for desktop device', () => {
    isDesktopDeviceMock.mockReturnValue(true);

    const sessionDispatchMock = jest.fn();
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      uiCMSContentMap: cmsContentWithGlobalMock,
    };
    useSessionContextMock.mockReturnValue({
      sessionDispatch: sessionDispatchMock,
      sessionState: sessionStateMock,
    });
    const setGetStartedPathMock = jest.fn();
    stateReset({ getStartedPathCall: ['', setGetStartedPathMock] });

    // @ts-ignore
    delete window.location;
    window.location = {
      pathname: '/some-path',
      search: '?some-query',
    } as Location;

    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const innerContainerView = getChildren(container)[0];
    const drugSearchCard = getChildren(innerContainerView)[1];

    drugSearchCard.props.onSearchPress();

    expect(setGetStartedPathMock).toHaveBeenCalledWith(
      `${window.location.pathname}${window.location.search}`
    );
    expect(setIsGettingStartedModalOpenDispatchMock).toHaveBeenLastCalledWith(
      sessionDispatchMock,
      true
    );
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it('logs event and navigates when drug search button is pressed for mobile device', () => {
    isDesktopDeviceMock.mockReturnValue(false);

    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const innerContainerView = getChildren(container)[0];
    const drugSearchCard = getChildren(innerContainerView)[1];

    drugSearchCard.props.onSearchPress();

    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.USER_HAS_CLICKED_ON_DRUG_SEARCH_UNAUTH,
      {}
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'DrugSearchStack',
      { screen: 'DrugSearchHome' }
    );
  });

  it('renders scroll view', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const innerContainerView = getChildren(container)[0];
    const scrollView = getChildren(innerContainerView)[2];

    expect(scrollView.type).toEqual(ScrollView);
    expect(scrollView.props.style).toEqual(styles.scrollViewStyle);
    expect(scrollView.props.contentContainerStyle).toEqual(
      styles.scrollContainerViewStyle
    );
    expect(getChildren(scrollView).length).toEqual(2);
  });

  it('renders services', () => {
    // @ts-ignore
    delete window.location;
    window.location = {
      pathname: '/some-path',
      search: '?some-query',
    } as Location;

    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const servicesData: IServiceData[] = [
      {
        action: 'default',
        learnMoreTitle: contentMock.clinicalServicesLearnMoreTitle,
        icon: contentMock.clinicalServicesIcon,
        bullets: [
          contentMock.clinicalServicesBullet1,
          contentMock.clinicalServicesBullet2,
          contentMock.clinicalServicesBullet3,
        ],
        name: '',
        text: '',
        buttonLabel: '',
        buttonTestId: 'unauthHomeCardClinicalServicesBookNowButton',
      },
      {
        action: 'drugsearch',
        learnMoreTitle: contentMock.smartPriceLearnMoreTitle,
        icon: contentMock.smartPriceIcon,
        bullets: [
          contentMock.smartPriceBullet1,
          contentMock.smartPriceBullet2,
          contentMock.smartPriceBullet3,
        ],
        name: '',
        text: '',
        buttonLabel: '',
        buttonTestId: 'unauthHomeCardSmartPriceServicesGetStartedButton',
      },
    ];

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const innerContainerView = getChildren(container)[0];
    const scrollView = getChildren(innerContainerView)[2];
    const services = getChildren(scrollView)[0];

    expect(services.type).toEqual(Services);
    expect(services.props.data).toEqual(servicesData);

    const onGetStartedShow = services.props.onGetStartedShow;
    const onSmartPriceButtonPress = services.props.onSmartPriceButtonPress;

    expect(onGetStartedShow).toEqual(expect.any(Function));
    expect(onSmartPriceButtonPress).toEqual(expect.any(Function));
  });

  it('renders prescription benefits view', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const innerContainerView = getChildren(container)[0];
    const scrollView = getChildren(innerContainerView)[2];
    const prescriptionBenefitsView = getChildren(scrollView)[1];
    expect(prescriptionBenefitsView.type).toEqual(View);
    expect(prescriptionBenefitsView.props.style).toEqual(
      styles.prescriptionBenefitsViewStyle
    );
    expect(prescriptionBenefitsView.props.testID).toEqual(
      'unauthHomeScreenPrescriptionBenefitsView'
    );
    expect(getChildren(prescriptionBenefitsView).length).toEqual(3);
  });

  it('renders prescription benefits title', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const innerContainerView = getChildren(container)[0];
    const scrollView = getChildren(innerContainerView)[2];
    const prescriptionBenefitsView = getChildren(scrollView)[1];
    const prescriptionBenefitsTitle = getChildren(prescriptionBenefitsView)[0];
    expect(prescriptionBenefitsTitle.type).toEqual(Heading);
    expect(prescriptionBenefitsTitle.props.level).toEqual(2);
    expect(prescriptionBenefitsTitle.props.textStyle).toEqual(
      styles.sectionTitleTextStyle
    );
    expect(prescriptionBenefitsTitle.props.children).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .prescriptionBenefitsTitle
    );
  });

  it('renders prescription benefits description', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const innerContainerView = getChildren(container)[0];
    const scrollView = getChildren(innerContainerView)[2];
    const prescriptionBenefitsView = getChildren(scrollView)[1];
    const prescriptionBenefitsDescription = getChildren(
      prescriptionBenefitsView
    )[1];
    expect(prescriptionBenefitsDescription.type).toEqual(BaseText);
    expect(prescriptionBenefitsDescription.props.style).toEqual(
      styles.sectionContentTextStyle
    );
    expect(prescriptionBenefitsDescription.props.children).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .prescriptionBenefitsDescription
    );
  });

  it('renders prescription benefits button', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const innerContainerView = getChildren(container)[0];
    const scrollView = getChildren(innerContainerView)[2];
    const prescriptionBenefitsView = getChildren(scrollView)[1];
    const prescriptionBenefitsButton = getChildren(prescriptionBenefitsView)[2];
    expect(prescriptionBenefitsButton.type).toEqual(BaseButton);
    expect(prescriptionBenefitsButton.props.viewStyle).toEqual(
      styles.prescriptionBenefitsButtonViewStyle
    );
    expect(prescriptionBenefitsButton.props.children).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock).getStarted
    );
  });

  it.each([
    ['/', '', '/activate'],
    ['/', '?abc=123', '/activate?abc=123'],
    ['/invite', '?abc=123', '/invite?abc=123'],
  ])(
    'shows get started modal on prescription benefits button press on desktop (pathname: %p, queryString: %p)',
    (pathnameMock: string, queryStringMock: string, expectedPath: string) => {
      isDesktopDeviceMock.mockReturnValue(true);

      const sessionDispatchMock = jest.fn();
      const sessionStateMock: ISessionState = {
        ...defaultSessionState,
        uiCMSContentMap: cmsContentWithGlobalMock,
      };
      useSessionContextMock.mockReturnValue({
        sessionDispatch: sessionDispatchMock,
        sessionState: sessionStateMock,
      });

      // @ts-ignore
      delete window.location;
      window.location = {
        pathname: pathnameMock,
        search: queryStringMock,
      } as Location;

      const setGetStartedPathMock = jest.fn();
      stateReset({ getStartedPathCall: ['', setGetStartedPathMock] });

      const testRenderer = renderer.create(<UnauthHomeScreen />);
      const basicPageConnected =
        testRenderer.root.findByType(BasicPageConnected);

      const bodyRenderer = renderer.create(basicPageConnected.props.body);
      const prescriptionBenefitsView = bodyRenderer.root.findByProps({
        testID: 'unauthHomeScreenPrescriptionBenefitsView',
      });
      const prescriptionBenefitsButton = getChildren(
        prescriptionBenefitsView
      )[2];

      prescriptionBenefitsButton.props.onPress();

      expect(setGetStartedPathMock).toHaveBeenCalledWith(expectedPath);
      expect(setIsGettingStartedModalOpenDispatchMock).toHaveBeenLastCalledWith(
        sessionDispatchMock,
        true
      );
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
    }
  );

  it('dispatches navigate to PBM Member Benefits screen on prescription benefits button press on mobile', () => {
    isDesktopDeviceMock.mockReturnValue(false);

    const testRenderer = renderer.create(<UnauthHomeScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);

    const bodyRenderer = renderer.create(basicPageConnected.props.body);
    const prescriptionBenefitsView = bodyRenderer.root.findByProps({
      testID: 'unauthHomeScreenPrescriptionBenefitsView',
    });
    const prescriptionBenefitsButton = getChildren(prescriptionBenefitsView)[2];

    prescriptionBenefitsButton.props.onPress();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PbmMemberBenefits',
      {
        showBackButton: true,
      }
    );
  });

  it('renders lower section view', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    expect(lowerSectionView.type).toEqual(View);
    expect(lowerSectionView.props.testID).toEqual(
      'unauthHomeScreenLowerSectionView'
    );
    expect(lowerSectionView.props.style).toEqual(
      styles.unauthLowerSectionViewStyle
    );
    expect(getChildren(lowerSectionView).length).toEqual(2);
  });

  it.each([
    [true, 'sectionBackground'],
    [false, 'sectionBackgroundImage'],
  ])(
    'renders background icon (isDesktop: %p, imageAssetName: %p)',
    (isDesktop: boolean, imageAssetName: string) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const testRenderer = renderer.create(<UnauthHomeScreen />);

      const basicPageConnected =
        testRenderer.root.findByType(BasicPageConnected);
      const container = basicPageConnected.props.body;
      const lowerSectionView = getChildren(container)[1];
      const backgroundIcon = getChildren(lowerSectionView)[0];
      expect(backgroundIcon.type).toEqual(ImageAsset);
      expect(backgroundIcon.props.name).toEqual(imageAssetName);
      expect(backgroundIcon.props.style).toEqual(
        styles.backgroundIconImageStyle
      );
    }
  );

  it('renders lower container view', () => {
    isDesktopDeviceMock.mockReturnValue(true);
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    expect(lowerContainerView.type).toEqual(View);
    expect(lowerContainerView.props.testID).toEqual(
      'unauthHomeScreenLowerContainerView'
    );
    expect(lowerContainerView.props.style).toEqual(styles.containerViewStyle);
    expect(getChildren(lowerContainerView).length).toEqual(3);
  });

  it('renders healthcare technology view', () => {
    isDesktopDeviceMock.mockReturnValue(true);
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    const healthcareTechnologyView = getChildren(lowerContainerView)[0];
    expect(healthcareTechnologyView.type).toEqual(View);
    expect(healthcareTechnologyView.props.testID).toEqual(
      'unauthHomeScreenHealthcareTechnologyView'
    );
    expect(healthcareTechnologyView.props.style).toEqual(
      styles.healthcareTechnologyViewStyle
    );
    expect(getChildren(healthcareTechnologyView).length).toEqual(2);
  });

  it('renders healthcare technology title', () => {
    isDesktopDeviceMock.mockReturnValue(true);
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    const healthcareTechnologyView = getChildren(lowerContainerView)[0];
    const healthcareTechnologyTitle = getChildren(healthcareTechnologyView)[0];
    expect(healthcareTechnologyTitle.type).toEqual(Heading);
    expect(healthcareTechnologyTitle.props.level).toEqual(2);
    expect(healthcareTechnologyTitle.props.textStyle).toEqual(
      styles.sectionTitleTextStyle
    );
    expect(healthcareTechnologyTitle.props.children).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .healthcareTechnologySectionTitle
    );
  });

  it('renders healthcare technology description', () => {
    isDesktopDeviceMock.mockReturnValue(true);
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    const healthcareTechnologyView = getChildren(lowerContainerView)[0];
    const healthcareTechnologyDescription = getChildren(
      healthcareTechnologyView
    )[1];
    expect(healthcareTechnologyDescription.type).toEqual(BaseText);
    expect(healthcareTechnologyDescription.props.style).toEqual(
      styles.sectionContentTextStyle
    );
    expect(healthcareTechnologyDescription.props.children).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .healthcareTechnologySectionDescription
    );
  });

  it('renders marketing card section view', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    const marketingCardSectionView = getChildren(lowerContainerView)[1];
    expect(marketingCardSectionView.type).toEqual(View);
    expect(marketingCardSectionView.props.testID).toEqual(
      'unauthHomeScreenMarketingCardSectionView'
    );
    expect(marketingCardSectionView.props.style).toEqual(
      styles.marketingCardSectionViewStyle
    );
    expect(getChildren(marketingCardSectionView).length).toEqual(2);
  });

  it('renders first marketing card row view', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    const marketingCardSectionView = getChildren(lowerContainerView)[1];
    const firstMarketingCardRowView = getChildren(marketingCardSectionView)[0];
    expect(firstMarketingCardRowView.type).toEqual(View);
    expect(firstMarketingCardRowView.props.testID).toEqual(
      'unauthHomeScreenFirstMarketingCardRowView'
    );
    expect(firstMarketingCardRowView.props.style).toEqual(
      styles.firstMarketingCardRowViewStyle
    );
    expect(getChildren(firstMarketingCardRowView).length).toEqual(2);
  });

  it('renders first marketing card in first row', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    const marketingCardSectionView = getChildren(lowerContainerView)[1];
    const firstMarketingCardRowView = getChildren(marketingCardSectionView)[0];
    const firstMarketingCard = getChildren(firstMarketingCardRowView)[0];
    expect(firstMarketingCard.type).toEqual(MarketingCard);
    expect(firstMarketingCard.props.imageName).toEqual('pillHandIcon');
    expect(firstMarketingCard.props.title).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .ownPrescriptionsTitle
    );
    expect(firstMarketingCard.props.description).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .ownPrescriptionsDescription
    );
    expect(firstMarketingCard.props.headingLevel).toEqual(3);
    expect(firstMarketingCard.props.viewStyle).toEqual(
      styles.firstMarketingCardViewStyle
    );
  });

  it('renders last marketing card in first row', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    const marketingCardSectionView = getChildren(lowerContainerView)[1];
    const firstMarketingCardRowView = getChildren(marketingCardSectionView)[0];
    const lastMarketingCard = getChildren(firstMarketingCardRowView)[1];
    expect(lastMarketingCard.type).toEqual(MarketingCard);
    expect(lastMarketingCard.props.imageName).toEqual('pillCartIcon');
    expect(lastMarketingCard.props.title).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .shopToSaveTitle
    );
    expect(lastMarketingCard.props.description).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .shopToSaveDescription
    );
    expect(lastMarketingCard.props.headingLevel).toEqual(3);
    expect(lastMarketingCard.props.viewStyle).toEqual(
      styles.lastMarketingCardViewStyle
    );
  });

  it('renders last marketing card row view', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    const marketingCardSectionView = getChildren(lowerContainerView)[1];
    const lastMarketingCardRowView = getChildren(marketingCardSectionView)[1];
    expect(lastMarketingCardRowView.type).toEqual(View);
    expect(lastMarketingCardRowView.props.testID).toEqual(
      'unauthHomeScreenLastMarketingCardRowView'
    );
    expect(lastMarketingCardRowView.props.style).toEqual(
      styles.lastMarketingCardRowViewStyle
    );
    expect(getChildren(lastMarketingCardRowView).length).toEqual(2);
  });

  it('renders first marketing card in last row', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    const marketingCardSectionView = getChildren(lowerContainerView)[1];
    const lastMarketingCardRowView = getChildren(marketingCardSectionView)[1];
    const firstMarketingCard = getChildren(lastMarketingCardRowView)[0];
    expect(firstMarketingCard.type).toEqual(MarketingCard);
    expect(firstMarketingCard.props.imageName).toEqual('stethoscopeIcon');
    expect(firstMarketingCard.props.title).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .trustedCliniciansTitle
    );
    expect(firstMarketingCard.props.description).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .trustedCliniciansDescription
    );
    expect(firstMarketingCard.props.headingLevel).toEqual(3);
    expect(firstMarketingCard.props.viewStyle).toEqual(
      styles.firstMarketingCardViewStyle
    );
  });

  it('renders last marketing card in last row', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    const marketingCardSectionView = getChildren(lowerContainerView)[1];
    const lastMarketingCardRowView = getChildren(marketingCardSectionView)[1];
    const lastMarketingCard = getChildren(lastMarketingCardRowView)[1];
    expect(lastMarketingCard.type).toEqual(MarketingCard);
    expect(lastMarketingCard.props.imageName).toEqual('lockIcon');
    expect(lastMarketingCard.props.title).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock).secureTitle
    );
    expect(lastMarketingCard.props.description).toEqual(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
        .secureDescription
    );
    expect(lastMarketingCard.props.headingLevel).toEqual(3);
    expect(lastMarketingCard.props.viewStyle).toEqual(
      styles.lastMarketingCardViewStyle
    );
  });

  it('renders learn more about us link', async () => {
    const learnMoreTextMock: IUIContent = {
      fieldKey: 'learn-more-text',
      language: 'English',
      type: 'text',
      value: 'learn-more-text-mock',
    };
    const sessionDispatchMock = jest.fn();
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      uiCMSContentMap: cmsContentWithGlobalMock,
    };
    useSessionContextMock.mockReturnValue({
      sessionDispatch: sessionDispatchMock,
      sessionState: sessionStateMock,
    });
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const lowerSectionView = getChildren(container)[1];
    const lowerContainerView = getChildren(lowerSectionView)[1];
    const linkButton = getChildren(lowerContainerView)[2];

    expect(linkButton.type).toEqual(LinkButton);
    expect(linkButton.props.linkText).toEqual(learnMoreTextMock.value);
    expect(linkButton.props.onPress).toEqual(expect.any(Function));

    await linkButton.props.onPress();

    expect(goToUrlMock).toHaveBeenCalledWith('https://prescryptive.com');
  });

  it('renders footer view', () => {
    const testRenderer = renderer.create(<UnauthHomeScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const container = basicPageConnected.props.body;
    const footerView = getChildren(container)[2];
    expect(footerView.type).toEqual(Footer);
  });

  it.each([[false], [false], [true]])(
    'renders "Get started" modal (isTextSent=%p)',
    (isTextSentMock: boolean) => {
      const pathMock = 'path';
      const setIsTextSentMock = jest.fn();

      stateReset({
        isTextSentCall: [isTextSentMock, setIsTextSentMock],
        getStartedPathCall: [pathMock, jest.fn()],
      });

      const testRenderer = renderer.create(<UnauthHomeScreen />);

      const basicPageConnected =
        testRenderer.root.findByType(BasicPageConnected);
      const modal = basicPageConnected.props.modals;

      expect(modal.type).toEqual(GetStartedModal);
      expect(modal.props.onHide).toEqual(expect.any(Function));
      expect(modal.props.textSent).toEqual(isTextSentMock);
      expect(modal.props.onTextSent).toEqual(setIsTextSentMock);
      expect(modal.props.path).toEqual(pathMock);
    }
  );

  it('handles "Get started" on hide', () => {
    const sessionDispatchMock = jest.fn();
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      uiCMSContentMap: cmsContentWithGlobalMock,
    };
    useSessionContextMock.mockReturnValue({
      sessionDispatch: sessionDispatchMock,
      sessionState: sessionStateMock,
    });

    const testRenderer = renderer.create(<UnauthHomeScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const modal = basicPageConnected.props.modals;
    const onHide = modal.props.onHide;
    onHide();

    expect(setIsGettingStartedModalOpenDispatchMock).toHaveBeenLastCalledWith(
      sessionDispatchMock,
      false
    );
  });

  it('useEffects is called with the correct parameters', () => {
    renderer.create(<UnauthHomeScreen />);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), []);
  });
});

interface IStateCalls {
  isTextSentCall: [boolean, jest.Mock];
  getStartedPathCall: [string, jest.Mock];
  content: [IUnauthHomeScreenContent, jest.Mock];
  contentIsLoaded: [boolean, jest.Mock];
  uiContentMap: [Map<string, IUIContentGroup>, jest.Mock];
  isFocused: [boolean, jest.Mock];
  currentLanguage: [Language, jest.Mock];
}

function stateReset({
  isTextSentCall = [false, jest.fn()],
  getStartedPathCall = ['', jest.fn()],
  content = [contentMock, jest.fn()],
  contentIsLoaded = [false, jest.fn()],
  uiContentMap = [new Map(), jest.fn()],
  isFocused = [true, jest.fn()],
  currentLanguage = ['English', jest.fn()],
}: Partial<IStateCalls>) {
  useEffectMock.mockReset();
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce(isTextSentCall);
  useStateMock.mockReturnValueOnce(getStartedPathCall);
  useStateMock.mockReturnValueOnce(content);
  useStateMock.mockReturnValueOnce(contentIsLoaded);
  useStateMock.mockReturnValueOnce(uiContentMap);
  useStateMock.mockReturnValueOnce(isFocused);
  useStateMock.mockReturnValueOnce(currentLanguage);
}
