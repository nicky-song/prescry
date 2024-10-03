// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { Heading } from '../../../../components/member/heading/heading';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import {
  IOrderSectionProps,
  OrderSection,
} from './sections/order/order.section';
import { PickUpSection } from './sections/pick-up/pick-up.section';
import {
  ISummarySectionProps,
  SummarySection,
} from './sections/summary/summary.section';
import { WhatIsNextSection } from './sections/what-is-next/what-is-next.section';
import { orderConfirmationScreenStyles as styles } from './order-confirmation.screen.styles';
import {
  IPrescriberDetailsProps,
  PrescriberDetails,
} from '../../../../components/member/prescriber-details/prescriber-details';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import {
  Coupon,
  ICouponProps,
} from '../../../../components/member/coupon/coupon';
import { ICouponDetails } from '../../../../models/coupon-details/coupon-details';
import { IPharmacyDrugPrice } from '../../../../models/pharmacy-drug-price';
import { OfferDeliveryInfo } from '../../../../components/member/offer-delivery-info/offer-delivery-info';
import { LinkButton } from '../../../../components/buttons/link/link.button';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import { cleanPhoneNumber } from '../../../../utils/formatters/phone-number.formatter';
import { PhoneNumberDialingCode } from '../../../../theming/constants';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { PharmacyHoursContainer } from '../../../../components/member/pharmacy-hours-container/pharmacy-hours-container';
import { convertHoursToMap } from '../../../../utils/pharmacy-info.helper';
import { RootStackNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';
import { FontAwesomeIcon } from '../../../../components/icons/font-awesome/font-awesome.icon';
import { NotificationColor } from '../../../../theming/colors';
import { callPhoneNumber, goToUrl } from '../../../../utils/link.helper';
import { HomeButton } from '../../../../components/buttons/home/home.button';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IOrderConfirmationScreenContent } from './order-confirmation.screen.content';
import { IconSize } from '../../../../theming/icons';
import { AllFavoriteNotifications } from '../../../../components/notifications/all-favorite/all-favorite.notifications';
import { favoritePharmacyAsyncAction } from '../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action';
import { setFavoritingStatusDispatch } from '../../state/membership/dispatch/set-favoriting-status.dispatch';
import { useTalkativeWidget } from '../../../../hooks/use-talkative-widget/use-talkative-widget';
import { useShoppingContext } from '../../context-providers/shopping/use-shopping-context.hook';
import { getDependentWithMemberId } from '../shopping/prescription-patient/get-dependent-with-member-id';
import { PrescriptionPatientName } from '../shopping/prescription-patient/prescription-patient-name';

