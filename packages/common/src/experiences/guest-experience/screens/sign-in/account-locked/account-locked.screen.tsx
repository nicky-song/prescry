// Copyright 2018 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { AccountLockedContainer } from '../../../../../components/member/account-locked-container/account-locked-container';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { useConfigContext } from '../../../context-providers/config/use-config-context.hook';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import {
  AccountLockedRouteProp,
  RootStackNavigationProp,
} from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { accountLockedScreenContent } from './account-locked.screen.content';

export interface IAccountLockedScreenRouteProps {
  accountLockedResponse?: boolean;
}

export const AccountLockedScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const { params } = useRoute<AccountLockedRouteProp>();
  const { accountLockedResponse } = params;
  const { getState: reduxGetState } = useReduxContext();
  const {
    identityVerification: { recoveryEmailExists },
  } = reduxGetState();
  const {
    configState: { supportEmail },
  } = useConfigContext();

  const onResetPinPress = () => {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.CLICKED_FORGOT_PIN_LINK,
      {}
    );
    navigation.navigate('VerifyIdentity');
  };

  const body = (
    <BodyContentContainer
      title={accountLockedScreenContent.title}
      testID='accountLockedBodyContentContainer'
    >
      <AccountLockedContainer
        supportEmail={supportEmail}
        recoveryEmailExists={recoveryEmailExists}
        accountLockedResponse={accountLockedResponse}
        onResetPinPress={onResetPinPress}
      />
    </BodyContentContainer>
  );

  return <BasicPageConnected body={body} translateContent={true} />;
};
