// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IPrescribedMedicationContent } from './prescribed-medication-content';
import { IDrugDetails } from '../../../utils/formatters/drug.formatter';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { PrescriptionPriceContainer } from '../../containers/prescription-price/prescription-price.container';
import { SectionView } from '../../primitives/section-view';
import { BaseText } from '../../text/base-text/base-text';
import { PrescriptionTitle } from '../prescription-title/prescription-title';
import { prescribedMedicationStyles } from './prescribed-medication.styles';
import { ValueText } from '../../text/value/value.text';
import { LineSeparator } from '../line-separator/line-separator';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { IconButton } from '../../buttons/icon/icon.button';

export interface IPrescribedMedicationProps {
  drugName: string;
  drugDetails: IDrugDetails;
  price?: number;
  planPrice?: number;
  pharmacyName?: string;
  orderDate?: string;
  onIconPress?: () => void;
  isDigitalRx?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
}

export const PrescribedMedication = ({
  drugName,
  drugDetails,
  price,
  planPrice,
  pharmacyName,
  orderDate,
  onIconPress,
  isDigitalRx,
  viewStyle,
}: IPrescribedMedicationProps): ReactElement => {
  const { strength, unit, formCode, quantity, supply, refills } = drugDetails;
  const formattedPrice = MoneyFormatter.format(price);
  const formattedPlanPrice = MoneyFormatter.format(planPrice);

  const groupKey = CmsGroupKey.prescribedMedication;

  const { content, isContentLoading } =
    useContent<IPrescribedMedicationContent>(groupKey, 2);

  const planPriceWithYouPayPrice = (
    <View>
      {price !== undefined && (
        <PrescriptionPriceContainer containerFormat='plain'>
          <BaseText
            isSkeleton={isContentLoading}
            skeletonWidth='short'
            weight='semiBold'
            style={prescribedMedicationStyles.youPayTextStyle}
          >
            {content.youPay}
          </BaseText>
          <ValueText style={prescribedMedicationStyles.priceTextStyle}>
            {formattedPrice}
          </ValueText>
        </PrescriptionPriceContainer>
      )}
      {planPrice !== undefined && price !== undefined && (
        <View>
          <BaseText
            isSkeleton={isContentLoading}
            skeletonWidth='short'
            size='small'
          >
            {content.planPays}{' '}
            <BaseText size='small'>{formattedPlanPrice}</BaseText>
          </BaseText>
        </View>
      )}
    </View>
  );

  const sentToPharmacyText =
    pharmacyName && orderDate
      ? StringFormatter.format(
          content.sentToMessage,
          new Map([
            ['pharmacyName', pharmacyName],
            ['orderDate', orderDate],
          ])
        )
      : pharmacyName && !orderDate
      ? `${content.sendToText} ${pharmacyName}`
      : undefined;

  const renderSentToPharmacyText = sentToPharmacyText && (
    <ProtectedBaseText
      isSkeleton={isContentLoading}
      skeletonWidth='medium'
      style={prescribedMedicationStyles.sentToPharmacyTextStyle}
    >
      {sentToPharmacyText}
    </ProtectedBaseText>
  );

  const estimatedPriceText = pharmacyName
    ? StringFormatter.format(
        content.estimatedPriceMessage,
        new Map([['pharmacyName', pharmacyName]])
      )
    : undefined;

  const renderEstimatedPriceText = estimatedPriceText && (
    <View style={prescribedMedicationStyles.estimatedPriceContainerViewStyle}>
      <ProtectedBaseText
        size='small'
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {estimatedPriceText}
      </ProtectedBaseText>
      {onIconPress ? (
        <IconButton
          onPress={onIconPress}
          iconName='info-circle'
          accessibilityLabel='lowestPriceInfoButton'
          iconTextStyle={prescribedMedicationStyles.iconButtonTextStyle}
          viewStyle={prescribedMedicationStyles.iconButtonViewStyle}
        />
      ) : null}
    </View>
  );

  const subText = isDigitalRx
    ? renderEstimatedPriceText
    : renderSentToPharmacyText;

  const lineSeparator = subText && (
    <LineSeparator
      viewStyle={prescribedMedicationStyles.lineSeparatorViewStyle}
    />
  );

  return (
    <SectionView testID='prescribedMedication' style={viewStyle}>
      <BaseText
        style={prescribedMedicationStyles.titleTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.title}
      </BaseText>
      <PrescriptionTitle
        productName={drugName}
        strength={strength}
        unit={unit}
        formCode={formCode}
        quantity={quantity}
        refills={refills}
        supply={supply}
        hideSeparator={true}
        isSkeleton={isContentLoading}
        headingLevel={2}
      />
      {planPriceWithYouPayPrice}
      {lineSeparator}
      {subText}
    </SectionView>
  );
};
