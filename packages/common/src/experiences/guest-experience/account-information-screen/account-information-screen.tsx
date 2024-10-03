// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { MemberNameFormatter } from '../../../utils/formatters/member-name-formatter';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { useMembershipContext } from '../context-providers/membership/use-membership-context.hook';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { accountInformationScreenContent } from './account-information-screen.content';
import { accountInformationScreenStyles as styles } from './account-information-screen.styles';
import dateFormatter from '../../../utils/formatters/date.formatter';
import { formatPhoneNumber } from '../../../utils/formatters/phone-number.formatter';
import { PrimaryTextInput } from '../../../components/inputs/primary-text/primary-text.input';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { SecondaryButton } from '../../../components/buttons/secondary/secondary.button';
import { isEmailValid } from '../../../utils/email.helper';
import { Heading } from '../../../components/member/heading/heading';
import { Label } from '../../../components/text/label/label';
import { BaseText } from '../../../components/text/base-text/base-text';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/stack-navigators/root/root.stack-navigator';
import { ILoginPinScreenRouteProps } from '../login-pin-screen/login-pin-screen';
import { IconButton } from '../../../components/buttons/icon/icon.button';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { updateRecoveryEmailDataLoadingAsyncAction } from '../store/member-list-info/async-actions/update-recovery-email-data-loading.async-action';
import { ProtectedBaseText } from '../../../components/text/protected-base-text/protected-base-text';
import { getPatientInfoByRxGroupType } from '../../../utils/patient.helper';
import {
  ILimitedAccount,
  RxGroupTypesEnum,
} from '../../../models/member-profile/member-profile-info';
import { ILimitedPatient } from '../../../models/patient-profile/limited-patient';

