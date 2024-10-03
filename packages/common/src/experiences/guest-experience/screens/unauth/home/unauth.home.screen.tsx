// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { IServiceData, Services } from './services/services';
import { getUnauthHomeScreenStyles } from './unauth.home.screen.styles';
import { GetStartedModal } from './get-started/get-started.modal';
import { HeadingGradient } from '../../../../../components/text/heading/heading.gradient';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { DrugSearchCard } from '../../../../../components/member/drug-search-card/drug-search-card';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { isDesktopDevice } from '../../../../../utils/responsive-screen.helper';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { MarketingCard } from '../../../../../components/member/cards/marketing/marketing.card';
import { ImageAsset } from '../../../../../components/image-asset/image-asset';
import { LinkButton } from '../../../../../components/buttons/link/link.button';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { Heading } from '../../../../../components/member/heading/heading';
import { setIsGettingStartedModalOpenDispatch } from '../../../state/session/dispatch/set-is-getting-started-modal.dispatch';
import { useNavigation } from '@react-navigation/native';
import { UnauthHomeNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { IPbmMemberBenefitsScreenRouteProps } from '../pbm-member-benefits/pbm-member-benefits.screen';
import { Footer } from './footer/footer';
import { goToUrl } from '../../../../../utils/link.helper';
import { unauthHomeScreenContent } from './unauth.home.screen.content';
import {
  getCMSContentAsyncAction,
  IGetCMSContentAsyncActionArgs,
} from '../../../../../experiences/guest-experience/state/cms-content/async-actions/get-cms-content.async-action';
import { IUIContentGroup } from '../../../../../models/ui-content';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { defaultLanguage } from '../../../../../models/language';

export const UnauthHomeScreen = (): ReactElement => {
  const navigation = useNavigation<UnauthHomeNavigationProp>();
  const [isTextSent, setIsTextSent] = useState(false);
  const [getStartedPath, setGetStartedPath] = useState('');

  const onModalClose = () => {
    setIsGettingStartedModalOpenDispatch(sessionDispatch, false);
    setIsTextSent(false);
  };

  const { sessionDispatch, sessionState } = useSessionContext();

  const [content, setContent] = useState(
    unauthHomeScreenContent(sessionState.uiCMSContentMap, defaultLanguage)
  );

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const [uiContentMap, setUIContentMap] = useState(new Map());
  const cloneUIContentMap = (k: string, v: IUIContentGroup) => {
    setUIContentMap(new Map(uiContentMap.set(k, v)));
  };

  const getCMSContent = async () => {
    if (sessionState.uiCMSContentMap?.size > 0) {
      for (const [key, value] of sessionState.uiCMSContentMap.entries()) {
        cloneUIContentMap(key, value);
      }
    }

    const args: IGetCMSContentAsyncActionArgs = {
      reduxDispatch,
      reduxGetState,
      sessionDispatch,
      version: 2,
      language: defaultLanguage,
      groupKey: CmsGroupKey.homePage,
      uiCMSContentMap: sessionState.uiCMSContentMap,
    };

    const newUIContentMap = await getCMSContentAsyncAction(args);

    for (const [key, value] of newUIContentMap.entries()) {
      cloneUIContentMap(key, value);
    }
  };

  useEffect(() => {
    async function fetchCMSContent() {
      await getCMSContent();

      setContent(
        unauthHomeScreenContent(sessionState.uiCMSContentMap, defaultLanguage)
      );
    }

    fetchCMSContent();
  }, []);

  const onGetStartedShow = (
    path = `${window.location.pathname}${window.location.search}`
  ) => {
    setGetStartedPath(path);
    scrollToTop();
    setIsGettingStartedModalOpenDispatch(sessionDispatch, true);
  };

  const onSearchButtonPress = () => {
    if (isDesktop) {
      onGetStartedShow();
    } else {
      guestExperienceCustomEventLogger(
        CustomAppInsightEvents.USER_HAS_CLICKED_ON_DRUG_SEARCH_UNAUTH,
        {}
      );
      navigation.navigate('DrugSearchStack', { screen: 'DrugSearchHome' });
    }
  };

  const isDesktop = isDesktopDevice();

  const onLearnMoreAboutUsPressed = async () => {
    await goToUrl('https://prescryptive.com');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };

  const onPrescriptionBenefitButton = () => {
    if (isDesktop) {
      const { pathname } = window.location;
      const linkPath = pathname.trim() === '/' ? '/activate' : pathname;

      onGetStartedShow(`${linkPath}${window.location.search}`);
      return;
    }
    navigation.navigate('PbmMemberBenefits', {
      showBackButton: true,
    } as IPbmMemberBenefitsScreenRouteProps);
  };

  const styles = getUnauthHomeScreenStyles(isDesktop);

  const servicesContent: IServiceData[] = [
    {
      action: 'default',
      learnMoreTitle: content.clinicalServicesLearnMoreTitle,
      icon: content.clinicalServicesIcon,
      bullets: [
        content.clinicalServicesBullet1,
        content.clinicalServicesBullet2,
        content.clinicalServicesBullet3,
      ],
      name: content.clinicalServicesHeader,
      text: content.clinicalServicesDescription,
      buttonLabel: content.clinicalServicesButton,
      buttonTestId: 'unauthHomeCardClinicalServicesBookNowButton',
    },
    {
      action: 'drugsearch',
      learnMoreTitle: content.smartPriceLearnMoreTitle,
      icon: content.smartPriceIcon,
      bullets: [
        content.smartPriceBullet1,
        content.smartPriceBullet2,
        content.smartPriceBullet3,
      ],
      name: content.smartPriceHeader,
      text: content.smartPriceDescription,
      buttonLabel: content.smartPriceButton,
      buttonTestId: 'unauthHomeCardSmartPriceServicesGetStartedButton',
    },
  ];

  const body = (
    <View testID='unauthHomeScreenBodyView'>
      <View
        testID='unauthHomeScreenContainerView'
        style={styles.containerViewStyle}
      >
        <View testID='unauthHomeScreenHeading'>
          <HeadingGradient>{content.heading}</HeadingGradient>
        </View>
        <DrugSearchCard
          title={content.drugSearchCardTitle}
          subtitle={content.drugSearchCardSubtitle}
          buttonLabel={content.drugSearchCardButtonLabel}
          onSearchPress={onSearchButtonPress}
          viewStyle={styles.drugSearchCardViewStyle}
        />
        <ScrollView
          style={styles.scrollViewStyle}
          contentContainerStyle={styles.scrollContainerViewStyle}
        >
          <Services
            data={servicesContent}
            onGetStartedShow={onGetStartedShow}
            onSmartPriceButtonPress={onSearchButtonPress}
          />
          <View
            testID='unauthHomeScreenPrescriptionBenefitsView'
            style={styles.prescriptionBenefitsViewStyle}
          >
            <Heading level={2} textStyle={styles.sectionTitleTextStyle}>
              {content.prescriptionBenefitsTitle}
            </Heading>
            <BaseText style={styles.sectionContentTextStyle}>
              {content.prescriptionBenefitsDescription}
            </BaseText>
            <BaseButton
              viewStyle={styles.prescriptionBenefitsButtonViewStyle}
              onPress={onPrescriptionBenefitButton}
              testID='unauthHomeButtonJoinEmployerPlan'
            >
              {content.getStarted}
            </BaseButton>
          </View>
        </ScrollView>
      </View>
      <View
        testID='unauthHomeScreenLowerSectionView'
        style={styles.unauthLowerSectionViewStyle}
      >
        <ImageAsset
          name={isDesktop ? 'sectionBackground' : 'sectionBackgroundImage'}
          style={styles.backgroundIconImageStyle}
        />
        <View
          testID='unauthHomeScreenLowerContainerView'
          style={styles.containerViewStyle}
        >
          <View
            testID='unauthHomeScreenHealthcareTechnologyView'
            style={styles.healthcareTechnologyViewStyle}
          >
            <Heading level={2} textStyle={styles.sectionTitleTextStyle}>
              {content.healthcareTechnologySectionTitle}
            </Heading>
            <BaseText style={styles.sectionContentTextStyle}>
              {content.healthcareTechnologySectionDescription}
            </BaseText>
          </View>
          <View
            testID='unauthHomeScreenMarketingCardSectionView'
            style={styles.marketingCardSectionViewStyle}
          >
            <View
              testID='unauthHomeScreenFirstMarketingCardRowView'
              style={styles.firstMarketingCardRowViewStyle}
            >
              <MarketingCard
                imageName='pillHandIcon'
                title={content.ownPrescriptionsTitle}
                description={content.ownPrescriptionsDescription}
                headingLevel={3}
                viewStyle={styles.firstMarketingCardViewStyle}
              />
              <MarketingCard
                imageName='pillCartIcon'
                title={content.shopToSaveTitle}
                description={content.shopToSaveDescription}
                headingLevel={3}
                viewStyle={styles.lastMarketingCardViewStyle}
              />
            </View>
            <View
              testID='unauthHomeScreenLastMarketingCardRowView'
              style={styles.lastMarketingCardRowViewStyle}
            >
              <MarketingCard
                imageName='stethoscopeIcon'
                title={content.trustedCliniciansTitle}
                description={content.trustedCliniciansDescription}
                headingLevel={3}
                viewStyle={styles.firstMarketingCardViewStyle}
              />
              <MarketingCard
                imageName='lockIcon'
                title={content.secureTitle}
                description={content.secureDescription}
                headingLevel={3}
                viewStyle={styles.lastMarketingCardViewStyle}
              />
            </View>
          </View>
          <LinkButton
            linkText={content.learnMore}
            onPress={onLearnMoreAboutUsPressed}
          />
        </View>
      </View>
      <Footer />
    </View>
  );

  const getStartedModal = isDesktop ? (
    <GetStartedModal
      onHide={onModalClose}
      textSent={isTextSent}
      onTextSent={setIsTextSent}
      path={getStartedPath}
    />
  ) : null;

  return (
    <BasicPageConnected
      applicationHeaderHamburgerTestID='unauthHomeScreenHeaderDrawerHamburgerButton'
      showProfileAvatar={true}
      body={body}
      bodyViewStyle={styles.bodyViewStyle}
      modals={getStartedModal}
      translateContent={true}
    />
  );
};
