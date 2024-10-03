// Copyright 2023 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { ReactElement, useState } from 'react';
import { View } from 'react-native';
import { ChevronCard } from '../../../../components/cards/chevron/chevron.card';
import { RxCardCarousel } from '../../../../components/carousels/rx-card/rx-card.carousel';
import { CustomerSupport } from '../../../../components/member/customer-support/customer-support';
import { Heading } from '../../../../components/member/heading/heading';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { IPrimaryProfile } from '../../../../models/member-profile/member-profile-info';
import { RxCardType } from '../../../../models/rx-id-card';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import {
  HealthPlanScreenRouteProp,
  RootStackNavigationProp,
} from '../../navigation/stack-navigators/root/root.stack-navigator';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { BenefitPlanLearnMoreModal } from '../digital-id-card/benefit-plan-learn-more-modal/benefit-plan.learn-more-modal';
import { BenefitPlanSection } from '../digital-id-card/sections/benefit-plan/benefit-plan.section';
import { PharmaciesSection } from '../digital-id-card/sections/pharmacies/pharmacies.section';
import { PrescribersSection } from '../digital-id-card/sections/prescribers/prescribers.section';
import { SmartPriceSection } from '../digital-id-card/sections/smart-price/smart-price.section';
import { SmartPriceLearnMoreModal } from '../digital-id-card/smart-price-learn-more-modal/smart-price.learn-more-modal';
import { IHealthPlanScreenContent } from './health-plan.screen.content';
import { healthPlanScreenStyles } from './health-plan.screen.styles';

export interface IHealthPlanScreenRouteProps {
  profile: IPrimaryProfile;
}

export const HealthPlanScreen = (): ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const {
    params: { profile },
  } = useRoute<HealthPlanScreenRouteProp>();

  const { content, isContentLoading } = useContent<IHealthPlanScreenContent>(
    CmsGroupKey.healthPlanScreen,
    2
  );

  const [cardType, setCardType] = useState<RxCardType>('pbm');
  const [
    isSmartPriceLearnMoreModalShowing,
    setIsSmartPriceLearnMoreModalShowing,
  ] = useState(false);
  const [
    isBenefitPlanLearnMoreModalShowing,
    setIsBenefitPlanLearnMoreModalShowing,
  ] = useState(false);

  const onSelect = (cardType: RxCardType) => {
    setCardType(cardType);
  };

  const cards: RxCardType[] = ['pbm', 'smartPrice'];

  const onSmartPriceLearnMorePress = () => {
    setIsSmartPriceLearnMoreModalShowing(true);
  };

  const smartPriceSection = (
    <SmartPriceSection
      onLearnMorePress={onSmartPriceLearnMorePress}
      viewStyle={healthPlanScreenStyles.sectionViewStyle}
    />
  );

  const onBenefitPlanLearnMorePress = () => {
    setIsBenefitPlanLearnMoreModalShowing(true);
  };

  const pbmSection = (
    <BenefitPlanSection
      viewStyle={healthPlanScreenStyles.sectionViewStyle}
      onLearnMorePress={onBenefitPlanLearnMorePress}
    />
  );

  const cardTypeSection = () => {
    switch (cardType) {
      case 'smartPrice':
        return smartPriceSection;
      case 'pbm':
        return pbmSection;
    }
  };

  const onChevronCardPress = () => {
    navigation.navigate('PrescriptionBenefitPlan');
  };

  const viewPlanAccumulatorsSection =
    cardType === 'pbm' ? (
      <View>
        <ChevronCard
          onPress={onChevronCardPress}
          viewStyle={
            healthPlanScreenStyles.viewPlanAccumulatorsSectionViewStyle
          }
        >
          <BaseText
            style={healthPlanScreenStyles.viewPlanAccumulatorsTextStyle}
          >
            {content.viewPlanAccumulators}
          </BaseText>
        </ChevronCard>
        <LineSeparator
          viewStyle={healthPlanScreenStyles.lineSeparatorTwoViewStyle}
        />
      </View>
    ) : null;

  const body = (
    <View>
      <Heading
        level={1}
        isSkeleton={isContentLoading}
        textStyle={healthPlanScreenStyles.headingTextStyle}
      >
        {content.heading}
      </Heading>
      <RxCardCarousel
        profile={profile}
        cards={cards}
        onSelect={onSelect}
        viewStyle={healthPlanScreenStyles.rxCardCarouselViewStyle}
      />
      {cardTypeSection()}
      <LineSeparator
        viewStyle={healthPlanScreenStyles.lineSeparatorOneViewStyle}
      />
      {viewPlanAccumulatorsSection}
      <PrescribersSection
        viewStyle={healthPlanScreenStyles.prescribersSectionViewStyle}
      />
      <PharmaciesSection
        viewStyle={healthPlanScreenStyles.pharmaciesSectionViewStyle}
      />
      <LineSeparator
        viewStyle={healthPlanScreenStyles.lineSeparatorThreeViewStyle}
      />
      <CustomerSupport
        viewStyle={healthPlanScreenStyles.customerSupportViewStyle}
      />
    </View>
  );

  const onSmartPriceClosePress = () => {
    setIsSmartPriceLearnMoreModalShowing(false);
  };

  const smartPriceLearnMoreModal = (
    <SmartPriceLearnMoreModal
      onClosePress={onSmartPriceClosePress}
      showModal={isSmartPriceLearnMoreModalShowing}
      key='smart-price-learn-more-modal'
    />
  );

  const onBenefitPlanClosePress = () => {
    setIsBenefitPlanLearnMoreModalShowing(false);
  };

  const benefitPlanLearnMoreModal = (
    <BenefitPlanLearnMoreModal
      onClosePress={onBenefitPlanClosePress}
      showModal={isBenefitPlanLearnMoreModalShowing}
      key='benefit-plan-learn-more-modal'
    />
  );

  return (
    <BasicPageConnected
      body={body}
      navigateBack={navigation.goBack}
      showProfileAvatar={true}
      modals={[smartPriceLearnMoreModal, benefitPlanLearnMoreModal]}
    />
  );
};
