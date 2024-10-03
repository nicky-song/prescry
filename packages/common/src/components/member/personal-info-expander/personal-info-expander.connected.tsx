// Copyright 2020 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../../../experiences/guest-experience/store/root-reducer';
import { MemberNameFormatter } from '../../../utils/formatters/member-name-formatter';
import {
  IPersonalInfoExpanderDataProps,
  PersonalInfoExpander,
} from './personal-info-expander';

export const mapStateToProps = (
  state: RootState,
  ownProps?: Partial<IPersonalInfoExpanderDataProps>
): IPersonalInfoExpanderDataProps => {
  const firstName = state.testResult.memberFirstName;
  const lastName = state.testResult.memberLastName;
  const dateOfBirth = state.testResult.memberDateOfBirth;
  const memberProfileName = MemberNameFormatter.formatName(firstName, lastName);

  const personalInformation = {
    dateOfBirth,
    name: memberProfileName,
  };
  const PersonalInfoExpanderData = {
    ...personalInformation,
  };

  return {
    ...ownProps,
    PersonalInfoExpanderData,
  };
};

export const PersonalInfoExpanderConnected = connect(mapStateToProps)(
  PersonalInfoExpander
);
