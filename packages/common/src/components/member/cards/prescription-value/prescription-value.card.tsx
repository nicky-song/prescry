// Copyright 2021 Prescryptive Health, Inc.

import React, { FunctionComponent } from 'react';
import { View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { BaseText } from '../../../text/base-text/base-text';
import { Heading } from '../../heading/heading';
import { prescriptionValueCardContent } from './prescription-value.card.content';
import { prescriptionValueCardStyles } from './prescription-value.card.styles';
import { IAddress } from '../../../../models/address';
import { RxGroupTypes } from '../../../../models/member-profile/member-profile-info';
import { PrescriptionPriceSection } from '../../prescription-price/prescription-price.section';
import { ICouponDetails } from '../../../../models/coupon-details/coupon-details';
import { useMembershipContext } from '../../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';
import { PharmacyTagList } from '../../../tags/pharmacy/pharmacy-tag-list';
import { ProtectedBaseText } from '../../../text/protected-base-text/protected-base-text';
import { IFeaturesState } from '../../../../experiences/guest-experience/guest-experience-features';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { SmartPricePricingOptionInformativePanel } from '../../panels/smart-pricing-option-informative/smart-price-pricing-option-informative.panel';
import { IDualDrugPrice } from '../../../../models/drug-price';
import { PbmPricingOptionInformativePanel } from '../../panels/pbm-pricing-option-informative/pbm-pricing-option-informative.panel';
import { ThirdPartyPricingOptionInformativePanel } from '../../panels/third-party-pricing-option-informative/third-party-pricing-option-informative.panel';
import { NoPricePricingOptionInformativePanel } from '../../panels/no-price-pricing-option-informative/no-price-pricing-option-informative.panel';

export interface IPrescriptionValueCardProps {
  pharmacyName: string;
  ncpdp: string;
  userGroup: RxGroupTypes;
  onPress?: () => void;
  isBestValue?: boolean;
  hasCoupon?: boolean;
  bestValueLabel?: string;
  distance?: number;
  serviceStatus?: string;
  isServiceStatusLoading?: boolean;
  priceYouPay?: number;
  pricePlanPays?: number;
  patientAssistance?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  showPlanPrice?: boolean;
  address?: IAddress;
  isMailOrderOnly?: boolean;
  couponDetails?: ICouponDetails;
  insurancePrice?: number;
  testID?: string;
  dualPrice?: IDualDrugPrice;
}

export const PrescriptionValueCard: FunctionComponent<IPrescriptionValueCardProps> =
  ({
    isBestValue,
    onPress,
    pharmacyName,
    ncpdp,
    distance,
    serviceStatus,
    isServiceStatusLoading,
    priceYouPay,
    pricePlanPays,
    viewStyle,
    address,
    isMailOrderOnly,
    hasCoupon,
    patientAssistance,
    userGroup = 'CASH',
    couponDetails,
    insurancePrice,
    testID,
    dualPrice,
  }) => {
    const {
      membershipState: {
        account: { favoritedPharmacies },
      },
    } = useMembershipContext();

    const { useDualPrice } = useFlags<IFeaturesState>();
    const isFavoritedPharmacy = favoritedPharmacies.includes(ncpdp);

    const pbmUserContainer = (
      <PrescriptionPriceSection
        hasAssistanceProgram={patientAssistance ?? false}
        showPlanPays={true}
        memberPays={priceYouPay}
        planPays={pricePlanPays}
        couponDetails={couponDetails}
      />
    );

    const cashUserContainer = hasCoupon ? (
      <PrescriptionPriceSection
        hasAssistanceProgram={patientAssistance ?? false}
        showPlanPays={false}
        memberPays={priceYouPay}
        couponDetails={couponDetails}
        insurancePrice={insurancePrice}
      />
    ) : (
      <PrescriptionPriceSection
        hasAssistanceProgram={patientAssistance ?? false}
        showPlanPays={false}
        memberPays={priceYouPay}
        insurancePrice={insurancePrice}
      />
    );

    const locationOrMailOrderInfo = !isMailOrderOnly && (
      <>
        {address?.lineOne && (
          <ProtectedBaseText>{address.lineOne}</ProtectedBaseText>
        )}

        {distance !== undefined && (
          <BaseText>
            {prescriptionValueCardContent.distanceInMiles(distance)}
          </BaseText>
        )}
      </>
    );

    const dualPriceContainer = (
      <>
        {!dualPrice && <NoPricePricingOptionInformativePanel />}
        {dualPrice?.pbmType === 'thirdParty' &&
          dualPrice.pbmMemberPays !== undefined && (
            <ThirdPartyPricingOptionInformativePanel
              viewStyle={
                prescriptionValueCardStyles.pricingOptionInformativePanelViewStyle
              }
              memberPays={dualPrice.pbmMemberPays}
            />
          )}
        {dualPrice?.pbmType === 'phx' &&
          dualPrice.pbmMemberPays !== undefined &&
          dualPrice.pbmPlanPays !== undefined && (
            <PbmPricingOptionInformativePanel
              viewStyle={
                prescriptionValueCardStyles.pricingOptionInformativePanelViewStyle
              }
              memberPays={dualPrice.pbmMemberPays}
              planPays={dualPrice.pbmPlanPays}
            />
          )}
        {dualPrice?.smartPriceMemberPays !== undefined && (
          <SmartPricePricingOptionInformativePanel
            memberPays={dualPrice.smartPriceMemberPays}
          />
        )}
      </>
    );

    const priceContainerWithoutDualPrice =
      userGroup === 'SIE' ? pbmUserContainer : cashUserContainer;

    const priceContainerRender = useDualPrice
      ? dualPriceContainer
      : priceContainerWithoutDualPrice;

    return (
      <TouchableOpacity
        style={[prescriptionValueCardStyles.cardViewStyle, viewStyle]}
        onPress={onPress}
        testID={testID}
      >
        <PharmacyTagList
          viewStyle={prescriptionValueCardStyles.tagsContainerViewStyle}
          isBestValue={isBestValue}
          isFavoritedPharmacy={isFavoritedPharmacy}
          isHomeDelivery={isMailOrderOnly}
        />
        <View style={prescriptionValueCardStyles.rowContainerViewStyle}>
          <View style={prescriptionValueCardStyles.leftColumnViewStyle}>
            <Heading
              level={3}
              textStyle={prescriptionValueCardStyles.pharmacyNameTextStyle}
              translateContent={false}
            >
              {pharmacyName}
            </Heading>
            {locationOrMailOrderInfo}
            <BaseText
              isSkeleton={isServiceStatusLoading}
              skeletonWidth='medium'
            >
              {serviceStatus}
            </BaseText>
          </View>
        </View>
        {priceContainerRender}
      </TouchableOpacity>
    );
  };
