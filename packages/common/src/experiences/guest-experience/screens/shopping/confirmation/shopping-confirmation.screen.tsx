// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { IPrescriberDetailsProps } from '../../../../../components/member/prescriber-details/prescriber-details';
import { ICouponDetails } from '../../../../../models/coupon-details/coupon-details';
import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import { IPrescriptionInfo } from '../../../../../models/prescription-info';
import { IDrugDetails } from '../../../../../utils/formatters/drug.formatter';
import { getProfileByMemberRxId } from '../../../../../utils/profile.helper';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { useShoppingContext } from '../../../context-providers/shopping/use-shopping-context.hook';
import { OrderConfirmationScreen } from '../../order-confirmation-screen/order-confirmation.screen';
import { IOrderSectionProps } from '../../order-confirmation-screen/sections/order/order.section';
import { ISummarySectionProps } from '../../order-confirmation-screen/sections/summary/summary.section';
import {
  ShoppingConfirmationNavigationProp,
  ShoppingConfirmationRouteProp,
} from '../../../navigation/stack-navigators/shopping/shopping.stack-navigator';
import { useNavigation, useRoute } from '@react-navigation/native';
import { findPharmacy } from '../../../../../utils/pharmacies/find-pharmacy.helper';
import { RxGroupTypesEnum } from '../../../../../models/member-profile/member-profile-info';
import { useFeaturesContext } from '../../../context-providers/features/use-features-context.hook';
import { PricingOption } from '../../../../../models/pricing-option';

export interface IShoppingConfirmationScreenRouteProps {
  pharmacyNcpdp?: string;
  pricingOption?: PricingOption;
  canGoBack?: boolean;
}

export const ShoppingConfirmationScreen = (): ReactElement => {
  const navigation = useNavigation<ShoppingConfirmationNavigationProp>();

  const {
    params: { pharmacyNcpdp, pricingOption, canGoBack },
  } = useRoute<ShoppingConfirmationRouteProp>();

  const {
    shoppingState: {
      prescriptionPharmacies,
      bestPricePharmacy,
      prescriptionInfo,
      hasInsurance,
    },
  } = useShoppingContext();

  const {
    membershipState: { profileList },
  } = useMembershipContext();

  const {
    featuresState: { usegrouptypesie, usegrouptypecash },
  } = useFeaturesContext();

  const prescriptionRxGroupType =
    getProfileByMemberRxId(profileList, prescriptionInfo?.primaryMemberRxId)
      ?.rxGroupType || RxGroupTypesEnum.CASH;
  const isSieMemberPrescription =
    (prescriptionRxGroupType === RxGroupTypesEnum.SIE || !!usegrouptypesie) &&
    !usegrouptypecash;

  const pharmacyDrugPrice = pharmacyNcpdp
    ? bestPricePharmacy
      ? findPharmacy(
          [...prescriptionPharmacies, bestPricePharmacy],
          pharmacyNcpdp
        )
      : findPharmacy(prescriptionPharmacies, pharmacyNcpdp)
    : buildPriceFromOrder(prescriptionInfo);

  const planPays = pharmacyDrugPrice?.price?.planPays;
  const memberPays = pharmacyDrugPrice?.price?.memberPays;

  const buildOrderSectionProps = (
    prescriptionInfo?: IPrescriptionInfo
  ): IOrderSectionProps | undefined => {
    if (!prescriptionInfo) {
      return undefined;
    }

    const drugDetails: IDrugDetails = {
      strength: prescriptionInfo.strength,
      unit: prescriptionInfo.unit,
      formCode: prescriptionInfo.form ?? '',
      quantity: prescriptionInfo.quantity ?? 0,
    };

    return {
      drugDetails,
      drugName: prescriptionInfo.drugName ?? '',
      showPlanPays: isSieMemberPrescription,
      planPays,
      memberPays,
      hasAssistanceProgram:
        pharmacyDrugPrice?.pharmacy.ncpdp ===
        pharmacyDrugPrice?.coupon?.featuredPharmacy,
      couponDetails: pharmacyDrugPrice?.coupon as ICouponDetails,
      hasInsurance,
      pricingOption,
    };
  };

  const summarySectionProps: ISummarySectionProps = {
    orderNumber: prescriptionInfo?.orderNumber,
    orderDate: prescriptionInfo?.orderDate,
  };

  const prescriberSectionProps: IPrescriberDetailsProps = {
    doctorContactNumber: prescriptionInfo?.practitioner?.phoneNumber ?? '',
    doctorName: prescriptionInfo?.practitioner?.name ?? '',
  };

  const isNewOrder = !!pharmacyNcpdp;

  return (
    <OrderConfirmationScreen
      pharmacyDrugPrice={pharmacyDrugPrice}
      orderSectionProps={buildOrderSectionProps(prescriptionInfo)}
      navigation={navigation}
      summarySectionProps={summarySectionProps}
      prescriberSectionContent={prescriberSectionProps}
      isNewOrder={isNewOrder}
      canGoBack={canGoBack}
    />
  );
};

const buildPriceFromOrder = (
  prescriptionInfo?: IPrescriptionInfo
): IPharmacyDrugPrice | undefined =>
  prescriptionInfo
    ? {
        pharmacy: {
          name: prescriptionInfo.pharmacy?.name ?? '',
          address: {
            lineOne: prescriptionInfo.pharmacy?.address.lineOne ?? '',
            lineTwo: prescriptionInfo.pharmacy?.address.lineTwo,
            city: prescriptionInfo.pharmacy?.address.city ?? '',
            state: prescriptionInfo.pharmacy?.address.state ?? '',
            zip: prescriptionInfo.pharmacy?.address.zip ?? '',
          },
          phoneNumber: prescriptionInfo.pharmacy?.phoneNumber,
          hours: prescriptionInfo.pharmacy?.hours ?? [],
          twentyFourHours: !!prescriptionInfo.pharmacy?.twentyFourHours,
          ncpdp: prescriptionInfo.pharmacy?.ncpdp ?? '',
          isMailOrderOnly: !!prescriptionInfo.pharmacy?.isMailOrderOnly,
        },
        price: prescriptionInfo.price,
        coupon: prescriptionInfo.coupon,
      }
    : undefined;
