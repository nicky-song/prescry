// Copyright 2021 Prescryptive Health, Inc.

import { View, LayoutChangeEvent, TextStyle, ViewStyle } from 'react-native';
import React, { ReactElement, useState } from 'react';
import { PromotionLinkButton } from '../../../components/buttons/promotion-link/promotion-link.button';
import { Heading } from '../../../components/member/heading/heading';
import { InformationButton } from '../../../components/buttons/information/information.button';
import { LocationButton } from '../../../components/buttons/location.button/location.button';
import { FilterButton } from '../../../components/buttons/filter/filter.button';
import { IPharmacyDrugPrice } from '../../../models/pharmacy-drug-price';
import { BaseText } from '../../../components/text/base-text/base-text';
import { ICouponDetails } from '../../../models/coupon-details/coupon-details';
import { PrescriptionValueCard } from '../../../components/member/cards/prescription-value/prescription-value.card';
import { PopupModal } from '../../../components/modal/popup-modal/popup-modal';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { getNewDate } from '../../../utils/date-time/get-new-date';
import { PrescriptionTitle } from '../../../components/member/prescription-title/prescription-title';
import { LineSeparator } from '../../../components/member/line-separator/line-separator';
import { pickAPharmacyStyles } from './pick-a-pharmacy.styles';
import { useSessionContext } from '../context-providers/session/use-session-context.hook';
import { RxGroupTypesEnum } from '../../../models/member-profile/member-profile-info';
import { goToUrl } from '../../../utils/link.helper';
import {
  IConfigureFiltersScreenRouteProps,
  ISortOptions,
  SortOptionValue,
} from '../screens/drug-search/configure-filters/configure-filters.screen';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/stack-navigators/root/root.stack-navigator';
import { SkeletonPharmacyCard } from '../../../components/member/cards/skeleton-pharmacy/skeleton-pharmacy.card';
import { PharmacyGroup } from '../../../components/member/pharmacy-group/pharmacy-group';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import pickAPharmacyFormatter from '../../../utils/formatters/pick-a-pharmacy.formatter';
import { LogoClickAction } from '../../../components/app/application-header/application-header';
import { favoritePharmaciesGroupLeaderGrouper } from '../../../utils/pharmacies/favorite-pharmacies.group-leaders.grouper';
import { useMembershipContext } from '../context-providers/membership/use-membership-context.hook';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { IPickAPharmacyContent } from './pick-a-pharmacy.content';
import { IOpenStatusContent } from '../../../utils/formatters/date.formatter';
import { AlternativeSavingsCard } from '../../../components/cards/alternative-savings/alternative-savings.card';
import { PrescribedMedication } from '../../../components/member/prescribed-medication/prescribed-medication';
import { IDrugDetails } from '../../../utils/formatters/drug.formatter';
import { IFeaturesState } from '../guest-experience-features';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { ILimitedPatient } from '../../../models/patient-profile/limited-patient';
import { PrescriptionPatientName } from '../screens/shopping/prescription-patient/prescription-patient-name';

