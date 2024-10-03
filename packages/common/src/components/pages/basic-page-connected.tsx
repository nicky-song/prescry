// Copyright 2020 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../../experiences/guest-experience/store/root-reducer';
import { MemberNameFormatter } from '../../utils/formatters/member-name-formatter';
import { BasicPage, IBasicPageProps } from './basic-page';

export const mapStateToProps = (
  state: RootState,
  ownProps: IBasicPageProps
): IBasicPageProps => {
  const { firstName, lastName } = state.memberProfile.account;

  const memberProfileName = MemberNameFormatter.formatName(firstName, lastName);
  return {
    memberProfileName,
    ...ownProps,
  };
};

export const BasicPageConnected = connect(
  mapStateToProps,
  undefined,
  undefined,
  {
    forwardRef: true,
  }
)(BasicPage);
