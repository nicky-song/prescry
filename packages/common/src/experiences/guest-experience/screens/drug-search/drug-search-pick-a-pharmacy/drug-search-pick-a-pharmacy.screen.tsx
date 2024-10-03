// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, useEffect, useState } from 'react';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import {
  getDrugPriceAsyncAction,
  IGetDrugPriceAsyncActionArgs,
} from '../../../state/drug-search/async-actions/get-drug-price.async-action';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import { setSelectedPharmacyDispatch } from '../../../state/drug-search/dispatch/set-selected-pharmacy.dispatch';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { getProfilesByGroup } from '../../../../../utils/profile.helper';
import { translateCoordinateHelper } from '../../../../../utils/translate-coordinate.helper';
import {
  PickAPharmacy,
  IPickAPharmacyPrescriptionTitleProps,
  IPickAPharmacyProps,
  IPickAPharmacyOnPress,
} from '../../../pick-a-pharmacy/pick-a-pharmacy';
import { RxGroupTypesEnum } from '../../../../../models/member-profile/member-profile-info';
import { getDrugInformation } from '../../../api/api-v1.get-drug-information';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { DrugSearchStackNavigationProp } from '../../../navigation/stack-navigators/drug-search/drug-search.stack-navigator';
import { useNavigation } from '@react-navigation/native';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { fetchUserPosition } from '../../../state/session/utils/fetch-user-position';
import { setLocationDeniedErrorMessageDispatch } from '../../../state/drug-search/dispatch/set-location-denied-error-message.dispatch';
import {
  getUserLocationAsyncAction,
  IGetUserLocationAsyncActionArgs,
} from '../../../state/session/async-actions/get-user-location.async-action';
import { formatUserLocation } from '../../../../../utils/format-address.helper';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';

export const DrugSearchPickAPharmacyScreen = (): ReactElement => {
  const navigation = useNavigation<DrugSearchStackNavigationProp>();

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const {
    drugSearchState: {
      bestPricePharmacy,
      pharmacies,
      selectedDrug,
      selectedConfiguration,
      errorMessage,
      noPharmaciesFound,
      isGettingPharmacies,
    },
    drugSearchDispatch,
  } = useDrugSearchContext();

  const {
    sessionState: {
      isUnauthExperience,
      pharmacyFilterPreferences,
      userLocation,
      isGettingUserLocation,
    },
    sessionDispatch,
  } = useSessionContext();

  const {
    membershipState: { profileList },
  } = useMembershipContext();

  const sieMember = !isUnauthExperience
    ? getProfilesByGroup(profileList, RxGroupTypesEnum.SIE)
    : undefined;
  let isSieMember = sieMember?.length ? true : false;

  const features = reduxGetState().features;
  if (features.usegrouptypesie) {
    isSieMember = true;
  } else if (features.usegrouptypecash) {
    isSieMember = false;
  }

  const [infoLink, setInfoLink] = useState('');

  useEffect(() => {
    if (
      !userLocation ||
      userLocation?.latitude === undefined ||
      userLocation?.longitude === undefined
    ) {
      void handleFetchUserPosition();
    }
  }, []);

  useEffect(() => {
    const getDrugInfo = async () => {
      if (selectedConfiguration) {
        const apiConfig = GuestExperienceConfig.apis.contentManagementApi;
        const drugInfo = await getDrugInformation(
          apiConfig,
          selectedConfiguration?.ndc
        );
        if (drugInfo && drugInfo.externalLink) {
          setInfoLink(drugInfo.externalLink);
        }
      }
    };
    void getDrugInfo();
  }, [selectedConfiguration]);

  useEffect(() => {
    if (navigation.isFocused()) void getDrugPrice();
  }, [pharmacyFilterPreferences, userLocation, selectedConfiguration]);

  const getDrugPrice = async (
    sort: string = pharmacyFilterPreferences.sortBy,
    distance: number = pharmacyFilterPreferences.distance
  ) => {
    if (!selectedConfiguration) {
      return;
    }

    if (
      userLocation?.latitude !== undefined &&
      userLocation?.longitude !== undefined
    ) {
      const { ndc, quantity, supply } = selectedConfiguration;
      const args: IGetDrugPriceAsyncActionArgs = {
        location: {
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
        },
        sortBy: sort,
        ndc,
        supply,
        quantity,
        isUnauthExperience: isUnauthExperience ?? true,
        distance,
        reduxDispatch,
        reduxGetState,
        drugSearchDispatch,
        navigation,
      };
      await getDrugPriceAsyncAction(args);
    }
  };

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
        drugSearchDispatch,
        geolocationDataError.message
      );
    }
  };
  const handleUserPositionChange = async (
    userDeviceLocation: ILocationCoordinates,
    errorMessage: string
  ) => {
    setLocationDeniedErrorMessageDispatch(drugSearchDispatch, errorMessage);
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

  const configureMedication = () => {
    navigation.navigate('ConfigureMedication');
  };

  const onPharmacyPress = (args: IPickAPharmacyOnPress) => {
    const { ncpdp, isBestPrice, pharmacyDrugPrice } = args;

    const ndc = selectedConfiguration?.ndc;
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.DRUG_SEARCH_USER_SELECTS_PHARMACY,
      {
        ndc,
        ncpdp,
        isBestPrice,
      }
    );

    setSelectedPharmacyDispatch(drugSearchDispatch, pharmacyDrugPrice);
    navigation.navigate('WhatComesNext', {});
  };

  const pharmacyLocation = formatUserLocation(userLocation);

  const getDrugData = () => {
    if (!selectedDrug || !selectedConfiguration) {
      return undefined;
    }
    const drugVariant = drugSearchResultHelper.getVariantByNdc(
      selectedConfiguration.ndc,
      selectedDrug
    );
    return {
      drugName: selectedDrug?.name,
      strength: drugVariant?.strength ?? '',
      formCode: drugVariant?.formCode ?? '',
      unit: drugVariant?.strengthUnit ?? '',
      quantity: selectedConfiguration.quantity,
      supply: selectedConfiguration.supply,
      refills: 0,
    };
  };

  const prescriptionTitleProps:
    | IPickAPharmacyPrescriptionTitleProps
    | undefined = getDrugData();

  if (infoLink && prescriptionTitleProps) {
    prescriptionTitleProps.externalInfoLink = infoLink;
  }

  const props: IPickAPharmacyProps = {
    showNoPharmaciesFoundErrorMessage: noPharmaciesFound ?? false,
    pharmacyLocation,
    pharmacies,
    bestPricePharmacy,
    memberProfileType: isSieMember ? 'SIE' : 'CASH',
    errorMessage,
    onPharmacyPress,
    showProfileAvatar: true,
    navigateBack: navigation.goBack,
    canShowContent: true,
    hasStickyView: true,
    prescriptionTitleProps,
    configureMedication,
    isGettingPharmacies,
    isGettingUserLocation,
    logoClickAction: LogoClickActionEnum.CONFIRM,
  };

  return <PickAPharmacy {...props} />;
};
