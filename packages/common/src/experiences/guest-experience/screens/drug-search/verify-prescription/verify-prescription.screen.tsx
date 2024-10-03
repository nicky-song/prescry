// Copyright 2021 Prescryptive Health, Inc.

import { View } from 'react-native';
import React, { ReactElement, useEffect, useState } from 'react';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { SecondaryButton } from '../../../../../components/buttons/secondary/secondary.button';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { PrimaryTextInput } from '../../../../../components/inputs/primary-text/primary-text.input';
import { Heading } from '../../../../../components/member/heading/heading';
import { LineSeparator } from '../../../../../components/member/line-separator/line-separator';
import { PrescriptionTitle } from '../../../../../components/member/prescription-title/prescription-title';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { verifyPrescriptionScreenStyle } from './verify-prescription.screen.style';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import { IAddress } from '../../../../../models/address';
import { prescriptionTransferConfirmationNavigateDispatch } from '../../../store/navigation/dispatch/drug-search/prescription-transfer-confirmation-navigate.dispatch';
import { AppointmentAddress } from '../../../../../components/member/appointment-address/appointment-address';
import AddressValidator from '../../../../../utils/validators/address.validator';
import { IMemberAddress } from '../../../../../models/api-request-body/create-booking.request-body';
import { ITransferPrescriptionRequestBody } from '../../../../../models/api-request-body/transfer-prescription.request-body';
import {
  ITransferPrescriptionAsyncActionArgs,
  transferPrescriptionAsyncAction,
} from '../../../state/drug-search/async-actions/transfer-prescription.async-action';
import { IPharmacy } from '../../../../../models/pharmacy';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  DrugSearchStackNavigationProp,
  VerifyPrescriptionRouteProp,
} from '../../../navigation/stack-navigators/drug-search/drug-search.stack-navigator';
import { navigateHomeScreenDispatch } from '../../../store/navigation/dispatch/navigate-home-screen.dispatch';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { IVerifyPrescriptionScreenContent } from '../../../../../models/cms-content/verify-prescription-screen.ui-content';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';
import { ProtectedView } from '../../../../../components/containers/protected-view/protected-view';
import { PricingOption } from '../../../../../models/pricing-option';

export interface IVerifyPrescriptionScreenRouteProps {
  hasBackNavigation?: boolean;
  pricingOption?: PricingOption;
}

