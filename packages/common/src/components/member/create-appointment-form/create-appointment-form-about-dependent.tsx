// Copyright 2020 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { IServiceTypeState } from '../../../experiences/guest-experience/store/service-type/service-type.reducer';
import {
  IDependentInformation,
  IMemberAddress,
} from '../../../models/api-request-body/create-booking.request-body';
import { sortAndFilterContactsBasedOnMinimumAge } from '../../../utils/sort.helper';
import { PrimaryCheckBox } from '../../checkbox/primary-checkbox/primary-checkbox';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';
import { Label } from '../../text/label/label';
import { PrimaryTextBox } from '../../text/primary-text-box/primary-text-box';
import { AppointmentAddress } from '../appointment-address/appointment-address';
import { DatePicker } from '../pickers/date/date.picker';
import { DependentPicker } from '../dependent/dependent-picker/dependent-picker';
import { createAppointmentFormContent } from './create-appointment-form.content';
import { createAppointmentFormStyles } from './create-appointment-form.styles';
import { IDependentProfile } from '../../../models/member-profile/member-profile-info';

export interface ICreateAppointmentFormAboutDependentProps {
  dependentInfo?: IDependentInformation;
  onDependentInfoChange: (dependentInfo?: IDependentInformation) => void;
  error?: string;
  availableDependents: IDependentProfile[];
  serviceType: string;
  serviceTypeInfo: IServiceTypeState;
}

