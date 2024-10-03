// Copyright 2022 Prescryptive Health, Inc.

import React, { useState, useEffect, useReducer } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useNavigation } from '@react-navigation/native';
import { FindLocationScreen } from './find-location.screen';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { ITestContainer } from '../../../../../testing/test.container';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { Heading } from '../../../../../components/member/heading/heading';
import { LocationAutocompleteInput } from '../../../../../components/inputs/location-autocomplete/location-autocomplete.input';
import { findLocationScreenStyles } from './find-location.screen.styles';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { defaultSessionState } from '../../../state/session/session.state';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { autocompleteUserLocationAsyncAction } from './async-actions/autocomplete-user-location.async-action';
import { setIsAutocompletingUserLocationDispatch } from './dispatch/set-is-autocompleting-user-location.dispatch';
import { locationCoordinatesMock } from '../../../__mocks__/location-coordinate.mock';
import { fetchUserPosition } from '../../../state/session/utils/fetch-user-position';
import { setSuggestedLocationsDispatch } from './dispatch/set-suggested-locations.dispatch';
import { setActiveSuggestedLocationDispatch } from './dispatch/set-active-suggested-location.dispatch';
import { setLocationErrorMessageDispatch } from './dispatch/set-location-error-message.dispatch';
import { IFindLocationState } from './find-location.state';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { setUserLocationDispatch } from '../../../state/session/dispatch/set-user-location.dispatch';
import { updateUserLocationSettingsDispatch } from '../../../store/settings/dispatch/update-user-location-settings.dispatch';
import { findLocationScreenContent as content } from './find-location.screen.content';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
  useReducer: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;
const useReducerMock = useReducer as jest.Mock;

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock(
  '../../../../../components/inputs/location-autocomplete/location-autocomplete.input',
  () => ({
    LocationAutocompleteInput: () => <div />,
  })
);

