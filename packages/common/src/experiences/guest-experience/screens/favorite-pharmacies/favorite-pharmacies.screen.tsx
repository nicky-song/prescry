// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useState, useEffect } from 'react';
import { View } from 'react-native';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { FavoritePharmacyCard } from '../../../../components/member/cards/favorite-pharmacy/favorite-pharmacy.card';
import { AllFavoriteNotifications } from '../../../../components/notifications/all-favorite/all-favorite.notifications';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { useIsMounted } from '../../../../hooks/use-is-mounted/use-is-mounted.hook';
import { IPharmacy } from '../../../../models/pharmacy';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { FavoritePharmaciesNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { setFavoritingStatusDispatch } from '../../state/membership/dispatch/set-favoriting-status.dispatch';
import { getFavoritedPharmaciesDispatch } from '../../store/member-list-info/dispatch/get-favorited-pharmacies.dispatch';
import { favoritePharmacyAsyncAction } from '../../store/set-favorite-pharmacy/async-actions/favorite-pharmacy.async-action';
import { IFavoritePharmaciesScreenContent } from './favorite-pharmacies.screen.cms-content-wrapper';
import { favoritePharmaciesScreenStyles } from './favorite-pharmacies.screen.styles';

export const FavoritePharmaciesScreen = (): ReactElement => {
  const navigation = useNavigation<FavoritePharmaciesNavigationProp>();

  const [errorMessage, setErrorMessage] = useState('');

  const [favoritedPharmacyList, setFavoritedPharmacyList] = useState<
    IPharmacy[]
  >([] as IPharmacy[]);

  const { content, isContentLoading } =
    useContent<IFavoritePharmaciesScreenContent>(
      CmsGroupKey.favoritePharmaciesScreen,
      2
    );

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const {
    membershipState: {
      account: { favoritedPharmacies },
      favoritingStatus,
    },
    membershipDispatch,
  } = useMembershipContext();

  const isMounted = useIsMounted();

  useEffect(() => {
    (async () => {
      try {
        setErrorMessage('');
        const favoritedPharmaciesResponse =
          await getFavoritedPharmaciesDispatch(reduxDispatch, reduxGetState);

        if (favoritedPharmaciesResponse.data.favoritedPharmacies.length) {
          return favoritedPharmaciesResponse.data.favoritedPharmacies;
        } else {
          throw new Error();
        }
      } catch {
        return [];
      }
    })().then((data) => {
      if (isMounted) {
        if (data.length) setFavoritedPharmacyList(data);
        else setErrorMessage(content.favoritePharmaciesErrorMessage);
      }
    });

    return () => {
      isMounted.current = false;
    };
  }, []);

  const onNotificationClose = () => {
    setFavoritingStatusDispatch(membershipDispatch, 'none');
  };

  const skeletonOnPress = () => {
    void true;
  };

  const skeletonOnPressAsync = () => new Promise<void>(skeletonOnPress);

  const skeletonFavoritePharmacyCard = (favoritedPharmacyNcpdp: string) => {
    return (
      <FavoritePharmacyCard
        key={favoritedPharmacyNcpdp}
        onPress={skeletonOnPressAsync}
        pharmacyName=''
        pharmacyAddress=''
        pharmacyNcpdp={favoritedPharmacyNcpdp}
        isSkeleton={true}
        viewStyle={favoritePharmaciesScreenStyles.favoritePharmacyCardViewStyle}
      />
    );
  };

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const skeletonFavoritePharmacyCards = favoritedPharmacies.map(
    (favoritedPharmacy) => {
      return skeletonFavoritePharmacyCard(favoritedPharmacy);
    }
  );

  const pageContent = favoritedPharmacyList.length ? (
    favoritedPharmacyList.map((favoritedPharmacy: IPharmacy) => {
      const onPress = async () => {
        setIsDisabled(true);

        const ncpdp = favoritedPharmacy.ncpdp;

        onNotificationClose();

        await favoritePharmacyAsyncAction({
          ncpdp,
          navigation,
          reduxDispatch,
          reduxGetState,
          membershipDispatch,
        });

        setIsDisabled(false);
      };

      const ncpdp = favoritedPharmacy.ncpdp;
      const pharmacyBrand = favoritedPharmacy.brand;
      const pharmacyName = favoritedPharmacy.name;
      const pharmacyBrandOrName = pharmacyBrand ?? pharmacyName;
      const pharmacyAddress = `${favoritedPharmacy.address.lineOne} ${favoritedPharmacy.address.city}, ${favoritedPharmacy.address.state}`;

      return (
        <FavoritePharmacyCard
          key={ncpdp}
          onPress={onPress}
          pharmacyName={pharmacyBrandOrName}
          pharmacyAddress={pharmacyAddress}
          pharmacyNcpdp={ncpdp}
          viewStyle={
            favoritePharmaciesScreenStyles.favoritePharmacyCardViewStyle
          }
          isDisabled={isDisabled}
          testID={`favoritePharmacyCard-${ncpdp}`}
        />
      );
    })
  ) : errorMessage === '' ? (
    <View>{skeletonFavoritePharmacyCards}</View>
  ) : null;

  const body = (
    <BodyContentContainer
      title={content.favoritePharmaciesTitle}
      testID='favoritePharmaciesScreen'
      isSkeleton={isContentLoading}
    >
      <BaseText style={favoritePharmaciesScreenStyles.errorMessageTextStyle}>
        {errorMessage}
      </BaseText>
      {pageContent}
    </BodyContentContainer>
  );

  const notification =
    favoritingStatus !== 'none' ? (
      <AllFavoriteNotifications onNotificationClose={onNotificationClose} />
    ) : undefined;

  return (
    <BasicPageConnected
      body={body}
      navigateBack={navigation.goBack}
      showProfileAvatar={true}
      notification={notification}
    />
  );
};
