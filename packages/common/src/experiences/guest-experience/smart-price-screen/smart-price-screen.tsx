// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '../../../components/icons/font-awesome/font-awesome.icon';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { MarkdownText } from '../../../components/text/markdown-text/markdown-text';
import { RxGroupTypesEnum } from '../../../models/member-profile/member-profile-info';
import { PurpleScale } from '../../../theming/theme';
import { getProfilesByGroup } from '../../../utils/profile.helper';
import { useMembershipContext } from '../context-providers/membership/use-membership-context.hook';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/stack-navigators/root/root.stack-navigator';
import { smartPriceScreenStyle } from './smart-price-screen.style';
import { BaseText } from '../../../components/text/base-text/base-text';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { resetStackToHome } from '../store/navigation/navigation-reducer.actions';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { ISmartPriceScreenContent } from './smart-price-screen.ui-content.model';
import { RxIdCard } from '../../../components/cards/rx-id-card/rx-id-card';

export const SmartPriceScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const onManageInfoPress = () => {
    navigation.navigate('AccountInformation');
  };

  const onNavigateBack = () => {
    resetStackToHome(navigation);
  };
  const {
    sectionViewStyle,
    cardViewStyle,
    sectionTitleTextStyle,
    sectionContentTextStyle,
    manageMyInformationTextStyle,
    buttonContainer,
    editIcon,
    manageInfoSectionViewStyle,
  } = smartPriceScreenStyle;

  const { membershipState } = useMembershipContext();

  const groupKey = CmsGroupKey.smartPriceScreen;

  const { content, isContentLoading } = useContent<ISmartPriceScreenContent>(
    groupKey,
    2
  );

  const renderBody = () => {
    const cashProfiles = getProfilesByGroup(
      membershipState.profileList ?? [],
      RxGroupTypesEnum.CASH
    );
    const hasCashProfile = cashProfiles && cashProfiles.length > 0;

    const profile = hasCashProfile ? cashProfiles[0].primary : undefined;

    if (profile)
      return (
        <BodyContentContainer
          testID='smartPrice_body'
          title={content.startSavingTodayLabel}
          isSkeleton={isContentLoading}
        >
          <View testID='smartPrice_card' style={sectionViewStyle}>
            <RxIdCard rxCardType='smartPrice' viewStyle={cardViewStyle} />
          </View>
          <View
            testID='smartPrice_manageMyInfo'
            style={manageInfoSectionViewStyle}
          >
            <BaseText
              children={content.manageMyInformationLabel}
              style={manageMyInformationTextStyle}
              isSkeleton={isContentLoading}
              skeletonWidth='medium'
            />
            <View style={buttonContainer}>
              <TouchableOpacity
                onPress={onManageInfoPress}
                testID='smartPriceScreenManageMyInformation'
              >
                <FontAwesomeIcon
                  style={editIcon}
                  name='edit'
                  size={20}
                  color={PurpleScale.darkest}
                  solid={true}
                />
              </TouchableOpacity>
            </View>
          </View>
          <BaseText
            children={content.showYourPharmacistLabel}
            style={sectionTitleTextStyle}
            isSkeleton={isContentLoading}
            skeletonWidth='medium'
          />
          <MarkdownText
            textStyle={sectionContentTextStyle}
            isSkeleton={isContentLoading}
          >
            {content.showYourPharmacistContent}
          </MarkdownText>
        </BodyContentContainer>
      );
    else return null;
  };

  return (
    <BasicPageConnected
      hideNavigationMenuButton={false}
      showProfileAvatar={true}
      navigateBack={onNavigateBack}
      body={renderBody()}
      translateContent={true}
    />
  );
};
