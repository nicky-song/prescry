// Copyright 2020 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../store/root-reducer';
import { setSelectedDateAsyncAction } from '../store/appointment/async-actions/set-selected-date.async-action';
import { setCurrentMonthDataLoadingAsyncAction } from '../store/appointment/async-actions/set-current-month-data-loading.async-action';
import {
  IAppointmentScreenProps,
  IAppointmentScreenActionProps,
  AppointmentScreen,
} from './appointment.screen';
import { createBookingAndNavigateDataLoadingAsyncAction } from '../store/appointment/async-actions/create-booking-and-navigate-data-loading.async-action';
import { getFirstRxGroupTypeByFeatureSwitch } from '../guest-experience-features';
import { IMemberAddress } from '../../../models/api-request-body/create-booking.request-body';
import { resetNewDependentErrorAction } from '../store/appointment/actions/reset-new-dependent-error.action';
import { RxGroupTypesEnum } from '../../../models/member-profile/member-profile-info';
import { getProfilesByGroup } from '../../../utils/profile.helper';
import { changeSlotDataLoadingAsyncAction } from '../store/appointment/async-actions/change-slot-data-loading.async-action';

export const mapStateToProps = (
  rootState: RootState,
  ownProps?: Partial<IAppointmentScreenProps>
): IAppointmentScreenProps => {
  const {
    currentMonth,
    error,
    dependentError,
    maxDate,
    minDate,
    selectedDate,
    selectedLocation,
    selectedService,
    slotsForSelectedDate,
    markedDates,
    availableSlots,
    currentSlot,
  } = rootState.appointment;

  const rxGroupType =
    getFirstRxGroupTypeByFeatureSwitch(rootState.features) || 'CASH';
  const cashProfile = rootState.memberProfile.profileList
    ? getProfilesByGroup(
        rootState.memberProfile.profileList,
        RxGroupTypesEnum.CASH
      )
    : [];
  const hasCashProfile = cashProfile && cashProfile.length > 0;

  const { isMember, childMembers, adultMembers } = hasCashProfile
    ? {
        isMember: true,
        childMembers: cashProfile[0].childMembers ?? [],
        adultMembers: cashProfile[0].adultMembers ?? [],
      }
    : { isMember: false, childMembers: [], adultMembers: [] };

  const cancelWindowHours = rootState.config.cancelAppointmentWindowHours;

  const { address1, address2, county, city, state, zip } = hasCashProfile
    ? cashProfile[0].primary
    : {
        address1: undefined,
        address2: undefined,
        county: undefined,
        city: undefined,
        state: undefined,
        zip: undefined,
      };

  const dates = {
    ...markedDates,
  };
  if (selectedDate) {
    dates[selectedDate] = { selected: true };
  }

  return {
    slotForDate: slotsForSelectedDate,
    markedDates: dates,
    maxDay: maxDate,
    minDay: minDate,
    currentMonth,
    selectedLocation,
    selectedService,
    error,
    dependentError,
    rxGroupType,
    isMember,
    availableSlots,
    memberAddress: {
      address1,
      address2,
      county,
      city,
      state,
      zip,
    } as IMemberAddress,
    cancelWindowHours,
    childMembers,
    adultMembers,
    currentSlot,
    serviceTypeInfo: rootState.serviceType,
    ...ownProps,
  };
};
export const actions: IAppointmentScreenActionProps = {
  onBookPressAsync: createBookingAndNavigateDataLoadingAsyncAction,
  onSlotChangeAsync: changeSlotDataLoadingAsyncAction,
  onDateSelectedAsync: setSelectedDateAsyncAction,
  onMonthChangeAsync: setCurrentMonthDataLoadingAsyncAction,
  resetNewDependentError: resetNewDependentErrorAction,
};
export const AppointmentScreenConnected = connect(
  mapStateToProps,
  actions
)(AppointmentScreen);
