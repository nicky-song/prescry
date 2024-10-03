// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { connect } from 'react-redux';
import { MemberNameFormatter } from '../../utils/formatters/member-name-formatter';
import { IBasicPageProps } from './basic-page';
import { BasicPageConnected, mapStateToProps } from './basic-page-connected';
import { RootState } from '../../experiences/guest-experience/store/root-reducer';

jest.mock('react-redux', () => {
  return {
    connect: jest.fn().mockReturnValue(() => jest.fn()),
  };
});

jest.mock('./basic-page', () => ({
  BasicPage: () => <div />,
}));

const connectMock = connect as jest.Mock;

describe('BasicPage connected component', () => {
  it('BasicPageConnected is defined', () => {
    expect(BasicPageConnected).toBeDefined();
  });

  it('calls connect expected number of times', () => {
    expect(connectMock).toBeCalledTimes(1);
  });

  it('maps state to props', () => {
    const ownProps: IBasicPageProps = {
      isCardStyle: true,
    };

    const firstName = 'fake firstName';
    const lastName = 'fake lastName';
    const state = {
      prescribedMember: {
        firstName,
        lastName,
      },
      memberProfile: {
        account: { firstName: 'Ac-first', lastName: 'Ac-last' },
      },
    } as RootState;

    const mappedProps: IBasicPageProps = mapStateToProps(state, ownProps);

    const memberProfileName = MemberNameFormatter.formatName(
      'Ac-first',
      'Ac-last'
    );

    const expectedProps: IBasicPageProps = {
      memberProfileName,
      isCardStyle: true,
    };
    expect(mappedProps).toEqual(expectedProps);
  });
});
