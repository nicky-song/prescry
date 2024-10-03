// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { ReactElement, useState } from 'react';
import { View } from 'react-native';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { AlternativeMedication } from '../../../../components/member/alternative-medication/alternative-medication';
import { CustomerSupport } from '../../../../components/member/customer-support/customer-support';
import { Heading } from '../../../../components/member/heading/heading';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { PrescribedMedication } from '../../../../components/member/prescribed-medication/prescribed-medication';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { useClaimAlertContext } from '../../context-providers/claim-alert/use-claim-alert-context';
import {
  RecommendedAlternativesNavigationProp,
  RecommendedAlternativesRouteProp,
} from '../../navigation/stack-navigators/claim-alert/claim-alert.stack-navigator';
import { recommendedAlternativesScreenStyles } from './recommended-alternatives.screen.styles';
import { IWhoSaves } from '../../../../models/claim-alert/claim-alert';
import dateFormatter from '../../../../utils/formatters/date.formatter';
import { IconButton } from '../../../../components/buttons/icon/icon.button';
import { KeepCurrentPrescriptionSection } from '../../../../components/member/keep-current-prescription/keep-current-prescription.section';
import { convertHoursToMap } from '../../../../utils/pharmacy-info.helper';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import { AllFavoriteNotifications } from '../../../../components/notifications/all-favorite/all-favorite.notifications';
import { setFavoritingStatusDispatch } from '../../state/membership/dispatch/set-favoriting-status.dispatch';
import { ContactDoctorContainer } from '../../../../components/member/contact-doctor/contact-doctor-container';
import { useShoppingContext } from '../../context-providers/shopping/use-shopping-context.hook';
import { IAlternativeMedication } from '../../../../models/alternative-medication';
import { IPrescribedMedication } from '../../../../models/prescribed-medication';
import { IContactInfo } from '../../../../models/contact-info';
import { SwitchYourMedicationSlideUpModal } from './slide-up-modals/switch-your-medication/switch-your-medication.slide-up-modal';
import { LowestPriceSlideUpModal } from './slide-up-modals/lowest-price/lowest-price.slide-up-modal';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IRecommendedAlternativesScreenContent } from './recommended-alternatives.screen.content';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';

export interface IRecommendedAlternativesRouteProps {
  whoSavesMock?: IWhoSaves;
  isCombinationMock?: boolean;
  isBrandMock?: boolean;
  isShopping?: boolean;
}

