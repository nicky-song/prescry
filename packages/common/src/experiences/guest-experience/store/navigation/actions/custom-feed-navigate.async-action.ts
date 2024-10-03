// Copyright 2021 Prescryptive Health, Inc.

import { setServiceTypeAction } from '../../service-type/actions/set-service-type.action';
import { Dispatch } from 'react';
import { resetServiceTypeAction } from '../../service-type/actions/reset-service-type.action';
import { IDispatchServiceTypeStateActionTypes } from '../../service-type/service-type.reducer';
import { IStaticFeedContextServiceItem } from '../../../../../models/static-feed';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export const customFeedNavigateAsyncAction = (
  navigation: RootStackNavigationProp,
  serviceType?: string,
  services?: IStaticFeedContextServiceItem[]
) => {
  return (dispatch: Dispatch<IDispatchServiceTypeStateActionTypes>) => {
    if (serviceType) {
      dispatch(
        setServiceTypeAction({
          type: serviceType,
        })
      );
      navigation.navigate('AppointmentsStack', { screen: 'PharmacyLocations' });
    } else if (services) {
      dispatch(resetServiceTypeAction());
      navigation.navigate('AppointmentsStack', {
        screen: 'ServiceSelection',
        params: { services },
      });
    }
  };
};
