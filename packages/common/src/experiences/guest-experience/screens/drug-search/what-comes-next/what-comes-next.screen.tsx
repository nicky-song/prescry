// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { LineSeparator } from '../../../../../components/member/line-separator/line-separator';
import { PrescriptionPharmacyInfo } from '../../../../../components/member/prescription-pharmacy-info/prescription-pharmacy-info';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import dateFormatter, {
  IOpenStatusContent,
} from '../../../../../utils/formatters/date.formatter';
import { IDrugDetails } from '../../../../../utils/formatters/drug.formatter';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { DrugWithPriceSection } from './sections/drug-with-price/drug-with-price.section';
import { whatComesNextScreenStyles } from './what-comes-next.screen.styles';
import { PrescriptionAtThisPharmacySection } from './sections/prescription-at-this-pharmacy/prescription-at-this-pharmacy.section';
import { getProfilesByGroup } from '../../../../../utils/profile.helper';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import {
  ActionCard,
  IActionCardButtonProps,
} from '../../../../../components/cards/action/action.card';
import { PrescriptionPriceSection } from '../../../../../components/member/prescription-price/prescription-price.section';
import {
  DrugSearchStackNavigationProp,
  DrugSearchWhatComesNextRouteProp,
} from '../../../navigation/stack-navigators/drug-search/drug-search.stack-navigator';
import { ICreateAccountScreenRouteProps } from '../../sign-in/create-account/create-account.screen';
import { IFindYourPharmacyScreenRouteProps } from '../find-pharmacy/find-your-pharmacy.screen';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { IWhatComesNextScreenContent } from '../../../../../models/cms-content/what-comes-next-ui-content.model';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { FavoriteIconButton } from '../../../../../components/buttons/favorite-icon/favorite-icon.button';
import { useFeaturesContext } from '../../../context-providers/features/use-features-context.hook';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';
import { Heading } from '../../../../../components/member/heading/heading';
import { useFavorites } from '../../../../../hooks/use-favorites/use-favorites.hook';
import { AllFavoriteNotifications } from '../../../../../components/notifications/all-favorite/all-favorite.notifications';
import { favoritePharmacyAsyncAction } from '../../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action';
import { setFavoritingStatusDispatch } from '../../../state/membership/dispatch/set-favoriting-status.dispatch';
import { useTalkativeWidget } from '../../../../../hooks/use-talkative-widget/use-talkative-widget';
import { assertIsDefined } from '../../../../../assertions/assert-is-defined';
import { PricingOption } from '../../../../../models/pricing-option';

export interface IWhatComesNextRouteProps {
  pricingOption?: PricingOption;
}

