// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { pastProceduresListScreenContent } from './past-procedures-list.screen.content';
import { PastProceduresList } from '../../../../components/member/lists/past-procedures-list/past-procedures-list';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  PastProceduresListNavigationProp,
  PastProceduresListRouteProp,
} from '../../navigation/stack-navigators/past-procedures/past-procedures.stack-navigator';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useUrl } from '../../../../hooks/use-url';

export interface IPastProceduresListScreenRouteProps {
  backToHome?: boolean;
}

export const PastProceduresListScreen = (): ReactElement => {
  const navigation = useNavigation<PastProceduresListNavigationProp>();
  const { params } = useRoute<PastProceduresListRouteProp>();
  const { getState: reduxGetState } = useReduxContext();

  useUrl('/results');

  const body = (
    <PastProceduresList
      navigation={navigation}
      title={pastProceduresListScreenContent.title}
    />
  );

  const onNavigateBack = () => {
    if (params?.backToHome) {
      navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
    } else {
      navigation.goBack();
    }
  };

  return (
    <BasicPageConnected
      body={body}
      navigateBack={onNavigateBack}
      showProfileAvatar={true}
      translateContent={true}
    />
  );
};
