// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IOrderConfirmationScreenContent } from '../../../experiences/guest-experience/screens/order-confirmation-screen/order-confirmation.screen.content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { BaseText } from '../../text/base-text/base-text';
import { Heading } from '../heading/heading';
import { PrescriptionPharmacyInfo } from '../prescription-pharmacy-info/prescription-pharmacy-info';
import { offerDeliveryInfoStyles } from './offer-delivery-info.style';

export interface IOfferDeliveryInfoProps {
  viewStyle?: StyleProp<ViewStyle>;
  phoneNumber?: string;
  pharmacyName: string;
  pharmacyNcpdp: string;
  isSkeleton?: boolean;
}

export const OfferDeliveryInfo = ({
  phoneNumber,
  viewStyle,
  pharmacyName,
  pharmacyNcpdp,
}: IOfferDeliveryInfoProps) => {
  const groupKey = CmsGroupKey.orderConfirmation;

  const { content, isContentLoading } =
    useContent<IOrderConfirmationScreenContent>(groupKey, 2);

  const offerDeliveryInfoDescription = StringFormatter.format(
    content.offerDeliveryInfoDescription,
    new Map([['pharmacyName', pharmacyName]])
  );

  return (
    <View style={viewStyle}>
      <Heading
        level={2}
        textStyle={offerDeliveryInfoStyles.titleTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.offerDeliveryInfoTitle}
      </Heading>
      <BaseText isSkeleton={isContentLoading} skeletonWidth='medium'>
        {offerDeliveryInfoDescription}
      </BaseText>
      <PrescriptionPharmacyInfo
        phoneNumber={phoneNumber}
        title={pharmacyName}
        ncpdp={pharmacyNcpdp}
        viewStyle={offerDeliveryInfoStyles.pharmacyInfoViewStyle}
        isSkeleton={isContentLoading}
      />
    </View>
  );
};
