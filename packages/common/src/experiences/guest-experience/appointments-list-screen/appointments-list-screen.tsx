// Copyright 2020 Prescryptive Health, Inc.

import React, { useRef } from 'react';
import { ScrollView } from 'react-native';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { AppointmentsList } from '../../../components/member/lists/appointments-list/appointments-list';
import { appointmentsListScreenContent } from './appointments-list-screen.content';
import { appointmentsListScreenStyles } from './appointments-list-screen.styles';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { useAppointmentsListContext } from '../context-providers/appointments-list/appointments-list-context.hook';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { navigateHomeScreenNoApiRefreshDispatch } from '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  AppointmentsListNavigationProp,
  AppointmentsListRouteProp,
} from '../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { Heading } from '../../../components/member/heading/heading';
import { useUrl } from '../../../hooks/use-url';

export interface IAppointmentsListScreenRouteProp {
  backToHome?: boolean;
}

export const AppointmentsListScreen = () => {
  const {
    appointmentsListState: { appointmentsType, appointments },
  } = useAppointmentsListContext();

  useUrl('/appointments');

  const { getState: reduxGetState } = useReduxContext();

  const navigation = useNavigation<AppointmentsListNavigationProp>();
  const { params } = useRoute<AppointmentsListRouteProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const handleHomeScreenNoApiRefreshDispatch = () => {
    navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
  };

  const appointmentsList: React.ReactNode = (
    <AppointmentsList
      navigation={navigation}
      scrollViewRef={scrollViewRef}
      backToHome={params?.backToHome}
    />
  );

  const header = (
    <Heading textStyle={appointmentsListScreenStyles.headerTextStyle}>
      {appointmentsListScreenContent.headerText}
    </Heading>
  );

  const footer =
    !appointments?.length && appointmentsType === 'upcoming' ? (
      <BaseButton onPress={handleHomeScreenNoApiRefreshDispatch}>
        {appointmentsListScreenContent.scheduleAppointmentButtonText}
      </BaseButton>
    ) : null;

  const handleNavigateback = () => {
    if (params?.backToHome) {
      handleHomeScreenNoApiRefreshDispatch();
    } else {
      navigation.goBack();
    }
  };

  return (
    <BasicPageConnected
      headerViewStyle={appointmentsListScreenStyles.headerViewStyle}
      header={header}
      body={appointmentsList}
      navigateBack={handleNavigateback}
      hideNavigationMenuButton={false}
      showProfileAvatar={true}
      footer={footer}
      ref={scrollViewRef}
      translateContent={true}
    />
  );
};
