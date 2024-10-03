// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement, useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, StatusBar } from 'react-native';
import { splashScreenStyle } from './splash.screen.style';
import { useSessionContext } from '../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { setIsUnauthExperienceDispatch } from '../../../experiences/guest-experience/state/session/dispatch/set-is-unauth-experience.dispatch';
import { isDesktopDevice } from '../../../utils/responsive-screen.helper';
import {
  RootStackNavigationProp,
  SplashNavigationProp,
} from '../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation } from '@react-navigation/native';
import { GrayScaleColor } from '../../../theming/colors';
import {
  getCMSContentAsyncAction,
  IGetCMSContentAsyncActionArgs,
} from '../../../experiences/guest-experience/state/cms-content/async-actions/get-cms-content.async-action';
import { useReduxContext } from '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { getResolvedImageSource } from '../../../utils/assets.helper';
import { getCurrentDeviceLanguageDispatch } from '../../../experiences/guest-experience/state/session/dispatch/get-current-device-language.dispatch';
import { IUIContentGroup } from '../../../models/ui-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../models/language';
import { transPerfectInject } from '../../../utils/translation/transperfect-script.helper';
import { useConfigContext } from '../../../experiences/guest-experience/context-providers/config/use-config-context.hook';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { protectTalkativeEngageElement } from '../../../hooks/use-talkative-widget/helpers/protect-talkative-engage-element';
import { useFlags } from 'launchdarkly-react-client-sdk';

export interface ISplashScreenProps {
  onMounted: (
    navigation: RootStackNavigationProp,
    isUnauthExperience?: boolean
  ) => void;
}

export const SplashScreen = ({
  onMounted,
}: ISplashScreenProps): ReactElement => {
  const navigation = useNavigation<SplashNavigationProp>();
  const { sessionDispatch, sessionState } = useSessionContext();
  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const [uiContentMap, setUIContentMap] = useState(new Map());
  const cloneUIContentMap = (k: string, v: IUIContentGroup) => {
    setUIContentMap(new Map(uiContentMap.set(k, v)));
  };
  const ldFlags = useFlags();
  const { configState } = useConfigContext();
  const { membershipState } = useMembershipContext();

  // TODO: Put these checks into utilities
  const hasAppSettings = localStorage.getItem('appSettings');
  const hasDeviceToken = hasAppSettings
    ? JSON.parse(hasAppSettings)?.deviceToken
    : undefined;
  const isDeepLinkScenario = (location: Location): boolean => {
    const resource = (location?.pathname || '').replace(/\//g, '').trim();
    return !!resource;
  };

  const [contentIsLoaded, setContentIsLoaded] = useState(false);

  const isUnauthExperience =
    isDesktopDevice() ||
    (!hasDeviceToken && !isDeepLinkScenario(window.location));

  transPerfectInject(ldFlags, configState);

  const getAllCMSContent = async () => {
    if (sessionState.uiCMSContentMap?.size > 0) {
      for (const [key, value] of sessionState.uiCMSContentMap.entries()) {
        cloneUIContentMap(key, value);
      }
    }

    const args: IGetCMSContentAsyncActionArgs = {
      reduxDispatch,
      reduxGetState,
      sessionDispatch,
    };

    const newUIContentMap = await getCMSContentAsyncAction(args);

    for (const [key, value] of newUIContentMap.entries()) {
      cloneUIContentMap(key, value);
    }
  };

  const getHomePageCMSContent = async () => {
    if (sessionState.uiCMSContentMap?.size > 0) {
      for (const [key, value] of sessionState.uiCMSContentMap.entries()) {
        cloneUIContentMap(key, value);
      }
    }

    const specifiedLanguageArgs: IGetCMSContentAsyncActionArgs = {
      reduxDispatch,
      reduxGetState,
      sessionDispatch,
      version: 2,
      language: defaultLanguage,
      groupKey: CmsGroupKey.homePage,
      uiCMSContentMap: uiContentMap,
    };

    const specifiedLanguageUIContentMap = await getCMSContentAsyncAction(
      specifiedLanguageArgs
    );

    for (const [key, value] of specifiedLanguageUIContentMap.entries()) {
      cloneUIContentMap(key, value);
    }
  };

  useEffect(() => {
    setIsUnauthExperienceDispatch(sessionDispatch, isUnauthExperience);
    getCurrentDeviceLanguageDispatch(sessionDispatch, membershipState);

    const loadCMSContent = async () => {
      await getHomePageCMSContent();
      await getAllCMSContent();
      setContentIsLoaded(true);
    };

    void loadCMSContent();
  }, []);

  useEffect(() => {
    if (contentIsLoaded) {
      onMounted(navigation, isUnauthExperience);
      protectTalkativeEngageElement();
    }
  }, [contentIsLoaded]);

  StatusBar.setHidden(true);

  const styles = splashScreenStyle;

  const backgroundSource = getResolvedImageSource('splashScreen');

  return (
    <ImageBackground
      source={backgroundSource}
      resizeMode='cover'
      style={styles.backgroundImageViewStyle}
      testID='splashScreenImageBackground'
    >
      <ActivityIndicator
        color={GrayScaleColor.white}
        style={styles.spinnerViewStyle}
        size='large'
      />
    </ImageBackground>
  );
};
