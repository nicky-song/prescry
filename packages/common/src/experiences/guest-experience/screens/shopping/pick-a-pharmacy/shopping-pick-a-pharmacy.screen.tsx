// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, useEffect } from 'react';
import { useShoppingContext } from '../../../context-providers/shopping/use-shopping-context.hook';
import {
  getPrescriptionInfoAsyncAction,
  IGetPrescriptionInfoAsyncActionArgs,
} from '../../../state/shopping/async-actions/get-prescription-info.async-action';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import {
  getPrescriptionPharmaciesAsyncAction,
  IGetPrescriptionPharmaciesAsyncActionArgs,
} from '../../../state/shopping/async-actions/get-prescription-pharmacies.async-action';
import { orderPreviewNavigateDispatch } from '../../../store/navigation/dispatch/shopping/order-preview-navigate.dispatch';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { getProfileByMemberRxId } from '../../../../../utils/profile.helper';
import {
  PickAPharmacy,
  IPickAPharmacyProps,
  IPickAPharmacyOnPress,
  IPickAPharmacyPrescribedMedicationProps,
} from '../../../pick-a-pharmacy/pick-a-pharmacy';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ShoppingStackNavigationProp,
  ShoppingPickAPharmacyRouteProp,
} from '../../../navigation/stack-navigators/shopping/shopping.stack-navigator';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { setPrescriptionPharmaciesDispatch } from '../../../state/shopping/dispatch/set-prescription-pharmacies.dispatch';
import { IPharmacyDrugPriceResponse } from '../../../../../models/api-response/pharmacy-price-search.response';
import { fetchUserPosition } from '../../../state/session/utils/fetch-user-position';
import { setLocationDeniedErrorMessageDispatch } from '../../../state/shopping/dispatch/set-location-denied-error-message.dispatch';
import { translateCoordinateHelper } from '../../../../../utils/translate-coordinate.helper';
import {
  getUserLocationAsyncAction,
  IGetUserLocationAsyncActionArgs,
} from '../../../state/session/async-actions/get-user-location.async-action';
import { confirmationNavigateDispatch } from '../../../store/navigation/dispatch/shopping/confirmation-navigate.dispatch';
import { formatUserLocation } from '../../../../../utils/format-address.helper';
import { useUrl } from '../../../../../hooks/use-url';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';
import { IAlternativeMedication } from '../../../../../models/alternative-medication';
import {
  getAlternativeDrugPriceAsyncAction,
  IGetAlternativeDrugPriceAsyncActionArgs,
} from '../../../state/shopping/async-actions/get-alternative-drug-price-response.async-action';
import { PricingOptionNavigateDispatch } from '../../../store/navigation/dispatch/shopping/pricing-option-navigate.dispatch';
import { PricingOption } from '../../../../../models/pricing-option';
import {
  getPricingOptionType,
  shouldNavigateToPricingOption,
} from '../../../../../utils/pricing-option.helper';
import { getDependentWithMemberId } from '../prescription-patient/get-dependent-with-member-id';

export interface IShoppingPickAPharmacyScreenRouteProps {
  prescriptionId: string;
  navigateToHome?: boolean;
  reloadPrescription?: boolean;
  blockchain?: boolean;
}