export const VerifyPrescriptionScreen = (): ReactElement => {
  const [prescriptionNumber, setPrescriptionNumber] =
    useState<string | undefined>();
  const [isAddressVisible, setAddressVisibile] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [patientAddress, setPatientAddress] =
    useState<IMemberAddress | undefined>();

  const { params } = useRoute<VerifyPrescriptionRouteProp>();
  const { hasBackNavigation = false, pricingOption } = params;

  const {
    drugSearchState: {
      selectedDrug,
      selectedConfiguration,
      selectedPharmacy,
      selectedSourcePharmacy,
    },
  } = useDrugSearchContext();

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const navigation = useNavigation<DrugSearchStackNavigationProp>();

  const {
    locationInfoViewStyle,
    addressComponentViewStyle,
    verifyPrescriptionContentTextStyle,
    prescriptionNumberInputViewStyle,
    submitButtonViewStyle,
    toFromTextStyle,
    pharmacyLineSeparatorViewStyle,
    verifyPrescriptionArrivalNoticeTextStyle,
    needMoreInformationNoticeTextStyle,
  } = verifyPrescriptionScreenStyle;

  const groupKey = CmsGroupKey.verifyPrescription;

  const { content, isContentLoading } =
    useContent<IVerifyPrescriptionScreenContent>(groupKey, 2);

  const loginUserProfiles = reduxGetState().memberProfile.profileList;

  const sieMember = loginUserProfiles.find(
    (profile) => profile.rxGroupType === 'SIE'
  );

  const cashMember = loginUserProfiles.find(
    (profile) => profile.rxGroupType === 'CASH'
  );

  useEffect(() => {
    if (!isAddressVisible) {
      if (!sieMember) {
        const isAddressExist =
          cashMember?.primary.address1 &&
          cashMember.primary.city &&
          cashMember.primary.state &&
          cashMember.primary.zip;
        if (!isAddressExist) {
          setAddressVisibile(true);
          setDisableButton(true);
        } else {
          setAddressVisibile(false);
          setDisableButton(false);
        }
      } else {
        setAddressVisibile(false);
        setDisableButton(false);
      }
    }
  });

  const onNavigateBack = hasBackNavigation ? navigation.goBack : undefined;

  const onCancelPress = async () => {
    await navigateHomeScreenDispatch(reduxDispatch, reduxGetState, navigation);
  };

  const onSubmitPress = async () => {
    const transferPrescriptionRequestBody: ITransferPrescriptionRequestBody = {
      memberAddress: patientAddress,
      sourceNcpdp: selectedSourcePharmacy?.ncpdp ?? '',
      destinationNcpdp: selectedPharmacy?.pharmacy.ncpdp ?? '',
      ndc: selectedConfiguration?.ndc ?? '',
      daysSupply: selectedConfiguration?.supply ?? 0,
      quantity: selectedConfiguration?.quantity ?? 0,
      prescriptionNumber,
    };
    const args: ITransferPrescriptionAsyncActionArgs = {
      transferPrescriptionRequestBody,
      reduxDispatch,
      reduxGetState,
      navigation,
    };
    await transferPrescriptionAsyncAction(args);
    prescriptionTransferConfirmationNavigateDispatch(navigation, pricingOption);
  };

  const onAddressChange = (memberAddress: IMemberAddress | undefined) => {
    const isAddressValid =
      AddressValidator.isAddressWithoutCountyValid(memberAddress);
    if (isAddressValid) setPatientAddress(memberAddress);
    setDisableButton(!isAddressValid);
  };

  const drugVariant =
    selectedConfiguration?.ndc && selectedDrug
      ? drugSearchResultHelper.getVariantByNdc(
          selectedConfiguration.ndc,
          selectedDrug
        )
      : undefined;

  const onPrescriptionNumberChange = (newPrescriptionNumber: string) => {
    if (prescriptionNumber !== newPrescriptionNumber) {
      setPrescriptionNumber(newPrescriptionNumber);
    }
  };
  const renderPrescriptionTitle = (
    <PrescriptionTitle
      productName={selectedDrug?.name ?? ''}
      strength={drugVariant?.strength}
      formCode={drugVariant?.formCode ?? ''}
      unit={drugVariant?.strengthUnit}
      quantity={selectedConfiguration?.quantity ?? 0}
      refills={0}
      headingLevel={2}
      isSkeleton={isContentLoading}
    />
  );
  const renderPharmacyAddress = (address: IAddress): string => {
    const formattedAddress = [address.lineOne, address.lineTwo]
      .filter(Boolean)
      .join(' ');
    const formatted =
      `${formattedAddress}, ${address.city}, ${address.state} ${address.zip}`.trim();
    return formatted;
  };

  const renderPharmacyDetails = (pharmacy?: IPharmacy) => {
    const pharmacyBrandOrName = pharmacy?.brand ?? pharmacy?.name;

    if (pharmacyBrandOrName && pharmacy?.address) {
      return (
        <ProtectedView style={locationInfoViewStyle}>
          <BaseText isSkeleton={isContentLoading} skeletonWidth='medium'>
            {pharmacyBrandOrName}
          </BaseText>
          <BaseText isSkeleton={isContentLoading} skeletonWidth='medium'>
            {renderPharmacyAddress(pharmacy.address)}
          </BaseText>
        </ProtectedView>
      );
    }
    return null;
  };

  const renderAddressComponent = isAddressVisible ? (
    <View
      testID='VerifyPrescAddressComponent'
      style={addressComponentViewStyle}
    >
      <LineSeparator />
      <BaseText
        style={addressComponentViewStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.addressComponentHeaderText}
      </BaseText>
      <AppointmentAddress
        onAddressChange={onAddressChange}
        isCountyVisible={false}
      />
    </View>
  ) : null;

  const renderPharmacyTransferDetails = (
    <>
      <BaseText
        style={toFromTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.fromLabel}
      </BaseText>
      {renderPharmacyDetails(selectedSourcePharmacy)}
      <LineSeparator viewStyle={pharmacyLineSeparatorViewStyle} />
      <BaseText
        style={toFromTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.toLabel}
      </BaseText>
      {renderPharmacyDetails(selectedPharmacy?.pharmacy)}
      <BaseText
        style={verifyPrescriptionArrivalNoticeTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.prescriptionArrivalNotice}
      </BaseText>
      <LineSeparator viewStyle={pharmacyLineSeparatorViewStyle} />
    </>
  );

  const renderBody = (
    <BodyContentContainer>
      <Heading level={1} isSkeleton={isContentLoading} skeletonWidth='long'>
        {content.verifyPrescriptionHeader}
      </Heading>
      <BaseText
        style={verifyPrescriptionContentTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.verifyPrescriptionContent}
      </BaseText>
      {renderPharmacyTransferDetails}
      <Heading level={2} isSkeleton={isContentLoading} skeletonWidth='long'>
        {content.prescriptionInfoHeader}
      </Heading>
      <BaseText
        style={needMoreInformationNoticeTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.needMoreInformationNotice}
      </BaseText>
      {renderPrescriptionTitle}
      <PrimaryTextInput
        label={content.prescriptionNumberText}
        isRequired={false}
        placeholder={content.prescriptionNumberPlaceholder}
        onChangeText={onPrescriptionNumberChange}
        viewStyle={prescriptionNumberInputViewStyle}
        testID='verifyPrescriptionScreenPrescriptionNumberTextInput'
      />
      {renderAddressComponent}
      <BaseButton
        disabled={disableButton}
        onPress={onSubmitPress}
        viewStyle={submitButtonViewStyle}
        testID='verifyPrescriptionScreenSubmitButton'
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.submitButtonText}
      </BaseButton>
      <SecondaryButton
        onPress={onCancelPress}
        testID='verifyPrescriptionScreenCancelButton'
        isSkeleton={isContentLoading}
        skeletonWidth='medium'
      >
        {content.cancelButtonText}
      </SecondaryButton>
    </BodyContentContainer>
  );
  return (
    <BasicPageConnected
      body={renderBody}
      hideNavigationMenuButton={false}
      navigateBack={onNavigateBack}
      showProfileAvatar={true}
      logoClickAction={LogoClickActionEnum.CONFIRM}
      translateContent={true}
    />
  );
};
