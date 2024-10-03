// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { Text, View } from 'react-native';
import { IPrescriptionDosageInfoProps } from '../prescription-dosage-info/prescription-dosage-info';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { alternativePrescriptionStyles } from './alternative-prescription.style';
import { IDrugInformation } from '../../../experiences/guest-experience/claim-alert-screen/claim-alert-screen';
import { alternativePrescriptionContent } from './alternative-prescription.content';
import { PrescriptionTitle } from '../prescription-title/prescription-title';
import { ProtectedView } from '../../containers/protected-view/protected-view';

export interface IAlternativePrescription extends IPrescriptionDosageInfoProps {
  drugName: string;
  price: string;
  planPays?: string;
  isScreenFocused?: boolean;
  medicationId: string;
  drugInformation?: IDrugInformation;
}

export const AlternativePrescription = (props: IAlternativePrescription) => {
  const { count, dose, form, units, price, planPays, drugName } = props;
  return (
    <View style={alternativePrescriptionStyles.rowContainerView}>
      <View style={alternativePrescriptionStyles.recommendationContentInfoView}>
        <ProtectedView style={alternativePrescriptionStyles.drugNameView}>
          <PrescriptionTitle
            productName={drugName}
            strength={dose.toString()}
            unit={units}
            quantity={Number(count)}
            refills={0}
            hideSeparator={true}
            formCode={form}
            infoLink={props.drugInformation?.externalLink}
          />
        </ProtectedView>
      </View>
      <View style={alternativePrescriptionStyles.youPayContainerView}>
        <Text style={alternativePrescriptionStyles.youPayText}>
          {alternativePrescriptionContent.youPayLabel()}
        </Text>
        <Text style={alternativePrescriptionStyles.youPayPriceText}>
          {MoneyFormatter.format(parseFloat(price))}
        </Text>
      </View>
      <View style={alternativePrescriptionStyles.planPayContainerView}>
        <Text style={alternativePrescriptionStyles.priceLabelText}>
          {alternativePrescriptionContent.employerPayLabel()}
        </Text>
        {planPays ? (
          <Text style={alternativePrescriptionStyles.planPayPriceText}>
            {MoneyFormatter.format(parseFloat(planPays))}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
