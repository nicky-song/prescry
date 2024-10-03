// Copyright 2020 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle, Text } from 'react-native';
import { IProviderLocationDetails } from '../../../../models/api-response/provider-location-response';
import { PrimaryTextBox } from '../../../text/primary-text-box/primary-text-box';
import { PharmacySearchLocationsListContent } from './pharmacy-locations-list.content';
import { PharmacySearchResultItem } from '../../items/pharmacy-search-result-item/pharmacy-search-result-item';
import { pharmacyLocationsListStyle } from './pharmacy-locations-list.style';
import { TitleDescriptionCardItem } from '../../items/title-description-card-item/title-description-card-item';
import {
  DistancePicker,
  IDistancePicker,
} from '../../distance-picker/distance-picker';
import AddressValidator from '../../../../utils/validators/address.validator';
import { ServiceTypes } from '../../../../models/provider-location';
import {
  guestExperienceCustomEventLogger,
  CustomAppInsightEvents,
} from '../../../../experiences/guest-experience/guest-experience-logger.middleware';
import { SearchBox } from '../../search-box/search-box';
import { AppointmentsStackNavigationProp } from '../../../../experiences/guest-experience/navigation/stack-navigators/appointments/appointments.stack-navigator';
import { useNavigation } from '@react-navigation/native';
import { navigateJoinWaitlistAsyncAction } from '../../../../experiences/guest-experience/store/navigation/actions/navigate-join-waitlist.async-action';
import {
  getProviderLocationDetailsDataLoadingAsyncAction,
  IProviderLocationDetailsArgs,
} from '../../../../experiences/guest-experience/store/provider-location-details/async-actions/get-provider-location-details-data-loading.async-action';
import { useReduxContext } from '../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
export interface IPharmacyLocationsListProps {
  pharmacyLocations?: IProviderLocationDetails[];
  viewStyle?: StyleProp<ViewStyle>;
  serviceType?: string;
  serviceNameMyRx?: string;
}

export interface IZipcodeParam {
  zipcode: string;
  distance: number;
}

export interface IPharmacyLocationsDispatchProps {
  getProviderLocations?: (
    navigation: AppointmentsStackNavigationProp,
    param: IZipcodeParam
  ) => void;
}

const getDefaultSearchDistance = (distances: IDistancePicker[]) => {
  const defaultSelectedValue = distances.filter(
    (option: IDistancePicker) => option.default
  );

  return defaultSelectedValue.length
    ? defaultSelectedValue[0].value
    : distances[0].value;
};

