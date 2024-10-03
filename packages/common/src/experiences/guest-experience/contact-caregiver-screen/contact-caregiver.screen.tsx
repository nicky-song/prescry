// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { useRoute } from '@react-navigation/native';
import { ContactCaregiverScreenRouteProp } from '../navigation/stack-navigators/root/root.stack-navigator';
import { ContactCaregiverScreenContainer } from '../../../components/member/contact-caregiver-container/contact-caregiver.container';
import { useConfigContext } from '../context-providers/config/use-config-context.hook';

export interface IContactCaregiverScreenRouteProps {
  group_number?: string;
}

export const ContactCaregiverScreen = (): ReactElement => {
  const { configState: config } = useConfigContext();
  const {
    params: { group_number: groupNumber },
  } = useRoute<ContactCaregiverScreenRouteProp>();

  const body = (
    <BodyContentContainer>
      <ContactCaregiverScreenContainer
        group_number={groupNumber}
        supportEmail={config.supportEmail}
      />
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      body={body}
      hideNavigationMenuButton={true}
      translateContent={true}
    />
  );
};
