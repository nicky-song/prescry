// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState, ReactElement } from 'react';
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from 'react-native';
import { ListItemButton } from '../../../../../components/buttons/list-item/list-item.button';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { PrimaryTextInput } from '../../../../../components/inputs/primary-text/primary-text.input';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { IDrugSearchResult } from '../../../../../models/drug-search-response';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import {
  drugSearchAsyncAction,
  IDrugSearchAsyncActionArgs,
} from '../../../state/drug-search/async-actions/drug-search.async-action';
import { pickAPharmacyNavigateDispatch } from '../../../store/navigation/dispatch/drug-search/pick-a-pharmacy-navigate.dispatch';
import { drugSearchHomeScreenStyle } from './drug-search-home.screen.style';
import { drugSearchHomeScreenContent } from './drug-search-home.screen.content';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import { setSelectedDrugDispatch } from '../../../state/drug-search/dispatch/set-selected-drug.dispatch';
import { DrugNameText } from '../../../../../components/text/drug-name/drug-name-text';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { GoBackButton } from '../../../../../components/buttons/go-back-button/go-back.button';
import { setDrugSearchResultsDispatch } from '../../../state/drug-search/dispatch/set-drug-search-results.dispatch';
import { getHighestPriorityProfile } from '../../../../../utils/profile.helper';
import { RX_SUB_GROUP_DEFAULT } from '../../../../../models/member-profile/member-profile-info';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { FontAwesomeIcon } from '../../../../../components/icons/font-awesome/font-awesome.icon';
import { useNavigation } from '@react-navigation/native';
import { DrugSearchHomeNavigationProp } from '../../../navigation/stack-navigators/drug-search/drug-search.stack-navigator';
import { PrimaryColor } from '../../../../../theming/colors';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { IFeaturesState } from '../../../guest-experience-features';

const debouncedDrugSearchAsyncAction = AwesomeDebouncePromise(
  drugSearchAsyncAction,
  200
);

export const DrugSearchHomeScreen = (): ReactElement => {
  const navigation = useNavigation<DrugSearchHomeNavigationProp>();

  const [showSpinner, setShowSpinner] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [userInput, setUserInput] = useState<string>('');

  const {
    deleteIconTextStyle,
    deleteIconHolderViewStyle,
    searchTextViewStyle,
    spinnerViewStyle,
  } = drugSearchHomeScreenStyle;

  const { searchTextAccessibilityLabel, searchTextPlaceholder } =
    drugSearchHomeScreenContent;

  const { getState: reduxGetState, dispatch: reduxDispatch } =
    useReduxContext();

  const {
    drugSearchState: { drugSearchResults },
    drugSearchDispatch,
  } = useDrugSearchContext();

  useEffect(() => {
    setShowSpinner(false);
    if (userInput.length) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [drugSearchResults]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const keyboardVisible = () => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  };

  useEffect(() => {
    keyboardVisible();
  }, []);

  const { membershipState } = useMembershipContext();
  const rxSubGroup =
    getHighestPriorityProfile(membershipState.profileList)?.primary
      .rxSubGroup ?? RX_SUB_GROUP_DEFAULT;

  const { useAllMedicationsSearch } = useFlags<IFeaturesState>();

  const onChangeText = async (value: string) => {
    const valueTrim = value.trim();
    setUserInput(value);

    if (valueTrim.length > 0) {
      setShowDeleteIcon(true);
    } else {
      setShowResults(false);
      setShowDeleteIcon(false);
    }

    if (valueTrim.length < 3) {
      return;
    }

    const args: IDrugSearchAsyncActionArgs = {
      filter: valueTrim,
      rxSubGroup,
      maxResults: 8,
      drugSearchDispatch,
      navigation,
      reduxDispatch,
      reduxGetState,
      useAllMedicationsSearch,
    };

    setShowSpinner(true);
    setSelectedDrugDispatch(drugSearchDispatch);
    await debouncedDrugSearchAsyncAction(args);
  };

  const setSelectedDrugAndNavigate = (drug: IDrugSearchResult) => {
    const defaultConfiguration =
      drugSearchResultHelper.getDefaultConfiguration(drug);

    setSelectedDrugDispatch(drugSearchDispatch, drug, defaultConfiguration);
    setShowSpinner(false);

    Keyboard.dismiss();
    pickAPharmacyNavigateDispatch(navigation);
  };

  const deleteText = () => {
    setUserInput('');
    setShowResults(false);
    setShowDeleteIcon(false);
  };

  const spinner = showSpinner ? (
    <View style={spinnerViewStyle}>
      <ActivityIndicator size='large' color={PrimaryColor.prescryptivePurple} />
    </View>
  ) : null;

  const deleteIcon = showDeleteIcon ? (
    <TouchableOpacity onPress={deleteText} style={deleteIconHolderViewStyle}>
      <FontAwesomeIcon name='times' size={16} style={deleteIconTextStyle} />
    </TouchableOpacity>
  ) : null;

  const drugList = showResults
    ? drugSearchResults.map((drug: IDrugSearchResult) => {
        const onListItemPress = () => {
          keyboardVisible();
          if (isKeyboardVisible) {
            Keyboard.dismiss();
          } else {
            setSelectedDrugAndNavigate(drug);
          }
        };

        return (
          <ListItemButton
            key={drug.name}
            onPress={onListItemPress}
            testID={'listItemDrugNameButton-' + drug.name}
          >
            <DrugNameText
              drugName={drug.name}
              input={userInput}
            />
          </ListItemButton>
        );
      })
    : null;

  const noResultsMessage =
    userInput.length >= 3 && drugSearchResults.length === 0 && !showSpinner ? (
      <BaseText style={drugSearchHomeScreenStyle.noResultsTextStyle}>
        {drugSearchHomeScreenContent.noResultsMessage}
      </BaseText>
    ) : null;

  const onNavigateBackButtonPress = () => {
    navigation.goBack();
    deleteText();
    setDrugSearchResultsDispatch(drugSearchDispatch, [], 0);
  };

  const navigateBackButton = navigation.canGoBack() ? (
    <GoBackButton
      onPress={onNavigateBackButtonPress}
      accessibilityLabel={drugSearchHomeScreenContent.goBackButtonLabel}
    />
  ) : null;

  const body = (
    <ScrollView keyboardDismissMode='on-drag'>
      <BodyContentContainer>
        <View style={searchTextViewStyle} testID='drugSearchSearchText'>
          {navigateBackButton}
          <PrimaryTextInput
            autoFocus={true}
            value={userInput}
            onChangeText={onChangeText}
            placeholder={searchTextPlaceholder}
            accessibilityLabel={searchTextAccessibilityLabel}
            testID='searchForDrugsTextInput'
          />
          {deleteIcon}
        </View>
        {noResultsMessage}
        {drugList}
        {spinner}
      </BodyContentContainer>
    </ScrollView>
  );

  return (
    <BasicPageConnected
      hideApplicationHeader={true}
      body={body}
      translateContent={true}
    />
  );
};
