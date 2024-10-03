// Copyright 2021 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { LogoClickActionEnum } from '../../../components/app/application-header/application-header';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { Heading } from '../../../components/member/heading/heading';
import { ServicesListConnected } from '../../../components/member/lists/services-list/services-list.connected';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { MarkdownText } from '../../../components/text/markdown-text/markdown-text';
import { IStaticFeedContextServiceItem } from '../../../models/static-feed';
import { isVaccineServiceType } from '../../../utils/vaccine-service-type.helper';
import {
  ServiceSelectionNavigationProp,
  ServiceSelectionRouteProp,
} from '../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { serviceSelectionScreenContent } from './service-selection-screen.content';
import { serviceSelectionScreenStyles } from './service-selection-screen.styles';

export interface IServiceSelectionScreenRouteProps {
  services: IStaticFeedContextServiceItem[];
}

export const ServiceSelectionScreen = (): React.ReactElement => {
  const { params } = useRoute<ServiceSelectionRouteProp>();
  const { services } = params;

  const navigation = useNavigation<ServiceSelectionNavigationProp>();

  const vaccineService = services.filter(
    (service: IStaticFeedContextServiceItem) =>
      isVaccineServiceType(service.serviceType)
  );
  const moreInfoLink = vaccineService.length ? (
    <MarkdownText
      textStyle={serviceSelectionScreenStyles.moreInfoVaccineLinkTextStyle}
    >
      {serviceSelectionScreenContent.moreInfoVaccineLink}
    </MarkdownText>
  ) : null;

  const body = (
    <BodyContentContainer>
      <Heading textStyle={serviceSelectionScreenStyles.titleTextStyle}>
        {serviceSelectionScreenContent.title}
      </Heading>
      <ServicesListConnected services={services} />
      {moreInfoLink}
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      body={body}
      showProfileAvatar={true}
      navigateBack={navigation.goBack}
      logoClickAction={LogoClickActionEnum.CONFIRM}
      translateContent={true}
    />
  );
};
