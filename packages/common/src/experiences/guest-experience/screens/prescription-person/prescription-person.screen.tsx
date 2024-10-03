// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import {
  PrescriptionPersonNavigationProp,
  PrescriptionPersonRouteProp,
} from '../../navigation/stack-navigators/account-and-family/account-and-family.stack-navigator';
import { ICreateAccountScreenRouteProps } from '../sign-in/create-account/create-account.screen';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { prescriptionPersonScreenStyles as styles } from './prescription-person.screen.styles';
import { IPrescriptionPersonScreenContent } from './prescription-person.screen.content';
import { setPrescriptionPersonSelectionDispatch } from '../../state/account-and-family/dispatch/set-prescription-person-selection.dispatch';
import { useAccountAndFamilyContext } from '../../context-providers/account-and-family/use-account-and-family-context.hook';
import { Workflow } from '../../../../models/workflow';
import { IVerifyPatientInfoScreenRouteProps } from '../verify-patient-info/verify-patient-info.screen';

export interface IPrescriptionPersonScreenRouteProps {
  workflow: Workflow;
  prescriptionId: string;
  userExists?: boolean;
}

export const PrescriptionPersonScreen = () => {
  const navigation = useNavigation<PrescriptionPersonNavigationProp>();

  const {
    params: { workflow, prescriptionId, userExists },
  } = useRoute<PrescriptionPersonRouteProp>();

  const groupKey = CmsGroupKey.prescriptionPersonScreen;

  const {
    content: { prescriptionPersonTitle, firstPersonOption, secondPersonOption },
    isContentLoading,
  } = useContent<IPrescriptionPersonScreenContent>(groupKey, 2);

  const { buttonViewStyle, buttonTextStyle } = styles;

  const { accountAndFamilyDispatch } = useAccountAndFamilyContext();

  const handleFirstPersonOptionPress = () => {
    setPrescriptionPersonSelectionDispatch(accountAndFamilyDispatch, 'self');
    const screenRouteProps: ICreateAccountScreenRouteProps = {
      workflow,
      prescriptionId,
    };
    navigation.navigate('CreateAccount', screenRouteProps);
  };

  const handleSecondPersonOptionPress = () => {
    const verifyPatientInfoRouteProps: IVerifyPatientInfoScreenRouteProps = {
      workflow,
      prescriptionId,
      userExists,
      isDependent: true,
    };
    setPrescriptionPersonSelectionDispatch(accountAndFamilyDispatch, 'other');
    navigation.navigate('VerifyPatientInfo', verifyPatientInfoRouteProps);
  };

  const body = (
    <BodyContentContainer
      title={prescriptionPersonTitle}
      isSkeleton={isContentLoading}
    >
      <BaseButton
        viewStyle={buttonViewStyle}
        textStyle={buttonTextStyle}
        onPress={handleFirstPersonOptionPress}
        isSkeleton={isContentLoading}
      >
        {firstPersonOption}
      </BaseButton>
      <BaseButton
        viewStyle={buttonViewStyle}
        textStyle={buttonTextStyle}
        onPress={handleSecondPersonOptionPress}
        isSkeleton={isContentLoading}
      >
        {secondPersonOption}
      </BaseButton>
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      body={body}
      showProfileAvatar={true}
      hideNavigationMenuButton={false}
    />
  );
};
