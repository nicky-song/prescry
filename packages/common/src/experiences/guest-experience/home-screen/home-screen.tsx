// Copyright 2020 Prescryptive Health, Inc.

import { View, Platform } from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import { HomeFeedListConnected } from '../../../components/member/lists/home-feed-list/home-feed-list.connected';
import { MessageContainer } from '../../../components/member/message-container/message-container';
import { PopupModal } from '../../../components/modal/popup-modal/popup-modal';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import {
  homeScreenStyles,
  homeScreenWelcomeHeaderWebTextStyle,
} from './home-screen.styles';
import { HeadingText } from '../../../components/primitives/heading-text';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  HomeNavigationProp,
  HomeRouteProp,
} from '../navigation/stack-navigators/root/root.stack-navigator';
import { SearchButton } from '../../../components/buttons/search/search.button';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { IGlobalContent } from '../../../models/cms-content/global.content';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';
import { CobrandingHeader } from '../../../components/member/cobranding-header/cobranding-header';
import { useUrl } from '../../../hooks/use-url';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { usePbmProfileCobrandingContent } from '../context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content';

export interface IHomeScreenProps {
  showMessage: boolean;
  firstName?: string;
  resetURL: () => void;
}

export interface IHomeScreenRouteProps {
  modalContent?: {
    modalType?: string;
    title?: string;
    showModal?: boolean;
    modalTopContent?: string;
    modalPrimaryContent?: string;
  };
}

export const HomeScreen = (props: IHomeScreenProps) => {
  const navigation = useNavigation<HomeNavigationProp>();
  const isFocused = useIsFocused();
  useUrl('');

  const { params } = useRoute<HomeRouteProp>();
  const { modalContent } = params;

  const [modalOpen, setModalOpen] = useState(modalContent ? true : false);

  const { logo: cobrandingLogo } = usePbmProfileCobrandingContent();

  const globalGroupKey = CmsGroupKey.global;
  const { content: globalContent, isContentLoading: isGlobalContentLoading } =
    useContent<IGlobalContent>(globalGroupKey, 2);

  useEffect(() => {
    setModalOpen(!!modalContent);
  }, [modalContent]);

  const message = props.showMessage ? (
    <MessageContainer bodyText={globalContent.bannerText} />
  ) : null;

  const cobrandingHeader = cobrandingLogo ? (
    <View style={homeScreenStyles.cobrandingHeaderViewStyle}>
      <CobrandingHeader logoUrl={cobrandingLogo} />
    </View>
  ) : null;

  const onDrugSearchButtonPress = () => {
    navigation.navigate('DrugSearchStack', { screen: 'DrugSearchHome' });
  };

  const welcomeCaption = props.firstName
    ? StringFormatter.format(
        globalContent.welcomeCaption,
        new Map([['firstName', props.firstName]])
      )
    : '';

  const body = (
    <>
      {message}
      <View style={homeScreenStyles.homeScreenBodyViewStyle}>
        {cobrandingHeader}
        <View style={homeScreenStyles.homeScreenWelcomeHeaderViewStyle}>
          {Platform.OS === 'web' ? (
            <h1 style={homeScreenWelcomeHeaderWebTextStyle}>
              {welcomeCaption}
            </h1>
          ) : (
            <HeadingText
              level={1}
              style={homeScreenStyles.homeScreenWelcomeHeaderTextStyle}
              testID='homeScreenHeadingTextWelcomeCaption'
            >
              {welcomeCaption}
            </HeadingText>
          )}

          <SearchButton
            onPress={onDrugSearchButtonPress}
            viewStyle={homeScreenStyles.drugSearchButtonViewStyle}
            label={globalContent.authSearchButton}
            isSkeleton={isGlobalContentLoading}
            testID='homeScreenSearchButton'
          />
        </View>
        <HomeFeedListConnected isScreenCurrent={isFocused} />
      </View>
    </>
  );

  const toggleModal = async () => {
    setModalOpen(!modalOpen);
    await props.resetURL();
  };

  const renderModal = (): ReactNode => {
    if (modalContent) {
      return (
        <PopupModal
          key='home-popup'
          modalType={modalContent.modalType}
          isOpen={modalOpen}
          toggleModal={toggleModal}
          content={modalContent.modalTopContent}
          primaryButtonLabel={modalContent.modalPrimaryContent}
          onPrimaryButtonPress={toggleModal}
          primaryButtonTestID='homeScreenPopupModalPrimaryButton'
          titleText={modalContent.title}
        />
      );
    } else return null;
  };

  return (
    <BasicPageConnected
      applicationHeaderHamburgerTestID='homeScreenHeaderDrawerHamburgerButton'
      headerViewStyle={homeScreenStyles.homeFeedHeaderViewStyle}
      body={body}
      hideNavigationMenuButton={false}
      showProfileAvatar={true}
      modals={renderModal()}
      translateContent={true}
    />
  );
};
