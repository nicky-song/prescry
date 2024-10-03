// Copyright 2022 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import {
  VerifyPatientInfoNavigationProp,
  VerifyPatientInfoRouteProp,
} from '../../navigation/stack-navigators/account-and-family/account-and-family.stack-navigator';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { verifyPatientInfoScreenStyles as styles } from './verify-patient-info.screen.styles';
import { IVerifyPatientInfoScreenContent } from './verify-patient-info.screen.content';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { View } from 'react-native';
import { PrimaryTextInput } from '../../../../components/inputs/primary-text/primary-text.input';
import { DatePicker } from '../../../../components/member/pickers/date/date.picker';
import { PrimaryCheckBox } from '../../../../components/checkbox/primary-checkbox/primary-checkbox';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { Workflow } from '../../../../models/workflow';

export interface IVerifyPatientInfoScreenRouteProps {
  workflow: Workflow;
  prescriptionId: string;
  userExists?: boolean;
  isDependent?: boolean;
}

export const VerifyPatientInfoScreen = () => {
  const navigation = useNavigation<VerifyPatientInfoNavigationProp>();

  const {
    params: { workflow, prescriptionId, userExists, isDependent },
  } = useRoute<VerifyPatientInfoRouteProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [date, setDate] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const isContinueDisabled = !firstName || !lastName || !date || !isAuthorized;

  const handleSetFirstName = (firstNameInput: string) => {
    setFirstName(firstNameInput);
  };

  const handleSetLastName = (lastNameInput: string) => {
    setLastName(lastNameInput);
  };

  const handleSetDate = (dateInput: string) => {
    setDate(dateInput);
  };

  const handleAuthorizationPress = () => {
    setIsAuthorized(!isAuthorized);
  };

  // TODO: call verifyPrescriptionAsyncAction with with firstName, lastName, date, prescriptionId, ... JPM 05/26/2022
  // TODO: button onPress handler, response = await verifyPrescriptionAsyncAction
  // TODO: if !!response.data.isNewUser, navigate to CreateAccountScreen, conditionally update title content
  // TODO: if !!response.data.phoneNumber, navigate to PhoneNumberVerificationScreen

  const handleContinuePress = () => {
    navigation.navigate('RootStack', {
      screen: 'CreateAccount',
      params: { workflow, prescriptionId, isDependent },
    });
  };

  const {
    lineSeparatorViewStyle,
    topInputViewStyle,
    firstInputViewStyle,
    secondInputViewStyle,
    datePickerViewStyle,
    authorizationTextStyle,
    buttonViewStyle,
    checkboxImageStyle,
  } = styles;

  const groupKey = CmsGroupKey.verifyPatientInfoScreen;

  const {
    content: {
      verifyPatientInfoTitle,
      verifyPatientInfoDescription,
      firstNameLabel,
      firstNamePlaceholder,
      lastNameLabel,
      lastNamePlaceholder,
      dateOfBirthLabel,
      authorizationStatement,
      footerButtonLabel,
    },
    isContentLoading,
  } = useContent<IVerifyPatientInfoScreenContent>(groupKey, 2);

  const renderCheckbox =
    userExists && isDependent ? (
      <PrimaryCheckBox
        checkBoxChecked={isAuthorized}
        checkBoxLabel={authorizationStatement}
        checkBoxValue={authorizationStatement}
        onPress={handleAuthorizationPress}
        checkBoxTextStyle={authorizationTextStyle}
        isSkeleton={isContentLoading}
        checkBoxImageStyle={checkboxImageStyle}
      />
    ) : undefined;

  const body = (
    <BodyContentContainer
      title={verifyPatientInfoTitle}
      isSkeleton={isContentLoading}
    >
      <BaseText isSkeleton={isContentLoading} skeletonWidth={'long'}>
        {verifyPatientInfoDescription}
      </BaseText>
      <LineSeparator viewStyle={lineSeparatorViewStyle} />
      <View style={topInputViewStyle}>
        <PrimaryTextInput
          onChangeText={handleSetFirstName}
          label={firstNameLabel}
          viewStyle={firstInputViewStyle}
          placeholder={firstNamePlaceholder}
          isSkeleton={isContentLoading}
        />
        <PrimaryTextInput
          onChangeText={handleSetLastName}
          label={lastNameLabel}
          viewStyle={secondInputViewStyle}
          placeholder={lastNamePlaceholder}
          isSkeleton={isContentLoading}
        />
      </View>
      <View style={datePickerViewStyle}>
        <DatePicker
          getSelectedDate={handleSetDate}
          label={dateOfBirthLabel}
          isSkeleton={isContentLoading}
        />
      </View>
      <LineSeparator viewStyle={lineSeparatorViewStyle} />
      {renderCheckbox}
      <BaseButton
        disabled={isContinueDisabled}
        viewStyle={buttonViewStyle}
        isSkeleton={isContentLoading}
        onPress={handleContinuePress}
      >
        {footerButtonLabel}
      </BaseButton>
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      body={body}
      showProfileAvatar={true}
      hideNavigationMenuButton={false}
      navigateBack={navigation.goBack}
    />
  );
};
