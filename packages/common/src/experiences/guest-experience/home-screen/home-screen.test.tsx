// Copyright 2020 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import renderer from 'react-test-renderer';
import { HomeFeedListConnected } from '../../../components/member/lists/home-feed-list/home-feed-list.connected';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { useMediaQueryContext } from '../context-providers/media-query/use-media-query-context.hook';
import { HeadingText } from '../../../components/primitives/heading-text';
import { HomeScreen, IHomeScreenProps } from './home-screen';
import {
  homeScreenStyles,
  homeScreenWelcomeHeaderWebTextStyle,
} from './home-screen.styles';
import { getChildren } from '../../../testing/test.helper';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IPrimaryProfile } from '../../../models/member-profile/member-profile-info';
import { SearchButton } from '../../../components/buttons/search/search.button';
import { MessageContainer } from '../../../components/member/message-container/message-container';
import { View } from 'react-native';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { useSessionContext } from '../context-providers/session/use-session-context.hook';
import { ISessionContext } from '../context-providers/session/session.context';
import { defaultSessionState } from '../state/session/session.state';
import { CobrandingHeader } from '../../../components/member/cobranding-header/cobranding-header';
import { useUrl } from '../../../hooks/use-url';
import { usePbmProfileCobrandingContent } from '../context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;
const useIsFocusedMock = useIsFocused as jest.Mock;

jest.mock('../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock(
  '../../../components/member/lists/home-feed-list/home-feed-list.connected',
  () => ({
    HomeFeedListConnected: () => <div />,
  })
);

jest.mock('../context-providers/media-query/use-media-query-context.hook');
const useMediaQueryContextMock = useMediaQueryContext as jest.Mock;

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../../components/buttons/search/search.button', () => ({
  SearchButton: () => <div />,
}));

jest.mock(
  '../../../components/member/message-container/message-container',
  () => ({
    MessageContainer: () => <div />,
  })
);

