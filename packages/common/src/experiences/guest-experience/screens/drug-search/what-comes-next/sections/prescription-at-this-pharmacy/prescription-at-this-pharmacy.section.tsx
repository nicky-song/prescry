// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { LinkButton } from '../../../../../../../components/buttons/link/link.button';
import { Heading } from '../../../../../../../components/member/heading/heading';
import { SectionView } from '../../../../../../../components/primitives/section-view';
import { BaseText } from '../../../../../../../components/text/base-text/base-text';
import {
  IProfile,
  RxGroupTypes,
  RxGroupTypesEnum,
} from '../../../../../../../models/member-profile/member-profile-info';
import {
  getHighestPriorityProfile,
  isPbmGroupType,
} from '../../../../../../../utils/profile.helper';
import { useMembershipContext } from '../../../../../context-providers/membership/use-membership-context.hook';
import { useSessionContext } from '../../../../../context-providers/session/use-session-context.hook';
import { prescriptionAtThisPharmacySectionStyles } from './prescription-at-this-pharmacy.section.styles';
import { useContent } from '../../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../../state/cms-content/cms-group-key';
import { IWhatComesNextScreenContent } from '../../../../../../../models/cms-content/what-comes-next-ui-content.model';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { RxIdCard } from '../../../../../../../components/cards/rx-id-card/rx-id-card';
import { IFeaturesState } from '../../../../../guest-experience-features';
import { PricingOption } from '../../../../../../../models/pricing-option';
import { RxCardType } from '../../../../../../../models/rx-id-card';

export interface IPrescriptionAtThisPharmacySectionProps {
  onSignUpPress: () => void;
  pricingOption?: PricingOption;
}

export const PrescriptionAtThisPharmacySection = ({
  onSignUpPress,
  pricingOption,
}: IPrescriptionAtThisPharmacySectionProps): ReactElement => {
  const {
    sessionState: { isUnauthExperience },
  } = useSessionContext();

  const {
    membershipState: { profileList },
  } = useMembershipContext();

  const { useDualPrice } = useFlags<IFeaturesState>();

  const groupKey = CmsGroupKey.whatComesNext;

  const { content, isContentLoading } = useContent<IWhatComesNextScreenContent>(
    groupKey,
    2
  );

  const renderDigitalIdCard = (
    pricingOption: PricingOption | undefined,
    useDualPrice: boolean | undefined
  ): boolean => {
    if (!useDualPrice) return true;
    return (
      pricingOption === undefined ||
      pricingOption === 'pbm' ||
      pricingOption === 'smartPrice'
    );
  };

  const getDisplayRxCardType = (
    pricingOption: PricingOption | undefined,
    profile: IProfile,
    useDualPrice: boolean | undefined
  ): RxCardType => {
    if (
      useDualPrice &&
      pricingOption &&
      (pricingOption === 'pbm' || pricingOption === 'smartPrice')
    ) {
      return pricingOption;
    }
    return isPbmGroupType(profile.rxGroupType as RxGroupTypes)
      ? 'pbm'
      : 'smartPrice';
  };

  const renderAuthOrUnauthUserCard = (
    pricingOption: PricingOption | undefined
  ) => {
    if (!isUnauthExperience) {
      const mainProfile = getHighestPriorityProfile(profileList);
      if (mainProfile)
        return (
          <>
            {renderDigitalIdCard(pricingOption, useDualPrice) ? (
              <RxIdCard
                profile={mainProfile.primary}
                rxCardType={getDisplayRxCardType(
                  pricingOption,
                  mainProfile,
                  useDualPrice
                )}
                viewStyle={
                  prescriptionAtThisPharmacySectionStyles.rxIdCardViewStyle
                }
              />
            ) : null}
            {mainProfile.rxGroupType !== RxGroupTypesEnum.SIE ? (
              <BaseText
                style={
                  prescriptionAtThisPharmacySectionStyles.informationTextStyle
                }
                isSkeleton={isContentLoading}
                skeletonWidth='medium'
              >
                {content.prescriptionAtThisPharmacy.unAuthInformation}
              </BaseText>
            ) : null}
          </>
        );
    }
    return (
      <>
        <RxIdCard
          rxCardType='smartPrice'
          viewStyle={prescriptionAtThisPharmacySectionStyles.rxIdCardViewStyle}
        />
        <BaseText
          style={prescriptionAtThisPharmacySectionStyles.informationTextStyle}
          isSkeleton={isContentLoading}
          skeletonWidth='medium'
        >
          {content.prescriptionAtThisPharmacy.unAuthInformation}
        </BaseText>
        <LinkButton
          onPress={onSignUpPress}
          linkText={content.prescriptionAtThisPharmacy.signUpButtonLabel}
          isSkeleton={isContentLoading}
          skeletonWidth='medium'
          testID='prescriptionAtThisPharmacySectionSignUpButton'
        />
      </>
    );
  };

  const renderHeading = () => {
    return (
      <Heading
        level={3}
        textStyle={prescriptionAtThisPharmacySectionStyles.headingTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.prescriptionAtThisPharmacy.heading}
      </Heading>
    );
  };

  const renderInstructions = () => {
    return (
      <BaseText isSkeleton={isContentLoading} skeletonWidth='medium'>
        {content.prescriptionAtThisPharmacy.instructions}
      </BaseText>
    );
  };

  return (
    <SectionView
      style={prescriptionAtThisPharmacySectionStyles.paddingViewStyle}
    >
      {renderHeading()}
      {renderInstructions()}
      {renderAuthOrUnauthUserCard(pricingOption)}
    </SectionView>
  );
};
