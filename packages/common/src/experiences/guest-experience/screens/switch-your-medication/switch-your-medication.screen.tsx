// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { SwitchingMedicationContainer } from '../../../../components/containers/switching-medication/switching-medication.container';
import { CustomerSupport } from '../../../../components/member/customer-support/customer-support';
import { Heading } from '../../../../components/member/heading/heading';
import { IPrescribedMedicationProps } from '../../../../components/member/prescribed-medication/prescribed-medication';
import { IPrescriptionDetailsProps } from '../../../../components/member/prescription-details/prescription-details';
import { IPrescriptionDetails } from '../../../../models/prescription-details';
import { IDrugPricing } from '../../../../models/drug-pricing';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { IDrugDetails } from '../../../../utils/formatters/drug.formatter';
import { callPhoneNumber } from '../../../../utils/link.helper';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import {
  SwitchYourMedicationNavigationProp,
  SwitchYourMedicationRouteProp,
} from '../../navigation/stack-navigators/claim-alert/claim-alert.stack-navigator';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { ISwitchYourMedicationScreenContent } from './switch-your-medication.screen.content';
import { switchYourMedicationScreenStyles } from './switch-your-medication.screen.styles';
import { View } from 'react-native';
import { usePbmProfileCobrandingContent } from '../../context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content';

export interface ISwitchYourMedicationRouteProps {
  drugName: string;
  drugDetails: IDrugDetails;
  price: number;
  planPrice: number;
  memberSaves: number;
  planSaves: number;
  prescriptionDetailsList: IPrescriptionDetails[];
  drugPricing: IDrugPricing;
}

export const SwitchYourMedicationScreen = (): ReactElement => {
  const navigation = useNavigation<SwitchYourMedicationNavigationProp>();

  const { content, isContentLoading } =
    useContent<ISwitchYourMedicationScreenContent>(
      CmsGroupKey.switchYourMedication,
      2
    );

  const {
    params: {
      drugName,
      drugDetails,
      price,
      planPrice,
      memberSaves,
      planSaves,
      prescriptionDetailsList,
      drugPricing,
    },
  } = useRoute<SwitchYourMedicationRouteProp>();

  const cobrandingContent = usePbmProfileCobrandingContent();

  const { getState: reduxGetState } = useReduxContext();

  const prescribedMedicationProps: IPrescribedMedicationProps = {
    drugName,
    drugDetails,
    price,
    planPrice,
  };

  const isCombination = prescriptionDetailsList.length > 1;

  const prescriptionDetailsProps: IPrescriptionDetailsProps = {
    title: isCombination ? content.combinationTitle : content.singleTitle,
    memberSaves,
    planSaves,
    prescriptionDetailsList,
    drugPricing,
    isShowingPriceDetails: isCombination,
  };

  const phoneNumber = '+17777777777';

  const onCallButtonPress = () => {
    callPhoneNumber(phoneNumber);
  };

  const onActionButtonPress = () => {
    navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
  };

  const providerName = 'John Smith'; // TODO: use actual providerName

  const body = (
    <BodyContentContainer
      title={content.title}
      testID='switchYourMedicationScreen'
      isSkeleton={isContentLoading}
    >
      <SwitchingMedicationContainer
        prescribedMedicationProps={prescribedMedicationProps}
        prescriptionDetailsProps={prescriptionDetailsProps}
        viewStyle={
          switchYourMedicationScreenStyles.switchYourMedicationContainerViewStyle
        }
      />
      <BaseText
        style={switchYourMedicationScreenStyles.descriptionTextStyle}
        isSkeleton={isContentLoading}
      >
        {cobrandingContent?.switchYourMedsDescription ?? content.description}
      </BaseText>
      {cobrandingContent?.switchYourMedsProviderName ? (
        <View style={switchYourMedicationScreenStyles.headingViewStyle}>
          <Heading
            level={4}
            translateContent={false}
          >
            {cobrandingContent?.switchYourMedsProviderName &&
            cobrandingContent.switchYourMedsProviderName.toLowerCase() !==
              'provider'
              ? cobrandingContent?.switchYourMedsProviderName
              : providerName}
          </Heading>
        </View>
      ) : null}
      <BaseButton
        onPress={onCallButtonPress}
        isSkeleton={isContentLoading}
        viewStyle={switchYourMedicationScreenStyles.callButtonViewStyle}
      >
        {cobrandingContent?.switchYourMedsCallButtonLabel ??
          content.callButtonLabel}
      </BaseButton>
      <BaseButton
        viewStyle={switchYourMedicationScreenStyles.actionButtonViewStyle}
        textStyle={switchYourMedicationScreenStyles.actionButtonTextStyle}
        isSkeleton={isContentLoading}
        onPress={onActionButtonPress}
      >
        {content.actionButtonLabel}
      </BaseButton>
      <CustomerSupport
        viewStyle={switchYourMedicationScreenStyles.customerSupportViewStyle}
      />
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      body={body}
      navigateBack={navigation.goBack}
      showProfileAvatar={true}
      translateContent={true}
    />
  );
};
