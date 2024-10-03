// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { Heading } from '../../../../../components/member/heading/heading';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { PharmacyHoursContainer } from '../../../../../components/member/pharmacy-hours-container/pharmacy-hours-container';
import { PrescriptionPharmacyInfo } from '../../../../../components/member/prescription-pharmacy-info/prescription-pharmacy-info';
import { PrescriptionTitle } from '../../../../../components/member/prescription-title/prescription-title';
import { PharmacyText } from '../../../../../components/member/pharmacy-text/pharmacy-text';
import { PrescriptionPriceSection } from '../../../../../components/member/prescription-price/prescription-price.section';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { SectionView } from '../../../../../components/primitives/section-view';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { IPharmacy } from '../../../../../models/pharmacy';
import { ICouponDetails } from '../../../../../models/coupon-details/coupon-details';
import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import { convertHoursToMap } from '../../../../../utils/pharmacy-info.helper';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { useShoppingContext } from '../../../context-providers/shopping/use-shopping-context.hook';
import {
  ISendPrescriptionAsyncActionArgs,
  sendPrescriptionAsyncAction,
} from '../../../state/shopping/async-actions/send-prescription.async-action';
import { confirmationNavigateDispatch } from '../../../store/navigation/dispatch/shopping/confirmation-navigate.dispatch';
import { orderPreviewScreenStyles } from './order-preview.screen.styles';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ShoppingOrderPreviewRouteProp,
  ShoppingStackNavigationProp,
} from '../../../navigation/stack-navigators/shopping/shopping.stack-navigator';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { ITransferFlowContent } from './transfer-flow.ui-content.model';
import { findPharmacy } from '../../../../../utils/pharmacies/find-pharmacy.helper';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';
import { AllFavoriteNotifications } from '../../../../../components/notifications/all-favorite/all-favorite.notifications';
import { favoritePharmacyAsyncAction } from '../../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { setFavoritingStatusDispatch } from '../../../state/membership/dispatch/set-favoriting-status.dispatch';
import { ErrorConstants } from '../../../../../theming/constants';
import { sendNotificationEvent } from '../../../api/api-v1.send-notification-event';
import { formatZipCode } from '../../../../../utils/formatters/address.formatter';
import { IFeaturesState } from '../../../guest-experience-features';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { sendErrorEvent } from '../../../api/api-v1.send-error-event';
import { EventType } from '../../../../../models/api-request-body/send-event.request-body';
import { PricingOption } from '../../../../../models/pricing-option';
import { getDependentWithMemberId } from '../prescription-patient/get-dependent-with-member-id';
import { PrescriptionPatientName } from '../prescription-patient/prescription-patient-name';
import { ThirdPartyPricingOptionInformativePanel } from '../../../../../components/member/panels/third-party-pricing-option-informative/third-party-pricing-option-informative.panel';
import { PbmPricingOptionInformativePanel } from '../../../../../components/member/panels/pbm-pricing-option-informative/pbm-pricing-option-informative.panel';
import { SmartPricePricingOptionInformativePanel } from '../../../../../components/member/panels/smart-pricing-option-informative/smart-price-pricing-option-informative.panel';

export interface IOrderPreviewScreenRouteProps {
  pharmacyNcpdp: string;
  isSieMemberPrescription: boolean;
  pricingOption: PricingOption;
}

interface IEventInfoProp {
  subject: string;
  status: string;
}

const eventInfo: Map<EventType, IEventInfoProp> = new Map([
  [
    'notification',
    {
      subject: 'Prescription has been sent to Pharmacy',
      status: 'Success',
    },
  ],
  [
    'error',
    {
      subject: 'Error sending to pharmacy for patient',
      status: 'Failure',
    },
  ],
]);

