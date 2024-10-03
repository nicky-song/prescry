// Copyright 2021 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { ImmunizationCertificate } from '../../../components/member/immunization-certificate/immunization-certificate';
import { PersonalInfoExpander } from '../../../components/member/personal-info-expander/personal-info-expander';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { MarkdownText } from '../../../components/text/markdown-text/markdown-text';
import { useUrl } from '../../../hooks/use-url';
import { IImmunizationRecord } from '../../../models/api-response/immunization-record-response';
import { popToTop } from '../navigation/navigation.helper';
import {
  PastProceduresStackNavigationProp,
  VaccinationRecordNavigationProp,
  VaccinationRecordRouteProp,
} from '../navigation/stack-navigators/past-procedures/past-procedures.stack-navigator';
import { navigatePastProceduresListDispatch } from '../store/navigation/dispatch/navigate-past-procedures-list.dispatch';
import { vaccinationRecordScreenContent } from './vaccination-record-screen.content';
import { vaccinationRecordScreenStyles } from './vaccination-record-screen.styles';

export interface IVaccinationRecordScreenProps {
  recipientName: string;
  dateOfBirth?: string;
  immunizationRecords: IImmunizationRecord[];
}

export interface IVaccinationRecordScreenDispatchProps {
  getImmunizationRecord: (
    navigation: PastProceduresStackNavigationProp,
    orderNumber: string
  ) => void;
}

export interface IVaccinationRecordRouteProp {
  orderNumber: string;
  backToList?: boolean;
}

export const VaccinationRecordScreen = (
  props: IVaccinationRecordScreenDispatchProps & IVaccinationRecordScreenProps
) => {
  const navigation = useNavigation<VaccinationRecordNavigationProp>();
  const { params } = useRoute<VaccinationRecordRouteProp>();
  const { orderNumber, backToList } = params;

  const update = !!orderNumber || !!props.immunizationRecords[0].orderNumber;
  useUrl(
    update
      ? `/results/vaccine/${
          orderNumber ?? props.immunizationRecords[0].orderNumber
        }`
      : undefined
  );

  useEffect(() => {
    props.getImmunizationRecord(navigation, orderNumber);
  }, []);

  const renderRecord = props.immunizationRecords.length ? (
    <ImmunizationCertificate immunizationRecords={props.immunizationRecords} />
  ) : null;

  const renderVaccineLinks =
    props.immunizationRecords[0]?.factSheetLinks !== undefined ? (
      <View>
        {props.immunizationRecords[0].factSheetLinks.map((link) => {
          return (
            <MarkdownText
              textStyle={vaccinationRecordScreenStyles.moreInfoTextStyle}
              key={link}
            >
              {link}
            </MarkdownText>
          );
        })}
      </View>
    ) : null;

  const body = (
    <BodyContentContainer title={vaccinationRecordScreenContent.title}>
      <PersonalInfoExpander
        PersonalInfoExpanderData={{
          name: props.recipientName,
          dateOfBirth: props.dateOfBirth,
        }}
        viewStyle={vaccinationRecordScreenStyles.expanderViewStyle}
      />
      {renderRecord}
      {renderVaccineLinks}
    </BodyContentContainer>
  );

  const handleNavigateBack = () => {
    if (backToList) {
      popToTop(navigation);
      navigatePastProceduresListDispatch(navigation, true);
    } else {
      navigation.goBack();
    }
  };

  return (
    <BasicPageConnected
      body={body}
      showProfileAvatar={true}
      navigateBack={handleNavigateBack}
      translateContent={true}
    />
  );
};
