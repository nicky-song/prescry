// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { IMemberListInfoState } from '../store/member-list-info/member-list-info-reducer';
import { RootState } from '../store/root-reducer';
import { HomeScreenConnected, mapStateToProps } from './home-screen-connected';
import { IHomeScreenProps } from './home-screen';

jest.mock('react-redux', () => {
  return {
    connect: jest.fn().mockReturnValue(() => jest.fn()),
  };
});

jest.mock('./home-screen', () => ({
  HomeScreen: () => <div />,
}));

const memberListInfoState: IMemberListInfoState = {
  adultMembers: [],
  childMembers: [],
  loggedInMember: {
    rxGroupType: 'SIE',
  },
  isMember: true,
};

const initialState: RootState = {
  memberListInfo: memberListInfoState,
  memberProfile: {
    account: {
      firstName: 'TestFirst',
    },
  },
} as RootState;

describe('HomeScreenConnected', () => {
  it('HomeScreen should be defined', () => {
    expect(HomeScreenConnected).toBeDefined();
  });
});

it('showMessage should return false irrespective of user type', () => {
  const mapStateToPropsResult = mapStateToProps(initialState, {});
  const expectedProps: IHomeScreenProps = {
    showMessage: false,
    firstName: 'TestFirst',
    resetURL: mapStateToPropsResult.resetURL,
  };

  expect(mapStateToPropsResult).toEqual(expectedProps);
});
