// Copyright 2021 Prescryptive Health, Inc.

import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { findYourPharmacyStyle } from './find-your-pharmacy.screen.style';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { Heading } from '../../../../../components/member/heading/heading';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { SearchBox } from '../../../../../components/member/search-box/search-box';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import {
  getPharmaciesByZipCodeAsyncAction,
  IGetPharmaciesByZipCodeAsyncActionArgs,
} from '../../../state/drug-search/async-actions/get-pharmacies-by-zip-code.async-action';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import { IPharmacy } from '../../../../../models/pharmacy';
import { PharmacySearchResultItem } from '../../../../../components/member/items/pharmacy-search-result-item/pharmacy-search-result-item';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { Workflow } from '../../../../../models/workflow';
import { LinkButton } from '../../../../../components/buttons/link/link.button';
import { setSelectedSourcePharmacyDispatch } from '../../../state/drug-search/dispatch/set-selected-source-pharmacy.dispatch';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { verifyPrescriptionNavigateDispatch } from '../../../store/navigation/dispatch/drug-search/verify-prescription-navigate.dispatch';
import { ICreateAccountScreenRouteProps } from '../../sign-in/create-account/create-account.screen';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { FindYourPharmacyRouteProp } from '../../../navigation/stack-navigators/drug-search/drug-search.stack-navigator';
import { LogoClickActionEnum } from '../../../../../components/app/application-header/application-header';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { IFindPharmacyContent } from './find-your-pharmacy.screen.content';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { PricingOption } from '../../../../../models/pricing-option';

export interface IFindYourPharmacyScreenRouteProps {
  workflow: Workflow;
  pricingOption?: PricingOption;
}

