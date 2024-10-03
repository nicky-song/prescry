// Copyright 2020 Prescryptive Health, Inc.

import React, { useState } from 'react';
import {
  IDependentInformation,
  IMemberAddress,
} from '../../../models/api-request-body/create-booking.request-body';
import AddressValidator from '../../../utils/validators/address.validator';
import { CreateAppointmentFormAboutDependent } from './create-appointment-form-about-dependent';
import { CreateAppointmentFormAboutYou } from './create-appointment-form-about-you';
import { CreateAppointmentFormMemberType } from './create-appointment-form-member-type';
import { IServiceTypeState } from '../../../experiences/guest-experience/store/service-type/service-type.reducer';
import { IDependentProfile } from '../../../models/member-profile/member-profile-info';

export interface ICreateAppointmentFormProps {
  onMemberTypeSelected: (value: number) => void;
  onMemberAddressChange: (address?: IMemberAddress) => void;
  onDependentInfoChange: (dependentInfo?: IDependentInformation) => void;
  guardianAddress?: IMemberAddress;
  showAboutYou?: boolean;
  error?: string;
  dependentInfo?: IDependentInformation;
  guardianIsMember: boolean;
  availableDependents: IDependentProfile[];
  serviceType: string;
  aboutDependentDescriptionMyRx?: string;
  serviceTypeInfo: IServiceTypeState;
}

export const CreateAppointmentForm = (props: ICreateAppointmentFormProps) => {
  const {
    guardianAddress,
    onMemberAddressChange,
    showAboutYou,
    error,
    dependentInfo,
    guardianIsMember,
    availableDependents,
    serviceType,
    serviceTypeInfo,
  } = props;

  const [primaryAddress, setPrimaryAddress] = useState(guardianAddress);
  const [memberType, setMemberType] = useState(-1);
  const [showRequestingFor, setShowRequestingFor] = useState<boolean>(false);

  const onMemberTypeSelected = (value: number) => {
    setMemberType(value);
    props.onMemberTypeSelected(value);
  };

  const onPrimaryAddressChange = (address?: IMemberAddress) => {
    setPrimaryAddress(address);
    onMemberAddressChange(address);
  };

  const isAddressValid = (address: IMemberAddress) => {
    if (
      guardianIsMember ||
      (!guardianIsMember && AddressValidator.isAddressValid(address))
    ) {
      if (!showRequestingFor) setShowRequestingFor(true);
      return true;
    }
    return false;
  };

  return (
    <>
      {renderAboutYou()}
      {renderRequestingFor()}
      {renderAboutDependent()}
    </>
  );

  function renderAboutYou() {
    if (showAboutYou) {
      return (
        <CreateAppointmentFormAboutYou
          onAddressChange={onPrimaryAddressChange}
        />
      );
    }
    return null;
  }

  function renderAboutDependent() {
    if (memberType === 1) {
      return (
        <CreateAppointmentFormAboutDependent
          onDependentInfoChange={props.onDependentInfoChange}
          error={error}
          dependentInfo={dependentInfo}
          availableDependents={availableDependents}
          serviceType={serviceType}
          serviceTypeInfo={serviceTypeInfo}
        />
      );
    }
    return null;
  }

  function renderRequestingFor() {
    if (
      (primaryAddress && isAddressValid(primaryAddress)) ||
      showRequestingFor
    ) {
      return (
        <CreateAppointmentFormMemberType
          onMemberTypeSelected={onMemberTypeSelected}
          selectedMemberType={memberType}
        />
      );
    }
    return null;
  }
};