export const WhatComesNextScreen = (): ReactElement => {
  const navigation = useNavigation<DrugSearchStackNavigationProp>();
  const { params } = useRoute<DrugSearchWhatComesNextRouteProp>();
  const { pricingOption } = params;
  const {
    drugSearchState: { selectedPharmacy, selectedDrug, selectedConfiguration },
  } = useDrugSearchContext();

  const {
    featuresState: { usegrouptypesie, usegrouptypecash },
  } = useFeaturesContext();

  useTalkativeWidget({
    showHeader: false,
    forceExpandedView: false,
  });

  assertIsDefined(selectedPharmacy);
  const {
    pharmacy: {
      phoneNumber = '',
      address: { state, city, zip, lineOne },
      hours,
      twentyFourHours: isOpenTwentyFourHours,
    },
  } = selectedPharmacy;

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

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const {
    membershipState: { profileList, favoritingStatus },
    membershipDispatch,
  } = useMembershipContext();

  const sieProfile = getProfilesByGroup(profileList, 'SIE');
  let isSieMember = sieProfile && sieProfile.length > 0;

  if (usegrouptypesie) {
    isSieMember = true;
  } else if (usegrouptypecash) {
    isSieMember = false;
  }

  const groupKey = CmsGroupKey.whatComesNext;
  const pharmacyOpenStatusGroupKey = CmsGroupKey.pharmacyOpenStatus;

  const { content, isContentLoading } = useContent<IWhatComesNextScreenContent>(
    groupKey,
    2
  );

  const { content: pharmacyOpenStatus } = useContent<IOpenStatusContent>(
    pharmacyOpenStatusGroupKey,
    2
  );

  const now = getNewDate();

  const openStatus = dateFormatter.formatOpenStatus(
    now,
    hours,
    isOpenTwentyFourHours,
    pharmacyOpenStatus
  );

  const onSignUpButtonPress = () => {
    navigation.navigate('RootStack', {
      screen: 'CreateAccount',
      params: {
        workflow: 'startSaving',
      } as ICreateAccountScreenRouteProps,
    });
  };

  const onPrescriptionTransferPress = () => {
    const routeProps: IFindYourPharmacyScreenRouteProps = {
      workflow: 'prescriptionTransfer',
      pricingOption,
    };
    navigation.navigate('FindYourPharmacy', routeProps);
  };

  const prescriptionTransferButton: IActionCardButtonProps = {
    label: content.getStartedLabel,
    onPress: onPrescriptionTransferPress,
  };
  const newPrescriptionButton: IActionCardButtonProps | undefined =
    !profileList.length
      ? {
          label: content.getStartedLabel,
          onPress: onSignUpButtonPress,
        }
      : undefined;

  const isFeaturedPharmacy =
    selectedPharmacy?.coupon?.featuredPharmacy ===
    selectedPharmacy?.pharmacy.ncpdp;

  const prescriptionCouponDetails =
    selectedPharmacy?.coupon?.price === Infinity
      ? undefined
      : selectedPharmacy?.coupon;

  const renderPrice = () => {
    if (prescriptionCouponDetails) {
      return (
        <PrescriptionPriceSection
          hasAssistanceProgram={isFeaturedPharmacy}
          showPlanPays={isSieMember}
          memberPays={selectedPharmacy?.price?.memberPays}
          planPays={selectedPharmacy?.price?.planPays}
          couponDetails={prescriptionCouponDetails}
          isSkeleton={isContentLoading}
        />
      );
    }

    return (
      <DrugWithPriceSection
        drugName={selectedDrug?.name ?? ''}
        drugDetails={drugDetails}
        hideSeparator={true}
        price={selectedPharmacy?.price?.memberPays}
        planPrice={isSieMember ? selectedPharmacy?.price?.planPays : undefined}
      />
    );
  };

  const {
    brand: selectedPharmacyBrand,
    name: selectedPharmacyName,
    ncpdp: selectedNcpdp,
  } = selectedPharmacy?.pharmacy ?? { name: '', brand: '' };
  const selectedPharmacyBrandOrName =
    selectedPharmacyBrand ?? selectedPharmacyName;

  const { isFavorites } = useFavorites(selectedNcpdp);

  const onNotificationClose = () => {
    setFavoritingStatusDispatch(membershipDispatch, 'none');
  };

  const onFavoriteIconButtonPress = async () => {
    onNotificationClose();

    const ncpdp = selectedNcpdp;

    if (ncpdp)
      await favoritePharmacyAsyncAction({
        ncpdp,
        navigation,
        reduxDispatch,
        reduxGetState,
        membershipDispatch,
      });
  };

  const bodyContentContainerTitle =
    selectedNcpdp && isFavorites ? (
      <View
        style={whatComesNextScreenStyles.bodyContentContainerTitleViewStyle}
      >
        <Heading testID='whatComesNextScreenTitleHeading'>
          {selectedPharmacyBrandOrName}
        </Heading>
        <FavoriteIconButton
          onPress={onFavoriteIconButtonPress}
          testID='favoriteIconButtonInBodyContentContainer'
          ncpdp={selectedNcpdp}
          viewStyle={whatComesNextScreenStyles.favoriteIconButtonViewStyle}
        />
      </View>
    ) : (
      selectedPharmacyBrandOrName
    );

  const body = (
    <BodyContentContainer
      title={bodyContentContainerTitle}
      translateTitle={false}
    >
      <PrescriptionPharmacyInfo
        phoneNumber={phoneNumber}
        pharmacyAddress1={lineOne}
        pharmacyState={state}
        pharmacyCity={city}
        pharmacyZipCode={zip}
        hideLinkButtons={true}
        openStatus={openStatus}
        isSkeleton={isContentLoading}
      />
      <LineSeparator viewStyle={whatComesNextScreenStyles.separatorViewStyle} />
      {renderPrice()}
      <View
        style={whatComesNextScreenStyles.prescriptionAtThisPharmacyViewStyle}
      >
        <PrescriptionAtThisPharmacySection
          onSignUpPress={onSignUpButtonPress}
          pricingOption={pricingOption}
        />
      </View>
      <ActionCard
        imageName='pillBottleIcon'
        title={content.anotherPharmacyLabel}
        subTitle={content.anotherPharmacySubtitle}
        button={prescriptionTransferButton}
        viewStyle={
          whatComesNextScreenStyles.prescriptionAtAnotherPharmacyViewStyle
        }
        testID='actionCardPillBottleIcon'
        isSkeleton={isContentLoading}
        isSingleton={true}
      />
      <ActionCard
        imageName='newPrescriptionIcon'
        title={content.newPrescriptionLabel}
        subTitle={content.newPrescriptionSubtitle}
        button={newPrescriptionButton}
        viewStyle={whatComesNextScreenStyles.newPrescriptionViewStyle}
        testID='actionCardNewPrescriptionIcon'
        isSkeleton={isContentLoading}
        isSingleton={true}
      />
    </BodyContentContainer>
  );

  const notification =
    favoritingStatus !== 'none' ? (
      <AllFavoriteNotifications onNotificationClose={onNotificationClose} />
    ) : undefined;

  return (
    <BasicPageConnected
      applicationHeaderHamburgerTestID='whatComesNextScreenHeaderHamburgerButton'
      body={body}
      navigateBack={navigation.goBack}
      showProfileAvatar={true}
      notification={notification}
      logoClickAction={LogoClickActionEnum.CONFIRM}
      translateContent={true}
    />
  );
};
