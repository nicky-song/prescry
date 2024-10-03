// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { SupportContactContainer } from '../../../components/member/support-container/support-contact-container';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { supportScreenContent } from './support.screen.content';
import { useNavigation } from '@react-navigation/native';
import { SupportNavigationProp } from '../navigation/stack-navigators/root/root.stack-navigator';

export const SupportScreen = (): ReactElement => {
  const navigation = useNavigation<SupportNavigationProp>();

  const body = (
    <BodyContentContainer title={supportScreenContent.title}>
      <SupportContactContainer />
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      navigateBack={navigation.goBack}
      body={body}
      hideNavigationMenuButton={true}
      translateContent={true}
    />
  );
};
