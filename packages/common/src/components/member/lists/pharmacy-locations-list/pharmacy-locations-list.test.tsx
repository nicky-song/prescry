// Copyright 2020 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { PharmacyLocationsList } from './pharmacy-locations-list';
import { IProviderLocationDetails } from '../../../../models/api-response/provider-location-response';
import { pharmacyLocationsListStyle } from './pharmacy-locations-list.style';
import { PharmacySearchLocationsListContent } from './pharmacy-locations-list.content';
import { TitleDescriptionCardItem } from '../../items/title-description-card-item/title-description-card-item';
import { DistancePicker } from '../../distance-picker/distance-picker';
import { PrimaryTextBox } from '../../../text/primary-text-box/primary-text-box';
import { PharmacySearchResultItem } from '../../items/pharmacy-search-result-item/pharmacy-search-result-item';
import {
  guestExperienceCustomEventLogger,
  CustomAppInsightEvents,
} from '../../../../experiences/guest-experience/guest-experience-logger.middleware';
import { SearchBox } from '../../search-box/search-box';
import { navigateJoinWaitlistAsyncAction } from '../../../../experiences/guest-experience/store/navigation/actions/navigate-join-waitlist.async-action';
import { useNavigation } from '@react-navigation/native';
import { appointmentsStackNavigationMock } from '../../../../experiences/guest-experience/navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { getProviderLocationDetailsDataLoadingAsyncAction } from '../../../../experiences/guest-experience/store/provider-location-details/async-actions/get-provider-location-details-data-loading.async-action';
import {
  ReduxDispatch,
  ReduxGetState,
} from '../../../../experiences/guest-experience/context-providers/redux/redux.context';
import { useReduxContext } from '../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';