jest.mock('../../../components/primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

jest.mock(
  '../../../components/member/cobranding-header/cobranding-header',
  () => ({
    CobrandingHeader: () => <div />,
  })
);

jest.mock('../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../hooks/use-url');
const useUrlMock = useUrl as jest.Mock;

jest.mock(
  '../context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content'
);
const usePbmProfileCobrandingContentMock =
  usePbmProfileCobrandingContent as jest.Mock;

const mockDrugSearchButtonLabel = 'drug-search-button-label';
const bannerTextMock = 'banner-text-mock';
const welcomeCaptionPrefix = 'welcome-caption-mock';
const uiContentMock: Partial<IGlobalContent> = {
  authSearchButton: mockDrugSearchButtonLabel,
  bannerText: bannerTextMock,
  welcomeCaption: welcomeCaptionPrefix + '{firstName}',
};

const rxGroupMock = 'rx-group-mock';
const brokerAssociationMock = 'broker-association';

const primaryProfileMock: IPrimaryProfile = {
  identifier: 'identifier-mock',
  firstName: 'first-name-mock',
  lastName: 'last-name-mock',
  dateOfBirth: 'date-of-birth-mock',
  rxGroupType: 'COVID19',
  rxSubGroup: 'rx-sub-group-mock',
  primaryMemberRxId: 'primary-member-rx-id-mock',
  phoneNumber: 'phone-number-mock',
  rxGroup: rxGroupMock,
  brokerAssociation: brokerAssociationMock,
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStateMock.mockReturnValue([false, jest.fn()]);
    useMediaQueryContextMock.mockReturnValue('small');

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({ params: {} });
    useMediaQueryContextMock.mockReturnValue('small');

    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });

    usePbmProfileCobrandingContentMock.mockReturnValue({ logo: undefined });

    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
      },
      sessionDispatch: jest.fn(),
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
  });

  it.each([[false], [true]])(
    'renders as BasicPageConnected (openModal: %p)',
    (isModalOpenMock: boolean) => {
      useNavigationMock.mockReturnValue(rootStackNavigationMock);

      useStateMock.mockReset();
      useStateMock.mockReturnValue([isModalOpenMock, jest.fn()]);

      const mockHomeScreenProps: IHomeScreenProps = {
        showMessage: false,
        resetURL: jest.fn(),
      };

      const homeScreen = renderer.create(
        <HomeScreen {...mockHomeScreenProps} />
      );
      const basicPageConnected = homeScreen.root.findByType(BasicPageConnected);
      const pageProps = basicPageConnected.props;

      expect(pageProps.hideNavigationMenuButton).toBeFalsy();
      expect(pageProps.showProfileAvatar).toBeTruthy();
      expect(pageProps.translateContent).toBeTruthy();
      expect(pageProps.applicationHeaderHamburgerTestID).toEqual(
        'homeScreenHeaderDrawerHamburgerButton'
      );
    }
  );

  it('renders body view', () => {
    const testRenderer = renderer.create(
      <HomeScreen resetURL={jest.fn()} showMessage={false} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const bodyView = getChildren(bodyContainer)[1];

    expect(bodyView.type).toEqual(View);
    expect(bodyView.props.style).toEqual(
      homeScreenStyles.homeScreenBodyViewStyle
    );
    expect(getChildren(bodyView).length).toEqual(3);
  });

  it("update url with ''", () => {
    renderer.create(<HomeScreen resetURL={jest.fn()} showMessage={false} />);

    expect(useUrlMock).toHaveBeenCalledWith('');
  });

  it.each([[false], [true]])(
    'renders message (showMessage: %p)',
    (showMessageMock: boolean) => {
      const testRenderer = renderer.create(
        <HomeScreen resetURL={jest.fn()} showMessage={showMessageMock} />
      );

      const basicPageConnected =
        testRenderer.root.findByType(BasicPageConnected);

      const message = getChildren(basicPageConnected.props.body)[0];

      if (showMessageMock) {
        expect(message.type).toEqual(MessageContainer);
        expect(message.props.bodyText).toEqual(uiContentMock.bannerText);
      } else {
        expect(message).toBeNull();
      }
    }
  );

  it('renders cobranding header', () => {
    const logoUrlMock = 'logo-url-mock';

    usePbmProfileCobrandingContentMock.mockReturnValue({ logo: logoUrlMock });

    const testRenderer = renderer.create(
      <HomeScreen resetURL={jest.fn()} showMessage={false} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const bodyView = getChildren(bodyContainer)[1];
    const headerView = getChildren(bodyView)[0];
    const cobrandingHeader = getChildren(headerView)[0];

    expect(headerView.props.style).toEqual(
      homeScreenStyles.cobrandingHeaderViewStyle
    );

    expect(cobrandingHeader.type).toEqual(CobrandingHeader);
    expect(cobrandingHeader.props.logoUrl).toEqual(logoUrlMock);
  });

  it.each([[false], [true]])(
    'renders HomeFeedListConnected (isFocused: %p)',
    (isFocusedMock) => {
      useIsFocusedMock.mockReturnValue(isFocusedMock);

      const testRenderer = renderer.create(
        <HomeScreen showMessage={false} resetURL={jest.fn()} />
      );
      const basicPageConnected =
        testRenderer.root.findByType(BasicPageConnected);
      const bodyContainer = basicPageConnected.props.body;
      const bodyView = getChildren(bodyContainer)[1];
      const homeFeedList = getChildren(bodyView)[2];

      expect(homeFeedList.type).toEqual(HomeFeedListConnected);
      expect(homeFeedList.props.isScreenCurrent).toEqual(isFocusedMock);
    }
  );

  it('should navigate to drug search home page when drug search button (search component) pressed', () => {
    const mockHomeScreenProps: IHomeScreenProps = {
      showMessage: false,
      resetURL: jest.fn(),
    };

    const homeScreen = renderer.create(<HomeScreen {...mockHomeScreenProps} />);
    const basicPageConnected = homeScreen.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const bodyView = getChildren(bodyContainer)[1];
    const headerView = getChildren(bodyView)[1];
    const drugSearchButton = getChildren(headerView)[1];
    drugSearchButton.props.onPress();
    expect(headerView.props.style).toEqual(
      homeScreenStyles.homeScreenWelcomeHeaderViewStyle
    );
    expect(rootStackNavigationMock.navigate).toBeCalledWith('DrugSearchStack', {
      screen: 'DrugSearchHome',
    });
  });

  it('should navigate to home page when back button pressed', () => {
    const mockHomeScreenProps: IHomeScreenProps = {
      showMessage: false,
      resetURL: jest.fn(),
    };

    const homeScreen = renderer.create(<HomeScreen {...mockHomeScreenProps} />);
    const basicPageConnected = homeScreen.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const bodyView = getChildren(bodyContainer)[1];
    const headerView = getChildren(bodyView)[1];
    const drugSearchButton = getChildren(headerView)[1];
    drugSearchButton.props.onPress();
    expect(headerView.props.style).toEqual(
      homeScreenStyles.homeScreenWelcomeHeaderViewStyle
    );
    expect(rootStackNavigationMock.navigate).toBeCalledTimes(1);
  });

  it('should pass HeadingText to body props with expect style', () => {
    const mockHomeScreenProps: IHomeScreenProps = {
      showMessage: false,
      resetURL: jest.fn(),
    };
    const testIDMock = 'homeScreenHeadingTextWelcomeCaption';

    useMediaQueryContextMock.mockReturnValue('small');

    const homeScreen = renderer.create(<HomeScreen {...mockHomeScreenProps} />);
    const basicPageConnected = homeScreen.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;
    expect(bodyProp.toString()).toContain(
      <>
        <HeadingText
          level={1}
          style={homeScreenStyles.drugSearchButtonViewStyle}
          testID={testIDMock}
        >
          {uiContentMock.welcomeCaption + primaryProfileMock.firstName}
        </HeadingText>
      </>
    );
  });

  it('should pass h1 to body props with expect style', () => {
    const mockHomeScreenProps: IHomeScreenProps = {
      showMessage: false,
      resetURL: jest.fn(),
    };

    useMediaQueryContextMock.mockReturnValue('large');

    const homeScreen = renderer.create(<HomeScreen {...mockHomeScreenProps} />);
    const basicPageConnected = homeScreen.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;
    expect(bodyProp.toString()).toContain(
      <>
        <h1 style={homeScreenWelcomeHeaderWebTextStyle}>
          {uiContentMock.welcomeCaption + primaryProfileMock.firstName}
        </h1>
      </>
    );
  });

  it('should show drug search component', () => {
    const mockHomeScreenProps: IHomeScreenProps = {
      showMessage: false,
      resetURL: jest.fn(),
    };

    const homeScreen = renderer.create(<HomeScreen {...mockHomeScreenProps} />);
    const basicPageConnected = homeScreen.root.findByType(BasicPageConnected);
    const bodyContainer = basicPageConnected.props.body;
    const bodyView = getChildren(bodyContainer)[1];
    const headerView = getChildren(bodyView)[1];
    const drugSearchButton = getChildren(headerView)[1];
    expect(headerView.props.style).toEqual(
      homeScreenStyles.homeScreenWelcomeHeaderViewStyle
    );
    expect(drugSearchButton.type).toEqual(SearchButton);
    expect(drugSearchButton.props.label).toEqual(mockDrugSearchButtonLabel);
    expect(drugSearchButton.props.viewStyle).toEqual(
      homeScreenStyles.drugSearchButtonViewStyle
    );
  });

  it('updates modalOpen in state when modal content is changed upon navigating to home', () => {
    const modalContentMock = {
      modalType: 'updatePinSuccessModal',
    };
    useRouteMock.mockReturnValue({
      params: {
        modalContent: modalContentMock,
      },
    });
    const setModalOpenMock = jest.fn();
    useStateMock.mockReturnValue([true, setModalOpenMock]);

    const mockHomeScreenProps: IHomeScreenProps = {
      showMessage: false,
      resetURL: jest.fn(),
    };

    renderer.create(<HomeScreen {...mockHomeScreenProps} />);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      modalContentMock,
    ]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expect(setModalOpenMock).toHaveBeenCalledWith(true);
  });
});
