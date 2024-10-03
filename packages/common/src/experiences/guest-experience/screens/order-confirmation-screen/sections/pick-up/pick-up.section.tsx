// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { Heading } from '../../../../../../components/member/heading/heading';
import { LineSeparator } from '../../../../../../components/member/line-separator/line-separator';
import { PrescriptionPharmacyInfo } from '../../../../../../components/member/prescription-pharmacy-info/prescription-pharmacy-info';
import { SectionView } from '../../../../../../components/primitives/section-view';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { IPharmacy } from '../../../../../../models/pharmacy';
import { IOrderConfirmationScreenContent } from '../../order-confirmation.screen.content';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { pickUpSectionStyles } from './pick-up.section.styles';
import { FavoriteIconButton } from '../../../../../../components/buttons/favorite-icon/favorite-icon.button';
import { View } from 'react-native';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { IFeaturesState } from '../../../../guest-experience-features';
import { PricingOption } from '../../../../../../models/pricing-option';

export interface IPickupSectionProps {
  pharmacy: IPharmacy;
  onFavoriteIconButtonPress: () => Promise<void>;
  hasInsurance?: boolean;
  pricingOption?: PricingOption;
}

export const PickUpSection = ({
  pharmacy,
  onFavoriteIconButtonPress,
  hasInsurance,
  pricingOption,
}: IPickupSectionProps): ReactElement => {
  const groupKey = CmsGroupKey.orderConfirmation;

  const { content, isContentLoading } =
    useContent<IOrderConfirmationScreenContent>(groupKey, 2);

  const { usertpb } = useFlags<IFeaturesState>();

  const styles = pickUpSectionStyles;

  const {
    name: pharmacyName,
    phoneNumber,
    address: pharmacyAddress,
    brand,
    ncpdp,
  } = pharmacy;

  const { lineOne, city, state, zip: zipCode } = pharmacyAddress;

  const pharmacyBrandOrName = brand ?? pharmacyName;

  const heading = (
    <Heading
      level={3}
      textStyle={styles.heading3TextStyle}
      isSkeleton={isContentLoading}
      skeletonWidth='long'
      translateContent={false}
    >
      {pharmacyBrandOrName}
    </Heading>
  );

  const headingWithFavorite = (
    <View style={styles.headingWithFavoriteViewStyle}>
      {heading}
      <FavoriteIconButton
        onPress={onFavoriteIconButtonPress}
        ncpdp={ncpdp}
        testID='favoriteIconButtonInPickUpSection'
        viewStyle={pickUpSectionStyles.favoriteIconButtonViewStyle}
      />
    </View>
  );

  const renderPickUpInstruction = (): ReactNode => {
    if (pricingOption === 'thirdParty' || (usertpb && hasInsurance)) {
      return (
        <BaseText isSkeleton={isContentLoading} skeletonWidth='medium'>
          {content.pickUpPreamble}&nbsp;
          <BaseText weight='semiBold'>
            {content.insuranceCardNoticeText}
          </BaseText>
        </BaseText>
      );
    }

    return (
      <BaseText isSkeleton={isContentLoading} skeletonWidth='medium'>
        {content.pickUpPreamble}
      </BaseText>
    );
  };

  return (
    <SectionView testID='pickUpSection' style={styles.sectionViewStyle}>
      <LineSeparator viewStyle={styles.separatorViewStyle} />
      <Heading
        level={2}
        textStyle={styles.heading2TextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.pickUpHeading}
      </Heading>
      {renderPickUpInstruction()}
      {headingWithFavorite}
      <PrescriptionPharmacyInfo
        phoneNumber={phoneNumber}
        pharmacyAddress1={lineOne}
        pharmacyCity={city}
        pharmacyState={state}
        pharmacyZipCode={zipCode}
        isSkeleton={isContentLoading}
      />
    </SectionView>
  );
};