export interface IPickAPharmacyOnPress {
  ncpdp: string;
  isBestPrice: boolean;
  isBestValue: boolean;
  pharmacyDrugPrice: IPharmacyDrugPrice;
}
export interface IPickAPharmacyProps {
  showNoPharmaciesFoundErrorMessage: boolean;
  showProfileAvatar: boolean;
  pharmacies: IPharmacyDrugPrice[];
  hasStickyView: boolean;
  bestPricePharmacy?: IPharmacyDrugPrice;
  memberProfileType?: string;
  errorMessage?: string;
  pharmacyLocation?: string;
  canShowContent?: boolean;
  prescriptionTitleProps?: IPickAPharmacyPrescriptionTitleProps;
  prescribedMedicationProps?: IPickAPharmacyPrescribedMedicationProps;
  onPharmacyPress: (args: IPickAPharmacyOnPress) => void;
  navigateBack: () => void;
  isGettingPharmacies: boolean;
  isGettingUserLocation: boolean;
  configureMedication?: () => void;
  logoClickAction?: LogoClickAction;
  navigateToPointOfCare?: () => void;
  savingsAmount?: number;
  hasInsurance?: boolean;
  prescriptionPatient?: ILimitedPatient;
}
export interface IPickAPharmacyPrescriptionTitleProps {
  drugName: string;
  strength?: string;
  formCode: string;
  unit?: string;
  quantity: number;
  supply?: number;
  refills: number;
  externalInfoLink?: string;
}
export interface IPickAPharmacyPrescribedMedicationProps {
  drugDetails: IDrugDetails;
  drugName: string;
  viewStyle?: ViewStyle;
}
export const PickAPharmacy = (props: IPickAPharmacyProps): ReactElement => {
  const {
    showNoPharmaciesFoundErrorMessage,
    pharmacyLocation,
    pharmacies,
    bestPricePharmacy,
    memberProfileType,
    errorMessage,
    onPharmacyPress,
    showProfileAvatar,
    navigateBack,
    isGettingPharmacies,
    canShowContent,
    hasStickyView,
    prescriptionTitleProps,
    prescribedMedicationProps,
    isGettingUserLocation,
    configureMedication,
    navigateToPointOfCare,
    savingsAmount,
    hasInsurance,
    prescriptionPatient,
  } = props;

  const navigation = useNavigation<RootStackNavigationProp>();

  const { usertpb, usePointOfCare } = useFlags<IFeaturesState>();

  const pickAPharmacyGroupKey = CmsGroupKey.pickAPharmacy;
  const pharmacyOpenStatusGroupKey = CmsGroupKey.pharmacyOpenStatus;

  const {
    content: pickAPharmacyContent,
    isContentLoading: pickAPharmacyLoading,
  } = useContent<IPickAPharmacyContent>(pickAPharmacyGroupKey, 2);

  const {
    content: pharmacyOpenStatus,
    isContentLoading: pharmacyOpenStatusLoading,
  } = useContent<IOpenStatusContent>(pharmacyOpenStatusGroupKey, 2);

  const styles = pickAPharmacyStyles;
  const createNavigator = (url: string) => () =>
    goToUrl(url).catch(() => {
      return;
    });

  const navigateToEligibilityURL = (eligibilityUrl: string) =>
    createNavigator(eligibilityUrl);

  const navigateToConfigureFiltersScreen = () => {
    const configureFiltersScreenProps: IConfigureFiltersScreenRouteProps = {
      defaultSort: sortBy,
      sortOptions,
      defaultDistanceSliderPosition: distance,
    };

    navigation.navigate('ConfigureFilters', configureFiltersScreenProps);
  };

  const now = getNewDate();
  const { sessionState } = useSessionContext();
  const [toolTipModalOpen, setToolTipModalOpen] = useState(false);
  const [featuredAdded, setFeaturedAdded] = useState(false);
  const [stickyHeight, setStickyHeight] = useState(0);

  const { sortBy, distance } = sessionState.pharmacyFilterPreferences;

  const openToolTipModal = () => {
    setToolTipModalOpen(true);
  };
  const navigateToFindLocationScreen = () => {
    navigation.navigate('FindLocation');
  };

  const { introductionDialog, eligibilityURL } =
    bestPricePharmacy?.coupon ??
    pharmacies?.find((pharm) => pharm.coupon)?.coupon ??
    {};

  const renderFilterButton = (
    <FilterButton onPress={navigateToConfigureFiltersScreen} />
  );

  const renderErrorMessage = (message: string, style: TextStyle) =>
    !isGettingPharmacies && !isGettingUserLocation ? (
      <BaseText style={style}>{message}</BaseText>
    ) : null;

  const renderError = () => {
    const currentErrorMessage = errorMessage?.length
      ? errorMessage
      : StringFormatter.format(
          distance !== 1
            ? pickAPharmacyContent.noPharmaciesFoundErrorMessagePlural
            : pickAPharmacyContent.noPharmaciesFoundErrorMessage,
          new Map([['distance', distance.toString()]])
        );

    return renderErrorMessage(
      currentErrorMessage,
      styles.noPharmacyMessageTextStyle
    );
  };

  const {
    membershipState: {
      account: { favoritedPharmacies },
    },
  } = useMembershipContext();

  const renderPharmacies = (
    allPharmacies: IPharmacyDrugPrice[],
    isBestValue: boolean
  ) => {
    const finalPharmacies = [] as IPharmacyDrugPrice[];

    if (favoritedPharmacies.length)
      allPharmacies.forEach((pharmacyDrugPrice) => {
        finalPharmacies.push(
          favoritePharmaciesGroupLeaderGrouper(
            pharmacyDrugPrice,
            favoritedPharmacies
          )
        );
      });
    else {
      allPharmacies.forEach((pharmacyDrugPrice) => {
        finalPharmacies.push(pharmacyDrugPrice);
      });
    }
    return finalPharmacies.map((pharmacyDrugPrice: IPharmacyDrugPrice) => {
      const { pharmacy, price, otherPharmacies, dualPrice } = pharmacyDrugPrice;

      const hasOtherPharmacies = !!otherPharmacies?.length;

      const {
        name,
        ncpdp,
        hours,
        twentyFourHours,
        address,
        distance,
        isMailOrderOnly,
        brand,
        chainId,
      } = pharmacy;

      const priceYouPay = price?.memberPays;
      const pricePlanPays = price?.planPays;
      const insurancePrice = price?.insurancePrice;

      const openStatus = pickAPharmacyFormatter.formatOpenStatus(
        now,
        hours,
        twentyFourHours,
        pharmacyOpenStatus
      );

      const isBestPrice =
        priceYouPay !== undefined &&
        priceYouPay === bestPricePharmacy?.price?.memberPays;

      const hasCoupon =
        !!bestPricePharmacy?.coupon?.price ??
        !!pharmacies?.find((pharm) => pharm?.coupon);

      const coupon =
        bestPricePharmacy?.coupon ??
        pharmacies?.find((pharm) => pharm?.coupon)?.coupon ??
        undefined;

      const couponDetails: ICouponDetails = {
        productManufacturerName: coupon?.productManufacturerName,
        price: coupon?.price,
        ageLimit: coupon?.ageLimit,
        introductionDialog: coupon?.introductionDialog,
        eligibilityURL: coupon?.eligibilityURL,
        copayText: coupon?.copayText,
        copayAmount: coupon?.copayAmount,
        groupNumber: coupon?.groupNumber,
        pcn: coupon?.pcn,
        memberId: coupon?.memberId,
        bin: coupon?.bin,
        featuredPharmacy: coupon?.featuredPharmacy,
        logo: coupon?.logo,
      } as ICouponDetails;

      const isFeaturedPharmacy =
        bestPricePharmacy?.coupon?.featuredPharmacy === ncpdp ??
        pharmacies?.find((pharm) => pharm?.coupon)?.coupon?.featuredPharmacy ===
          ncpdp;

      if (!featuredAdded && isFeaturedPharmacy) {
        setFeaturedAdded(true);
      }

      const onPress = () =>
        onPharmacyPress({
          ncpdp,
          isBestPrice,
          isBestValue,
          pharmacyDrugPrice,
        });

      const generateTestIDAttributeValue = (): string => {
        let testIDAttributeValue = 'prescriptionValueCard';
        const boolBestValue = featuredAdded ? isFeaturedPharmacy : isBestValue;

        testIDAttributeValue = testIDAttributeValue.concat(
          '-',
          boolBestValue ? 'IsBestValue' : 'IsNotBestValue'
        );
        testIDAttributeValue = testIDAttributeValue.concat(
          '-',
          isMailOrderOnly ? 'IsMailOrderOnly' : 'IsNotMailOrderOnly'
        );
        testIDAttributeValue = testIDAttributeValue.concat('-', ncpdp);

        return testIDAttributeValue;
      };

      const pharmacyInfoList = otherPharmacies ?? [];

      const pharmacyGroup = hasOtherPharmacies ? (
        <PharmacyGroup
          onPharmacyPress={onPharmacyPress}
          pharmacyInfoList={pharmacyInfoList}
          viewStyle={pickAPharmacyStyles.pharmacyGroupViewStyle}
        />
      ) : null;

      const pharmacyName = brand ?? name;

      return (
        <View key={`${ncpdp}${chainId}${favoritedPharmacies}`}>
          <PrescriptionValueCard
            key={ncpdp}
            pharmacyName={pharmacyName}
            ncpdp={ncpdp}
            serviceStatus={openStatus}
            isServiceStatusLoading={pharmacyOpenStatusLoading}
            priceYouPay={priceYouPay}
            pricePlanPays={pricePlanPays}
            viewStyle={styles.pharmacyCardViewStyle}
            onPress={onPress}
            isBestValue={featuredAdded ? isFeaturedPharmacy : isBestValue}
            patientAssistance={isFeaturedPharmacy}
            userGroup={
              memberProfileType === RxGroupTypesEnum.SIE
                ? RxGroupTypesEnum.SIE
                : RxGroupTypesEnum.CASH
            }
            address={address}
            isMailOrderOnly={isMailOrderOnly}
            distance={distance}
            hasCoupon={hasCoupon}
            couponDetails={couponDetails}
            insurancePrice={insurancePrice}
            testID={generateTestIDAttributeValue()}
            dualPrice={dualPrice}
          />
          {pharmacyGroup}
        </View>
      );
    });
  };

  const onStickyLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setStickyHeight(height);
    return { is: true };
  };

  const renderStickyView = () => {
    return (
      <View style={styles.stickyViewStyle} onLayout={onStickyLayout}>
        <View style={styles.forPatientViewStyle}>
          {prescriptionPatient && (
            <PrescriptionPatientName
              prescriptionPatient={prescriptionPatient}
            />
          )}
        </View>
        {!configureMedication && prescribedMedicationProps ? (
          <PrescribedMedication
            viewStyle={styles.prescribedMedicationViewStyle}
            drugDetails={prescribedMedicationProps.drugDetails}
            drugName={prescribedMedicationProps.drugName}
          ></PrescribedMedication>
        ) : (
          prescriptionTitleProps && (
            <View>
              <PrescriptionTitle
                productName={prescriptionTitleProps.drugName}
                strength={prescriptionTitleProps.strength}
                formCode={prescriptionTitleProps.formCode}
                unit={prescriptionTitleProps.unit}
                quantity={prescriptionTitleProps.quantity}
                supply={prescriptionTitleProps.supply}
                refills={0}
                onPressButton={configureMedication}
                hideSeparator={true}
                infoLink={props.prescriptionTitleProps?.externalInfoLink}
                testID={
                  'pickAPharmacyPrescriptionTitle-' +
                  prescriptionTitleProps.drugName
                }
              />
              <LineSeparator viewStyle={styles.lineSeparatorViewStyle} />
            </View>
          )
        )}
      </View>
    );
  };

  const stickyViews = hasStickyView
    ? [{ view: renderStickyView() }]
    : undefined;

  const renderBestPrice = () =>
    bestPricePharmacy ? renderPharmacies([bestPricePharmacy], true) : undefined;

  const renderPharmacyList = () => renderPharmacies(pharmacies, false);

  const renderPharmacyCards = () => {
    return isGettingPharmacies || isGettingUserLocation ? (
      <>
        <SkeletonPharmacyCard isBestPricePharmacy={true} />
        <LineSeparator />
        <SkeletonPharmacyCard />
        <LineSeparator />
        <SkeletonPharmacyCard />
      </>
    ) : (
      <>
        {renderBestPrice()}
        {renderPharmacyList()}
      </>
    );
  };

  const locationAndFilterContainer = !isGettingUserLocation ? (
    <View style={styles.modalViewStyle}>
      <LocationButton
        viewStyle={styles.locationButtonViewStyle}
        onPress={navigateToFindLocationScreen}
        location={
          StringFormatter.shrinkText(pharmacyLocation, 20) ||
          pickAPharmacyContent.location
        }
      />
      {renderFilterButton}
    </View>
  ) : null;

  const description =
    !configureMedication && usertpb && hasInsurance ? (
      <BaseText
        isSkeleton={pickAPharmacyLoading}
        skeletonWidth='long'
        style={styles.pickYourPharmacySubTextStyle}
      >
        {pickAPharmacyContent.rtpbDescription}
      </BaseText>
    ) : null;

  const bodyContent = (
    <>
      {!!introductionDialog && !!eligibilityURL ? (
        <PromotionLinkButton
          promotionText={introductionDialog}
          linkText={pickAPharmacyContent.eligibility}
          onPress={navigateToEligibilityURL(eligibilityURL)}
          viewStyle={styles.promotionLinkViewStyle}
          image='couponIcon'
        />
      ) : null}
      {navigateToPointOfCare && savingsAmount && usePointOfCare && (
        <AlternativeSavingsCard
          viewStyle={styles.alternativeSavingsCardViewStyle}
          savingsAmount={savingsAmount}
          onPress={navigateToPointOfCare}
        />
      )}
      <View style={styles.pickYourPharmacyViewStyle}>
        <Heading
          level={2}
          textStyle={styles.pickYourPharmacyTextStyle}
          isSkeleton={pickAPharmacyLoading}
          skeletonWidth='medium'
        >
          {pickAPharmacyContent.pickYourPharmacy}
        </Heading>
        <InformationButton
          onPress={openToolTipModal}
          accessibilityLabel={pickAPharmacyContent.informationButtonLabel}
          isSkeleton={pickAPharmacyLoading}
          skeletonWidth='short'
        />
      </View>
      {description}
      {locationAndFilterContainer}
      {showNoPharmaciesFoundErrorMessage || errorMessage?.length
        ? renderError()
        : renderPharmacyCards()}
    </>
  );

  const body = canShowContent ? (
    <View style={[styles.bodyViewStyle, { marginTop: stickyHeight }]}>
      {bodyContent}
    </View>
  ) : undefined;

  const sortOptions: ISortOptions[] =
    memberProfileType === 'SIE'
      ? [
          {
            label: pickAPharmacyContent.distanceLabel,
            value: SortOptionValue.distance,
            sortBy: 'distance',
          },
          {
            label: pickAPharmacyContent.youPayLabel,
            value: SortOptionValue.youpay,
            sortBy: 'youpay',
          },
          {
            label: pickAPharmacyContent.planPaysLabel,
            value: SortOptionValue.planpays,
            sortBy: 'planpays',
          },
        ]
      : [
          {
            label: pickAPharmacyContent.distanceLabel,
            value: SortOptionValue.distance,
            sortBy: 'distance',
          },
          {
            label: pickAPharmacyContent.youPayLabel,
            value: SortOptionValue.youpay,
            sortBy: 'youpay',
          },
        ];

  const closeToolTipModal = () => {
    setToolTipModalOpen(false);
  };
  const tooltipModal = (
    <PopupModal
      key='information'
      titleText={pickAPharmacyContent.popUpModalText}
      onPrimaryButtonPress={closeToolTipModal}
      primaryButtonLabel={pickAPharmacyContent.popUpModalLabel}
      isOpen={toolTipModalOpen}
      content={pickAPharmacyContent.popUpModalContent}
    />
  );

  return (
    <BasicPageConnected
      stickyIndices={[1]}
      stickyViews={stickyViews}
      body={body}
      modals={[tooltipModal]}
      showProfileAvatar={showProfileAvatar}
      headerViewStyle={styles.headerViewStyle}
      navigateBack={navigateBack}
      logoClickAction={props.logoClickAction}
      translateContent={true}
    />
  );
};