export const OrderPreviewScreen = (): ReactElement => {
  const navigation = useNavigation<ShoppingStackNavigationProp>();

  const {
    membershipState: { favoritingStatus, patientDependents },
    membershipDispatch,
  } = useMembershipContext();

  const { useDualPrice, usertpb } = useFlags<IFeaturesState>();

  const {
    params: { pharmacyNcpdp, isSieMemberPrescription, pricingOption },
  } = useRoute<ShoppingOrderPreviewRouteProp>();

  const styles = orderPreviewScreenStyles;

  const {
    shoppingState: {
      prescriptionInfo,
      bestPricePharmacy,
      drugInformation,
      prescriptionPharmacies,
      hasInsurance,
    },
    shoppingDispatch,
  } = useShoppingContext();

  if (!prescriptionInfo) {
    throw new Error(ErrorConstants.errorForGettingPrescriptionInfo);
  }

  const groupKey = CmsGroupKey.transferFlow;

  const { content, isContentLoading } = useContent<ITransferFlowContent>(
    groupKey,
    2
  );

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const pharmacyDrugPrice = bestPricePharmacy
    ? findPharmacy(
        [...prescriptionPharmacies, bestPricePharmacy],
        pharmacyNcpdp
      )
    : findPharmacy(prescriptionPharmacies, pharmacyNcpdp);

  const coupon: ICouponDetails = pharmacyDrugPrice?.coupon ?? {
    productManufacturerName: '',
    price: Infinity,
    ageLimit: Infinity,
    introductionDialog: '',
    eligibilityURL: '',
    copayText: '',
    copayAmount: 0,
    groupNumber: '',
    pcn: '',
    memberId: '',
    bin: '',
    featuredPharmacy: '',
    logo: {
      name: '',
      alternativeText: '',
      caption: '',
      hash: '',
      ext: '',
      mime: '',
      size: 0,
      url: '',
      provider: '',
      width: 0,
      height: 0,
      id: '',
    },
  };

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
  const {
    name: pharmacyName,
    phoneNumber,
    hours,
    address: pharmacyAddress,
    isMailOrderOnly,
    inNetwork,
    brand,
    ncpdp,
  } = pharmacy;

  const pharmacyBrandOrName = brand ?? pharmacyName;

  const { lineOne, city, state, zip: zipCode } = pharmacyAddress;

  const pharmacyAddressFormatted = `${lineOne}, ${state}, ${formatZipCode(
    zipCode ?? ''
  )}`;

  const reduxState = reduxGetState();
  const api = reduxState?.config.apis.guestExperienceApi;
  const settings = reduxState?.settings;

  const hoursMap = convertHoursToMap(hours);

  const price = inNetwork ? pharmacyDrugPrice?.price : undefined;

  const hasCoupon = coupon && coupon?.price !== Infinity;

  const { drugName, form, quantity, refills, unit, strength, prescriptionId } =
    prescriptionInfo;

  const prescriptionPatient = getDependentWithMemberId(
    patientDependents,
    prescriptionInfo?.primaryMemberRxId
  );

  const onNotificationClose = () => {
    setFavoritingStatusDispatch(membershipDispatch, 'none');
  };

  const onFavoriteIconButtonPress = async () => {
    onNotificationClose();

    await favoritePharmacyAsyncAction({
      ncpdp,
      navigation,
      reduxDispatch,
      reduxGetState,
      membershipDispatch,
    });
  };

  const hoursContent =
    hours.length > 0 ? (
      <PharmacyHoursContainer
        pharmacyHours={hoursMap}
        textStyle={styles.hoursTextStyle}
        isSkeleton={isContentLoading}
      />
    ) : (
      <BaseText skeletonWidth='long' isSkeleton={isContentLoading}>
        {content.hoursNotSpecified}
      </BaseText>
    );

  const renderPricingSection = () => {
    if (useDualPrice && price) {
      switch (pricingOption) {
        case 'pbm':
          return (
            <PbmPricingOptionInformativePanel
              memberPays={price.memberPays}
              planPays={price.planPays}
            />
          );
        case 'thirdParty':
          return (
            <ThirdPartyPricingOptionInformativePanel
              memberPays={price.memberPays}
            />
          );
        case 'smartPrice':
          return (
            <SmartPricePricingOptionInformativePanel
              memberPays={price.memberPays}
            />
          );
      }
    }

    return (
      <PrescriptionPriceSection
        hasAssistanceProgram={coupon.featuredPharmacy === pharmacy.ncpdp}
        showPlanPays={isSieMemberPrescription}
        memberPays={price?.memberPays}
        planPays={price?.planPays}
        couponDetails={
          isSieMemberPrescription || coupon.price === Infinity
            ? undefined
            : coupon
        }
        isSkeleton={isContentLoading}
        isConfirmed={true}
        insurancePrice={price?.insurancePrice}
      />
    );
  };

  const showPriceSection = pharmacyDrugPrice?.pharmacy.inNetwork ? (
    <View
      testID='prescriptionPrice'
      style={styles.PrescriptionPriceSectionViewStyle}
    >
      {renderPricingSection()}
      {usertpb && hasInsurance && (
        <BaseText
          style={styles.estimatedPriceNoticeTextStyle}
          isSkeleton={isContentLoading}
          skeletonWidth='long'
        >
          {content.estimatedPriceNoticeText}
        </BaseText>
      )}
    </View>
  ) : null;

  const couponSection = (
    <View>
      {pharmacyDrugPrice?.pharmacy.isMailOrderOnly ? (
        <PharmacyText
          pharmacy={pharmacyBrandOrName}
          ncpdp={ncpdp}
          onFavoriteIconButtonPress={onFavoriteIconButtonPress}
          headingLevel={2}
          alternative={content.premierDescription}
        />
      ) : !pharmacyDrugPrice?.pharmacy.inNetwork ? (
        <PharmacyText
          pharmacy={pharmacyBrandOrName}
          ncpdp={ncpdp}
          onFavoriteIconButtonPress={onFavoriteIconButtonPress}
          headingLevel={2}
          alternative={
            <BaseText>
              <BaseText
                weight='bold'
                isSkeleton={isContentLoading}
                skeletonWidth='long'
              >
                {content.outOfNetworkPrefix}
              </BaseText>{' '}
              {content.outOfNetworkDescription}
            </BaseText>
          }
        />
      ) : (
        <PharmacyText
          pharmacy={pharmacyBrandOrName}
          ncpdp={ncpdp}
          onFavoriteIconButtonPress={onFavoriteIconButtonPress}
          headingLevel={2}
          hasCoupon={hasCoupon}
        />
      )}
      {showPriceSection}
    </View>
  );
  const [stickyHeight, setStickyHeight] = useState(0);

  const onStickyLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setStickyHeight(height);
    return { is: true };
  };

  const renderStickyView = () => {
    return (
      prescriptionPatient && (
        <View style={styles.stickyViewStyle} onLayout={onStickyLayout}>
          <PrescriptionPatientName prescriptionPatient={prescriptionPatient} />
        </View>
      )
    );
  };

  const stickyViews = prescriptionPatient
    ? [{ view: renderStickyView() }]
    : undefined;

  const body = (
    <BodyContentContainer
      title={content.title}
      testID='orderPreviewScreen'
      isSkeleton={isContentLoading}
      viewStyle={{ marginTop: stickyHeight }}
    >
      <PrescriptionTitle
        productName={drugName}
        strength={strength}
        formCode={form}
        unit={unit}
        quantity={quantity}
        refills={refills}
        infoLink={drugInformation?.externalLink}
        headingLevel={2}
        isSkeleton={isContentLoading}
      />
      <SectionView testID='pharmacyInfoSection'>
        {couponSection}
        <SectionView testID='pharmacyContactSection'>
          <Heading
            level={3}
            textStyle={styles.pharmacyInfoHeadingTextStyle}
            isSkeleton={isContentLoading}
            skeletonWidth='long'
          >
            {content.pharmacyInfoHeading}
          </Heading>
          <PrescriptionPharmacyInfo
            phoneNumber={phoneNumber}
            pharmacyAddress1={lineOne}
            pharmacyCity={city}
            pharmacyState={state}
            pharmacyZipCode={zipCode}
            isMailOrderOnly={isMailOrderOnly}
            isSkeleton={isContentLoading}
          />
        </SectionView>
        <SectionView testID='pharmacyHoursSection'>{hoursContent}</SectionView>
      </SectionView>
    </BodyContentContainer>
  );

  const onSendCommonEvent = (isError = false) => {
    const eventType = isError ? 'error' : 'notification';
    const eventDetail = eventInfo.get(eventType);

    (isError ? sendErrorEvent : sendNotificationEvent)(
      api,
      {
        idType: 'smartContractId',
        id: prescriptionId,
        tags: ['dRx', 'supportDashboard'],
        type: eventType,
        subject: eventDetail?.subject as string,
        messageData: `Send to Pharmacy (${eventDetail?.status}) - ${pharmacyName}, ${pharmacyAddressFormatted}, ${pharmacyNcpdp}`,
      },
      settings?.deviceToken,
      settings?.token
    );
  };

  const onSendPress = async () => {
    if (!prescriptionId || !pharmacyNcpdp) {
      return;
    }

    const now = getNewDate();
    const args: ISendPrescriptionAsyncActionArgs = {
      ncpdp: pharmacyNcpdp,
      prescriptionId,
      orderDate: now,
      shoppingDispatch,
      reduxDispatch,
      reduxGetState,
      navigation,
      blockchain: prescriptionInfo.blockchain,
    };
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.PRESCRIPTION_USER_SEND_TO_PHARMACY,
      {
        prescriptionId,
        ncpdp: pharmacyNcpdp,
      }
    );
    try {
      await sendPrescriptionAsyncAction(args);

      confirmationNavigateDispatch(navigation, {
        pharmacyNcpdp,
        canGoBack: false,
        pricingOption,
      });

      onSendCommonEvent();
    } catch {
      onSendCommonEvent(true);
      return;
    }
  };

  const notification =
    favoritingStatus !== 'none' ? (
      <AllFavoriteNotifications onNotificationClose={onNotificationClose} />
    ) : undefined;

  const footer = (
    <BaseButton
      onPress={onSendPress}
      isSkeleton={isContentLoading}
      testID='orderPreviewScreenSendtoPharmacyButton'
    >
      {content.sendButton}
    </BaseButton>
  );

  return (
    <BasicPageConnected
      stickyIndices={[1]}
      stickyViews={stickyViews}
      body={body}
      navigateBack={navigation.goBack}
      showProfileAvatar={true}
      headerViewStyle={styles.headerViewStyle}
      footer={footer}
      bodyViewStyle={styles.bodyViewStyle}
      notification={notification}
      logoClickAction={LogoClickActionEnum.CONFIRM}
      translateContent={true}
    />
  );
};
