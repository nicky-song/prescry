// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IGreatPriceScreenContent } from './great-price.screen.content';
import { GreatPriceNavigationProp } from '../../navigation/stack-navigators/claim-alert/claim-alert.stack-navigator';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { greatPriceScreenStyles } from './great-price.screen.styles';
import { PrescribedMedication } from '../../../../components/member/prescribed-medication/prescribed-medication';
import { PrescriptionPharmacyInfo } from '../../../../components/member/prescription-pharmacy-info/prescription-pharmacy-info';
import { PharmacyHoursContainer } from '../../../../components/member/pharmacy-hours-container/pharmacy-hours-container';
import { CustomerSupport } from '../../../../components/member/customer-support/customer-support';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { useClaimAlertContext } from '../../context-providers/claim-alert/use-claim-alert-context';
import { convertHoursToMap } from '../../../../utils/pharmacy-info.helper';
import dateFormatter from '../../../../utils/formatters/date.formatter';

export const GreatPriceScreen = (): ReactElement => {
  const navigation = useNavigation<GreatPriceNavigationProp>();

  const { content, isContentLoading } = useContent<IGreatPriceScreenContent>(
    CmsGroupKey.greatPrice,
    2
  );

  const { getState: reduxGetState } = useReduxContext();

  const onDoneButtonPress = () => {
    navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
  };

  const {
    claimAlertState: { prescribedMedication, pharmacyInfo },
  } = useClaimAlertContext();

  const pharmacyHours = convertHoursToMap(pharmacyInfo?.hours);

  const body = (
    <BodyContentContainer
      title={content.title}
      isSkeleton={isContentLoading}
      testID='greatPriceScreen'
    >
      <BaseText
        isSkeleton={isContentLoading}
        style={greatPriceScreenStyles.descriptionTextStyle}
      >
        {content.description}
      </BaseText>
      {prescribedMedication && (
        <PrescribedMedication
          drugName={prescribedMedication.drugName}
          drugDetails={prescribedMedication.drugDetails}
          price={prescribedMedication.price}
          planPrice={prescribedMedication.planPrice}
          viewStyle={greatPriceScreenStyles.prescribedMedicationViewStyle}
          pharmacyName={pharmacyInfo?.name}
          orderDate={dateFormatter.formatStringToMMDDYYYY(
            prescribedMedication.orderDate
          )}
        />
      )}
      {pharmacyInfo && (
        <PrescriptionPharmacyInfo
          title={pharmacyInfo.name}
          ncpdp={pharmacyInfo.ncpdp}
          phoneNumber={pharmacyInfo.phone}
          pharmacyAddress1={pharmacyInfo.address?.lineOne}
          pharmacyCity={pharmacyInfo.address?.city}
          pharmacyState={pharmacyInfo.address?.state}
          pharmacyZipCode={pharmacyInfo.address?.zip}
          viewStyle={greatPriceScreenStyles.prescriptionPharmacyInfoViewStyle}
        />
      )}
      {pharmacyInfo?.hours.length && (
        <PharmacyHoursContainer
          isCollapsed={true}
          pharmacyHours={pharmacyHours}
        />
      )}
      <BaseButton
        viewStyle={greatPriceScreenStyles.doneButtonViewStyle}
        textStyle={greatPriceScreenStyles.doneButtonTextStyle}
        onPress={onDoneButtonPress}
        testID='greatPriceScreenDoneButton'
      >
        {content.doneButton}
      </BaseButton>
      <CustomerSupport
        viewStyle={greatPriceScreenStyles.customerSupportViewStyle}
      />
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      body={body}
      showProfileAvatar={true}
      translateContent={true}
    />
  );
};
