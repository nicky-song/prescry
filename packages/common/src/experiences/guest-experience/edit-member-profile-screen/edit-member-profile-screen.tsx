// Copyright 2018 Prescryptive Health, Inc.

import React, { useState, ReactElement } from 'react';
import { TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { editMemberProfileScreenContent } from './edit-member-profile-screen.content';
import { IEditMemberProfileState } from '../store/edit-member-profile/edit-member-profile-reducer';
import {
  IDependentProfile,
  IPrimaryProfile,
  RxGroupTypesEnum,
} from '../../../models/member-profile/member-profile-info';
import {
  editMemberProfileScreenStyle,
  editMemberProfileScreenStyle as styles,
} from './edit-member-profile-screen.styles';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { useNavigation } from '@react-navigation/native';
import {
  EditMemberProfileNavigationProp,
  RootStackNavigationProp,
} from '../navigation/stack-navigators/root/root.stack-navigator';
import { useMembershipContext } from '../context-providers/membership/use-membership-context.hook';
import { getHighestPriorityProfile } from '../../../utils/profile.helper';
import { IconButton } from '../../../components/buttons/icon/icon.button';
import { ILoginPinScreenRouteProps } from '../login-pin-screen/login-pin-screen';
import { BasePicker } from '../../../components/member/pickers/base/base.picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import { BaseText } from '../../../components/text/base-text/base-text';
import { ProtectedBaseText } from '../../../components/text/protected-base-text/protected-base-text';
import { ProtectedView } from '../../../components/containers/protected-view/protected-view';

export interface IEditMemberProfileScreenProps {
  memberInfo: IPrimaryProfile | IDependentProfile;
  isAdult?: boolean;
  secondaryUser?: IDependentProfile;
}

export interface IEditMemberProfileScreenState extends IEditMemberProfileState {
  errorMessage?: string;
  isContactInfoEdited: boolean;
}
export interface IEditMemberProfileScreenActionProps {
  saveMemberContactInfo: (
    navigation: RootStackNavigationProp,
    updatedMember: IEditMemberProfileState
  ) => void;
  setErrorMessage: (errorMessage: string) => void;
}

export const EditMemberProfileScreen = (
  props: IEditMemberProfileScreenProps & IEditMemberProfileScreenActionProps,
  state: IEditMemberProfileScreenState
): ReactElement => {
  const navigation = useNavigation<EditMemberProfileNavigationProp>();

  const { membershipState: memberProfile } = useMembershipContext();
  const { profileList } = memberProfile;

  const highestPriorityProfile = getHighestPriorityProfile(profileList);

  const adultMembers = !highestPriorityProfile?.adultMembers
    ? []
    : highestPriorityProfile.adultMembers.filter((member) => !member.isPrimary);

  const [isContactInfoEdited, setIsContactInfoEdited] = useState<boolean>(
    state.isContactInfoEdited || false
  );
  const [memberInfo, setMemberInfo] = useState<
    IPrimaryProfile | IDependentProfile
  >(props.memberInfo);
  const [secondaryUser, setSecondaryUser] = useState<
    IDependentProfile | undefined
  >(props.secondaryUser);

  const onChangeEmail = (email: string) => {
    if (!memberInfo) {
      return;
    }

    setMemberInfo({ ...memberInfo, email });

    setIsContactInfoEdited(
      checkMemberContactInfoEdited({
        email,
        secondaryMemberIdentifier: secondaryUser
          ? secondaryUser.identifier
          : undefined,
      })
    );

    setMemberInfo(memberInfo);
    setSecondaryUser(undefined);
  };

  const onAdultMemberChange = (
    adultMemberIdentifier: ItemValue,
    _adultMemberIndex: number
  ) => {
    if (!memberInfo) {
      return;
    }

    const secondaryUserById = getSecondaryUserById(
      adultMemberIdentifier as string
    );

    setIsContactInfoEdited(
      checkMemberContactInfoEdited({
        email: memberInfo.email,
        secondaryMemberIdentifier: secondaryUserById
          ? secondaryUserById.identifier
          : '',
      })
    );

    setSecondaryUser(secondaryUserById);
  };

  const onClickSaveButton = () => {
    if (!memberInfo) {
      return;
    }

    if (isContactInfoEdited) {
      props.saveMemberContactInfo(navigation, {
        memberInfo,
        secondaryUser,
      });
    } else {
      props.setErrorMessage(editMemberProfileScreenContent.errorMessage);
    }

    return;
  };

  const onEditPinPress = () => {
    const loginPinParams: ILoginPinScreenRouteProps = { isUpdatePin: true };
    navigation.navigate('LoginPin', loginPinParams);
  };

  const accessibilityLabel = 'edit';

  const renderPin = props.isAdult ? (
    <View style={styles.pinContainer} testID='pinContainer'>
      <View style={styles.textContainer} testID='textContainer'>
        <BaseText style={styles.bodyPinText}>
          {editMemberProfileScreenContent.pin}
        </BaseText>
        <BaseText style={styles.bodyPinText}>
          {editMemberProfileScreenContent.star}
        </BaseText>
      </View>
      <IconButton
        iconName='pen'
        onPress={onEditPinPress}
        accessibilityLabel={accessibilityLabel}
        viewStyle={styles.editButtonViewStyle}
        iconTextStyle={styles.editButtonIconTextStyle}
        iconSolid={true}
      />
    </View>
  ) : null;

  const getFieldValue = (value: string | undefined, isAdult?: boolean) => {
    if (value) {
      return value;
    }

    if (isAdult) {
      return '';
    }

    return editMemberProfileScreenContent.sameAsPrimary;
  };

  const renderEmail = memberInfo?.email ? (
    <ProtectedView style={styles.emailAddressContainer}>
      <TextInput
        value={memberInfo?.email}
        textContentType='emailAddress'
        onChangeText={onChangeEmail}
        style={styles.bodyPlaceholderText}
        keyboardType='email-address'
      />
    </ProtectedView>
  ) : (
    <View style={styles.textContainer} testID='dialingCode'>
      <BaseText style={styles.dialingCode}>
        {getFieldValue(props.memberInfo.email, props.isAdult)}
      </BaseText>
    </View>
  );

  const shouldRenderEmail = (
    <>
      <TextInput
        placeholder={editMemberProfileScreenContent.emailPlaceHolderText}
        style={styles.bodyInputText}
        editable={false}
      />
      {renderEmail}
    </>
  );

  const renderAdultMembersIfAppropriate = () => {
    if (
      adultMembers.length &&
      props.memberInfo.rxGroupType === RxGroupTypesEnum.SIE
    ) {
      return (
        <View style={editMemberProfileScreenStyle.basePickerViewStyle}>
          <TextInput
            style={styles.bodyInputText}
            placeholder={editMemberProfileScreenContent.secondaryUserLabel}
            editable={false}
          />
          <BasePicker
            selectedValue={secondaryUser ? secondaryUser.identifier : ''}
            onValueChange={onAdultMemberChange}
          >
            <Picker.Item
              key={-1}
              label={editMemberProfileScreenContent.noSecondaryLabel}
              value={''}
            />
            {(adultMembers as IDependentProfile[]).map(
              (adultMember: IDependentProfile) => (
                <Picker.Item
                  key={adultMember.identifier}
                  label={`${adultMember.firstName} ${adultMember.lastName}`}
                  value={adultMember.identifier}
                />
              )
            )}
          </BasePicker>
          <TextInput
            style={styles.bodyMobileInfoText}
            placeholder={editMemberProfileScreenContent.memberDescription}
            editable={false}
          />
        </View>
      );
    }
    return null;
  };

  const header = (
    <View style={styles.paddingHeader} testID='headerRxContainer'>
      <ProtectedBaseText style={styles.headerNameText}>
        {`${props.memberInfo.firstName} ${props.memberInfo.lastName}`}
      </ProtectedBaseText>
      <BaseText style={styles.headerRxContainerText}>
        <BaseText style={styles.headerRxTitleText}>
          {editMemberProfileScreenContent.memberIdText}
        </BaseText>
        <ProtectedBaseText style={styles.headerRxIdText}>
          {props.memberInfo.primaryMemberFamilyId || ''}
        </ProtectedBaseText>
      </BaseText>
    </View>
  );

  const onClickSaveButtonPress = () => {
    return () => onClickSaveButton();
  };

  const footer =
    !!adultMembers.length &&
    props.memberInfo.rxGroupType === RxGroupTypesEnum.SIE ? (
      <View style={styles.footerContainerViewStyle}>
        <BaseButton
          testID={'saveButton'}
          disabled={!isContactInfoEdited}
          onPress={onClickSaveButtonPress()}
        >
          {editMemberProfileScreenContent.saveButtonLabel}
        </BaseButton>
      </View>
    ) : null;

  const body = (
    <>
      <View>
        <BaseText style={styles.errorMessageText}>
          {state.errorMessage}
        </BaseText>
        {shouldRenderEmail}
        <TextInput
          placeholder={editMemberProfileScreenContent.mobileNumberText}
          style={styles.bodyInputText}
          editable={false}
        />
        <View style={styles.textContainer} testID='phoneNumber'>
          <BaseText style={styles.dialingCode}>
            {getFieldValue(memberInfo?.phoneNumber, props.isAdult)}
          </BaseText>
        </View>
        <BaseText
          style={styles.bodyMobileInfoText}
          children={editMemberProfileScreenContent.mobileNumberDescription}
        />
        {renderPin}
        {renderAdultMembersIfAppropriate()}
      </View>
      {footer}
    </>
  );

  const getSecondaryUserById = (id: string) => {
    return (adultMembers as IDependentProfile[]).find(
      (member: IDependentProfile) => member.identifier === id
    );
  };

  const checkMemberContactInfoEdited = (contactMemberInfo: {
    email?: string;
    secondaryMemberIdentifier?: string;
  }) => {
    const isEmailChanged =
      contactMemberInfo.email &&
      contactMemberInfo.email !== props.memberInfo.email;
    const isSecondaryMemberIdentifierChanged = props.secondaryUser
      ? contactMemberInfo.secondaryMemberIdentifier !==
        props.secondaryUser.identifier
      : !!contactMemberInfo.secondaryMemberIdentifier;

    return isEmailChanged || isSecondaryMemberIdentifierChanged;
  };

  return (
    <BasicPageConnected
      navigateBack={navigation.goBack}
      bodyViewStyle={footer === null ? undefined : styles.bodyViewStyle}
      header={header}
      body={body}
      translateContent={true}
    />
  );
};
