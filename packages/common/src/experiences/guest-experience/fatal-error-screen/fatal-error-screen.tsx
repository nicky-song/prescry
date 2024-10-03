// Copyright 2018 Prescryptive Health, Inc.

import { useRoute } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { FatalError } from '../../../components/member/fatal-error/fatal-error';
import { FatalErrorRouteProp } from '../navigation/stack-navigators/root/root.stack-navigator';
import { useConfigContext } from '../context-providers/config/use-config-context.hook';

export interface IFatalErrorScreenRouteProps {
  errorMessage?: string;
}

export const FatalErrorScreen = (): ReactElement => {
  const { params } = useRoute<FatalErrorRouteProp>();
  const { configState } = useConfigContext();

  const errorMessage = params.errorMessage || '';
  const supportEmail = configState.supportEmail || 'support@prescryptive.com';

  return (
    <FatalError
      errorMessage={errorMessage}
      supportEmail={supportEmail}
    />
  );
};
