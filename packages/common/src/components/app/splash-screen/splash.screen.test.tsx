// Copyright 2018 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, StatusBar } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { IConfigContext } from '../../../experiences/guest-experience/context-providers/config/config.context';
import { useConfigContext } from '../../../experiences/guest-experience/context-providers/config/use-config-context.hook';
import { IMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/membership.context';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { IReduxContext } from '../../../experiences/guest-experience/context-providers/redux/redux.context';
import { useReduxContext } from '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { ISessionContext } from '../../../experiences/guest-experience/context-providers/session/session.context';
import { useSessionContext } from '../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { GuestExperienceConfig } from '../../../experiences/guest-experience/guest-experience-config';
import { rootStackNavigationMock } from '../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import {
  getCMSContentAsyncAction,
  IGetCMSContentAsyncActionArgs,
} from '../../../experiences/guest-experience/state/cms-content/async-actions/get-cms-content.async-action';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import {
  defaultMembershipState,
  IMembershipState,
} from '../../../experiences/guest-experience/state/membership/membership.state';
import { getCurrentDeviceLanguageDispatch } from '../../../experiences/guest-experience/state/session/dispatch/get-current-device-language.dispatch';
import { setIsUnauthExperienceDispatch } from '../../../experiences/guest-experience/state/session/dispatch/set-is-unauth-experience.dispatch';
import { defaultSessionState } from '../../../experiences/guest-experience/state/session/session.state';
import { protectTalkativeEngageElement } from '../../../hooks/use-talkative-widget/helpers/protect-talkative-engage-element';
import { defaultLanguage } from '../../../models/language';
import { IUIContentGroup } from '../../../models/ui-content';
import { ITestContainer } from '../../../testing/test.container';
import { getChildren } from '../../../testing/test.helper';
import { GrayScaleColor } from '../../../theming/colors';
import { getResolvedImageSource } from '../../../utils/assets.helper';
import { loadDefaultLanguageContentIfSpecifiedAbsent } from '../../../utils/cms-content.helper';
import { isDesktopDevice } from '../../../utils/responsive-screen.helper';
import { transPerfectInject } from '../../../utils/translation/transperfect-script.helper';
import { SplashScreen } from './splash.screen';
import { splashScreenStyle } from './splash.screen.style';
import { LDFlagSet } from 'launchdarkly-js-sdk-common';
import { useFlags } from 'launchdarkly-react-client-sdk';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

jest.mock('react-native', () => ({
  Platform: { select: jest.fn() },
  Dimensions: { get: jest.fn().mockReturnValue({}) },
  StatusBar: { setHidden: jest.fn() },
  ImageBackground: ({ children }: ITestContainer) => <div>{children}</div>,
  ActivityIndicator: () => <div />,
}));
const setHiddenMock = StatusBar.setHidden as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/use-session-context.hook'
);
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/state/session/dispatch/set-is-unauth-experience.dispatch'
);
const setIsUnauthExperienceDispatchMock =
  setIsUnauthExperienceDispatch as jest.Mock;

jest.mock('../../../utils/responsive-screen.helper');
const isDesktopDeviceMock = isDesktopDevice as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../utils/assets.helper');
const getResolvedImageSourceMock = getResolvedImageSource as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/state/cms-content/async-actions/get-cms-content.async-action'
);
const getCMSContentAsyncActionMock = getCMSContentAsyncAction as jest.Mock;

jest.mock('../../../utils/cms-content.helper');
const loadDefaultLanguageContentIfSpecifiedAbsentMock =
  loadDefaultLanguageContentIfSpecifiedAbsent as jest.Mock;

const localStorageGetItemMock = localStorage.getItem as jest.Mock;
jest.mock(
  '../../../experiences/guest-experience/state/session/dispatch/get-current-device-language.dispatch'
);
const getCurrentDeviceLanguageDispatchMock =
  getCurrentDeviceLanguageDispatch as jest.Mock;

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/config/use-config-context.hook'
);
const useConfigContextMock = useConfigContext as jest.Mock;

jest.mock('../../../utils/translation/transperfect-script.helper');
const transPerfectInjectMock = transPerfectInject as jest.Mock;

