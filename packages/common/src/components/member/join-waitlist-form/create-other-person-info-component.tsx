// Copyright 2021 Prescryptive Health, Inc.

import { View, Text } from 'react-native';
import React, { BaseSyntheticEvent, useState } from 'react';
import MaskedInput from 'react-text-mask';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import {
  mandatoryIconUsingStrikeThroughStyle,
  PhoneNumberMaskedValue,
} from '../../../theming/constants';
import { JoinWaitlistScreenContent } from '../../../experiences/guest-experience/join-waitlist-screen/join-waitlist-screen.content';
import { joinWaitlistScreenStyle } from '../../../experiences/guest-experience/join-waitlist-screen/join-waitlist-screen.style';
import { DatePicker } from '../pickers/date/date.picker';
import { DependentPicker } from '../dependent/dependent-picker/dependent-picker';
import { IServiceTypeState } from '../../../experiences/guest-experience/store/service-type/service-type.reducer';
import { sortAndFilterContactsBasedOnMinimumAge } from '../../../utils/sort.helper';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';
import { IDependentProfile } from '../../../models/member-profile/member-profile-info';

export interface IOtherPersonInfoProps {
  onOtherPersonSelected: (selected: string) => void;
  onFirstNameChange: (name: string) => void;
  onLastNameChange: (name: string) => void;
  onDateOfBirthChange: (dob: string) => void;
  onPhoneNumberChange: (event: BaseSyntheticEvent) => void;
  currentInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    serviceType?: string;
    availableWaitlistMembers: IDependentProfile[];
  };
  serviceType: IServiceTypeState;
}

const {
  phoneNumberTextStyle,
  leftItemViewStyle,
  rightItemViewStyle,
  fullItemViewStyle,
  formItemLabelTextStyle,
  mandatoryIconTextStyle,
  locationFormViewStyle,
  otherPersonInfoContainerViewStyle,
  otherPersonConsentTextStyle,
  dependentPickerContainerStyle,
  otherPersonDetailsContainerStyle,
  personDropDownContainerStyle,
} = joinWaitlistScreenStyle;

export const OtherPersonInfo = (props: IOtherPersonInfoProps) => {
  const [identifier, setIdentifier] = useState('');
  const currentYear = new Date().getFullYear();
  const startYearForDateOfBirth =
    currentYear - (props.serviceType.minimumAge ?? 0);

  const endYearForDateOfBirth = currentYear - 120;

  function onOtherPersonSelectedHandler(selected: string) {
    setIdentifier(selected);
    const selectedWaitlistMember =
      selected !== 'newDependent'
        ? props.currentInfo.availableWaitlistMembers.find(
            (x) => x.identifier === selected
          )
        : undefined;
    props.onFirstNameChange(selectedWaitlistMember?.firstName ?? '');
    props.onLastNameChange(selectedWaitlistMember?.lastName ?? '');
    props.onDateOfBirthChange('');
    props.onPhoneNumberChange({
      target: { value: selectedWaitlistMember?.phoneNumber ?? '' },
    } as BaseSyntheticEvent);
    props.onOtherPersonSelected(selected);
  }

  function renderPersonDropDown() {
    const filteredDependentsList = sortAndFilterContactsBasedOnMinimumAge(
      props.currentInfo.availableWaitlistMembers,
      props.serviceType.minimumAge ?? 0
    );
    return (
      <View style={personDropDownContainerStyle} testID='otherPersonPicker'>
        <DependentPicker
          availableDependents={filteredDependentsList as IDependentProfile[]}
          onDependentSelected={onOtherPersonSelectedHandler}
          selectedValue={typeof identifier !== 'string' ? '' : identifier}
          containerStyle={dependentPickerContainerStyle}
        />
        <Text style={otherPersonConsentTextStyle}>
          {JoinWaitlistScreenContent.otherPersonConsentText}
        </Text>
      </View>
    );
  }

  function renderFirstNameField() {
    return (
      <View style={leftItemViewStyle} testID='otherPersonFirstNameContainer'>
        <PrimaryTextInput
          label={JoinWaitlistScreenContent.firstNameText}
          isRequired={true}
          placeholder={props.currentInfo.firstName}
          onChangeText={props.onFirstNameChange}
        />
      </View>
    );
  }

  function renderLastNameField() {
    return (
      <View style={rightItemViewStyle} testID='otherPersonLastNameContainer'>
        <PrimaryTextInput
          label={JoinWaitlistScreenContent.lastNameText}
          isRequired={true}
          placeholder={props.currentInfo.lastName}
          onChangeText={props.onLastNameChange}
        />
      </View>
    );
  }

  function renderPhoneNumberField() {
    return (
      <View style={fullItemViewStyle}>
        <MarkdownText
          textStyle={formItemLabelTextStyle}
          markdownTextStyle={mandatoryIconTextStyle}
        >
          {`${JoinWaitlistScreenContent.phoneNumberText} ${mandatoryIconUsingStrikeThroughStyle}`}
        </MarkdownText>
        <MaskedInput
          value={props.currentInfo.phoneNumber}
          guide={false}
          type='tel'
          onChange={props.onPhoneNumberChange}
          style={phoneNumberTextStyle}
          showMask={true}
          placeholder={JoinWaitlistScreenContent.phoneNumberPlaceholder}
          mask={PhoneNumberMaskedValue}
        />
      </View>
    );
  }

  function renderDateOfBirthField() {
    return (
      <View style={fullItemViewStyle} testID='otherPersonDOBContainer'>
        <DatePicker
          label={JoinWaitlistScreenContent.dateOfBirthText}
          isRequired={true}
          getSelectedDate={props.onDateOfBirthChange}
          defaultValue={props.currentInfo.dateOfBirth}
          startYearForDateOfBirth={startYearForDateOfBirth}
          endYearForDateOfBirth={endYearForDateOfBirth}
        />
      </View>
    );
  }

  function renderOtherPersonNamePhoneAndDOB() {
    return (
      <View
        style={otherPersonDetailsContainerStyle}
        testID='otherPersonDetailsContainer'
      >
        <View style={locationFormViewStyle} testID='otherPersonNameContainer'>
          {renderFirstNameField()}
          {renderLastNameField()}
        </View>
        {renderPhoneNumberField()}
        {renderDateOfBirthField()}
      </View>
    );
  }

  function renderOtherPersonContainer() {
    return identifier === 'newDependent' ? (
      <View
        style={otherPersonInfoContainerViewStyle}
        testID='otherPersonInfoContainer'
      >
        {renderOtherPersonNamePhoneAndDOB()}
      </View>
    ) : null;
  }

  return (
    <View>
      {renderPersonDropDown()}
      {renderOtherPersonContainer()}
    </View>
  );
};
