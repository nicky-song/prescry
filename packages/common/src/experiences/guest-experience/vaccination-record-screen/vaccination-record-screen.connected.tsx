// Copyright 2021 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { MemberNameFormatter } from '../../../utils/formatters/member-name-formatter';
import { getImmunizationRecordDataLoadingAsyncAction } from '../store/appointment/async-actions/get-immunization-record-data-loading-async-action';
import { RootState } from '../store/root-reducer';
import {
  IVaccinationRecordScreenProps,
  VaccinationRecordScreen,
  IVaccinationRecordScreenDispatchProps,
} from './vaccination-record-screen';

export const mapStateToProps = (
  state: RootState
): IVaccinationRecordScreenProps => {
  const memberFirstName = state.immunizationRecord.immunizationRecord?.length
    ? state.immunizationRecord.immunizationRecord[0].memberFirstName
    : '';
  const memberLastName = state.immunizationRecord.immunizationRecord?.length
    ? state.immunizationRecord.immunizationRecord[0].memberLastName
    : '';
  const memberDateOfBirth = state.immunizationRecord.immunizationRecord?.length
    ? state.immunizationRecord.immunizationRecord[0].memberDateOfBirth
    : '';
  const recipientName = MemberNameFormatter.formatName(
    memberFirstName,
    memberLastName
  );
  const immunizationRecords = state.immunizationRecord.immunizationRecord ?? [];

  return {
    recipientName,
    dateOfBirth: memberDateOfBirth,
    immunizationRecords,
  };
};

export const actions: IVaccinationRecordScreenDispatchProps = {
  getImmunizationRecord: getImmunizationRecordDataLoadingAsyncAction,
};

export const VaccinationRecordScreenConnected = connect(
  mapStateToProps,
  actions
)(VaccinationRecordScreen);