export const ShoppingPickAPharmacyScreen = (): ReactElement => {
  const navigation = useNavigation<ShoppingStackNavigationProp>();

  const { params } = useRoute<ShoppingPickAPharmacyRouteProp>();
  const { prescriptionId, navigateToHome, reloadPrescription, blockchain } =
    params;

  const prescriptionPath = blockchain ? 'bc' : 'prescription';

  useUrl(`/cabinet/${prescriptionPath}/${prescriptionId}`);

  const {
    sessionState: {
      pharmacyFilterPreferences,
      userLocation,
      isGettingUserLocation,
      isUnauthExperience,
    },
    sessionDispatch,
  } = useSessionContext();

  const {
    shoppingState: {
      prescriptionInfo,
      bestPricePharmacy,
      prescriptionPharmacies,
      noPharmaciesFound,
      isGettingPharmacies,
      errorMessage,
      alternativeDrugPrice,
      hasInsurance,
    },
    shoppingDispatch,
  } = useShoppingContext();

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const {
    membershipState: { profileList, patientDependents },
  } = useMembershipContext();

  const prescriptionPatient = getDependentWithMemberId(
    patientDependents,
    prescriptionInfo?.primaryMemberRxId
  );

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

  const getLowestPriceAlternative = (alternative: IAlternativeMedication[]) => {
    const prices = alternative.map((alternative) =>
      alternative.drugPricing ? alternative.drugPricing.memberPays : Infinity
    );

    return Math.min(...prices);
  };

  const savingsAmount =
    alternativeDrugPrice?.alternativeMedicationList && bestPricePharmacy?.price
      ? getLowestPriceAlternative(
          alternativeDrugPrice?.alternativeMedicationList
        ) - bestPricePharmacy.price?.memberPays
      : undefined;
  const isOrderBooked = !!prescriptionInfo?.pharmacy;

  useEffect(() => {
    if (
      reloadPrescription ||
      prescriptionId !== prescriptionInfo?.prescriptionId
    ) {
      const userExists = !isUnauthExperience;
      const handleGetPrescriptionInfo = async () => {
        const args: IGetPrescriptionInfoAsyncActionArgs = {
          prescriptionId,
          reduxDispatch,
          reduxGetState,
          shoppingDispatch,
          navigation,
          userExists,
          blockchain,
        };
        await getPrescriptionInfoAsyncAction(args);
      };

      handleGetPrescriptionInfo();
    }
  }, []);

  useEffect(() => {
    if (prescriptionInfo?.prescriptionId === prescriptionId && isOrderBooked) {
      confirmationNavigateDispatch(navigation, {
        canGoBack: !navigateToHome,
      });
    }
    if (
      !userLocation ||
      userLocation?.latitude === undefined ||
      userLocation?.longitude === undefined
    ) {
      if (prescriptionInfo?.zipCode) {
        void handleGetGeolocationData({
          zipCode: prescriptionInfo?.zipCode,
        });
      } else {
        void handleFetchUserPosition();
      }
    }
  }, [prescriptionInfo]);

  useEffect(() => {
    if (navigation.isFocused()) {
      void getPrescriptionPharmacies();
    }
  }, [pharmacyFilterPreferences, userLocation, prescriptionInfo]);

  useEffect(() => {
    if (bestPricePharmacy && prescriptionInfo && !alternativeDrugPrice) {
      const handleAlernativeDrugPriceAsyncAction = async () => {
        const alternativeDrugPriceArgs: IGetAlternativeDrugPriceAsyncActionArgs =
          {
            ndc: prescriptionInfo?.ndc,
            ncpdp: bestPricePharmacy?.pharmacy.ncpdp,
            isUnauthExperience,
            navigation,
            shoppingDispatch,
            reduxDispatch,
            reduxGetState,
          };

        await getAlternativeDrugPriceAsyncAction(alternativeDrugPriceArgs);
      };

      handleAlernativeDrugPriceAsyncAction();
    }
  }, [bestPricePharmacy, prescriptionInfo]);

  const handleGetGeolocationData = async (location?: ILocationCoordinates) => {
    try {
      const args: IGetUserLocationAsyncActionArgs = {
        location,
        reduxDispatch,
        reduxGetState,
        sessionDispatch,
        navigation,
      };
      await getUserLocationAsyncAction(args);
    } catch (error) {
      const geolocationDataError = error as Error;
      setLocationDeniedErrorMessageDispatch(
        shoppingDispatch,
        geolocationDataError.message
      );
    }
  };
  const handleUserPositionChange = async (
    userDeviceLocation: ILocationCoordinates,
    errorMessage: string
  ) => {
    setLocationDeniedErrorMessageDispatch(shoppingDispatch, errorMessage);
    if (
      userDeviceLocation.latitude !== undefined &&
      userDeviceLocation.longitude !== undefined
    ) {
      const latitude = translateCoordinateHelper(userDeviceLocation.latitude);
      const longitude = translateCoordinateHelper(userDeviceLocation.longitude);

      await handleGetGeolocationData({
        latitude,
        longitude,
      });
      guestExperienceCustomEventLogger(
        CustomAppInsightEvents.PRESCRIPTION_USER_LOCATION_SERVICE_USED,
        {
          latitude,
          longitude,
        }
      );
    }
  };

  const handleFetchUserPosition = () => {
    void fetchUserPosition(handleUserPositionChange, sessionDispatch);
  };

  const getPrescriptionPharmacies = async (
    sort: string = pharmacyFilterPreferences.sortBy,
    distance: number = pharmacyFilterPreferences.distance
  ) => {
    setPrescriptionPharmaciesDispatch(
      shoppingDispatch,
      { pharmacyPrices: [] } as IPharmacyDrugPriceResponse,
      prescriptionId
    );
    if (isOrderBooked || !prescriptionInfo) {
      return;
    }
    if (
      userLocation?.latitude !== undefined &&
      userLocation?.longitude !== undefined
    ) {
      const args: IGetPrescriptionPharmaciesAsyncActionArgs = {
        location: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        sortBy: sort,
        prescriptionId,
        distance,
        reduxDispatch,
        reduxGetState,
        shoppingDispatch,
        navigation,
        blockchain,
      };
      await getPrescriptionPharmaciesAsyncAction(args);
    }
  };

  const hasStickyView =
    prescriptionInfo &&
    prescriptionInfo.prescriptionId === prescriptionId &&
    !isOrderBooked
      ? true
      : false;

  const onPharmacyPress = (args: IPickAPharmacyOnPress) => {
    const { ncpdp, isBestValue, pharmacyDrugPrice } = args;
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.PRESCRIPTION_USER_SELECTS_PHARMACY,
      {
        prescriptionId,
        ncpdp,
        isBestValue,
      }
    );

    if (shouldNavigateToPricingOption(pharmacyDrugPrice.dualPrice))
      PricingOptionNavigateDispatch(navigation, {
        pharmacyNcpdp: ncpdp,
      });
    else {
      const pricingOption: PricingOption = getPricingOptionType(
        pharmacyDrugPrice.dualPrice
      );

      orderPreviewNavigateDispatch(navigation, {
        pharmacyNcpdp: ncpdp,
        isSieMemberPrescription,
        pricingOption,
      });
    }
  };

  const navigationHome = () => {
    navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
  };

  const navigateBack = () => {
    navigateToHome ? navigationHome() : navigation.goBack();
  };

  const navigateToPointOfCare = () => {
    navigation.navigate('RootStack', {
      screen: 'ClaimAlertStack',
      params: {
        screen: 'RecommendedAlternatives',
        params: { isShopping: true },
      },
    });
  };

  const pharmacyLocation = formatUserLocation(userLocation);
  const canShowContent =
    prescriptionInfo &&
    !isOrderBooked &&
    prescriptionInfo?.prescriptionId === prescriptionId;

  const getDrugData = () => {
    if (!prescriptionInfo) {
      return undefined;
    }
    return {
      drugDetails: {
        quantity: prescriptionInfo.quantity,
        formCode: prescriptionInfo.form,
        strength: prescriptionInfo.strength,
        refills: prescriptionInfo.refills,
        unit: prescriptionInfo.unit,
      },
      drugName: prescriptionInfo.drugName,
    };
  };

  const prescribedMedicationProps:
    | IPickAPharmacyPrescribedMedicationProps
    | undefined = getDrugData();

  const props: IPickAPharmacyProps = {
    showNoPharmaciesFoundErrorMessage: noPharmaciesFound ?? false,
    errorMessage,
    pharmacyLocation,
    pharmacies: prescriptionPharmacies,
    bestPricePharmacy,
    memberProfileType: prescriptionRxGroupType,
    onPharmacyPress,
    showProfileAvatar: true,
    navigateBack,
    isGettingPharmacies,
    canShowContent,
    hasStickyView,
    prescribedMedicationProps,
    isGettingUserLocation,
    logoClickAction: LogoClickActionEnum.CONFIRM,
    navigateToPointOfCare,
    savingsAmount,
    hasInsurance,
    prescriptionPatient,
  };

  return <PickAPharmacy {...props} />;
};
