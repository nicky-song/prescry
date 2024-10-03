// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { ReactElement, useEffect } from 'react';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import {
  ClaimAlertStackScreenName,
  ClaimExperienceNavigationProp,
  ClaimExperienceRouteProp,
} from '../../navigation/stack-navigators/claim-alert/claim-alert.stack-navigator';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useClaimAlertContext } from '../../context-providers/claim-alert/use-claim-alert-context';
import { popToTop } from '../../navigation/navigation.helper';
import { getClaimAlertAsyncAction } from '../../state/claim-alert/async-actions/get-claim-alert.async-action';
import { View } from 'react-native';

export interface IClaimExperienceScreenRouteProps {
  identifier: string;
}

export const ClaimExperienceScreen = (): ReactElement => {
  const navigation = useNavigation<ClaimExperienceNavigationProp>();

  const { params } = useRoute<ClaimExperienceRouteProp>();
  const { identifier } = params;

  const { getState: reduxGetState, dispatch: reduxDispatch } =
    useReduxContext();

  const {
    claimAlertState: { prescribedMedication, notificationType },
    claimAlertDispatch,
  } = useClaimAlertContext();

  const getClaimAlert = async () => {
    if (identifier) {
      await getClaimAlertAsyncAction({
        identifier,
        claimAlertDispatch,
        reduxDispatch,
        reduxGetState,
        navigation,
      });
    }
  };

  const notificationTypeToScreen = {
    reversal: 'ClaimReversal',
    alternativesAvailable: 'RecommendedAlternatives',
    bestPrice: 'GreatPrice',
  };

  useEffect(() => {
    if (notificationType) {
      popToTop(navigation);
      navigation.navigate('ClaimAlertStack', {
        screen: notificationTypeToScreen[
          notificationType
        ] as ClaimAlertStackScreenName,
      });
    }

    if (!prescribedMedication) {
      void getClaimAlert();
    }
  }, [prescribedMedication]);

  const body = <View testID='claimExperienceScreen' />;

  return <BasicPageConnected body={body} />;
};