export interface IOrderConfirmationScreenProps {
  pharmacyDrugPrice?: IPharmacyDrugPrice;
  orderSectionProps?: IOrderSectionProps;
  navigation: RootStackNavigationProp;
  whatIsNextSectionContent?: string;
  summarySectionProps?: ISummarySectionProps;
  prescriberSectionContent?: IPrescriberDetailsProps;
  isNewOrder?: boolean;
  canGoBack?: boolean;
}
export const OrderConfirmationScreen = ({
  orderSectionProps,
  whatIsNextSectionContent,
  navigation,
  summarySectionProps,
  prescriberSectionContent,
  pharmacyDrugPrice,
  isNewOrder,
  canGoBack,
}: IOrderConfirmationScreenProps): ReactElement => {
  useTalkativeWidget({
    showHeader: false,
    forceExpandedView: false,
  });

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const {
    membershipState: { favoritingStatus, patientDependents },
    membershipDispatch,
  } = useMembershipContext();

  const {
    shoppingState: { hasInsurance, prescriptionInfo },
  } = useShoppingContext();
  const {
    titleViewStyle,
    headerViewStyle,
    bodyViewStyle,
    separatorViewStyle,
    whatIsNextSectionViewStyle,
  } = styles;

  const groupKey = CmsGroupKey.orderConfirmation;

  const { content, isContentLoading } =
    useContent<IOrderConfirmationScreenContent>(groupKey, 2);

  const coupon: ICouponDetails = pharmacyDrugPrice?.coupon as ICouponDetails;

  const couponProps: ICouponProps = {
    price: coupon?.price,
    productName: coupon?.productManufacturerName,
    viewStyle: styles.couponViewStyle,
    group: coupon?.groupNumber,
    pcn: coupon?.pcn,
    memberId: coupon?.memberId,
    bin: coupon?.bin,
    eligibilityUrl: coupon?.eligibilityURL,
    // TODO: logoUrl: (coupon?.logo as ICouponDetailsLogo)?.url,
  } as ICouponProps;

  const prescriptionPatient = getDependentWithMemberId(
    patientDependents,
    prescriptionInfo?.primaryMemberRxId
  );

  const [stickyHeight, setStickyHeight] = useState(0);

  const title = (
    <View style={titleViewStyle}>
      <FontAwesomeIcon
        name='check-circle'
        size={IconSize.regular}
        color={NotificationColor.green}
        solid={true}
      />
      <View style={styles.orderConfirmationTitleViewStyle}>
        <Heading
          level={1}
          isSkeleton={isContentLoading}
          textStyle={styles.orderConfirmationTitleTextStyle}
        >
          {content.orderConfirmationTitleText}
        </Heading>
      </View>
    </View>
  );

  const callDoctorAction = () => {
    if (prescriberSectionContent?.doctorContactNumber) {
      const formattedPhone = `${PhoneNumberDialingCode}${cleanPhoneNumber(
        prescriberSectionContent.doctorContactNumber
      )}`;

      (async () => {
        await callPhoneNumber(formattedPhone);
      })();
    }
  };

  const renderPrescriberDetails = () => {
    if (
      prescriberSectionContent?.doctorContactNumber &&
      prescriberSectionContent.doctorName
    ) {
      return (
        <>
          <LineSeparator viewStyle={separatorViewStyle} />
          <PrescriberDetails
            doctorName={prescriberSectionContent.doctorName}
            doctorContactNumber={prescriberSectionContent.doctorContactNumber}
            callToDoctor={callDoctorAction}
          />
        </>
      );
    }
    return null;
  };

  const summarySection = summarySectionProps ? (
    <SummarySection
      orderDate={summarySectionProps?.orderDate}
      orderNumber={summarySectionProps?.orderNumber}
    />
  ) : null;

  const renderCouponWithLinkButton = () => {
    const { eligibilityUrl } = couponProps;

    const navigateToEligibilityUrl = () => {
      if (eligibilityUrl) {
        return goToUrl(eligibilityUrl);
      }
      return () => true;
    };

    const renderLinkButton = () => {
      if (eligibilityUrl) {
        return (
          <LinkButton
            textStyle={styles.linkTextStyle}
            linkText={content.orderConfirmationEligibilityText}
            onPress={navigateToEligibilityUrl}
          />
        );
      }
      return null;
    };

    return !coupon ||
      !couponProps ||
      Object.keys(couponProps).length === 0 ? null : (
      <View>
        <Coupon {...couponProps} />
        {renderLinkButton()}
      </View>
    );
  };

  const onNotificationClose = () => {
    setFavoritingStatusDispatch(membershipDispatch, 'none');
  };

  const onFavoriteIconButtonPress = async () => {
    const ncpdp = pharmacyDrugPrice?.pharmacy.ncpdp;
    if (!ncpdp) {
      return;
    }

    onNotificationClose();

    await favoritePharmacyAsyncAction({
      ncpdp,
      navigation,
      reduxDispatch,
      reduxGetState,
      membershipDispatch,
    });
  };

  const renderPickUpSection = (): ReactNode => {
    if (!pharmacyDrugPrice) {
      return null;
    }

    const { name, brand, ncpdp } = pharmacyDrugPrice.pharmacy;

    const pharmacyName = brand ?? name;

    return pharmacyDrugPrice.pharmacy.isMailOrderOnly ? (
      <OfferDeliveryInfo
        pharmacyName={pharmacyName}
        pharmacyNcpdp={ncpdp}
        phoneNumber={pharmacyDrugPrice.pharmacy.phoneNumber}
      />
    ) : (
      <PickUpSection
        pharmacy={pharmacyDrugPrice?.pharmacy}
        onFavoriteIconButtonPress={onFavoriteIconButtonPress}
        hasInsurance={hasInsurance}
        pricingOption={orderSectionProps?.pricingOption}
      />
    );
  };

  const hoursMap = convertHoursToMap(pharmacyDrugPrice?.pharmacy.hours);
  const hoursSection = hoursMap.size ? (
    <>
      <LineSeparator viewStyle={separatorViewStyle} />
      <PharmacyHoursContainer
        pharmacyHours={hoursMap}
        isSkeleton={isContentLoading}
      />
    </>
  ) : null;

  const whatIsNextSection = isNewOrder ? (
    <WhatIsNextSection
      customContent={whatIsNextSectionContent}
      viewStyle={whatIsNextSectionViewStyle}
    />
  ) : null;

  const orderSection = orderSectionProps ? (
    <OrderSection {...orderSectionProps} />
  ) : null;

  const body = (
    <BodyContentContainer
      title={title}
      testID='orderConfirmationScreen'
      viewStyle={{ marginTop: stickyHeight }}
    >
      {whatIsNextSection}
      {orderSection}
      {summarySection}
      {renderPrescriberDetails()}
      {renderPickUpSection()}
      {hoursSection}
      {renderCouponWithLinkButton()}
    </BodyContentContainer>
  );

  const notification = favoritingStatus ? (
    <AllFavoriteNotifications onNotificationClose={onNotificationClose} />
  ) : undefined;

  const onHomePress = () => {
    navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
  };

  const footer = canGoBack ? null : (
    <HomeButton
      onPress={onHomePress}
      isSkeleton={isContentLoading}
      testID='orderConfirmationScreenHomeButton'
    />
  );

  const onNavigateBack = canGoBack
    ? () => navigation.navigate('MedicineCabinet', { backToHome: true })
    : undefined;

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

  return (
    <BasicPageConnected
      stickyIndices={[1]}
      stickyViews={stickyViews}
      body={body}
      showProfileAvatar={true}
      headerViewStyle={headerViewStyle}
      footer={footer}
      bodyViewStyle={bodyViewStyle}
      notification={notification}
      navigateBack={onNavigateBack}
      translateContent={true}
    />
  );
};
