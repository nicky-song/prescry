// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement, useEffect, useState } from 'react';

import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { IPharmacy } from '../../../../../models/pharmacy';
import { useShoppingContext } from '../../../context-providers/shopping/use-shopping-context.hook';
import { pricingOptionsScreenStyles } from './pricing-options.screen.styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ShoppingPricingOptionsRouteProp,
  ShoppingStackNavigationProp,
} from '../../../navigation/stack-navigators/shopping/shopping.stack-navigator';
import { findPharmacy } from '../../../../../utils/pharmacies/find-pharmacy.helper';
import { ErrorConstants } from '../../../../../theming/constants';
import { PricingOptionContextContainer } from '../../../../../components/containers/pricing-option-context/pricing-option-context.container';
import { Heading } from '../../../../../components/member/heading/heading';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { View } from 'react-native';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { IPricingOptionContent } from '../../../../../models/cms-content/pricing-options.content';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { LineSeparator } from '../../../../../components/member/line-separator/line-separator';
import {
  IPricingOptionSelectorOption,
  PricingOptionGroup,
} from '../../../../../components/buttons/pricing-option-group/pricing-option-group';
import { MoneyFormatter } from '../../../../../utils/formatters/money-formatter';
import { PricingOption } from '../../../../../models/pricing-option';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { getProfileByMemberRxId } from '../../../../../utils/profile.helper';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { orderPreviewNavigateDispatch } from '../../../store/navigation/dispatch/shopping/order-preview-navigate.dispatch';
import {
  getOptions,
  lowestPriceOption,
} from '../../../../../utils/pricing-option.helper';
import { StringFormatter } from '../../../../../utils/formatters/string.formatter';

export interface IPricingOptionsScreenRouteProps {
  pharmacyNcpdp: string;
}

export const PricingOptionsScreen = (): ReactElement => {
  const navigation = useNavigation<ShoppingStackNavigationProp>();

  const {
    params: { pharmacyNcpdp },
  } = useRoute<ShoppingPricingOptionsRouteProp>();

  const [selectedOption, setSelectedOption] =
    useState<IPricingOptionSelectorOption | undefined>(undefined);

  const {
    content: pricingOptionsContent,
    isContentLoading: pricingOptionsIsContentLoading,
  } = useContent<IPricingOptionContent>(CmsGroupKey.pricingOptions, 2);

  const styles = pricingOptionsScreenStyles;
  const formattedMemberPays = MoneyFormatter.format(selectedOption?.memberPays);
  const parameterMap = new Map<string, string>([
    ['memberPays', formattedMemberPays],
  ]);

  const footerButtonLabel = StringFormatter.format(
    pricingOptionsContent.pricingOptionsFooterLabel,
    parameterMap
  );

  const {
    shoppingState: {
      prescriptionInfo,
      bestPricePharmacy,
      prescriptionPharmacies,
    },
  } = useShoppingContext();

  const {
    membershipState: { profileList },
  } = useMembershipContext();

  const { getState: reduxGetState } = useReduxContext();

  if (!prescriptionInfo) {
    throw new Error(ErrorConstants.errorForGettingPrescriptionInfo);
  }

  let prescriptionRxGroupType =
    getProfileByMemberRxId(profileList, prescriptionInfo?.primaryMemberRxId)
      ?.rxGroupType || 'CASH';
  let isSieMemberPrescription = prescriptionRxGroupType === 'SIE';

  const features = reduxGetState().features;
  if (features.usegrouptypesie) {
    isSieMemberPrescription = true;
    prescriptionRxGroupType = 'SIE';
  } else if (features.usegrouptypecash) {
    isSieMemberPrescription = false;
    prescriptionRxGroupType = 'CASH';
  }

  const pharmacyDrugPrice = bestPricePharmacy
    ? findPharmacy(
        [...prescriptionPharmacies, bestPricePharmacy],
        pharmacyNcpdp
      )
    : findPharmacy(prescriptionPharmacies, pharmacyNcpdp);

  const pricingOptionData = getOptions(pharmacyDrugPrice?.dualPrice);

  useEffect(() => {
    if (pricingOptionData) {
      const lowestPrice = lowestPriceOption(pricingOptionData);
      setSelectedOption(lowestPrice);
    }
  }, []);

  const pharmacy: IPharmacy = pharmacyDrugPrice?.pharmacy ?? {
    name: '?',
    phoneNumber: '',
    hours: [],
    ncpdp: '',
    address: {
      city: '',
      lineOne: '',
      state: '',
      zip: '',
    },
    twentyFourHours: false,
    isMailOrderOnly: false,
    inNetwork: false,
  };
  const { name: pharmacyName, address: pharmacyAddress, brand } = pharmacy;

  const pharmacyBrandOrName = brand ?? pharmacyName;
  const { lineOne, city, state, zip: zipCode } = pharmacyAddress;
  const { drugName, form, quantity, refills, unit, strength } =
    prescriptionInfo;

  const onSelectOption = (pricingOption: PricingOption): void => {
    if (pricingOption === selectedOption?.pricingOption) return;
    const optionSelected = pricingOptionData.find(
      (option: IPricingOptionSelectorOption) =>
        option.pricingOption === pricingOption
    );
    setSelectedOption(optionSelected);
  };

  const onPressPreviewOrder = (): void => {
    if (!selectedOption?.pricingOption) return;
    orderPreviewNavigateDispatch(navigation, {
      pharmacyNcpdp,
      isSieMemberPrescription,
      pricingOption: selectedOption?.pricingOption,
    });
  };

  const pricingOptionContainer = (
    <PricingOptionContextContainer
      drugName={drugName}
      drugDetails={{
        strength,
        unit,
        formCode: form,
        quantity,
        supply: refills,
      }}
      pharmacyInfo={{
        name: pharmacyBrandOrName,
        address: {
          city,
          lineOne,
          zip: zipCode,
          state,
        },
      }}
    />
  );

  const body = (
    <BodyContentContainer testID='pricingOptionScreen'>
      {pricingOptionContainer}
      <LineSeparator viewStyle={styles.separatorViewStyle} />
      <View style={styles.selectYourPricingOptionViewStyle}>
        <Heading
          level={2}
          isSkeleton={pricingOptionsIsContentLoading}
          skeletonWidth='long'
        >
          {pricingOptionsContent.pricingOptionsTitle}
        </Heading>
      </View>
      <BaseText
        isSkeleton={pricingOptionsIsContentLoading}
        skeletonWidth='medium'
      >
        {pricingOptionsContent.pricingOptionsDescription}
      </BaseText>
      <PricingOptionGroup
        options={pricingOptionData}
        viewStyle={styles.pricingOptionGroupViewStyle}
        selected={selectedOption?.pricingOption}
        onSelect={onSelectOption}
      />
    </BodyContentContainer>
  );

  const footer = (
    <BaseButton
      onPress={onPressPreviewOrder}
      isSkeleton={pricingOptionsIsContentLoading}
      testID='pricingOptionsScreenFooterButton'
    >
      {footerButtonLabel}
    </BaseButton>
  );

  return (
    <BasicPageConnected
      body={body}
      navigateBack={navigation.goBack}
      showProfileAvatar={true}
      translateContent={true}
      footer={footer}
    />
  );
};
