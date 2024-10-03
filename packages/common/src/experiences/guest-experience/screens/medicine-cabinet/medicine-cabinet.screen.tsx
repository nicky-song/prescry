// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
  useRef,
  ReactElement,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { ScrollView, View } from 'react-native';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { useMedicineCabinetContext } from '../../context-providers/medicine-cabinet/medicine-cabinet.context.hook';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import {
  getMedicineCabinetAsyncAction,
  IGetMedicineCabinetAsyncActionArgs,
} from '../../state/medicine-cabinet/async-actions/get-medicine-cabinet.async-action';
import { pickAPharmacyNavigateDispatch } from '../../store/navigation/dispatch/shopping/pick-a-pharmacy-navigate.dispatch';
import { IMedicineCabinetScreenContent } from './medicine-cabinet.screen.content';
import { MedicineCabinetApiConstants } from '../../../../theming/constants';
import { LinkButton } from '../../../../components/buttons/link/link.button';
import {
  MedicineCabinetNavigationProp,
  MedicineCabinetRouteProps,
} from '../../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { useUrl } from '../../../../hooks/use-url';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { useFeaturesContext } from '../../context-providers/features/use-features-context.hook';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IGlobalContent } from '../../../../models/cms-content/global.content';
import { PrescriptionList } from '../../../../components/lists/prescription/prescription.list';
import {
  INavigationLink,
  NavigationLinkList,
} from '../../../../components/lists/navigation-link/navigation-link.list';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { medicineCabinetScreenStyles } from './medicine-cabinet.screen.styles';
import { LogoClickActionEnum } from '../../../../components/app/application-header/application-header';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import { isPbmMember } from '../../../../utils/profile.helper';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { Heading } from '../../../../components/member/heading/heading';
import { ChevronCard } from '../../../../components/cards/chevron/chevron.card';
import { List } from '../../../../components/primitives/list';
import { ListItem } from '../../../../components/primitives/list-item';
import { EmptyStateMessage } from '../../../../components/messages/empty-state/empty-state.message';
import { InlineLink } from '../../../../components/member/links/inline/inline.link';
import { SlideUpModal } from '../../../../components/modal/slide-up/slide-up.modal';
import { MarkdownText } from '../../../../components/text/markdown-text/markdown-text';
import { useLoadingContext } from '../../context-providers/loading/use-loading-context';
import { sendNotificationEvent } from '../../api/api-v1.send-notification-event';

export interface IMedicineCabinetScreenRouteProps {
  backToHome?: boolean;
}