export const AccountInformationScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const {
    headerViewStyle,
    sectionViewStyle,
    itemViewStyle,
    bottomSpacing,
    topSpacing,
    lastSectionViewStyle,
    editableItemViewStyle,
    buttonContainer,
    editButtonViewStyle,
    editButtonTextStyle,
    secondaryButtonViewStyle,
    saveButtonsViewStyle,
  } = styles;

  const { membershipState } = useMembershipContext();

  const { dispatch: reduxDispatch } = useReduxContext();

  const isBlockchain = membershipState.patientList?.length;

  let patient = {} as ILimitedPatient;

  if (isBlockchain) {
    patient = getPatientInfoByRxGroupType(
      membershipState.patientList ?? [],
      RxGroupTypesEnum.CASH
    );
  }

  const account = membershipState.account;

  const patientInfo: ILimitedPatient | ILimitedAccount = isBlockchain
    ? { ...patient }
    : { ...account };

  const { firstName, lastName, recoveryEmail, dateOfBirth, phoneNumber } =
    patientInfo;

  const [isEditEmail, setIsEditEmail] = useState(false);
  const [oldEmailAddress, setOldEmailAddress] =
    useState<string | undefined>(recoveryEmail);
  const [newEmailAddress, setNewEmailAddress] =
    useState<string | undefined>(recoveryEmail);
  const [errorMessage, setErrorMessage] = useState<string>();

  const name = StringFormatter.trimAndConvertToNameCase(
    MemberNameFormatter.formatName(firstName, lastName)
  );

  const formattedDateOfBirth = dateOfBirth
    ? dateFormatter.formatToMMDDYYYY(
        dateFormatter.convertDateOfBirthToDate(dateOfBirth)
      )
    : undefined;

  const onChangePinPress = () => {
    const loginPinScreenRouteProps: ILoginPinScreenRouteProps = {
      isUpdatePin: true,
    };
    navigation.navigate('LoginPin', loginPinScreenRouteProps);
  };

  const onSaveEmailPress = () => {
    setErrorMessage(undefined);
    const isValid = newEmailAddress ? isEmailValid(newEmailAddress) : false;
    if (isValid && newEmailAddress && oldEmailAddress) {
      setOldEmailAddress(newEmailAddress);
      reduxDispatch(
        updateRecoveryEmailDataLoadingAsyncAction(
          {
            email: newEmailAddress,
            oldEmail: oldEmailAddress,
          },
          navigation
        )
      );
      setIsEditEmail(!isEditEmail);
    } else {
      setErrorMessage(accountInformationScreenContent.invalidEmailErrorText);
    }
  };

  const toggleEditEmail = () => {
    setErrorMessage(undefined);
    setNewEmailAddress(recoveryEmail);
    setIsEditEmail(!isEditEmail);
  };

  const onEmailChange = (inputValue: string) => {
    setNewEmailAddress(inputValue);
    setErrorMessage(undefined);
  };

  const renderEditEmail = !isEditEmail ? (
    <View testID='accountInfo_email' style={editableItemViewStyle}>
      <View testID='accountInfo_emailLabel'>
        <Label label={accountInformationScreenContent.emailLabel}>
          <ProtectedBaseText>{recoveryEmail}</ProtectedBaseText>
        </Label>
      </View>
      <View testID='accountInfo_editEmailButton' style={buttonContainer}>
        <IconButton
          testID='editEmailButtonIcon'
          iconName='edit'
          viewStyle={editButtonViewStyle}
          iconTextStyle={editButtonTextStyle}
          onPress={toggleEditEmail}
          accessibilityLabel={
            accountInformationScreenContent.editEmailButtonIconAccessibilityLabel
          }
        />
      </View>
    </View>
  ) : (
    <View testID='accountInfoEditEmail' style={itemViewStyle}>
      <PrimaryTextInput
        label={accountInformationScreenContent.emailLabel}
        textContentType={'emailAddress'}
        onChangeText={onEmailChange}
        value={newEmailAddress}
        errorMessage={errorMessage}
      />
    </View>
  );

  const renderSaveButtons = () => {
    if (isEditEmail) {
      const saveDisabled = newEmailAddress === recoveryEmail;
      return (
        <View style={saveButtonsViewStyle}>
          <BaseButton
            disabled={saveDisabled}
            onPress={onSaveEmailPress}
            testID='accountInformationScreenBaseButtonSave'
          >
            {accountInformationScreenContent.saveButtonText}
          </BaseButton>
          <SecondaryButton
            viewStyle={secondaryButtonViewStyle}
            onPress={toggleEditEmail}
            testID='accountInformationScreenSecondaryButtonCancel'
          >
            {accountInformationScreenContent.cancelButtonText}
          </SecondaryButton>
        </View>
      );
    }
    return null;
  };

  const body = (
    <BodyContentContainer title={accountInformationScreenContent.headerText}>
      <Heading level={2} translateContent={false}>
        {name}
      </Heading>
      <View testID='accountInfo_container1' style={sectionViewStyle}>
        <View style={bottomSpacing}>
          {renderEditEmail}
          <View testID='accountInfo_dateOfBirth' style={itemViewStyle}>
            <Label label={accountInformationScreenContent.dateOfBirthLabel}>
              <ProtectedBaseText>{formattedDateOfBirth}</ProtectedBaseText>
            </Label>
          </View>
          <View testID='accountInfo_mobile' style={itemViewStyle}>
            <Label label={accountInformationScreenContent.mobileLabel}>
              <ProtectedBaseText>
                {formatPhoneNumber(phoneNumber)}
              </ProtectedBaseText>
            </Label>
          </View>
        </View>
      </View>
      <View testID='accountInfo_container2' style={lastSectionViewStyle}>
        <Heading level={2}>
          {accountInformationScreenContent.securityLabel}
        </Heading>
        <View style={topSpacing}>
          <View testID='accountInfo_pin' style={editableItemViewStyle}>
            <View>
              <BaseText>{accountInformationScreenContent.pinLabel}</BaseText>
            </View>
            <View style={buttonContainer}>
              <IconButton
                testID='editPinButtonIcon'
                iconName='edit'
                viewStyle={editButtonViewStyle}
                iconTextStyle={editButtonTextStyle}
                onPress={onChangePinPress}
                accessibilityLabel={
                  accountInformationScreenContent.editPinButtonIconAccessibilityLabel
                }
              />
            </View>
          </View>
          {renderSaveButtons()}
        </View>
      </View>
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      headerViewStyle={headerViewStyle}
      hideNavigationMenuButton={false}
      showProfileAvatar={true}
      navigateBack={navigation.goBack}
      body={body}
      translateContent={true}
    />
  );
};
