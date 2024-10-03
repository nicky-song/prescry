// Copyright 2020 Prescryptive Health, Inc.

import { connect } from 'react-redux';
import { RootState } from '../../../../experiences/guest-experience/store/root-reducer';
import {
  IPharmacyLocationsListProps,
  PharmacyLocationsList,
  IPharmacyLocationsDispatchProps,
} from './pharmacy-locations-list';
import { getProviderLocationsDataLoadingAsyncAction } from '../../../../experiences/guest-experience/store/provider-locations/async-actions/get-provider-locations-data-loading.async-action';

export const mapStateToProps = (
  state: RootState,
  ownProps?: IPharmacyLocationsListProps
): IPharmacyLocationsListProps => {
  const pharmacyLocations = state.providerLocations.providerLocations;
  const serviceType = state.serviceType.type || '';
  const serviceNameMyRx = state.serviceType.serviceNameMyRx;
  return {
    pharmacyLocations,
    ...ownProps,
    serviceType,
    serviceNameMyRx,
  };
};

export const dispatchActions: IPharmacyLocationsDispatchProps = {
  getProviderLocations: getProviderLocationsDataLoadingAsyncAction,
};

export const PharmacyLocationsListConnected = connect(
  mapStateToProps,
  dispatchActions
)(PharmacyLocationsList);
