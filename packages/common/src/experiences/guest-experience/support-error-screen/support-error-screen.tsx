// Copyright 2018 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import {
  ISupportErrorScreenContainerActionProps,
  ISupportErrorScreenContainerProps,
  SupportErrorScreenContainer,
} from '../../../components/member/support-error-container/support-error.container';
import { SupportErrorBackNavigationType } from '../store/support-error/support-error.reducer';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { useNavigation } from '@react-navigation/native';
import { SupportErrorNavigationProp } from '../navigation/stack-navigators/root/root.stack-navigator';

export interface ISupportErrorScreenProps
  extends ISupportErrorScreenContainerProps {
  errorBackNavigationType?: SupportErrorBackNavigationType;
}
export type ISupportErrorScreenActionProps =
  ISupportErrorScreenContainerActionProps;

export const SupportErrorScreen = ({
  errorBackNavigationType,
  errorMessage,
  reloadPageAction,
}: ISupportErrorScreenProps & ISupportErrorScreenActionProps): ReactElement => {
  const navigation = useNavigation<SupportErrorNavigationProp>();

  const navigateToBack =
    errorBackNavigationType === 'LogoutAndStartOverAtLogin'
      ? () => reloadPageAction(navigation)
      : navigation.goBack;

  const body = (
    <BodyContentContainer>
      <SupportErrorScreenContainer
        errorMessage={errorMessage}
        reloadPageAction={reloadPageAction}
      />
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      navigateBack={navigateToBack}
      body={body}
      hideNavigationMenuButton={true}
    />
  );
};