export const MedicineCabinetScreen = (): ReactElement => {
  const navigation = useNavigation<MedicineCabinetNavigationProp>();
  const styles = medicineCabinetScreenStyles;

  const { content: globalContent, isContentLoading: isGlobalContentLoading } =
    useContent<IGlobalContent>(CmsGroupKey.global, 2);

  const { content, isContentLoading } =
    useContent<IMedicineCabinetScreenContent>(
      CmsGroupKey.medicineCabinetScreen,
      2
    );

  useUrl('/cabinet');

  const { membershipState: memberProfile } = useMembershipContext();
  const { loadingState } = useLoadingContext();

  const {
    medicineCabinetState: { prescriptions },
    medicineCabinetDispatch,
  } = useMedicineCabinetContext();

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const { featuresState: features } = useFeaturesContext();

  const { params } = useRoute<MedicineCabinetRouteProps>();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentResultLength, setCurrentResultLength] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setCurrentPage(1);
    setCurrentResultLength(0);
    setLastPage(false);

    void getPrescriptions(1);
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      setCurrentResultLength(prescriptions.length);

      void getPrescriptions(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentResultLength === prescriptions.length && currentPage > 1) {
      setLastPage(true);
    }
  }, [prescriptions]);

  const getPrescriptions = async (page: number) => {
    const args: IGetMedicineCabinetAsyncActionArgs = {
      page,
      reduxDispatch,
      reduxGetState,
      medicineCabinetDispatch,
      navigation,
      loadingText: content.loadingPrescriptionsText,
    };
    await getMedicineCabinetAsyncAction(args);
  };

  const scrollToTop = () => {
    if (scrollViewRef?.current) {
      const scrollViewRefCurrent = scrollViewRef.current;
      scrollViewRefCurrent.scrollTo({ y: 0 });
    }
  };

  const onDrugSearchButtonPress = () => {
    navigation.navigate('DrugSearchStack', { screen: 'DrugSearchHome' });
  };

  const onPressLoadMoreButton = () => {
    setCurrentPage(currentPage + 1);
  };

  const loadMoreButton =
    prescriptions.length >= MedicineCabinetApiConstants.pageSize ? (
      <View testID='buttonContainer'>
        <LinkButton
          onPress={!lastPage ? onPressLoadMoreButton : scrollToTop}
          linkText={
            !lastPage
              ? content.seeMorePrescriptionsLink
              : globalContent.scrollToTop
          }
          isSkeleton={isGlobalContentLoading}
        />
      </View>
    ) : null;

  const onPrescriptionSelect = (
    prescriptionId: string,
    blockchain?: boolean
  ) => {
    pickAPharmacyNavigateDispatch(navigation, {
      prescriptionId,
      navigateToHome: false,
      reloadPrescription: true,
      blockchain,
    });

    const state = reduxGetState();
    const api = state.config.apis.guestExperienceApi;
    const settings = state.settings;

    sendNotificationEvent(
      api,
      {
        idType: 'smartContractId',
        id: prescriptionId,
        tags: [
          'dRx',
          'supportDashboard',
          'myPrescryptive',
          'prescriberFeedbackLoop',
        ],
        subject: 'Patient viewed NewRx in Medicine Cabinet.',
        messageData: '',
      },
      settings.deviceToken,
      settings.token
    );
  };

  const buildNavigationLinks = (): ReactNode => {
    const prescriptionBenefitPlanLink: INavigationLink = {
      key: 'prescriptionBenefitPlan',
      label: content.prescriptionBenefitPlanLink,
      onPress: () => navigation.navigate('PrescriptionBenefitPlan'),
      isSkeleton: isContentLoading,
    };
    const transferAPrescriptionLink: INavigationLink = {
      key: 'transferAPrescription',
      label: content.transferAPrescriptionLink,
      onPress: onDrugSearchButtonPress,
      isSkeleton: isContentLoading,
    };

    const links: INavigationLink[] = [];

    if (isPbmMember(memberProfile.profileList, features)) {
      links.push(prescriptionBenefitPlanLink);
    }

    if (prescriptions.length > 0) {
      links.push(transferAPrescriptionLink);
    }

    return links.length ? (
      <>
        <LineSeparator viewStyle={styles.navigationListSeparatorViewStyle} />
        <NavigationLinkList links={links} />
      </>
    ) : null;
  };
  const navigationLinks = buildNavigationLinks();

  const showLearnMore = () => setShowModal(true);
  const hideLearnMore = () => setShowModal(false);

  const emptyStateContent =
    loadingState.count === 0 && prescriptions.length === 0 ? (
      <View>
        <LineSeparator viewStyle={styles.lineSeparatorViewStyle} />
        <Heading level={2} textStyle={styles.headingTextStyle}>
          {content.howToSendPrescriptionText}
        </Heading>
        <List style={styles.listViewStyle}>
          <ListItem testID='transferPrescriptionListItem'>
            <ChevronCard
              viewStyle={styles.chevronCardViewStyle}
              onPress={onDrugSearchButtonPress}
            >
              <View style={styles.chevronCardCommonViewStyle}>
                <BaseText style={styles.subHeadingTextStyle}>
                  {content.transferExistingPrescriptionHeading}
                </BaseText>
                <BaseText style={styles.subtitleTextStyle}>
                  {content.transferExistingPrescriptionText}
                </BaseText>
              </View>
            </ChevronCard>
          </ListItem>
          <ListItem testID='sayTheWordListItem'>
            <BaseText style={styles.subHeadingTextStyle}>
              {content.sayTheWordPrescryptiveHeading}
            </BaseText>
            <BaseText style={styles.subtitleTextStyle}>
              {content.sayTheWordPrescryptiveText}{' '}
              <InlineLink onPress={showLearnMore} isSkeleton={isContentLoading}>
                {content.learnMoreText}
              </InlineLink>
            </BaseText>

            <SlideUpModal
              isVisible={showModal}
              heading={content.learnMoreModalHeading}
              onClosePress={hideLearnMore}
              isSkeleton={isContentLoading}
            >
              <MarkdownText>{content.learnMoreModalText}</MarkdownText>
            </SlideUpModal>
          </ListItem>
        </List>
      </View>
    ) : null;

  const noMedicineCabinetContent = (
    <View>
      <EmptyStateMessage
        imageName='emptyMedicineCabinet'
        message={content.noPrescriptionText}
        bottomSpacing='wide'
        isSkeleton={isContentLoading}
      />
      {emptyStateContent}
    </View>
  );
  const prescriptionListContent =
    prescriptions.length > 0 ? (
      <PrescriptionList
        prescriptions={prescriptions}
        onPrescriptionSelect={onPrescriptionSelect}
        testID='medicineCabinetPrescriptionList'
        viewStyle={styles.prescriptionListViewStyle}
      />
    ) : (
      noMedicineCabinetContent
    );

  const body = (
    <BodyContentContainer title={content.title} isSkeleton={isContentLoading}>
      {prescriptionListContent}
      {loadMoreButton}
      {navigationLinks}
    </BodyContentContainer>
  );

  const handleNavigateBack = () => {
    if (params?.backToHome) {
      navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
    } else {
      navigation.goBack();
    }
  };

  return (
    <BasicPageConnected
      showProfileAvatar={true}
      navigateBack={handleNavigateBack}
      body={body}
      ref={scrollViewRef}
      logoClickAction={LogoClickActionEnum.CONFIRM}
      translateContent={true}
    />
  );
};