export const RecommendedAlternativesScreen = (): ReactElement => {
  const navigation = useNavigation<RecommendedAlternativesNavigationProp>();
  const { params } = useRoute<RecommendedAlternativesRouteProp>();
  const isShopping = params && params.isShopping;
  const { content, isContentLoading } =
    useContent<IRecommendedAlternativesScreenContent>(
      CmsGroupKey.recommendedAlternatives,
      2
    );

  const {
    claimAlertState: {
      prescribedMedication: claimAlertPrescribedMedication,
      alternativeMedicationList: claimAlertAlternativeMedicationList,
      pharmacyInfo: claimAlertPharmacyInfo,
      prescriber: claimAlertPrescriber,
    },
  } = useClaimAlertContext();

  const {
    shoppingState: { alternativeDrugPrice, prescriptionInfo },
  } = useShoppingContext();

  const prescribedMedication: IPrescribedMedication | undefined =
    isShopping && alternativeDrugPrice
      ? alternativeDrugPrice.prescribedMedication
      : claimAlertPrescribedMedication;

  const alternativeMedicationList: IAlternativeMedication[] | undefined =
    isShopping && alternativeDrugPrice
      ? alternativeDrugPrice.alternativeMedicationList
      : claimAlertAlternativeMedicationList;

  const pharmacyInfo: IContactInfo | undefined =
    isShopping && alternativeDrugPrice
      ? alternativeDrugPrice.pharmacyInfo
      : claimAlertPharmacyInfo;

  const prescriber: Pick<IContactInfo, 'name' | 'phone'> | undefined =
    isShopping && prescriptionInfo?.practitioner
      ? {
          name: prescriptionInfo.practitioner?.name,
          phone: prescriptionInfo.practitioner?.phoneNumber,
        }
      : claimAlertPrescriber;
  const {
    membershipState: { favoritingStatus },
    membershipDispatch,
  } = useMembershipContext();

  const [currentSlideUpModalShowing, setCurrentSlideUpModalShowing] =
    useState<'none' | 'switch-your-medication' | 'lowest-price'>('none');

  const onSlideUpModalClosePress = () => {
    setCurrentSlideUpModalShowing('none');
  };

  const onLearnMorePress = () => {
    setCurrentSlideUpModalShowing('switch-your-medication');
  };

  const onLowestPricePress = () => {
    setCurrentSlideUpModalShowing('lowest-price');
  };

  const alternativeMedications = () => {
    return alternativeMedicationList?.map((alternativeMedication, index) => {
      return (
        <View
          style={
            recommendedAlternativesScreenStyles.alternativeMedicationContainerViewStyle
          }
          key={
            alternativeMedication.prescriptionDetailsList[0].productName +
            (alternativeMedication.prescriptionDetailsList.length > 1
              ? alternativeMedication.prescriptionDetailsList[1].productName
              : '')
          }
        >
          <AlternativeMedication
            {...alternativeMedication}
            memberSaves={alternativeMedication.memberSaves}
            planSaves={alternativeMedication.planSaves}
            testID={`alternativeMedication${index}`}
          />
          <LineSeparator
            viewStyle={
              recommendedAlternativesScreenStyles.lineSeparatorViewStyle
            }
          />
        </View>
      );
    });
  };

  const onKeepCurrentPrescriptionPress = () => {
    navigation.navigate('RootStack', {
      screen: 'MedicineCabinet',
    });
  };
  const sentToPharmacyDate = prescribedMedication?.orderDate
    ? dateFormatter.formatStringToMMDDYYYY(prescribedMedication.orderDate)
    : undefined;

  const keepCurrentPrescriptionSection =
    !!pharmacyInfo &&
    !!pharmacyInfo.name &&
    !!pharmacyInfo.ncpdp &&
    !!pharmacyInfo.phone &&
    !!pharmacyInfo.address &&
    !!pharmacyInfo.address.lineOne &&
    !!pharmacyInfo.address.city &&
    !!pharmacyInfo.address.state &&
    !!pharmacyInfo.address.zip ? (
      <KeepCurrentPrescriptionSection
        pharmacyName={pharmacyInfo.name}
        pharmacyNcpdp={pharmacyInfo.ncpdp}
        pharmacyHours={convertHoursToMap(pharmacyInfo.hours)}
        pharmacyPhoneNumber={pharmacyInfo.phone}
        pharmacyAddress1={pharmacyInfo.address.lineOne}
        pharmacyCity={pharmacyInfo.address.city}
        pharmacyState={pharmacyInfo.address.state}
        pharmacyZipCode={pharmacyInfo.address.zip}
        onKeepCurrentPrescriptionPress={onKeepCurrentPrescriptionPress}
        viewStyle={
          recommendedAlternativesScreenStyles.keepCurrentPrescriptionSectionViewStyle
        }
      />
    ) : null;

  const body = (
    <BodyContentContainer
      testID='recommendedAlternativesScreen'
      isSkeleton={isContentLoading}
    >
      {prescribedMedication && (
        <PrescribedMedication
          {...prescribedMedication}
          viewStyle={
            recommendedAlternativesScreenStyles.prescribedMedicationViewStyle
          }
          pharmacyName={pharmacyInfo?.name}
          orderDate={sentToPharmacyDate}
          onIconPress={onLowestPricePress}
          isDigitalRx={isShopping}
        />
      )}
      <BaseText
        style={recommendedAlternativesScreenStyles.headingContainerTextStyle}
      >
        <Heading
          level={1}
          textStyle={recommendedAlternativesScreenStyles.headingTextStyle}
          isSkeleton={isContentLoading}
        >
          {content.heading}
        </Heading>
        <IconButton
          iconName='info-circle'
          accessibilityLabel='learnMore'
          onPress={onLearnMorePress}
          iconTextStyle={
            recommendedAlternativesScreenStyles.iconButtonTextStyle
          }
          viewStyle={recommendedAlternativesScreenStyles.iconButtonViewStyle}
          testID='learnMoreIcon'
        />
      </BaseText>
      {alternativeMedications()}
      <ContactDoctorContainer
        doctorName={prescriber?.name}
        phoneNumber={prescriber?.phone}
        viewStyle={
          recommendedAlternativesScreenStyles.contactDoctorContainerViewStyle
        }
      />
      <LineSeparator
        viewStyle={recommendedAlternativesScreenStyles.lineSeparatorViewStyle}
      />
      {keepCurrentPrescriptionSection}
      <CustomerSupport
        viewStyle={recommendedAlternativesScreenStyles.customerSupportViewStyle}
        testID='recommendedAlternativesCustomerSupport'
      />
    </BodyContentContainer>
  );

  const onNotificationClose = () => {
    setFavoritingStatusDispatch(membershipDispatch, 'none');
  };

  const notification = favoritingStatus ? (
    <AllFavoriteNotifications onNotificationClose={onNotificationClose} />
  ) : undefined;

  return (
    <BasicPageConnected
      body={body}
      showProfileAvatar={true}
      modals={[
        <SwitchYourMedicationSlideUpModal
          key='switch-your-medication-slide-up-modal'
          onClosePress={onSlideUpModalClosePress}
          isVisible={currentSlideUpModalShowing === 'switch-your-medication'}
        />,
        <LowestPriceSlideUpModal
          key='lowest-price-slide-up-modal'
          onClosePress={onSlideUpModalClosePress}
          isVisible={currentSlideUpModalShowing === 'lowest-price'}
          title={pharmacyInfo?.name}
          phoneNumber={pharmacyInfo?.phone}
          pharmacyAddress1={pharmacyInfo?.address?.lineOne}
          pharmacyCity={pharmacyInfo?.address?.city}
          pharmacyState={pharmacyInfo?.address?.state}
          pharmacyZipCode={pharmacyInfo?.address?.zip}
        />,
      ]}
      navigateBack={isShopping ? navigation.goBack : undefined}
      translateContent={true}
      notification={notification}
    />
  );
};
