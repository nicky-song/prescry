// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import { IDrugDetails } from '../../../../../utils/formatters/drug.formatter';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import { prescriptionTransferConfirmationScreenContent } from './prescription-transfer-confirmation.screen.content';
import { OrderConfirmationScreen } from '../../order-confirmation-screen/order-confirmation.screen';
import { IOrderSectionProps } from '../../order-confirmation-screen/sections/order/order.section';
import { getProfilesByGroup } from '../../../../../utils/profile.helper';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { ICouponDetails } from '../../../../../models/coupon-details/coupon-details';
import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import {
  PrescriptionTransferNavigationProp,
  PrescriptionTransferRouteProp,
} from '../../../navigation/stack-navigators/drug-search/drug-search.stack-navigator';
import { useNavigation, useRoute } from '@react-navigation/native';
import { assertIsDefined } from '../../../../../assertions/assert-is-defined';
import { PricingOption } from '../../../../../models/pricing-option';

export interface IPrescriptionTransferConfirmationRouteProps {
  pricingOption?: PricingOption;
}

export const PrescriptionTransferConfirmationScreen = (): ReactElement => {
  const navigation = useNavigation<PrescriptionTransferNavigationProp>();
  const { params } = useRoute<PrescriptionTransferRouteProp>();
  const { pricingOption } = params;
  const content = prescriptionTransferConfirmationScreenContent;

  const {
    drugSearchState: { selectedDrug, selectedConfiguration, selectedPharmacy },
  } = useDrugSearchContext();

  const { getState: reduxGetState } = useReduxContext();
  const {
    membershipState: { profileList },
  } = useMembershipContext();
  const sieMember = getProfilesByGroup(profileList, 'SIE');

  let isSieMember = sieMember?.length ? true : false;

  const features = reduxGetState().features;
  if (features.usegrouptypesie) {
    isSieMember = true;
  } else if (features.usegrouptypecash) {
    isSieMember = false;
  }

  assertIsDefined(selectedConfiguration);
  const { ndc, quantity, supply } = selectedConfiguration;

  assertIsDefined(selectedDrug);
  const drugVariant = drugSearchResultHelper.getVariantByNdc(ndc, selectedDrug);

  assertIsDefined(drugVariant);
  const { formCode, strength, strengthUnit: unit } = drugVariant;

  const drugDetails: IDrugDetails = {
    formCode,
    quantity,
    strength,
    unit,
    supply,
  };

  const couponDetails = selectedPharmacy?.coupon;

  const hasAssistanceProgram =
    selectedPharmacy?.pharmacy.ncpdp ===
    selectedPharmacy?.coupon?.featuredPharmacy;

  const orderSectionProps: IOrderSectionProps = {
    drugDetails,
    drugName: selectedDrug?.name ?? '',
    showPlanPays: isSieMember,
    memberPays: selectedPharmacy?.price?.memberPays,
    planPays: selectedPharmacy?.price?.planPays,
    couponDetails: couponDetails as ICouponDetails,
    hasAssistanceProgram,
    pricingOption,
  };

  return (
    <OrderConfirmationScreen
      pharmacyDrugPrice={selectedPharmacy as IPharmacyDrugPrice}
      whatIsNextSectionContent={content.confirmationText}
      navigation={navigation}
      orderSectionProps={orderSectionProps}
      isNewOrder={true}
    />
  );
};