jest.mock('react-native-markdown-display', () => ({
  Markdown: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook'
);
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock(
  '../../../hooks/use-talkative-widget/helpers/protect-talkative-engage-element'
);
const protectTalkativeEngageElementMock =
  protectTalkativeEngageElement as jest.Mock;

const originalWindow = window;

const defaultSessionDispatchMock = jest.fn();

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();

const membershipDispatchMock = jest.fn();

interface IStateCalls {
  uiContentMap: [Map<string, IUIContentGroup>, jest.Mock];
  contentIsLoaded: [boolean, jest.Mock];
}

function stateReset({
  uiContentMap = [cmsContentMapMock, jest.fn()],
  contentIsLoaded = [true, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(uiContentMap);
  useStateMock.mockReturnValueOnce(contentIsLoaded);
}

const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
  [
    CmsGroupKey.homePage,
    {
      content: [
        {
          fieldKey: 'unauth-home-header',
          language: 'English',
          type: 'text',
          value: 'unauth-home-header-mock',
        },
      ],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
]);

const configContextMock: IConfigContext = {
  configState: GuestExperienceConfig,
};

const ldFlagsMock: LDFlagSet = {
  usetrans: true,
};

const membershipContextMock: IMembershipContext = {
  membershipDispatch: membershipDispatchMock,
  membershipState: defaultMembershipState,
};

describe('SplashScreen', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    stateReset({});

    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const sessionContextMock: ISessionContext = {
      sessionDispatch: defaultSessionDispatchMock,
      sessionState: {
        ...defaultSessionState,
        currentLanguage: defaultLanguage,
        uiCMSContentMap: cmsContentMapMock,
      },
    };
    useReduxContextMock.mockReturnValue({
      dispatch: jest.fn(),
      getState: jest.fn().mockReturnValue({
        config: {
          cmsRefreshInterval: GuestExperienceConfig.cmsRefreshInterval,
        },
      }),
    });
    useSessionContextMock.mockReturnValue(sessionContextMock);
    useFlagsMock.mockReturnValue(ldFlagsMock);

    useConfigContextMock.mockReturnValue(configContextMock);
    useMembershipContextMock.mockReturnValue(membershipContextMock);

    window.addEventListener = jest.fn();
  });

  afterAll(() => {
    window = originalWindow;
    jest.useRealTimers();
  });

  it.each([
    [true, null, '', true, undefined],
    [false, null, '', true, undefined],
    [true, JSON.stringify({ deviceToken: '' }), '', true, undefined],
    [false, JSON.stringify({ deviceToken: '' }), '', true, undefined],
    [true, JSON.stringify({ deviceToken: 'token' }), '', true, undefined],
    [false, JSON.stringify({ deviceToken: 'token' }), '', false, undefined],
    [true, null, 'somepath', true, defaultMembershipState],
    [
      false,
      null,
      'somepath',
      false,
      {
        ...defaultMembershipState,
        account: { ...defaultMembershipState.account, languageCode: 'es' },
      } as IMembershipState,
    ],
  ])(
    'calls onMounted and sets auth state on mount (isDesktopDevice: %p; appSettings: %p; pathname: %p, membershipState: %p)',
    (
      isDesktopDeviceResponse: boolean,
      appSettingsJsonMock: string | null,
      pathnameMock: string,
      isUnauthExperienceExpected: boolean,
      membershipState: IMembershipState | undefined
    ) => {
      useNavigationMock.mockReturnValue(rootStackNavigationMock);

      const sessionDispatchMock = jest.fn();
      const sessionContextMock: Partial<ISessionContext> = {
        sessionDispatch: sessionDispatchMock,
        sessionState: {
          ...defaultSessionState,
          currentLanguage: defaultLanguage,
        },
      };
      useSessionContextMock.mockReturnValue(sessionContextMock);

      isDesktopDeviceMock.mockReturnValue(isDesktopDeviceResponse);
      localStorageGetItemMock.mockReturnValue(appSettingsJsonMock);

      // @ts-ignore
      delete window.location;
      window.location = { pathname: pathnameMock } as Location;

      const onMountedMock = jest.fn();
      renderer.create(<SplashScreen onMounted={onMountedMock} />);

      expect(useEffectMock).toHaveBeenCalledTimes(2);
      expect(useEffectMock).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
        []
      );

      const effectHandler = useEffectMock.mock.calls[0][0];
      effectHandler();

      const effectHandler2 = useEffectMock.mock.calls[1][0];
      effectHandler2();

      expect(setIsUnauthExperienceDispatchMock).toHaveBeenCalledWith(
        sessionDispatchMock,
        isUnauthExperienceExpected
      );

      getCurrentDeviceLanguageDispatchMock(
        defaultSessionDispatchMock,
        membershipState
      );

      expect(onMountedMock).toHaveBeenCalledWith(
        rootStackNavigationMock,
        isUnauthExperienceExpected
      );

      expect(protectTalkativeEngageElementMock).toHaveBeenCalledTimes(1);
    }
  );

  it('should lazy load order confirmation content', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    const expectedCmsContentMapMock: Map<string, IUIContentGroup> = new Map([
      [
        CmsGroupKey.homePage,
        {
          content: [
            {
              fieldKey: 'unauth-home-header',
              language: 'English',
              type: 'text',
              value: 'unauth-home-header-mock',
            },
          ],
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    stateReset({
      uiContentMap: [cmsContentMapMock, jest.fn()],
    });

    getCMSContentAsyncActionMock.mockResolvedValue(expectedCmsContentMapMock);
    loadDefaultLanguageContentIfSpecifiedAbsentMock.mockResolvedValue(
      expectedCmsContentMapMock
    );
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    isDesktopDeviceMock.mockReturnValue(false);
    localStorageGetItemMock.mockReturnValue(
      JSON.stringify({ deviceToken: '' })
    );

    // @ts-ignore
    delete window.location;
    window.location = { pathname: 'somepath' } as Location;

    const onMountedMock = jest.fn();

    renderer.create(<SplashScreen onMounted={onMountedMock} />);

    getCurrentDeviceLanguageDispatchMock(defaultSessionDispatchMock);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), []);

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    const expectedArgs: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: defaultSessionDispatchMock,
      groupKey: CmsGroupKey.homePage,
      language: defaultLanguage,
      uiCMSContentMap: cmsContentMapMock,
      version: 2,
    };

    expect(getCMSContentAsyncActionMock).toHaveBeenCalledWith(expectedArgs);
  });

  it('hides status bar', () => {
    renderer.create(<SplashScreen onMounted={jest.fn()} />);

    expect(setHiddenMock).toHaveBeenCalledWith(true);
  });

  it('renders background', () => {
    const imageSourceMock = 1;
    getResolvedImageSourceMock.mockReturnValue(imageSourceMock);

    const testRenderer = renderer.create(
      <SplashScreen onMounted={jest.fn()} />
    );

    const background = testRenderer.root.children[0] as ReactTestInstance;

    expect(background.type).toEqual(ImageBackground);
    expect(background.props.resizeMode).toEqual('cover');
    expect(background.props.style).toEqual(
      splashScreenStyle.backgroundImageViewStyle
    );
    expect(background.props.source).toEqual(imageSourceMock);
    expect(getChildren(background).length).toEqual(1);

    expect(getResolvedImageSourceMock).toHaveBeenCalledTimes(1);
    expect(getResolvedImageSourceMock).toHaveBeenNthCalledWith(
      1,
      'splashScreen'
    );
  });

  it('renders spinner', () => {
    const testRenderer = renderer.create(
      <SplashScreen onMounted={jest.fn()} />
    );
    const background = testRenderer.root.findByType(ImageBackground);
    const spinner = getChildren(background)[0];

    expect(spinner.type).toEqual(ActivityIndicator);
    expect(spinner.props.color).toEqual(GrayScaleColor.white);
    expect(spinner.props.style).toEqual(splashScreenStyle.spinnerViewStyle);
    expect(spinner.props.size).toEqual('large');
  });

  it('calls transPerfectInject', () => {
    renderer.create(<SplashScreen onMounted={jest.fn()} />);

    expect(transPerfectInjectMock).toHaveBeenCalledWith(
      ldFlagsMock,
      configContextMock.configState
    );
  });
});
