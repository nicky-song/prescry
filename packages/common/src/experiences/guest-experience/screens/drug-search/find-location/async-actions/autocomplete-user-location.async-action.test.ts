// Copyright 2022 Prescryptive Health, Inc.

import { locationCoordinatesMock } from '../../../../__mocks__/location-coordinate.mock';
import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { autocompleteUserLocationDispatch } from '../dispatch/autocomplete-user-location.dispatch';
import {
  IAutocompleteUserLocationAsyncActionArgs,
  autocompleteUserLocationAsyncAction,
} from './autocomplete-user-location.async-action';

jest.mock('../dispatch/autocomplete-user-location.dispatch');
const autocompleteUserLocationDispatchMock =
  autocompleteUserLocationDispatch as jest.Mock;

describe('autocompleteUserLocationAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches autocomplete location with default props', async () => {
    const argsMock: IAutocompleteUserLocationAsyncActionArgs = {
      query: 'zip',
      findLocationDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
    };
    await autocompleteUserLocationAsyncAction(argsMock);

    expect(autocompleteUserLocationDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('dispatches autocomplete location with expected props', async () => {
    const argsMock: IAutocompleteUserLocationAsyncActionArgs = {
      defaultSet: true,
      notFoundErrorMessage: 'Error Found',
      location: locationCoordinatesMock,
      findLocationDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await autocompleteUserLocationAsyncAction(argsMock);

    expect(autocompleteUserLocationDispatchMock).toHaveBeenCalledWith(argsMock);
  });
});