jest.mock('../../../../components/image-asset/image-asset');
jest.mock(
  '../../items/title-description-card-item/title-description-card-item',
  () => ({ TitleDescriptionCardItem: () => <div /> })
);
jest.mock(
  '../../../../experiences/guest-experience/guest-experience-logger.middleware'
);
jest.mock('../../search-box/search-box', () => ({ SearchBox: () => <div /> }));
jest.mock('../../distance-picker/distance-picker', () => ({
  DistancePicker: () => <div />,
}));
jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
jest.mock(
  '../../items/pharmacy-search-result-item/pharmacy-search-result-item',
  () => ({ PharmacySearchResultItem: () => <div /> })
);
jest.mock(
  '../../../../experiences/guest-experience/store/navigation/actions/navigate-join-waitlist.async-action'
);
jest.mock('@react-navigation/native');
jest.mock(
  '../../../../experiences/guest-experience/store/provider-location-details/async-actions/get-provider-location-details-data-loading.async-action'
);
jest.mock(
  '../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);

const pharmacyLocationsListProps: IProviderLocationDetails[] = [
  {
    id: '1',
    providerName: 'Bartell Drugs',
    locationName: 'Bartell Drugs',
    address1: '7370 170th Ave NE',
    city: 'Redmond',
    state: 'WA',
    zip: '98052',
    phoneNumber: '(425) 977-5489',
  },
];

const navigateJoinWaitlistAsyncActionMock =
  navigateJoinWaitlistAsyncAction as jest.Mock;
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;
const useStateMock = useState as jest.Mock;
const setInputMock = jest.fn();
const setIsValidZipSearchMock = jest.fn();
const setSearchedMock = jest.fn();
const setLocationsMock = jest.fn();
const setDistanceInMilesMock = jest.fn();
const setShowedOnceMock = jest.fn();
const setSearchButtonPressedMock = jest.fn();
const navigationMock = useNavigation as jest.Mock;
const getProviderLocationDetailsDataLoadingAsyncActionMock =
  getProviderLocationDetailsDataLoadingAsyncAction as jest.Mock;
const reduxDispatchMock = {} as ReduxDispatch;
const reduxGetStateMock = {} as ReduxGetState;
const useReduxContextMock = useReduxContext as jest.Mock;

interface INewStateArguments {
  input?: string;
  isValidZipSearch?: boolean;
  searched?: boolean;
  locations?: IProviderLocationDetails[];
  distanceInMiles?: number;
  showedOnce?: boolean;
  searchButtonPressed?: boolean;
}

const resetState = (newState?: INewStateArguments) => {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce([newState?.input ?? '', setInputMock]);
  useStateMock.mockReturnValueOnce([
    newState?.isValidZipSearch ?? false,
    setIsValidZipSearchMock,
  ]);
  useStateMock.mockReturnValueOnce([
    newState?.searched ?? false,
    setSearchedMock,
  ]);
  useStateMock.mockReturnValueOnce([
    newState?.locations ?? [],
    setLocationsMock,
  ]);
  useStateMock.mockReturnValueOnce([
    newState?.distanceInMiles ?? 10,
    setDistanceInMilesMock,
  ]);
  useStateMock.mockReturnValueOnce([
    newState?.showedOnce ?? false,
    setShowedOnceMock,
  ]);
  useStateMock.mockReturnValueOnce([
    newState?.searchButtonPressed ?? false,
    setSearchButtonPressedMock,
  ]);
};

describe('PharmacyList', () => {
  beforeEach(() => {
    guestExperienceCustomEventLoggerMock.mockReset();
    navigateJoinWaitlistAsyncActionMock.mockReset();
    navigationMock.mockReturnValue(appointmentsStackNavigationMock);
    useReduxContextMock.mockReturnValue({
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    });
    resetState();
  });
  it('renders searchbox with expected properties', () => {
    resetState();
    const testRenderer = renderer.create(
      <PharmacyLocationsList
        pharmacyLocations={[] as IProviderLocationDetails[]}
        serviceType='abbott_antigen'
      />
    );

    const views = testRenderer.root.findAllByType(View);
    const searchBoxView = views[0];
    expect(searchBoxView.props.style).toEqual(
      pharmacyLocationsListStyle.searchSectionStyle
    );
    const searchBox = searchBoxView.props.children;
    expect(searchBox.type).toEqual(SearchBox);
    expect(searchBox.props.testID).toEqual('pharmacyLocationsSearchBox');
  });
  it('renders View for search results with expected properties', () => {
    resetState();
    const customViewStyle: ViewStyle = { backgroundColor: 'blue' };
    const props: IProviderLocationDetails[] = [];
    const testRenderer = renderer.create(
      <PharmacyLocationsList
        pharmacyLocations={props}
        viewStyle={customViewStyle}
        serviceType='abbott_antigen'
      />
    );

    const views = testRenderer.root.findAllByType(View);
    const view = views[1];
    expect(view.props.style).toEqual([
      pharmacyLocationsListStyle.pharmacyLocationsListViewStyle,
      customViewStyle,
    ]);
  });

  it('renders search header along with distance filter with expected properties', () => {
    const mockState = {
      searched: true,
      isValidZipSearch: true,
    };
    const props: IProviderLocationDetails[] = [];
    resetState(mockState);
    const testRenderer = renderer.create(
      <PharmacyLocationsList
        pharmacyLocations={props}
        serviceType='abbott_antigen'
      />
    );
    const views = testRenderer.root.findAllByType(View);
    const view = views[2];
    const searchResultsText = view.props.children[0];
    expect(view.props.style).toEqual(
      pharmacyLocationsListStyle.searchResultHeaderViewStyle
    );
    expect(searchResultsText.props.caption).toEqual(
      PharmacySearchLocationsListContent.searchresults
    );

    const distanceView = views[3];
    expect(distanceView.props.style).toEqual(
      pharmacyLocationsListStyle.distanceViewStyle
    );
  });

  it('renders distance filter with expected properties', () => {
    const mockState = {
      searched: true,
      isValidZipSearch: true,
    };
    resetState(mockState);
    const props: IProviderLocationDetails[] = [];
    const testRenderer = renderer.create(
      <PharmacyLocationsList pharmacyLocations={props} />
    );
    const views = testRenderer.root.findAllByType(View);
    const distancePickerView = views[3];
    const distanceText = distancePickerView.props.children[0];
    const distancePicker = distancePickerView.props.children[1];
    expect(distanceText.props.style).toEqual(
      pharmacyLocationsListStyle.distanceTextStyle
    );
    expect(distancePicker.type).toEqual(DistancePicker);
    expect(distancePicker.props.optionValues).toEqual(
      PharmacySearchLocationsListContent.distances
    );
  });
  it('calls app insights when distance filter changed', () => {
    const props: IProviderLocationDetails[] = [];
    const mockState = {
      searched: true,
      isValidZipSearch: true,
    };
    resetState(mockState);
    const testRenderer = renderer.create(
      <PharmacyLocationsList pharmacyLocations={props} />
    );
    const views = testRenderer.root.findAllByType(View);
    const distancePickerView = views[3];
    const distancePicker = distancePickerView.props.children[1];

    distancePicker.props.onValueSelected(25);
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.CHANGING_PROVIDER_SEARCH_DISTANCE,
      {
        distance: '25',
      }
    );
  });
  it('doesnt render search header when there is no search executed', () => {
    const props: IProviderLocationDetails[] = [];
    const mockState = {
      searched: false,
    };
    resetState(mockState);
    const testRenderer = renderer.create(
      <PharmacyLocationsList pharmacyLocations={props} />
    );
    const distancePickers = testRenderer.root.findAllByType(DistancePicker);
    const distancePicker = distancePickers[0];
    expect(distancePicker).toBeUndefined();
  });

  it('renders "not found location" error when no pharmacies found for a zipcode', () => {
    const mockState = {
      locations: [],
      searched: true,
      isValidZipSearch: true,
    };
    resetState(mockState);
    const testRenderer = renderer.create(
      <PharmacyLocationsList
        pharmacyLocations={pharmacyLocationsListProps}
        serviceType='abbott_antigen'
      />
    );
    const views = testRenderer.root.findAllByType(View);
    const view = views[2];
    const searchResultsText = view.props.children[0];
    expect(view.props.style).toEqual(
      pharmacyLocationsListStyle.searchResultHeaderViewStyle
    );
    expect(searchResultsText.props.caption).toEqual(
      PharmacySearchLocationsListContent.searchresults
    );

    const distanceView = views[3];
    expect(distanceView.props.style).toEqual(
      pharmacyLocationsListStyle.distanceViewStyle
    );

    const notFoundErrorView = views[4];
    expect(notFoundErrorView.props.style).toEqual(
      pharmacyLocationsListStyle.pharmacySearchResultViewStyle
    );
  });

  it('renders "invalid zip code" error when invalid input is given for a zipcode', () => {
    const mockState = {
      input: '5a555',
    };
    resetState(mockState);
    const testRenderer = renderer.create(
      <PharmacyLocationsList
        pharmacyLocations={pharmacyLocationsListProps}
        serviceType='abbott_antigen'
      />
    );
    const views = testRenderer.root.findAllByType(View);

    const invalidZipcodeView = views[2];
    expect(invalidZipcodeView.props.style).toEqual(
      pharmacyLocationsListStyle.pharmacySearchResultViewStyle
    );
    expect(invalidZipcodeView.props.children.type).toEqual(PrimaryTextBox);
    expect(invalidZipcodeView.props.children.props.caption).toEqual(
      PharmacySearchLocationsListContent.errorInvalidZipcodeInput
    );
  });

  it('renders join waitlist card when no providers found for a given zip code', () => {
    const mockState = {
      locations: [],
      searched: true,
      input: '55555',
    };
    resetState(mockState);
    const testRenderer = renderer.create(
      <PharmacyLocationsList pharmacyLocations={pharmacyLocationsListProps} />
    );
    const waitListItems = testRenderer.root.findAllByType(
      TitleDescriptionCardItem
    );
    const waitList = waitListItems[0];
    expect(waitList.props.title).toEqual(
      PharmacySearchLocationsListContent.joinWaitlistHeader
    );
    expect(waitList.props.description).toEqual(
      PharmacySearchLocationsListContent.joinWaitlistText
    );
  });
  it('doesnt render join waitlist card when providers found for a given zip code', () => {
    const mockState = {
      locations: pharmacyLocationsListProps,
      searched: true,
    };
    resetState(mockState);
    const testRenderer = renderer.create(
      <PharmacyLocationsList pharmacyLocations={pharmacyLocationsListProps} />
    );
    const waitListItems = testRenderer.root.findAllByType(
      TitleDescriptionCardItem
    );
    const waitList = waitListItems[0];
    expect(waitList).toBe(undefined);
  });

  it('renders pharmacy location item view with expected properties', () => {
    const mockState = {
      locations: pharmacyLocationsListProps,
      searched: true,
      isValidZipSearch: true,
    };
    resetState(mockState);
    const testRenderer = renderer.create(
      <PharmacyLocationsList pharmacyLocations={pharmacyLocationsListProps} />
    );
    const views = testRenderer.root.findAllByType(View);
    const pharmaciesView = views[4];
    expect(pharmaciesView.props.style).toEqual(
      pharmacyLocationsListStyle.pharmacyResultViewStyle
    );
    expect(pharmaciesView.props.testID).toEqual(
      'pharmacyLocationsPharmacyCard-' + pharmacyLocationsListProps[0].id
    );

    const pharmacySearchResultItem = pharmaciesView.props.children;
    expect(pharmacySearchResultItem.type).toEqual(PharmacySearchResultItem);
    expect(pharmacySearchResultItem.props.item).toEqual(
      pharmacyLocationsListProps[0]
    );
    expect(
      pharmacySearchResultItem.props.navigateToPharmacyInformation
    ).toEqual(expect.any(Function));
    const waitListItems = testRenderer.root.findAllByType(
      TitleDescriptionCardItem
    );
    const waitList = waitListItems[0];
    expect(waitList).toBeUndefined();
  });

  it('navigates correctly when pharmacy location item is pressed', () => {
    const mockState = {
      locations: pharmacyLocationsListProps,
      searched: true,
      isValidZipSearch: true,
    };
    resetState(mockState);
    const testRenderer = renderer.create(
      <PharmacyLocationsList pharmacyLocations={pharmacyLocationsListProps} />
    );
    const views = testRenderer.root.findAllByType(View);
    const pharmaciesView = views[4];

    const pharmacySearchResultItem = pharmaciesView.props.children;

    pharmacySearchResultItem.props.navigateToPharmacyInformation();

    expect(
      getProviderLocationDetailsDataLoadingAsyncActionMock
    ).toHaveBeenCalledWith({
      identifier: pharmacyLocationsListProps[0].id,
      navigation: appointmentsStackNavigationMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    });
  });

  it('navigates to join waitlist screen when join waitlist card is pressed', () => {
    const mockState = {
      locations: [],
      searched: true,
      input: '55555',
    };
    resetState(mockState);
    const testRenderer = renderer.create(
      <PharmacyLocationsList pharmacyLocations={pharmacyLocationsListProps} />
    );
    testRenderer.root.findByType(TitleDescriptionCardItem).props.onPress();
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
      CustomAppInsightEvents.ADDING_PERSON_TO_WAITLIST,
      {}
    );
    expect(navigateJoinWaitlistAsyncActionMock).toHaveBeenCalledWith(
      appointmentsStackNavigationMock,
      '55555'
    );
  });

  it('renders "not found location" error without join waitlist card when no pharmacies for a zipcode and vaccine DOSE2 service type', () => {
    const mockState = {
      locations: [],
      searched: true,
      input: '55555',
    };
    resetState(mockState);
    const testRenderer = renderer.create(
      <PharmacyLocationsList
        pharmacyLocations={pharmacyLocationsListProps}
        serviceType='c19-vaccine-dose2'
      />
    );
    const views = testRenderer.root.findAllByType(View);
    const headerView = views[2];
    const searchResultsText = headerView.props.children[0];
    expect(searchResultsText.props.caption).toEqual(
      PharmacySearchLocationsListContent.searchresults
    );
    const view = views[3];
    expect(view.props.style).toEqual(
      pharmacyLocationsListStyle.pharmacySearchResultViewStyle
    );
    const errorText = view.props.children;
    expect(errorText.props.caption).toEqual(
      PharmacySearchLocationsListContent.pharmacyNotFoundErrorWithoutWaitlist
    );
    const waitListItems = testRenderer.root.findAllByType(
      TitleDescriptionCardItem
    );
    const waitList = waitListItems[0];
    expect(waitList).toBeUndefined();
  });
});