export const FindYourPharmacyScreen = () => {
  const findYourPharmacyContentGroupKey = CmsGroupKey.findYourPharmacy;

  const {
    content: findYourPharmacyContent,
    isContentLoading: findYourPharmacyIsContentLoading,
  } = useContent<IFindPharmacyContent>(findYourPharmacyContentGroupKey, 2);

  const navigation = useNavigation<RootStackNavigationProp>();
  const styles = findYourPharmacyStyle;
  const numberOfPharmaciesInBatch = 20;
  const zipCodeLength = 5;
  const {
    drugSearchState: { sourcePharmacies, invalidZipErrorMessage },
    drugSearchDispatch,
  } = useDrugSearchContext();

  const {
    sessionState: { isUnauthExperience, userLocation },
  } = useSessionContext();

  const [start, setStart] = useState(0);

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();
  const { params } = useRoute<FindYourPharmacyRouteProp>();
  const { workflow, pricingOption } = params;

  const [zipCode, setZipCode] = useState<string>(userLocation?.zipCode ?? '');
  const [previousPharmacyListLength, setPreviousPharmacyListLength] =
    useState(0);
  const [allPharmaciesReceived, setAllPharmaciesReceived] = useState(false);

  const getPharmacies = async () => {
    const args: IGetPharmaciesByZipCodeAsyncActionArgs = {
      zipCode,
      start: start === 0 ? undefined : start.toString(),
      isUnauthExperience: isUnauthExperience || false,
      reduxDispatch,
      reduxGetState,
      drugSearchDispatch,
      navigation,
    };
    await getPharmaciesByZipCodeAsyncAction(args);
  };
  const scrollViewRef = useRef<ScrollView>(null);
  const viewRef = useRef<View>(null);
  useEffect(() => {
    setAllPharmaciesReceived(false);
    if (zipCode.length === zipCodeLength) {
      setStart(0);
      getPharmacies().catch((err) => {
        return err;
      });
    }
  }, [zipCode]);

  useEffect(() => {
    if (zipCode.length === zipCodeLength) {
      getPharmacies().catch((err) => {
        return err;
      });
    }
  }, [start]);

  useEffect(() => {
    if (
      sourcePharmacies.length > 0 &&
      sourcePharmacies.length <
        previousPharmacyListLength + numberOfPharmaciesInBatch
    ) {
      setAllPharmaciesReceived(true);
    }
  }, [sourcePharmacies]);

  const renderHeader = (
    <View ref={viewRef}>
      <View>
        <Heading
          textStyle={styles.findPharmacyTextStyle}
          isSkeleton={findYourPharmacyIsContentLoading}
          skeletonWidth='medium'
        >
          {findYourPharmacyContent.header}
        </Heading>
        <BaseText
          style={styles.findPharmacySubTextStyle}
          isSkeleton={findYourPharmacyIsContentLoading}
          skeletonWidth='long'
        >
          {findYourPharmacyContent.subHeader}
        </BaseText>
      </View>
    </View>
  );

  const search = (zip?: string) => {
    if (zip && zip !== zipCode) {
      setZipCode(zip);
    }
  };

  const renderSearchBox = (
    <SearchBox
      onSearch={search}
      value={zipCode}
      testID='findYourPharmacySearchBox'
    />
  );

  const renderPharmacies = (pharmacies: IPharmacy[]) => {
    return pharmacies.map((pharmacy) => {
      const onPharmacyPress = () => {
        setSelectedSourcePharmacyDispatch(drugSearchDispatch, pharmacy);
        if (isUnauthExperience && workflow) {
          const createAccountParams: ICreateAccountScreenRouteProps = {
            workflow,
          };
          navigation.navigate('RootStack', {
            screen: 'CreateAccount',
            params: createAccountParams,
          });
        } else if (!isUnauthExperience) {
          const hasBackNavigation = true;
          verifyPrescriptionNavigateDispatch(
            navigation,
            hasBackNavigation,
            pricingOption
          );
        }
      };
      const pharmacyItem = {
        id: pharmacy.ncpdp,
        providerName: pharmacy.name,
        locationName: pharmacy.name,
        address1: pharmacy.address.lineOne,
        address2: pharmacy.address.lineTwo,
        city: pharmacy.address.city,
        state: pharmacy.address.state,
        zip: pharmacy.address.zip,
        distance: pharmacy.distance,
        phoneNumber: pharmacy.phoneNumber,
      };
      return (
        <View
          testID={'findYourPharmacyCard-' + pharmacy.ncpdp}
          style={styles.pharmacyResultViewStyle}
          key={pharmacy.ncpdp}
        >
          <PharmacySearchResultItem
            item={pharmacyItem}
            navigateToPharmacyInformation={onPharmacyPress}
          />
        </View>
      );
    });
  };

  const getMorePharmacies = () => {
    setPreviousPharmacyListLength(sourcePharmacies.length);
    setStart(start + numberOfPharmaciesInBatch);
  };

  const scrollToTop = () => {
    if (!viewRef?.current || !scrollViewRef?.current) {
      return;
    }
    const viewRefCurrent = viewRef.current;
    const scrollViewRefCurrent = scrollViewRef.current;
    viewRefCurrent.measure((_, y) => {
      scrollViewRefCurrent.scrollTo(y);
    });
  };

  const renderSeeMoreButton =
    sourcePharmacies.length !== 0 ? (
      <LinkButton
        viewStyle={styles.displayMoreButtonViewStyle}
        onPress={allPharmaciesReceived ? scrollToTop : getMorePharmacies}
        linkText={
          allPharmaciesReceived
            ? findYourPharmacyContent.backToTheTop
            : findYourPharmacyContent.displayMore
        }
        isSkeleton={findYourPharmacyIsContentLoading}
        skeletonWidth='short'
      />
    ) : null;
  const renderErrorMessage = invalidZipErrorMessage ? (
    <BaseText style={styles.errorMessageTextStyle}>
      {invalidZipErrorMessage}
    </BaseText>
  ) : undefined;

  const body = (
    <BodyContentContainer>
      {renderHeader}
      {renderSearchBox}
      {renderErrorMessage}
      {renderPharmacies(sourcePharmacies)}
      {renderSeeMoreButton}
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      stickyIndices={[1]}
      body={body}
      showProfileAvatar={false}
      navigateBack={navigation.goBack}
      headerViewStyle={styles.headerViewStyle}
      ref={scrollViewRef}
      logoClickAction={LogoClickActionEnum.CONFIRM}
      translateContent={true}
    />
  );
};