export const CreateAppointmentFormAboutDependent = (
  props: ICreateAppointmentFormAboutDependentProps
) => {
  const initialAddress: IMemberAddress = {
    address1: '',
    city: '',
    state: '',
    zip: '',
    county: '',
  };
  const {
    dependentInfo,
    onDependentInfoChange,
    error,
    availableDependents,
    serviceTypeInfo,
  } = props;

  const currentYear = new Date().getFullYear();

  const startYearForDateOfBirth =
    currentYear - (serviceTypeInfo.minimumAge ?? 0);

  const endYearForDateOfBirth = currentYear - 120;

  const [sameAddress, setSameAddress] = useState(
    dependentInfo?.addressSameAsParent || false
  );

  const [identifier, setIdentifier] = useState(dependentInfo?.identifier || '');

  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');

  const [dateOfBirth, setDateOfBirth] = useState('');

  const [dependentAddress, setDependentAddress] = useState(
    dependentInfo?.address || initialAddress
  );

  const [newDependentInfo, setNewDependentInfo] = useState(dependentInfo);

  function onFirstNameChange(name: string) {
    setFirstName(name);
  }

  function onLastNameChange(name: string) {
    setLastName(name);
  }

  function onDateOfBirthChange(dob: string) {
    setDateOfBirth(dob);
  }

  function onAddressChange(address: IMemberAddress | undefined) {
    setDependentAddress(address ?? initialAddress);
  }

  useEffect(() => {
    const masterId = availableDependents.find(
      (dep) => dep.identifier === identifier
    )?.masterId;
    setNewDependentInfo({ ...newDependentInfo, identifier, masterId });
  }, [identifier]);

  useEffect(() => {
    setNewDependentInfo({ ...newDependentInfo, firstName: firstName.trim() });
  }, [firstName]);

  useEffect(() => {
    setNewDependentInfo({ ...newDependentInfo, lastName: lastName.trim() });
  }, [lastName]);

  useEffect(() => {
    setNewDependentInfo({ ...newDependentInfo, dateOfBirth });
  }, [dateOfBirth]);

  useEffect(() => {
    setNewDependentInfo({ ...newDependentInfo, address: dependentAddress });
  }, [dependentAddress]);

  useEffect(() => {
    setNewDependentInfo({
      ...newDependentInfo,
      addressSameAsParent: sameAddress,
      address: initialAddress,
    });
    setDependentAddress(initialAddress);
  }, [sameAddress]);

  useEffect(() => {
    onDependentInfoChange(newDependentInfo);
  }, [newDependentInfo]);

  function onDependentSelectedHandler(dependentIdentifier: string) {
    setIdentifier(dependentIdentifier);
  }

  function renderDependentPicker() {
    return (
      <Label
        label={createAppointmentFormContent.anotherPersonDropdownCaption}
        viewStyle={createAppointmentFormStyles.dependentPickerViewStyle}
      >
        <DependentPicker
          availableDependents={sortAndFilterContactsBasedOnMinimumAge(
            availableDependents,
            serviceTypeInfo.minimumAge
          )}
          onDependentSelected={onDependentSelectedHandler}
          selectedValue={typeof identifier !== 'string' ? '' : identifier}
        />
      </Label>
    );
  }
  function renderDependentInfo() {
    return identifier && identifier === 'newDependent' ? (
      <View testID='dependentInfoContainer'>
        {renderDependentNameAndDOB()}
        {renderDependentAddress()}
      </View>
    ) : null;
  }

  function renderDependentNameAndDOB() {
    return (
      <>
        <View
          style={createAppointmentFormStyles.dependentDetailsContainerViewStyle}
          testID='dependentDetailsContainer'
        >
          <View
            style={createAppointmentFormStyles.dependentNameContainerViewStyle}
            testID='dependentFirstNameContainer'
          >
            <PrimaryTextInput
              label={createAppointmentFormContent.firstNameText}
              isRequired={true}
              textContentType='name'
              defaultValue={dependentInfo?.firstName}
              onChangeText={onFirstNameChange}
              viewStyle={createAppointmentFormStyles.dependentInputViewStyle}
              testID='dependentFirstName'
            />
          </View>
          <View
            style={createAppointmentFormStyles.dependentNameContainerViewStyle}
            testID='dependentLastNameContainer'
          >
            <PrimaryTextInput
              label={createAppointmentFormContent.lastNameText}
              isRequired={true}
              textContentType='name'
              defaultValue={dependentInfo?.lastName}
              onChangeText={onLastNameChange}
              viewStyle={createAppointmentFormStyles.dependentInputViewStyle}
              testID='dependentLastName'
            />
          </View>
        </View>
        <View
          style={createAppointmentFormStyles.dependentDOBContainerViewStyle}
          testID='dependentDOBContainer'
        >
          <DatePicker
            label={createAppointmentFormContent.dateOfBirthText}
            isRequired={true}
            getSelectedDate={onDateOfBirthChange}
            defaultValue={dependentInfo?.dateOfBirth}
            startYearForDateOfBirth={startYearForDateOfBirth}
            endYearForDateOfBirth={endYearForDateOfBirth}
          />
          {renderError()}
        </View>
      </>
    );
  }

  function renderAddressComponent() {
    return !sameAddress ? (
      <AppointmentAddress
        onAddressChange={onAddressChange}
        defaultAddress={dependentAddress}
        editable={!sameAddress}
      />
    ) : null;
  }

  function renderDependentAddress() {
    return (
      <View
        style={createAppointmentFormStyles.dependentAddressContainerViewStyle}
        testID='dependentAddressContainer'
      >
        <PrimaryCheckBox
          onPress={toggleSameAddress}
          checkBoxValue='sameAddress'
          checkBoxLabel={
            createAppointmentFormContent.sameAddressAsYoursCheckboxLabel
          }
          checkBoxChecked={sameAddress}
          checkBoxTextStyle={createAppointmentFormStyles.checkboxTextStyle}
          checkBoxImageStyle={createAppointmentFormStyles.checkBoxImageStyle}
        />
        {renderAddressComponent()}
      </View>
    );
  }

  function toggleSameAddress() {
    setSameAddress(!sameAddress);
  }

  function renderError() {
    if (error) {
      return (
        <Text style={createAppointmentFormStyles.errorTextStyle}>{error}</Text>
      );
    }
    return null;
  }

  return (
    <View style={createAppointmentFormStyles.dependentContainerViewStyle}>
      <PrimaryTextBox
        caption={createAppointmentFormContent.aboutAppointmentText}
        textBoxStyle={createAppointmentFormStyles.dependentHeaderTextStyle}
      />
      <PrimaryTextBox
        caption={props.serviceTypeInfo.aboutDependentDescriptionMyRx}
        textBoxStyle={createAppointmentFormStyles.dependentHeaderSubTextStyle}
      />
      {renderDependentPicker()}
      {renderDependentInfo()}
    </View>
  );
};
