// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { Text } from 'react-native';
import { pharmacyLocationsScreenContent } from './pharmacy-locations-screen.content';
import { pharmacyLocationsScreenStyle as styles } from './pharmacy-locations-screen.style';
import { PharmacyLocationsListConnected } from '../../../components/member/lists/pharmacy-locations-list/pharmacy-locations-list.connected';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { useNavigation } from '@react-navigation/native';
import { PharmacyLocationsNavigationProp } from '../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { LogoClickActionEnum } from '../../../components/app/application-header/application-header';

export const PharmacyLocationsScreen = (): ReactElement => {
  const navigation = useNavigation<PharmacyLocationsNavigationProp>();
  const header = (
    <>
      <Text
        style={styles.pharmacyLocationsHeaderTextStyle}
        testID='pharmacyLocationsHeader'
      >
        {pharmacyLocationsScreenContent.headerText}
      </Text>
    </>
  );

  const renderLocationsList = <PharmacyLocationsListConnected />;

  return (
    <BasicPageConnected
      headerViewStyle={styles.pharmacyLocationsScreenHeaderViewStyle}
      header={header}
      body={renderLocationsList}
      navigateBack={navigation.goBack}
      hideNavigationMenuButton={false}
      showProfileAvatar={true}
      logoClickAction={LogoClickActionEnum.CONFIRM}
      translateContent={true}
    />
  );
};
