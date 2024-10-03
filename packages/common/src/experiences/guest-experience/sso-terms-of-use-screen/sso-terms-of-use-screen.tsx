// Copyright 2021 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { TermsConditionsAndPrivacyCheckbox } from '../../../components/member/checkboxes/terms-conditions-and-privacy/terms-conditions-and-privacy.checkbox';

import { BasicPageConnected } from '../../../components/pages/basic-page-connected';

import type { ISignUpContent } from '../../../models/cms-content/sign-up.ui-content';

import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { useSessionContext } from '../context-providers/session/use-session-context.hook';
import {
  RootStackNavigationProp,
  SsoTermsOfUseRouteProp,
} from '../navigation/stack-navigators/root/root.stack-navigator';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';

import { ssoTermsOfUseScreenStyles } from './sso-terms-of-use-screen.styles';

import { setAuthExperienceAction } from '../store/secure-pin/secure-pin-reducer.actions';
import { ssoExternalLoginAction } from '../store/start-experience/async-actions/sso-experience.actions';
import { PbmMemberBenefitsList } from '../screens/unauth/pbm-member-benefits/pbm-member-benefits-list';
import { useCobrandingContent } from '../context-providers/session/ui-content-hooks/use-cobranding-content';
import { CobrandingHeader } from '../../../components/member/cobranding-header/cobranding-header';
import { useFlags } from 'launchdarkly-react-client-sdk';

export interface ISsoTermsOfUseScreenRouteProps {
  group_number?: string;
  ssoJwt: string;
}

export const SsoTermsOfUseScreen = (): ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const {
    params: { ssoJwt, group_number },
  } = useRoute<SsoTermsOfUseRouteProp>();

  const [isTermsAccepted, setIsTermsAccepted] = React.useState<boolean>(false);
  const [isWaitingForSso, setIsWaitingForSso] = React.useState(false);

  const {
    sessionState: { isUserAuthenticated },
  } = useSessionContext();
  const { logo: cobrandingLogo } = useCobrandingContent(group_number);

  const { dispatch, getState } = useReduxContext();
  const { settings } = getState();
  const isContinueDisabled = !ssoJwt || !isTermsAccepted || isWaitingForSso;
  const onAcceptTermsPress = (isTermAcceptedCurrent: boolean) => {
    setIsTermsAccepted(isTermAcceptedCurrent);
  };

  const { uselangselector } = useFlags();
  React.useEffect(() => {
    if (isUserAuthenticated || settings.deviceToken) {
      trySsoLogin();
    } else {
      setIsWaitingForSso(false);
    }
  }, [isUserAuthenticated]);

  React.useEffect(() => {
    dispatch(setAuthExperienceAction(true));
  }, []);

  const trySsoLogin = () => {
    if (!ssoJwt) {
      return;
    }
    setIsWaitingForSso(true);

    ssoExternalLoginAction({
      jwtToken: ssoJwt,
      navigation,
      getState,
      dispatch,
      group_number,
    });

    setIsWaitingForSso(false);

    return;
  };

  const onContinuePress = () => {
    if (!isContinueDisabled) {
      trySsoLogin();
    }
  };

  const groupKey = CmsGroupKey.signUp;
  const { content, isContentLoading } = useContent<ISignUpContent>(groupKey, 2);
  const showSkeleton = isContentLoading;

  const bottomContent = (
    <View style={ssoTermsOfUseScreenStyles.bottomContentViewStyle}>
      <TermsConditionsAndPrivacyCheckbox
        onPress={onAcceptTermsPress}
        viewStyle={
          ssoTermsOfUseScreenStyles.termsAndConditionsContainerViewStyles
        }
      />

      <BaseButton
        disabled={isContinueDisabled}
        onPress={onContinuePress}
        isSkeleton={showSkeleton}
        testID='SsoTermsOfUseScreenContinueButton'
      >
        {content.continueButton}
      </BaseButton>
    </View>
  );

  const body = (
    <BodyContentContainer
      testID='SsoTermsOfUseScreenBodyContentContainer'
      viewStyle={ssoTermsOfUseScreenStyles.bodyContainerViewStyle}
    >
      {cobrandingLogo ? (
        <View style={ssoTermsOfUseScreenStyles.cobrandingImageContainer}>
          <CobrandingHeader logoUrl={cobrandingLogo} />
        </View>
      ) : null}
      <PbmMemberBenefitsList
        styles={ssoTermsOfUseScreenStyles}
        content={content}
        showSkeleton={showSkeleton}
      />
      {bottomContent}
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      body={body}
      bodyViewStyle={ssoTermsOfUseScreenStyles.bodyContainerViewStyle}
      allowBodyGrow={true}
      showProfileAvatar={uselangselector}
      translateContent={true}
    />
  );
};
