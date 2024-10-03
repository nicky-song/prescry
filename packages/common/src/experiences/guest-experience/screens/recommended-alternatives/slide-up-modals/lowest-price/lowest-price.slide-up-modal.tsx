// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import {
  ClaimPharmacyInfo,
  IClaimPharmacyInfoProps,
} from '../../../../../../components/member/claim-pharmacy-info/claim-pharmacy-info';
import {
  ISlideUpModalProps,
  SlideUpModal,
} from '../../../../../../components/modal/slide-up/slide-up.modal';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { ILowestPriceSlideUpModalContent } from './lowest-price.slide-up-modal.content';
import { lowestPriceSlideUpModalStyles } from './lowest-price.slide-up-modal.styles';

export type ILowestPriceSlideUpModalProps = Pick<
  ISlideUpModalProps,
  'isVisible' | 'onClosePress' | 'viewStyle'
> &
  Pick<
    IClaimPharmacyInfoProps,
    | 'title'
    | 'phoneNumber'
    | 'pharmacyAddress1'
    | 'pharmacyCity'
    | 'pharmacyState'
    | 'pharmacyZipCode'
  >;

export const LowestPriceSlideUpModal = ({
  isVisible,
  onClosePress,
  viewStyle,
  title,
  phoneNumber,
  pharmacyAddress1,
  pharmacyCity,
  pharmacyState,
  pharmacyZipCode,
}: ILowestPriceSlideUpModalProps): ReactElement => {
  const { content, isContentLoading } =
    useContent<ILowestPriceSlideUpModalContent>(
      CmsGroupKey.lowestPriceSlideUpModal,
      2
    );

  const children = (
    <>
      <BaseText
        style={lowestPriceSlideUpModalStyles.descriptionTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.description}
      </BaseText>
      <ClaimPharmacyInfo
        title={title}
        phoneNumber={phoneNumber}
        pharmacyAddress1={pharmacyAddress1}
        pharmacyCity={pharmacyCity}
        pharmacyState={pharmacyState}
        pharmacyZipCode={pharmacyZipCode}
        viewStyle={lowestPriceSlideUpModalStyles.claimPharmacyInfoViewStyle}
      />
    </>
  );
  return (
    <SlideUpModal
      key='lowest-price-slide-up-modal'
      isVisible={isVisible}
      onClosePress={onClosePress}
      children={children}
      heading={content.heading}
      isSkeleton={isContentLoading}
      viewStyle={viewStyle}
      testID='lowestPriceSlideUpModal'
    />
  );
};
