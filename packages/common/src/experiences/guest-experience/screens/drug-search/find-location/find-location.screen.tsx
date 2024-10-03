// Copyright 2022 Prescryptive Health, Inc.

import React, {
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useReducer,
} from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useNavigation } from '@react-navigation/native';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { Heading } from '../../../../../components/member/heading/heading';
import { LocationAutocompleteInput } from '../../../../../components/inputs/location-autocomplete/location-autocomplete.input';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { findLocationScreenContent as content } from './find-location.screen.content';
import { findLocationScreenStyles as styles } from './find-location.screen.styles';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { setIsAutocompletingUserLocationDispatch } from './dispatch/set-is-autocompleting-user-location.dispatch';
import { setLocationErrorMessageDispatch } from './dispatch/set-location-error-message.dispatch';
import { setSuggestedLocationsDispatch } from './dispatch/set-suggested-locations.dispatch';
import { setActiveSuggestedLocationDispatch } from './dispatch/set-active-suggested-location.dispatch';
import {
  autocompleteUserLocationAsyncAction,
  IAutocompleteUserLocationAsyncActionArgs,
} from './async-actions/autocomplete-user-location.async-action';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { translateCoordinateHelper } from '../../../../../utils/translate-coordinate.helper';
import { fetchUserPosition } from '../../../state/session/utils/fetch-user-position';
import { setUserLocationDispatch } from '../../../state/session/dispatch/set-user-location.dispatch';
import { updateUserLocationSettingsDispatch } from '../../../store/settings/dispatch/update-user-location-settings.dispatch';
import { formatUserLocation } from '../../../../../utils/format-address.helper';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { findLocationReducer } from './find-location.reducer';
import { IFindLocationState } from './find-location.state';

export const FindLocationScreen = (): ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const initialState: IFindLocationState = {
    isAutocompletingUserLocation: false,
  };
  const [
    {
      isAutocompletingUserLocation,
      locationErrorMessage,
      suggestedLocations,
      activeSuggestedLocation,
    },
    findLocationDispatch,
  ] = useReducer(findLocationReducer, initialState);
  const { sessionDispatch } = useSessionContext();
  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();
  const [query, setQuery] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const fetchAutoComplete = useCallback(
    async (query: string): Promise<void> => {
      try {
        setIsAutocompletingUserLocationDispatch(findLocationDispatch, true);
        setLocationErrorMessageDispatch(findLocationDispatch, undefined);
        setShowSuggestions(true);
        const args: IAutocompleteUserLocationAsyncActionArgs = {
          query,
          notFoundErrorMessage: content.wrongLocationErrorLabel,
          reduxDispatch,
          reduxGetState,
          findLocationDispatch,
          navigation,
        };
        await autocompleteUserLocationAsyncAction(args);
      } catch (error) {
        const autocompleteError = error as Error;
        setSuggestedLocationsDispatch(findLocationDispatch, []);
        setLocationErrorMessageDispatch(
          findLocationDispatch,
          autocompleteError.message
        );
      } finally {
        setIsAutocompletingUserLocationDispatch(findLocationDispatch, false);
      }
    },
    []
  );
  const debouncedFetch = useCallback(
    AwesomeDebouncePromise(fetchAutoComplete, 500),
    []
  );
  const resetStateToDefault = () => {
    setShowSuggestions(false);
    setLocationErrorMessageDispatch(findLocationDispatch, undefined);
    setSuggestedLocationsDispatch(findLocationDispatch, []);
  };
  const handleUserPositionChange = async (
    userDeviceLocation: ILocationCoordinates,
    errorMessage: string
  ) => {
    setLocationErrorMessageDispatch(findLocationDispatch, errorMessage);
    if (errorMessage && !activeSuggestedLocation) {
      setQuery('');
    }
    if (
      userDeviceLocation.latitude !== undefined &&
      userDeviceLocation.longitude !== undefined
    ) {
      const latitude = translateCoordinateHelper(userDeviceLocation.latitude);
      const longitude = translateCoordinateHelper(userDeviceLocation.longitude);
      const args = {
        query: '',
        location: {
          latitude,
          longitude,
        },
        notFoundErrorMessage: content.deviceLocationErrorLabel,
        defaultSet: true,
        reduxDispatch,
        reduxGetState,
        findLocationDispatch,
        navigation,
      };
      try {
        setIsAutocompletingUserLocationDispatch(findLocationDispatch, true);
        await autocompleteUserLocationAsyncAction(args);
      } catch (error) {
        const geolocationError = error as Error;
        setLocationErrorMessageDispatch(
          findLocationDispatch,
          geolocationError.message
        );
        if (!activeSuggestedLocation) {
          setQuery('');
        }
      } finally {
        setIsAutocompletingUserLocationDispatch(findLocationDispatch, false);
      }
    }
  };
  const onChangeText = (locationInput: string) => {
    setQuery(locationInput);
    if (activeSuggestedLocation) {
      setActiveSuggestedLocationDispatch(findLocationDispatch, undefined);
    }
    if (locationInput.length > 2) {
      debouncedFetch(locationInput);
    } else {
      resetStateToDefault();
    }
  };
  const onRemovePress = () => {
    setQuery('');
    setActiveSuggestedLocationDispatch(findLocationDispatch, undefined);
    resetStateToDefault();
  };
  const onLocationPress = () => {
    resetStateToDefault();
    fetchUserPosition(handleUserPositionChange, sessionDispatch);
  };
  const onApplyPress = () => {
    if (activeSuggestedLocation) {
      setUserLocationDispatch(sessionDispatch, activeSuggestedLocation);
      updateUserLocationSettingsDispatch(
        reduxDispatch,
        activeSuggestedLocation
      );
      navigation.goBack();
    }
  };
  const onSelectLocation = (location: ILocationCoordinates) => {
    setActiveSuggestedLocationDispatch(findLocationDispatch, location);
    setSuggestedLocationsDispatch(findLocationDispatch, []);
    setShowSuggestions(false);
  };

  const applyButton =
    !showSuggestions && !isAutocompletingUserLocation ? (
      <BaseButton
        disabled={!activeSuggestedLocation}
        onPress={onApplyPress}
        testID='findLocationScreenApplyButton'
      >
        {content.applyLabel}
      </BaseButton>
    ) : null;

  useEffect(() => {
    if (activeSuggestedLocation) {
      setQuery(formatUserLocation(activeSuggestedLocation) || '');
    }
  }, [activeSuggestedLocation]);

  useEffect(() => {
    if (suggestedLocations?.length === 0) {
      setShowSuggestions(false);
    }
  }, [suggestedLocations]);

  const body = (
    <BodyContentContainer viewStyle={styles.bodyContentContainerViewStyle}>
      <Heading textStyle={styles.headingTextStyle}>
        {content.mylocationLabel}
      </Heading>
      <LocationAutocompleteInput
        showSuggestions={showSuggestions}
        query={query}
        placeholder={content.locationInputPlaceholderLabel}
        viewStyle={styles.autocompleteViewStyle}
        suggestions={suggestedLocations || []}
        isLoading={isAutocompletingUserLocation}
        errorMessage={locationErrorMessage}
        onChangeText={onChangeText}
        onRemovePress={onRemovePress}
        onLocationPress={onLocationPress}
        onSelectLocation={onSelectLocation}
      />
      {applyButton}
    </BodyContentContainer>
  );
  return (
    <BasicPageConnected
      navigateBack={navigation.goBack}
      body={body}
      showProfileAvatar={true}
      translateContent={true}
    />
  );
};
