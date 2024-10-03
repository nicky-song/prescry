// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useEffect, useState } from 'react';
import { LinkButton } from '../../../../components/buttons/link/link.button';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { AccumulatorList } from '../../../../components/lists/accumulators/accumulator.list';
import {
  INavigationLink,
  NavigationLinkList,
} from '../../../../components/lists/navigation-link/navigation-link.list';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { useMedicineCabinetContext } from '../../context-providers/medicine-cabinet/medicine-cabinet.context.hook';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { PrescriptionBenefitPlanNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import {
  getAccumulatorsAsyncAction,
  IGetAccumulatorAsyncActionArgs,
} from '../../state/medicine-cabinet/async-actions/get-accumulators.async-action';
import { IPrescriptionBenefitPlanScreenContent } from './prescription-benefit-plan.screen.content';
import { prescriptionBenefitPlanScreenStyles } from './prescription-benefit-plan.screen.styles';

import { PrescriptionBenefitPlanLearnMoreModal } from './prescription-benefit-plan-learn-more.modal';
import { ToolButton } from '../../../../components/buttons/tool.button/tool.button';
import { goToUrl } from '../../../../utils/link.helper';

export const PrescriptionBenefitPlanScreen = (): ReactElement => {
  const styles = prescriptionBenefitPlanScreenStyles;
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigation = useNavigation<PrescriptionBenefitPlanNavigationProp>();
  const { content, isContentLoading } =
    useContent<IPrescriptionBenefitPlanScreenContent>(
      CmsGroupKey.prescriptionBenefitPlanScreen,
      2
    );

  const {
    medicineCabinetState: { accumulators },
    medicineCabinetDispatch,
  } = useMedicineCabinetContext();

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  useEffect(() => {
    getAccumulators();
  }, []);

  const getAccumulators = async () => {
    const args: IGetAccumulatorAsyncActionArgs = {
      reduxDispatch,
      reduxGetState,
      medicineCabinetDispatch,
      navigation,
    };
    await getAccumulatorsAsyncAction(args);
  };

  const toggleModalDisplay = () => {
    setShowModal(!showModal);
  };

  const hasPlanDetails = accumulators?.planDetailsPdf;
  const openPlanDetailsLabel = hasPlanDetails
    ? content.openPlanDetails
    : content.openPlanDetailsNotAvailable;

  const onOpenPlanDetailsPress = async () => {
    const planDetailsPdf = accumulators?.planDetailsPdf;

    if (planDetailsPdf) {
      await goToUrl(planDetailsPdf);
    }
  };

  const openPlanDetailsButton = (
    <ToolButton
      iconName='external-link-alt'
      viewStyle={styles.openPlanDetailsButtonViewStyle}
      disabled={!hasPlanDetails}
      onPress={onOpenPlanDetailsPress}
    >
      {openPlanDetailsLabel}
    </ToolButton>
  );

  const accumulatorList = accumulators ? (
    <AccumulatorList accumulators={accumulators} />
  ) : null;

  const claimHistoryLink: INavigationLink = {
    key: 'claimHistory',
    label: content.claimHistoryLink,
    onPress: () => navigation.navigate('ClaimHistory'),
    isSkeleton: isContentLoading,
  };

  const links: INavigationLink[] = [claimHistoryLink];

  const body = (
    <BodyContentContainer
      title={content.title}
      testID='prescriptionBenefitPlanScreen'
      isSkeleton={isContentLoading}
    >
      {openPlanDetailsButton}
      {accumulatorList}
      <LinkButton
        linkText={content.learnMoreText}
        onPress={toggleModalDisplay}
        testID='prescriptionBenefitPlanLearnMoreLink'
        isSkeleton={isContentLoading}
        viewStyle={styles.linkViewStyle}
        textStyle={styles.linkTextStyle}
      />
      <PrescriptionBenefitPlanLearnMoreModal
        onPressHandler={toggleModalDisplay}
        showModal={showModal}
      />
      <LineSeparator viewStyle={styles.navigationListSeparatorViewStyle} />
      <NavigationLinkList links={links} />
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