export const PharmacyLocationsList = (
  props: IPharmacyLocationsListProps & IPharmacyLocationsDispatchProps
) => {
  const navigation = useNavigation<AppointmentsStackNavigationProp>();

  const [input, setInput] = useState('');
  const [isValidZipSearch, setIsValidZipSearch] = useState(false);
  const [searched, setSearched] = useState(false);
  const [locations, setLocations] = useState<
    IProviderLocationDetails[] | undefined
  >([]);
  const [distanceInMiles, setDistanceInMiles] = useState(
    getDefaultSearchDistance(PharmacySearchLocationsListContent.distances)
  );
  const [showedOnce, setShowedOnce] = useState(false);
  const [searchButtonPressed, setSearchButtonPressed] = useState(false);

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  useEffect(() => {
    if (searchButtonPressed) {
      search(input)
        .catch((err) => {
          throw err;
        })
        .then(() => {
          return;
        })
        .catch((err) => {
          throw err;
        });
    }
  }, [distanceInMiles]);

  useEffect(() => {
    return () => setLocations([]);
  }, []);

  useEffect(() => {
    if (searchButtonPressed) {
      const { pharmacyLocations } = props;
      setSearched(true);
      setLocations(pharmacyLocations);
      setShowedOnce(true);
    }
  }, [props.pharmacyLocations]);

  const searchButtonOnPress = async (newInput: string) => {
    if (!searchButtonPressed) {
      setSearchButtonPressed(true);
    }
    await search(newInput);
  };

  const search = async (newInput: string) => {
    if (newInput !== input) setInput(newInput);
    if (!isValidZipSearch) setIsValidZipSearch(true);
    const { getProviderLocations } = props;
    if (getProviderLocations) {
      await getProviderLocations(navigation, {
        zipcode: newInput,
        distance: distanceInMiles,
      });
    }
  };

  const renderSearchBox = (
    <View style={pharmacyLocationsListStyle.searchSectionStyle}>
      <SearchBox
        onSearch={searchButtonOnPress}
        testID='pharmacyLocationsSearchBox'
      />
    </View>
  );

  const onPressJoinWaitlistPress = () => {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.ADDING_PERSON_TO_WAITLIST,
      {}
    );
    navigateJoinWaitlistAsyncAction(navigation, input);
  };

  const renderJoinWaitlistCard =
    props.serviceType !== ServiceTypes.c19VaccineDose2 ? (
      <TitleDescriptionCardItem
        title={PharmacySearchLocationsListContent.joinWaitlistHeader}
        description={PharmacySearchLocationsListContent.joinWaitlistText}
        onPress={onPressJoinWaitlistPress}
      />
    ) : null;

  const renderNotFoundError = (): React.ReactNode => {
    if (
      !AddressValidator.isZipValid(input) &&
      !AddressValidator.isZipAllDigits(input)
    ) {
      return (
        <View
          style={pharmacyLocationsListStyle.pharmacySearchResultViewStyle}
          testID='pharmacyLocationsList'
        >
          <PrimaryTextBox
            caption={
              PharmacySearchLocationsListContent.errorInvalidZipcodeInput
            }
            textBoxStyle={
              pharmacyLocationsListStyle.pharmacySearchInvalidTextStyle
            }
          />
        </View>
      );
    }
    if (searched && !locations?.length) {
      return (
        <>
          <View
            style={pharmacyLocationsListStyle.pharmacySearchResultViewStyle}
            testID='pharmacyLocationsList'
          >
            <PrimaryTextBox
              caption={
                props.serviceType !== ServiceTypes.c19VaccineDose2
                  ? PharmacySearchLocationsListContent.errorNearbyPharmacyNotFound
                  : PharmacySearchLocationsListContent.pharmacyNotFoundErrorWithoutWaitlist
              }
              textBoxStyle={
                pharmacyLocationsListStyle.pharmacySearchNotFoundTextStyle
              }
            />
          </View>
          {renderJoinWaitlistCard}
        </>
      );
    }
    return null;
  };

  const onSearchDistanceChange = (value: number) => {
    guestExperienceCustomEventLogger(
      CustomAppInsightEvents.CHANGING_PROVIDER_SEARCH_DISTANCE,
      {
        distance: value.toString(),
      }
    );
    setDistanceInMiles(value);
  };

  const renderDistanceFilter = isValidZipSearch ? (
    <View
      testID='pharmacyDistanceDropdown'
      style={pharmacyLocationsListStyle.distanceViewStyle}
    >
      <Text style={pharmacyLocationsListStyle.distanceTextStyle}>
        {PharmacySearchLocationsListContent.distancePickerTitle}
      </Text>
      <DistancePicker
        optionValues={PharmacySearchLocationsListContent.distances}
        onValueSelected={onSearchDistanceChange}
        defaultOption={distanceInMiles}
      />
    </View>
  ) : undefined;

  const renderHeader = (
    <>
      {searched || showedOnce ? (
        <View
          style={pharmacyLocationsListStyle.searchResultHeaderViewStyle}
          testID='pharmacySearchResult'
        >
          <PrimaryTextBox
            caption={PharmacySearchLocationsListContent.searchresults}
            textBoxStyle={
              pharmacyLocationsListStyle.pharmacySearchResultTextStyle
            }
          />
          {renderDistanceFilter}
        </View>
      ) : null}
      {renderNotFoundError()}
    </>
  );

  const renderPharmacies = (pharmacies: IProviderLocationDetails[]) => {
    return pharmacies.map((pharmacy) => {
      const onPress = () => {
        const args: IProviderLocationDetailsArgs = {
          identifier: pharmacy.id,
          navigation,
          reduxDispatch,
          reduxGetState,
        };
        getProviderLocationDetailsDataLoadingAsyncAction(args);
      };
      return (
        <View
          testID={'pharmacyLocationsPharmacyCard-' + pharmacy.id}
          style={pharmacyLocationsListStyle.pharmacyResultViewStyle}
          key={pharmacy.id}
        >
          <PharmacySearchResultItem
            item={pharmacy}
            navigateToPharmacyInformation={onPress}
          />
        </View>
      );
    });
  };

  return (
    <>
      {renderSearchBox}
      <View
        style={[
          pharmacyLocationsListStyle.pharmacyLocationsListViewStyle,
          props.viewStyle,
        ]}
      >
        {renderHeader}
        {renderPharmacies(locations ?? [])}
      </View>
    </>
  );
};
