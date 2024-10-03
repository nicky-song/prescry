// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useEffect } from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { HomeButton } from '../../../../components/buttons/home/home.button';
import { ToolButton } from '../../../../components/buttons/tool.button/tool.button';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { ClaimHistoryList } from '../../../../components/lists/claim-history/claim-history.list';
import { EmptyStateMessage } from '../../../../components/messages/empty-state/empty-state.message';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { goToUrl } from '../../../../utils/link.helper';
import { base64StringToBlob } from '../../../../utils/test-results/test-results.helper';
import { useLoadingContext } from '../../context-providers/loading/use-loading-context';
import { useMedicineCabinetContext } from '../../context-providers/medicine-cabinet/medicine-cabinet.context.hook';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { ClaimHistoryNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  getClaimHistoryAsyncAction,
  IGetClaimHistoryAsyncActionArgs,
} from '../../state/medicine-cabinet/async-actions/get-claim-history.async-action';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';

import { IClaimHistoryScreenContent } from './claim-history.screen.content';
import { claimHistoryScreenStyles } from './claim-history.screen.styles';

export const ClaimHistoryScreen = (): ReactElement => {
  const navigation = useNavigation<ClaimHistoryNavigationProp>();

  const { content, isContentLoading } = useContent<IClaimHistoryScreenContent>(
    CmsGroupKey.claimHistoryScreen,
    2
  );

  const {
    medicineCabinetState: { claimHistory, prescriptions },
    medicineCabinetDispatch,
  } = useMedicineCabinetContext();
  const { loadingState } = useLoadingContext();
  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  useEffect(() => {
    getClaimHistory();
  }, []);

  const getClaimHistory = async () => {
    const args: IGetClaimHistoryAsyncActionArgs = {
      reduxDispatch,
      reduxGetState,
      medicineCabinetDispatch,
      navigation,
      loadingText: content.loadingClaimsText,
    };
    await getClaimHistoryAsyncAction(args);
  };

  const onPressViewPdf = async () => {
    const resultPdf = claimHistory?.claimPdf;

    if (resultPdf) {
      const blob = base64StringToBlob(resultPdf);

      const url = URL.createObjectURL(blob).toString();
      await goToUrl(url);
    }
  };

  const onHomePress = () => {
    navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
  };
  const onMedicineCabinetPress = () => {
    navigation.navigate('MedicineCabinet', {});
  };

  const modalButton =
    prescriptions.length > 0 ? (
      <BaseButton
        size='large'
        onPress={onMedicineCabinetPress}
        testID='claimHistoryMedicineCabinetButton'
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.medicineCabinetButtonLabel}
      </BaseButton>
    ) : (
      <HomeButton
        onPress={onHomePress}
        isSkeleton={isContentLoading}
        testID='claimHistoryScreenHomeButton'
      />
    );

  const noClaimsText =
    prescriptions.length > 0
      ? content.emptyClaimsWithPrescriptionText
      : content.emptyClaimsText;

  const isEmptyState =
    loadingState.count === 0 && claimHistory?.claims.length === 0;

  const emptyStateContent = isEmptyState ? (
    <View>
      <BaseText style={claimHistoryScreenStyles.noClaimsTextViewStyle}>
        {noClaimsText}
      </BaseText>
      {modalButton}
    </View>
  ) : null;

  const emptyClaimHeading = isEmptyState ? content.emptyClaimsHeading : '';

  const noClaimHistoryContent = (
    <View>
      <EmptyStateMessage
        imageName='emptyClaimsImage'
        message={emptyClaimHeading}
        bottomSpacing='regular'
        isSkeleton={isContentLoading}
      />

      {emptyStateContent}
    </View>
  );

  const claimHistoryContent = claimHistory?.claims.length ? (
    <ClaimHistoryList
      claims={claimHistory?.claims}
      testID='claimHistoryList'
    ></ClaimHistoryList>
  ) : (
    noClaimHistoryContent
  );

  const downloadButton = claimHistory.claims.length ? (
    <ToolButton
      iconName='file-download'
      onPress={onPressViewPdf}
      viewStyle={claimHistoryScreenStyles.downloadButtonViewStyle}
    >
      {content.downloadButtonLabel}
    </ToolButton>
  ) : null;

  const body = (
    <BodyContentContainer
      title={content.title}
      testID='claimHistoryScreen'
      isSkeleton={isContentLoading}
    >
      {downloadButton}
      {claimHistoryContent}
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      body={body}
      navigateBack={navigation.goBack}
      showProfileAvatar={true}
      translateContent={true}
    />
  );
};