jest.mock('../../../../../components/buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

jest.mock('@react-navigation/native');
const navigationMock = useNavigation as jest.Mock;

jest.mock('../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('./async-actions/autocomplete-user-location.async-action');
const autocompleteUserLocationAsyncActionMock =
  autocompleteUserLocationAsyncAction as jest.Mock;

jest.mock('./dispatch/set-is-autocompleting-user-location.dispatch');
const setIsAutocompletingUserLocationDispatchMock =
  setIsAutocompletingUserLocationDispatch as jest.Mock;

jest.mock('../../../state/session/utils/fetch-user-position');
const fetchUserPositionMock = fetchUserPosition as jest.Mock;

jest.mock('./dispatch/set-suggested-locations.dispatch');
const setSuggestedLocationsDispatchMock =
  setSuggestedLocationsDispatch as jest.Mock;

jest.mock('./dispatch/set-active-suggested-location.dispatch');
const setActiveSuggestedLocationDispatchMock =
  setActiveSuggestedLocationDispatch as jest.Mock;

jest.mock('./dispatch/set-location-error-message.dispatch');
const setLocationErrorMessageDispatchMock =
  setLocationErrorMessageDispatch as jest.Mock;

jest.mock('../../../state/session/dispatch/set-user-location.dispatch');
const setUserLocationDispatcMock = setUserLocationDispatch as jest.Mock;

jest.mock(
  '../../../store/settings/dispatch/update-user-location-settings.dispatch'
);
const updateUserLocationSettingsDispatchMock =
  updateUserLocationSettingsDispatch as jest.Mock;

const defaultSessionDispatchMock = jest.fn();
const defaultReduxDispatchMock = jest.fn();
const defaultReduxGetStateMock = jest.fn();
const defaultFindLocationDispatchMock = jest.fn();
const defaultFindLocationState: IFindLocationState = {
  isAutocompletingUserLocation: false,
};

interface IStateCalls {
  query: [string, jest.Mock];
  showSuggestions: [boolean, jest.Mock];
}

function stateReset({
  query = ['', jest.fn()],
  showSuggestions = [false, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(query);
  useStateMock.mockReturnValueOnce(showSuggestions);
}

describe('FindLocationScreen', () => {
  beforeEach(() => {
    navigationMock.mockReturnValue(rootStackNavigationMock);
    jest.clearAllMocks();
    useEffectMock.mockReset();
    stateReset({});
    useSessionContextMock.mockReturnValue({
      sessionDispatch: defaultSessionDispatchMock,
      sessionState: defaultSessionState,
    });
    useReduxContextMock.mockReturnValue({
      dispatch: defaultReduxDispatchMock,
      getState: defaultReduxGetStateMock,
    });
    useReducerMock.mockReturnValue([
      defaultFindLocationState,
      defaultFindLocationDispatchMock,
    ]);
  });

  it('renders as BasicPage', () => {
    const testRenderer = renderer.create(<FindLocationScreen />);
    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.showProfileAvatar).toEqual(true);
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it('renders page body in body content container', () => {
    const testRenderer = renderer.create(<FindLocationScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const container = bodyRenderer.root.findByType(BodyContentContainer);

    const heading = container.props.children[0];
    expect(heading.type).toEqual(Heading);
    expect(heading.props.textStyle).toEqual(
      findLocationScreenStyles.headingTextStyle
    );

    const locationInput = container.props.children[1];
    expect(locationInput.type).toEqual(LocationAutocompleteInput);

    const applyButton = container.props.children[2];
    expect(applyButton.type).toEqual(BaseButton);
    expect(applyButton.props.disabled).toEqual(true);
    expect(applyButton.props.testID).toEqual('findLocationScreenApplyButton');
  });

  it('should hide the apply button when showSuggestions', () => {
    useStateMock.mockReset();
    const setQueryMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', setQueryMock]);
    useStateMock.mockReturnValueOnce([true, jest.fn()]);
    const testRenderer = renderer.create(<FindLocationScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const container = bodyRenderer.root.findByType(BodyContentContainer);

    const heading = container.props.children[0];
    expect(heading.type).toEqual(Heading);
    expect(heading.props.textStyle).toEqual(
      findLocationScreenStyles.headingTextStyle
    );

    const locationInput = container.props.children[1];
    expect(locationInput.type).toEqual(LocationAutocompleteInput);

    const applyButton = container.props.children[2];
    expect(applyButton).toEqual(null);
  });

  it('should update query when user types', () => {
    useStateMock.mockReset();
    const setQueryMock = jest.fn();
    const valueMock = '20032';
    useStateMock.mockReturnValueOnce(['', setQueryMock]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);

    const testRenderer = renderer.create(<FindLocationScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const input = bodyRenderer.root.findByType(LocationAutocompleteInput);
    input.props.onChangeText(valueMock);

    expect(setQueryMock).toHaveBeenCalledWith(valueMock);
  });

  it('should requests autocomplete when user types', () => {
    useStateMock.mockReset();
    const setQueryMock = jest.fn();
    const setShowSuggestionsMock = jest.fn();
    const valueMock = '20032';
    useStateMock.mockReturnValueOnce(['', setQueryMock]);
    useStateMock.mockReturnValueOnce([false, setShowSuggestionsMock]);

    const testRenderer = renderer.create(<FindLocationScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const input = bodyRenderer.root.findByType(LocationAutocompleteInput);
    input.props.onChangeText(valueMock);

    expect(setQueryMock).toHaveBeenCalledWith(valueMock);
    setTimeout(() => {
      expect(setIsAutocompletingUserLocationDispatchMock).toHaveBeenCalledWith(
        defaultFindLocationDispatchMock,
        true
      );
      expect(autocompleteUserLocationAsyncActionMock).toHaveBeenCalledWith({
        query: valueMock,
        reduxDispatch: defaultReduxDispatchMock,
        reduxGetState: defaultReduxGetStateMock,
        findLocationDispatch: defaultFindLocationDispatchMock,
        navigation: rootStackNavigationMock,
      });
      expect(setLocationErrorMessageDispatchMock).toHaveBeenCalledWith(
        defaultFindLocationDispatchMock,
        undefined
      );
      expect(setShowSuggestionsMock).toHaveBeenCalledWith(true);
    }, 500);
  });

  it('should not clear selected location when query changes', () => {
    const valueMock = '20032';
    const testRenderer = renderer.create(<FindLocationScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const input = bodyRenderer.root.findByType(LocationAutocompleteInput);
    input.props.onChangeText(valueMock);

    expect(setActiveSuggestedLocationDispatchMock).not.toHaveBeenCalled();
  });

  it('should clear selected location when query changes', () => {
    useReducerMock.mockReturnValue([
      {
        ...defaultFindLocationState,
        activeSuggestedLocation: locationCoordinatesMock,
      },
      defaultFindLocationDispatchMock,
    ]);
    const valueMock = '20032';
    const testRenderer = renderer.create(<FindLocationScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const input = bodyRenderer.root.findByType(LocationAutocompleteInput);
    input.props.onChangeText(valueMock);

    expect(setActiveSuggestedLocationDispatchMock).toHaveBeenCalledWith(
      defaultFindLocationDispatchMock,
      undefined
    );
  });

  it('should request current user location when press on location icon', async () => {
    useStateMock.mockReset();
    const errorMock = 'error-message-mock';
    const setQueryMock = jest.fn();
    const setShowSuggestionsMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', setQueryMock]);
    useStateMock.mockReturnValueOnce([false, setShowSuggestionsMock]);

    const testRenderer = renderer.create(<FindLocationScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const input = bodyRenderer.root.findByType(LocationAutocompleteInput);
    input.props.onLocationPress();

    expect(fetchUserPositionMock).toHaveBeenCalledWith(
      expect.any(Function),
      defaultSessionDispatchMock
    );

    const handleUserPositionChange = fetchUserPositionMock.mock.calls[0][0];

    await handleUserPositionChange(locationCoordinatesMock, errorMock);

    expect(setLocationErrorMessageDispatchMock).toHaveBeenCalledWith(
      defaultFindLocationDispatchMock,
      errorMock
    );
    expect(setQueryMock).toHaveBeenCalledWith('');
    expect(setIsAutocompletingUserLocationDispatchMock).toHaveBeenCalledWith(
      defaultFindLocationDispatchMock,
      true
    );
    expect(autocompleteUserLocationAsyncActionMock).toHaveBeenCalledWith({
      query: '',
      location: {
        latitude: locationCoordinatesMock.latitude,
        longitude: locationCoordinatesMock.longitude,
      },
      notFoundErrorMessage: content.deviceLocationErrorLabel,
      defaultSet: true,
      reduxDispatch: defaultReduxDispatchMock,
      reduxGetState: defaultReduxGetStateMock,
      findLocationDispatch: defaultFindLocationDispatchMock,
      navigation: rootStackNavigationMock,
    });
  });

  it('should remove query input when press on remove icon', () => {
    useStateMock.mockReset();
    const setQueryMock = jest.fn();
    const setShowSuggestionsMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', setQueryMock]);
    useStateMock.mockReturnValueOnce([false, setShowSuggestionsMock]);

    const testRenderer = renderer.create(<FindLocationScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const input = bodyRenderer.root.findByType(LocationAutocompleteInput);
    input.props.onRemovePress();

    expect(setQueryMock).toHaveBeenCalledWith('');
    expect(setLocationErrorMessageDispatchMock).toHaveBeenCalledWith(
      defaultFindLocationDispatchMock,
      undefined
    );
    expect(setSuggestedLocationsDispatchMock).toHaveBeenCalledWith(
      defaultFindLocationDispatchMock,
      []
    );
    expect(setActiveSuggestedLocationDispatchMock).toHaveBeenCalledWith(
      defaultFindLocationDispatchMock,
      undefined
    );
  });

  it('should select active location', () => {
    useStateMock.mockReset();
    const setQueryMock = jest.fn();
    const setShowSuggestionsMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', setQueryMock]);
    useStateMock.mockReturnValueOnce([false, setShowSuggestionsMock]);

    const testRenderer = renderer.create(<FindLocationScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const input = bodyRenderer.root.findByType(LocationAutocompleteInput);
    input.props.onSelectLocation(locationCoordinatesMock);

    expect(setShowSuggestionsMock).toHaveBeenCalledWith(false);
    expect(setSuggestedLocationsDispatchMock).toHaveBeenCalledWith(
      defaultFindLocationDispatchMock,
      []
    );
    expect(setActiveSuggestedLocationDispatchMock).toHaveBeenCalledWith(
      defaultFindLocationDispatchMock,
      locationCoordinatesMock
    );
  });

  it('should apply location', () => {
    useStateMock.mockReset();
    const setQueryMock = jest.fn();
    const setShowSuggestionsMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', setQueryMock]);
    useStateMock.mockReturnValueOnce([false, setShowSuggestionsMock]);

    useReducerMock.mockReturnValue([
      {
        ...defaultFindLocationState,
        activeSuggestedLocation: locationCoordinatesMock,
      },
      defaultFindLocationDispatchMock,
    ]);

    const testRenderer = renderer.create(<FindLocationScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyRenderer = renderer.create(body);
    const applyButton = bodyRenderer.root.findByType(BaseButton);
    applyButton.props.onPress();

    expect(setUserLocationDispatcMock).toHaveBeenCalledWith(
      defaultSessionDispatchMock,
      locationCoordinatesMock
    );
    expect(updateUserLocationSettingsDispatchMock).toHaveBeenCalledWith(
      defaultReduxDispatchMock,
      locationCoordinatesMock
    );
    expect(rootStackNavigationMock.goBack).toHaveBeenCalled();
  });
});
