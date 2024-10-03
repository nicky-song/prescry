// Copyright 2020 Prescryptive Health, Inc.

import { connect, MapStateToProps } from 'react-redux';
import { HomeScreen, IHomeScreenProps } from './home-screen';
import { RootState } from '../store/root-reducer';
import { resetURLAfterNavigation } from '../store/navigation/navigation-reducer.helper';

export const mapStateToProps: MapStateToProps<
  IHomeScreenProps,
  Partial<IHomeScreenProps>,
  RootState
> = (state: RootState, ownProps?): IHomeScreenProps => {
  const resetURL = () => resetURLAfterNavigation(state.features);
  return {
    ...ownProps,
    showMessage: false,
    firstName: state.memberProfile.account.firstName,
    resetURL,
  };
};

export const HomeScreenConnected = connect(mapStateToProps)(HomeScreen);
